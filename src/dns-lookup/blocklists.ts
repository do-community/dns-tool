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

import { ipBlocklists, domainBlocklists } from "./data/blocklists"
import cfDNS from "../shared/utils/cfDNS"

// Reverses the IP address for DNSBL lookups.
const reverseIp = (ip: string) => ip.split(".").reverse().join(".")

// Get the result of a blocklist check
const checkBlocklist = async (name: string, blocklist: string, type: string) => {
    const res = await cfDNS(`${name}.${blocklist}`, "A")
    if (!res.ok) return
    if ((await res.json()).Answer) {
        const resp = {} as any
        resp[type] = blocklist
        return resp
    }
}

const checkIpBlocklists = (ip: string) => {
    const promises = []
    for (const blocklist of ipBlocklists) {
        promises.push(checkBlocklist(reverseIp(ip), blocklist, "ip"))
    }
    return promises
}

const checkDomainBlocklists = (domain: string) => {
    const promises = []
    for (const blocklist of domainBlocklists) {
        promises.push(checkBlocklist(domain, blocklist, "domain"))
    }
    return promises
}

// Gets any blocklists that the IP/domain is in.
const getBlocklists = async (ip: string, domain: string) => {
    const blocklists = {
        ip: [],
        domain: [],
    } as any

    const promises = [...checkIpBlocklists(ip)]
    if (domain) promises.push(...checkDomainBlocklists(domain))

    const data = await Promise.all(promises)
    data.forEach(item => {
        if (!item) return
        if (item.ip) blocklists.domain.push(item.ip)
        if (item.domain) blocklists.domain.push(item.domain)
    })

    return blocklists
}

export default getBlocklists
