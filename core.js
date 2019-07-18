"use strict"

// Sets record information.
const records = {
    A: {
        info: "A records are the most basic type of DNS record and are used to point a domain or subdomain to an IPv4 address.\n<b>These do NOT act as MX records, to receive e-mail, you need to set a MX record.</b>",
        url: "https://kb.pressable.com/article/dns-record-types-explained/",
        expectsHost: true,
    },
    TXT: {
        info: "TXT records are a type of DNS record that contains text information for sources outside of your domain.",
        url: "https://support.google.com/a/answer/2716800?hl=en",
        additionalDataParsing: data => data.substr(1).slice(0, -1),
    },
    MX: {
        info: "A mail exchanger record (MX record) specifies the mail server responsible for accepting email messages on behalf of a domain name.",
        url: "https://en.wikipedia.org/wiki/MX_record",
        additionalDataParsing: data => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    AAAA: {
        info: "AAAA records behave the same as A records but for IPv6.\nThey are used to point a domain or subdomain to a IPv6 address.",
        url: "https://help.fasthosts.co.uk/app/answers/detail/a_id/1548/~/dns-aaaa-records",
        expectsHost: true,
    },
    CAA: {
        info: "CAA records allow domain owners to specify which Certificate Authorities (CAs) are permitted to issue certificates.",
        url: "https://www.digitalocean.com/docs/networking/dns/how-to/caa/",
    },
    NS: {
        info: "NS stands for \"name server\" and this record indicates which DNS server is authoritative for that domain (which server contains the actual DNS records).\nA domain will often have multiple NS records which can indicate primary and backup name servers for that domain.",
        url: "https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/",
        additionalDataParsing: data => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    SRV: {
        info: "A Service record (SRV record) is a specification of data in the Domain Name System defining the location, i.e. the hostname and port number, of servers for specified services.",
        url: "https://en.wikipedia.org/wiki/SRV_record",
    },
}

// Defines TXT fragments and what they mean.
const globalsign = "This TXT record is used so that GlobalSign can verify that they are issuing certificates to the domain owner."
const txtFragments = {
    "google-site-verification": "This TXT record is used so that Google can verify the domain owner.",
    "mailru-verification": "This TXT record is used so that mail.ru can verify the domain owner.",
    "MS": "This TXT record is used for Office 365 domain verification.",
    "keybase-site-verification": "This TXT record is commonly used to verify that a Keybase user is in ownership of a domain.",
    "_globalsign-domain-verification": globalsign,
    "globalsign-domain-verification": globalsign,
    "bugcrowd-verification": "This TXT record is used so that Bugcrowd can verify the domain owner.",
    "status-page-domain-verification": "This is used so that Statuspage.io can verify the domain owner.",
    "segment-site-verification": "This is used so that Segment.com can verify the domain owner.",
    "logmein-verification-code": "This is used so that LogMeIn can verify the domain owner.",
    "facebook-domain-verification": "This is used so that Facebook can verify the domain owner.",
    "yandex-verification": "This is used so that Yandex can verify the domain owner.",
    "loaderio": "This is used so that Loader.io can verify the domain owner.",
    "v": "This is a SPF record which is used to identify trusted sources for transmitted e-mail.\nThis makes it easier for recievers to tell if a e-mail is spam.",
}

// Defines all included IP blacklists.
const ipBlacklists = [
    "zen.spamhaus.org",
    "sbl.spamhaus.org",
    "xbl.spamhaus.org",
    "dnsbl.spfbl.net",
    "spam.spamrats.com",
]

// Defines all included domain blacklists.
const domainBlacklists = [
    "dbl.spamhaus.org",
    "0spam.org",
    "dbl.suomispam.net",
]

// Reverses the IP address for DNSBL lookups.
const reverseIp = ip => ip.split(".").reverse().join(".")

// Defines the core regex.
const isHostname = /.*\.[a-z]+/
const txtSplit = /=|:| /

// Gets any blacklists that the IP/domain is in.
const getBlacklists = async (ip, domain) => {
    const blacklists = {
        ip: [],
        domain: [],
    }

    const promises = []

    for (const blacklist of ipBlacklists) {
        promises.push((async() => {
            const res = await fetch(
                `https://cloudflare-dns.com/dns-query?name=${reverseIp(ip)}.${blacklist}&type=A`,
                {
                    headers: {
                        Accept: "application/dns-json",
                    },
                }
            )
            if (!res.ok) {
                return
            }
            if ((await res.json()).Answer) {
                blacklists.ip.push(blacklist)
            }
            return res
        })())
    }

    if (domain) {
        for (const domainBlacklist of domainBlacklists) {
            promises.push((async() => {
                const res = await fetch(
                    `https://cloudflare-dns.com/dns-query?name=${domain}.${domainBlacklist}&type=A`,
                    {
                        headers: {
                            Accept: "application/dns-json",
                        },
                    }
                )
                if (!res.ok) {
                    return
                }
                if ((await res.json()).Answer) {
                    blacklists.domain.push(domainBlacklist)
                }
                return res
            })())
        }
    }

    await Promise.all(promises)
    return blacklists
}

// Gets the IP address for a hostname.
const getIpFromHostname = async hostname => {
    for (;;) {
        if (!hostname.match(isHostname)) {
            return hostname
        }

        const res = await fetch(
            `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
            {
                headers: {
                    Accept: "application/dns-json"
                }
            }
        )

        if (!res.ok) {
            throw new Error()
        }

        const json = await res.json()
        if (!json.Answer) {
            throw new Error()
        }

        return json.Answer[0].data
    }
}

// Runs a MX lookup.
const mxLookup = async (spanId, domain, ip) => {
    let html = ""

    const blacklists = await getBlacklists(ip, domain)
    for (const domainBlacklist of blacklists.domain) {
        html += `<p style="font-size: 11px"><b>Domain blacklisted by ${domainBlacklist}</b></p>`
    }
    for (const ipBlacklist of blacklists.ip) {
        html += `<p style="font-size: 11px"><b>Domain blacklisted by ${ipBlacklist}</b></p>`
    }

    if ("" === html) {
        html += `
            <p style="font-size: 11px"><b>Domain/IP is not blacklisted.</b></p>
        `
    }

    html += `<p style="font-size: 11px"><a href="https://www.techwalla.com/articles/what-does-it-mean-if-an-email-address-is-blacklisted">What does a mailing blacklist mean?</a></p>`

    const setLoop = () => {
        const span = document.getElementById(spanId)
        if (span) {
            span.innerHTML = html
        } else {
            setTimeout(setLoop, 10)
        }
    }
    setLoop()
}

// Sanitizes the external input. Never trust external input!
const sanitize = data => {
    const lt = /</g, 
        gt = />/g, 
        ap = /'/g, 
        ic = /"/g

    return data.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;")
}

// Gets the domain input element.
const domainInput = document.getElementById("DomainInput")

// Runs the WHOIS lookup.
const whoisLookup = async (spanId, ip) => {
    const url = `https://cfwho.com/get/${ip}`
    const fetchRes = await fetch(
        url, {
            headers: {
                Accept: "application/json",
            },
        }
    )
    const json = await fetchRes.json()
    const html = `
        <p style="font-size: 11px"><b>Owner:</b> ${sanitize(json.results[0].netname)}</p>
    `
    const setLoop = () => {
        const span = document.getElementById(spanId)
        if (span) {
            span.innerHTML = html
        } else {
            setTimeout(setLoop, 10)
        }
    }
    setLoop()
}

// Gets the DNS record.
const getDNSRecord = async (key, text) => {
    let html = `
        <h3 class="title is-3" id="${key}-Records">${key} Records <a href="#${key}-Records"><i class="fas fa-link" style="color: black; font-size: 50%;"></i></a></h3>
        <p>${records[key].info.replace(/\n/g, "<br>")} <a href="${records[key].url}">Learn more</a></p>
    `
    const fetchRes = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(text)}&type=${key}`,
        {
            headers: {
                Accept: "application/dns-json",
            },
        }
    )
    if (!fetchRes.ok) {
        throw fetchRes
    }
    const json = await fetchRes.json()
    if (!json.Answer) {
        html += "<p><b>Could not find any records of this type.</b></p>"
    } else {
        const recordsJoined = {}
        if (key === "MX") {
            for (const record of json.Answer) {
                const dataSplit = record.data.split(" ")
                if (dataSplit.length === 2) {
                    record.data = dataSplit[1]
                    record.priority = Number(dataSplit[0])
                }
            }
        }
        json.Answer.sort((a, b) => {
            if (a.priority) {
                return a.priority - b.priority
            }
            if (a.TTL) {
                return b.TTL - a.TTL
            }
        })
        const txtRecordFragments = {}
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
                    recordsJoined[recordKey].push(recordObject[recordKey])
                } else {
                    recordsJoined[recordKey] = [recordObject[recordKey]]
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
            if (part.length > largestRecordPart) {
                largestRecordPart = part.length
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
                        let part = records[key].additionalDataParsing ? sanitize(records[key].additionalDataParsing(splitPart)) : sanitize(splitPart)
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
                                <a href="javascript:toggleTruncation('${truncateId}')" id="${truncateId}-handler">Show more</a>
                            `
                        } else if (key === "NS") {
                            if (!item.endsWith(".digitalocean.com") && !item.endsWith(".digitalocean.com.")) {
                                document.getElementById("NS-Extra").innerHTML = `
                                    <p><b>This domain is not using DigitalOcean DNS.</b> <a href="https://www.digitalocean.com/docs/networking/dns/">Learn more about DigitalOcean DNS.</a></p>
                                `
                            } else {
                                document.getElementById("NS-Extra").innerHTML = `
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
                if (records[key].expectsHost && collectionKey === "Data") {
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
                    if (tSplit && tSplit.length > 1 && txtFragments[tSplit[0]]) {
                        extra += `<hr style="margin: 5px"><p style="font-size: 11px"><b>${txtFragments[tSplit[0]].replace(/\n/g, "<br>")}</b></p>`
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
const glueHtml = parts => {
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
const parallelRender = async (spanId, promise) => {
    try {
        const promiseRes = await promise
        document.getElementById(spanId).innerHTML = promiseRes
    } catch (e) {
        console.error(e)
    }
}

// Does the main DNS searching.
const searchDNS = async() => {
    const text = domainInput.value.toLowerCase()
    if (!text.match(isHostname)) {
        alert("Invalid domain.")
        return
    }
    const domainLookup = await fetch(
        `https://whoisjs.com/api/v1/${encodeURIComponent(text)}`
    )
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
    document.getElementById("content").innerHTML = `<span id="NS-Extra"><p><i>Loading NS record information...</i></p></span><hr>${glueHtml(parts)}`
    await Promise.all(promises)
    if (urlFragment) {
        const el = document.getElementById(urlFragment)
        if (el) {
            el.scrollIntoView()
        }
    }
}

// Gets the search button element.
const searchButton = document.getElementById("SearchButton")

// Defines if a search is running.
let running = false

// Runs the main code block to get DNS results.
const searchDNSEvent = async() => {
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

// Focuses the domain text box or runs the search from query params.
window.onload = () => {
    if (linked) {
        domainInput.value = linked
        linked = null
        searchDNSEvent()
    } else {
        domainInput.focus()
    }
}

// Run the searchDNSEvent function when ENTER is detected in the text box.
domainInput.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        searchDNSEvent()
    }
})

// Toggles the span class.
const toggleTruncation = spanId => {
    const trunc = document.getElementById(`${spanId}-trunc`)
    const untrunc = document.getElementById(`${spanId}-untrunc`)
    const show = untrunc.style.display === "none"
    trunc.style.display = show ? "none" : ""
    untrunc.style.display = show ? "" : "none"
    document.getElementById(`${spanId}-handler`).textContent = show ? "Show less" : "Show more"
}
