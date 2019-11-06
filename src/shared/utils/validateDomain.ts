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

import cfDNS from "./cfDNS"
import i18n from "../i18n"

const stripHttps = /(https*:\/\/)*(.+)*/
const isHostname = /.*\.[a-z]+/

export default async (name: string) => {
    // Strip http(s) from the input
    const regexpExec = stripHttps.exec(name.toLowerCase())
    if (regexpExec === null) return [null, i18n.common.invalidDomain]

    // Attempt to determine the hostname
    const text = regexpExec[2] ? regexpExec[2].replace(/\//g, "") : ""
    if (!text.match(isHostname)) return [null, i18n.common.invalidDomain]

    // Talk to Cloudflare to validate the domain exists
    const domainLookup = await cfDNS(text, "NULL")
    let json
    try {
        json = await domainLookup.json()
    } catch {
        // Sometimes Cloudflare's DNS sends invalid JSON in the event that it is invalid.
        // That has happened here.
        return [null, i18n.common.invalidDomain]
    }
    if (json.Status !== 0) {
        let msg = i18n.common.invalidDomain
        if (json.Comment) msg += `</p><p>${json.Comment}`
        return [null, msg]
    }

    // It's legit
    return [text, null]
}
