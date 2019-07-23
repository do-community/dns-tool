import records from './data/records';
import txtFragments from './data/txt';
import cfDNS from './utils/cfDNS';
import whoisJS from './utils/whoisJS';
import sanitize from './utils/sanitize';
import { whoisLookup, mxLookup } from './lookups';

// Defines the core regex.
const isHostname = /.*\.[a-z]+/;
const txtSplit = /[=: ]/;

// Defines the window.
const htmlWindow = (window as any)

// Gets the IP address for a hostname.
const getIpFromHostname = async(hostname: string) => {
    if (!hostname.match(isHostname)) return hostname;

    const res = await cfDNS(hostname, 'A');

    if (!res.ok) throw new Error();

    const json = await res.json();
    if (!json.Answer) throw new Error();

    return json.Answer[0].data
};

// Gets the domain input element.
const domainInput = document.getElementById('DomainInput') as HTMLInputElement

// Gets the DNS record.
const getDNSRecord = async (key: string, text: string) => {
    let html = `
        <h3 class="title is-3" id="${key}-Records">${key} Records <a href="#${key}-Records"><i class="fas fa-link" style="color: black; font-size: 50%;"></i></a></h3>
        <p>${(records as any)[key].info.replace(/\n/g, "<br>")} <a href="${(records as any)[key].url}">Learn more</a></p>
    `
    let changedKey = key
    if (key === "DMARC") {
        text = `_dmarc.${text}`
        changedKey = "TXT"
    }
    const fetchRes = await cfDNS(text, changedKey);
    if (!fetchRes.ok) throw fetchRes;
    const json = await fetchRes.json()
    if (!json.Answer) {
        html += "<p><b>Could not find any records of this type.</b></p>"
    } else {
        const recordsJoined = {} as any
        if (key === "MX") {
            for (const record of json.Answer) {
                const dataSplit = record.data.split(" ")
                if (dataSplit.length === 2) {
                    record.data = dataSplit[1]
                    record.priority = Number(dataSplit[0])
                }
            }
        } else if (key === "DMARC") {
            const newRecords = []
            for (const record of json.Answer) {
                const dataSplit = record.data.substr(1).slice(0, -1).split(";")
                for (const newSplit of dataSplit) {
                    if (!newSplit.startsWith("v")) {
                        newRecords.push({
                            name: record.name,
                            data: newSplit,
                            TTL: record.TTL,
                            type: undefined,
                        })
                    }
                }
            }
            json.Answer = newRecords
        }
        json.Answer.sort((a: any, b: any) => {
            if (a.priority) {
                return a.priority - b.priority
            }
            if (a.TTL) {
                return b.TTL - a.TTL
            }
        })
        const txtRecordFragments = {} as any
        for (const record of json.Answer) {
            delete record.type
            if (key === "TXT") {
                const recordDataSplit = record.data.split(txtSplit)
                if (recordDataSplit.length > 1) {
                    const consumableRecord = `${recordDataSplit[0].substr(1).startsWith("_") ? recordDataSplit[0].substr(2) : recordDataSplit[0].substr(1)}%${record.name}%${record.TTL}`
                    if (txtRecordFragments[consumableRecord]) {
                        txtRecordFragments[consumableRecord] += `\n${record.data}`
                    } else {
                        txtRecordFragments[consumableRecord] = record.data
                    }
                    delete json.Answer[record]
                    continue
                }
            }
            const recordKeys = Object.keys(record)
            for (const recordKeyOrigin of recordKeys) {
                const recordKey = `${recordKeyOrigin[0].toUpperCase()}${recordKeyOrigin.substr(1)}`
                if (recordsJoined[recordKey]) {
                    recordsJoined[recordKey].push(record[recordKeyOrigin])
                } else {
                    recordsJoined[recordKey] = [record[recordKeyOrigin]]
                }
            }
        }
        for (const fragmentKey of Object.keys(txtRecordFragments)) {
            const fragSplit = fragmentKey.split(/%/g)
            const name = fragSplit[1]
            const ttl = fragSplit[2]
            const fullRecord = txtRecordFragments[fragmentKey]
            const recordObject = {
                Name: name,
                TTL: ttl,
                Data: fullRecord,
            }
            for (const recordKey of Object.keys(recordObject)) {
                if (recordsJoined[recordKey]) {
                    recordsJoined[recordKey].push((recordObject as any)[recordKey])
                } else {
                    recordsJoined[recordKey] = [(recordObject as any)[recordKey]]
                }
            }
        }
        const keys = Object.keys(recordsJoined)
        let headings = "<thead><tr>"
        for (const heading of keys) {
            headings += `
                <th>${heading}</th>
            `
        }
        headings += "</tr></thead>"
        let body = "<tbody>"
        let largestRecordPart = 0
        for (const part of Object.values(recordsJoined)) {
            if ((part as string).length > largestRecordPart) {
                largestRecordPart = (part as string).length
            }
        }
        for (let i = 0; i < largestRecordPart; i++) {
            let row = "<tr>"
            for (const collectionKey of keys) {
                let item = recordsJoined[collectionKey][i]
                let tSplit
                if (item === undefined) {
                    item = "--"
                } else if (collectionKey === "Data") {
                    const newLineSplit = item.toString().split(/\n/g)
                    const newParts = []
                    for (const splitPart of newLineSplit) {
                        let part = (records as any)[key].additionalDataParsing ? sanitize((records as any)[key].additionalDataParsing(splitPart)) : sanitize(splitPart)
                        if (key === "TXT" && part.length > 20) {
                            const truncateId = Math.random().toString()
                            tSplit = part.split(txtSplit)
                            let truncated
                            if (tSplit.length > 1) {
                                if (tSplit[0] === "v" && tSplit[1] === "spf1") {
                                    truncated = `${tSplit[0]}=${tSplit[1]}`
                                } else {
                                    truncated = tSplit[0]
                                }
                            } else {
                                truncated = part.substr(0, 30)
                            }
                            part = `
                                <span id="${truncateId}-trunc">
                                    ${truncated}
                                </span>
                                <span id="${truncateId}-untrunc" style="display: none">
                                    ${part}
                                </span>
                                <a href="javascript:toggleExtra('${truncateId}-untrunc', '${truncateId}-trunc', '${truncateId}-handler')" id="${truncateId}-handler">Show more</a>
                            `
                        } else if (key === "NS") {
                            if (!item.endsWith(".digitalocean.com") && !item.endsWith(".digitalocean.com.")) {
                                document.getElementById("NS-Extra")!.innerHTML = `
                                    <p><b>This domain is not using DigitalOcean DNS.</b> <a href="https://www.digitalocean.com/docs/networking/dns/">Learn more about DigitalOcean DNS.</a></p>
                                `
                            } else {
                                document.getElementById("NS-Extra")!.innerHTML = `
                                    <p><b>This domain is using DigitalOcean DNS.</b> <a href="https://www.digitalocean.com/docs/networking/dns/">Learn more about DigitalOcean DNS.</a></p>
                                `
                            }
                        }
                        newParts.push(part)
                    }
                    item = newParts.join(`<hr style="margin: 5px">`)
                } else if (collectionKey === "Name") {
                    const last = item[item.length - 1]
                    if (last === ".") {
                        item = item.slice(0, -1)
                    }
                } else {
                    item = item.toString()
                }
                let extra = ""
                if ((records as any)[key].expectsHost && collectionKey === "Data") {
                    const ip = await getIpFromHostname(item)
                    const whoisSpanId = Math.random().toString()
                    whoisLookup(whoisSpanId, ip)
                    extra = `<hr style="margin: 5px"><span id="${whoisSpanId}"><p style="font-size: 11px"><i>Loading WHOIS data...</i></p></span>`
                    if (key === "MX") {
                        const mxSpanId = Math.random().toString()
                        extra += `<hr style="margin: 5px"><span id="${mxSpanId}"><p style="font-size: 11px"><i>Loading MX blacklist data...</i></p></span>`
                        mxLookup(mxSpanId, item, ip)
                    }
                    if (item !== ip) {
                        item = `${item} (${ip})`
                    }
                } else if (key === "TXT") {
                    if (tSplit && tSplit.length > 1 && (txtFragments as any)[tSplit[0]]) {
                        extra += `<hr style="margin: 5px"><p style="font-size: 11px"><b>${(txtFragments as any)[tSplit[0]].replace(/\n/g, "<br>")}</b></p>`
                    }
                }
                row += `<td>${item}${extra}</td>`
            }
            row += "</tr>"
            body += row
        }
        body += "</tbody>"
        html += `
            <br>
            <table class="table is-bordered">
                ${headings}
                ${body}
            </table>
        `
    }
    html += "<hr>"
    return html
}

