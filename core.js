"use strict"

// Sets record information.
const records = {
    A: {
        info: "A records are the most basic type of DNS record and are used to point a domain or subdomain to an IPv4 address. <b>These do NOT act as MX records, to receive e-mail, you need to set a MX record.</b>",
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
        info: "AAAA records behave the same as A records but for IPv6. They are used to point a domain or subdomain to a IPv6 address.",
        url: "https://help.fasthosts.co.uk/app/answers/detail/a_id/1548/~/dns-aaaa-records",
        expectsHost: true,
    },
    CAA: {
        info: "CAA records allow domain owners to specify which Certificate Authorities (CAs) are permitted to issue certificates.",
        url: "https://www.digitalocean.com/docs/networking/dns/how-to/caa/",
    },
    NS: {
        info: "NS stands for \"name server\" and this record indicates which DNS server is authoritative for that domain (which server contains the actual DNS records). A domain will often have multiple NS records which can indicate primary and backup name servers for that domain.",
        url: "https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/",
        additionalDataParsing: data => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    SRV: {
        info: "A Service record (SRV record) is a specification of data in the Domain Name System defining the location, i.e. the hostname and port number, of servers for specified services. It is defined in RFC 2782, and its type code is 33.",
        url: "https://en.wikipedia.org/wiki/SRV_record",
    },
}

// Defines TXT fragments and what they mean.
const globalsign = "This TXT record is used so that GlobalSign can verify that they are issuing certificates to the domain owner."
const txtFragments = {
    "google-site-verification": "TXT records related to Google site verification are used by Google as validation to link a domain to a user for various domain-related Google services.",
    "mailru-verification": "TXT records related to mail.ru are used to tie a domain to a user. This allows you to check statistics for your domain related to mail.ru users.",
    "MS": "This TXT record is used for Office 365 domain verification.",
    "keybase-site-verification": "This TXT record is commonly used to verify that a Keybase user is in ownership of a domain.",
    "_globalsign-domain-verification": globalsign,
    "globalsign-domain-verification": globalsign,
    "bugcrowd-verification": "This TXT record is used so that Bugcrowd can verify the domain owner.",
    "status-page-domain-verification": "This is used so that Statuspage.io can verify the domain owner.",
    "segment-site-verification": "This is used so that Segment.com can verify the domain owner.",
    "logmein-verification-code": "This is used so that LogMeIn can verify the domain owner.",
    "facebook-domain-verification": "This is used so that Facebook can verify the domain owner so they can provide domain statistics.",
    "v": "This is a SPF record which is used to handle spam e-mails.",
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
    const isHostname = /.*\.[a-z]+/
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
        html += `<p style="font-size: 11px"><b>Domain/IP is not blacklisted.</b></p>`
    }

    const setLoop = () => {
        const span = document.getElementById(spanId)
        if (span) {
            span.innerHTML = html
        } else {
            setTimeout(setLoop, 100)
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
    const url = `https://whois.arin.net/rest/ip/${ip}.json`
    const fetchRes = await fetch(
        url, {
            headers: {
                Accept: "application/json",
            },
        }
    )
    const json = await fetchRes.json()
    const noWhoisData = "<p>No WHOIS data found.</p>"
    if (!json.net.rdapRef.$) {
        return noWhoisData
    }
    const rdapFetch = await fetch(json.net.rdapRef.$)
    if (!rdapFetch.ok) {
        return noWhoisData
    }
    const rdapFetchJson = await rdapFetch.json()
    let remarks = ""
    for (const remark of rdapFetchJson.remarks ? rdapFetchJson.remarks : []) {
        remarks += `<p style="font-size: 11px">${sanitize(remark.description)}</p>`
    }
    let owner = rdapFetchJson.name
    if (rdapFetchJson.entities[0]) {
        owner = `${rdapFetchJson.entities[0].vcardArray[1][1][3]} (${owner})`
    }
    document.getElementById(spanId).innerHTML = `
        <p style="font-size: 11px"><b>Owner:</b> ${sanitize(owner)}</p>
        ${remarks}
    `
}

// Gets the DNS record.
const getDNSRecord = async (key, text) => {
    let html = `
        <h3 class="title is-3">${key} Records</h3>
        <p>${records[key].info} <a href="${records[key].url}">Learn more</a></p>
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
        for (const record of json.Answer) {
            delete record.type
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
                if (item === undefined) {
                    item = "--"
                } else if (collectionKey === "Data") {
                    item = records[key].additionalDataParsing ? records[key].additionalDataParsing(item.toString()) : item.toString()
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
                    const txtSplit = /=|:/
                    const equalSplit = item.split(txtSplit)
                    if (equalSplit.length > 1 && txtFragments[equalSplit[0]]) {
                        extra += `<hr style="margin: 5px"><p style="font-size: 11px"><b>${txtFragments[equalSplit[0]]}</b></p>`
                    }
                }
                row += `<td>${sanitize(item)}${extra}</td>`
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

// Does the main DNS searching.
const searchDNS = async() => {
    const text = domainInput.value.toLowerCase()
    const isHostname = /.*\.[a-z]+/
    if (!text.match(isHostname)) {
        alert("Invalid domain.")
        return
    }
    // const domainLookup = await fetch(
    //     `https://whoisjs.com/api/v1/${encodeURIComponent(text)}`
    // )
    // if (!(await domainLookup.json()).domain) {
    //     alert("Invalid domain.")
    //     return
    // }
    const promises = []
    for (const key of Object.keys(records)) {
        promises.push(getDNSRecord(key, text))
    }
    const allHtml = await Promise.all(promises)
    document.getElementById("content").innerHTML = allHtml.join("")
}

// Gets the search button element.
const searchButton = document.getElementById("SearchButton")

// Focuses the domain text box.
window.onload = () => domainInput.focus()

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

// Run the searchDNSEvent function when ENTER is detected in the text box.
domainInput.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        searchDNSEvent()
    }
})
