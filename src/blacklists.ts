import { ipBlacklists, domainBlacklists } from "./data/blacklists"
import cfDNS from "./utils/cfDNS"

// Reverses the IP address for DNSBL lookups.
const reverseIp = (ip: string) => ip.split(".").reverse().join(".")

// Get the result of a blacklist check
const checkBlacklist = async (name: string, blacklist: string, type: string) => {
    const res = await cfDNS(`${name}.${blacklist}`, "A")
    if (!res.ok) return
    if ((await res.json()).Answer) {
        const resp = {} as any
        resp[type] = blacklist
        return resp
    }
}

const checkIpBlacklists = (ip: string) => {
    const promises = []
    for (const blacklist of ipBlacklists) {
        promises.push(checkBlacklist(reverseIp(ip), blacklist, "ip"))
    }
    return promises
}

const checkDomainBlacklists = (domain: string) => {
    const promises = []
    for (const blacklist of domainBlacklists) {
        promises.push(checkBlacklist(domain, blacklist, "domain"))
    }
    return promises
}

// Gets any blacklists that the IP/domain is in.
const getBlacklists = async (ip: string, domain: string) => {
    const blacklists = {
        ip: [],
        domain: [],
    } as any

    const promises = [...checkIpBlacklists(ip)]
    if (domain) promises.push(...checkDomainBlacklists(domain))

    const data = await Promise.all(promises)
    data.forEach(item => {
        if (!item) return
        if (item.ip) blacklists.domain.push(item.ip)
        if (item.domain) blacklists.domain.push(item.domain)
    })

    return blacklists
}

export default getBlacklists