// Defines the URL params.
const params = new URLSearchParams(window.location.search)

// Defines if the user has linked to a domain.
let linked = params.get("domain")

// Defines the URL fragment.
const urlFragment = window.location.hash === "" ? null : window.location.hash.substr(1)

// Glues all the HTML together.
const glueHtml = (parts: string[]) => {
    const columns = [`<div class="column is-half">`, `<div class="column is-half">`]
    let index = 1
    for (const part of parts) {
        if (index === columns.length) {
            index = 0
        }
        columns[index] += part
        index++
    }
    for (const c in columns) {
        columns[c] += "</div>"
    }
    return `<div class="columns">${columns.join("")}</div>`
}

// Does the parallel HTML rendering.
const parallelRender = async (spanId: string, promise: Promise<string>) => {
    try {
        const promiseRes = await promise
        document.getElementById(spanId)!.innerHTML = promiseRes
    } catch (e) {
        console.error(e)
    }
}

// Does the main DNS searching.
const searchDNS = async () => {
    const text = domainInput.value.toLowerCase()
    if (!text.match(isHostname)) {
        alert("Invalid domain.")
        return
    }
    const domainLookup = await whoisJS(text);
    if (!(await domainLookup.json()).domain) {
        alert("Invalid domain.")
        return
    }
    if (!linked) {
        window.history.pushState({}, "", `?domain=${encodeURIComponent(text)}`)
    }
    const parts = []
    const promises = []
    for (const key of Object.keys(records)) {
        parts.push(`<span id="${key}-base"></span>`)
        promises.push(parallelRender(`${key}-base`, getDNSRecord(key, text)))
    }
    document.getElementById("content")!.innerHTML = `<span id="NS-Extra"><p><i>Loading NS record information...</i></p></span><hr>${glueHtml(parts)}`
    await Promise.all(promises)
    if (urlFragment) {
        const el = document.getElementById(urlFragment)
        if (el) {
            el.scrollIntoView()
        }
    }
}

