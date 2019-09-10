/*
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ipBlacklists, domainBlacklists } from "./data/blacklists"
import cfDNS from "../utils/cfDNS"

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
