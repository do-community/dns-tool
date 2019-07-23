import records from './data/records';
import txtFragments from './data/txt';
import cfDNS from './utils/cfDNS';
import whoisJS from './utils/whoisJS';
import sanitize from './utils/sanitize';
import { whoisLookup, mxLookup } from './lookups';
import toggles from './utils/toggles';
import standardiseRecords from './standardise_records';
import joinTxtSameHostTtl from './txt_join'
import { createHeadings, getLargestRecordPart } from './table'
import displayIfDigitalOceanDns from './utils/dodns_display'
import truncatedRecordHandling from './truncated_record_handling'

// Defines the core regex.
const isHostname = /.*\.[a-z]+/;
const txtSplit = /[=: ]/;

// Defines the window.
const htmlWindow = (window as any)

// Gets the IP address for a hostname.
const getIpFromHostname = async (hostname: string) => {
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
        const txtRecordFragments = {} as any
        standardiseRecords(key, json, txtRecordFragments, recordsJoined, txtSplit)
        joinTxtSameHostTtl(recordsJoined, txtRecordFragments)
        const keys = Object.keys(recordsJoined)
        const headings = createHeadings(keys)
        const largestRecordPart = getLargestRecordPart(Object.values(recordsJoined))
        let body = "<tbody>"
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
                        // This long line parses data and makes sure it is sanitized.
                        let part = (records as any)[key].additionalDataParsing ? sanitize((records as any)[key].additionalDataParsing(splitPart)) : sanitize(splitPart)

                        if (key === "TXT" && part.length > 20) {
                            const parts = truncatedRecordHandling(tSplit, part, txtSplit)
                            tSplit = parts[0]
                            part = parts[1] as string
                        } else if (key === "NS") {
                            displayIfDigitalOceanDns(item)
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

// Handles truncation/extra info.
htmlWindow.toggleExtra = toggles