// Gets the search button element.
const searchButton = document.getElementById("SearchButton") as HTMLInputElement

// Defines if a search is running.
let running = false

// Runs the main code block to get DNS results.
const searchDNSEvent = async () => {
    if (running) {
        return
    }
    running = true
    try {
        searchButton.classList.add("is-loading")
        await searchDNS()
        searchButton.classList.remove("is-loading")
    } finally {
        running = false
    }
}
htmlWindow.searchDNSEvent = searchDNSEvent

// Focuses the domain text box or runs the search from query params.
window.onload = () => {
    if (linked) {
        domainInput!.value = linked
        linked = null
        searchDNSEvent()
    } else {
        domainInput!.focus()
    }
}

// Run the searchDNSEvent function when ENTER is detected in the text box.
domainInput!.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        searchDNSEvent()
    }
})

// Handles truncation/extra info.
htmlWindow.toggleExtra = (showTogglingSpanId: string, spanId2: string | undefined, handlerId: string | undefined) => {
    const showToggler = document.getElementById(showTogglingSpanId) as HTMLDivElement
    const show = showToggler!.style.display === "none"
    if (spanId2) {
        const spanInfo2 = document.getElementById(spanId2) as HTMLDivElement
        spanInfo2.style.display = show ? "none" : ""
    }
    showToggler.style.display = show ? "" : "none"
    if (handlerId) {
        document.getElementById(handlerId)!.textContent = show ? "Show less" : "Show more"
    }
}
