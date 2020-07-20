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

// Defines a SPF rule.
class SPFRule {
    // Defines public values in the class.
    public rule: boolean | undefined
    public range: RegExp

    // Turns the IP range into a regex.
    private _regexFromString(range: string) {
        const regexParts: string[] = []
        let regex = ""
        range = range.split("/").shift()!
        if (range.match(/^ip[4-6]:/)) range = range.substr(4)
        if (range.includes(".")) {
            // This is a IPv4 address.
            const partSplit = range.split(".")
            for (const part of partSplit) {
                if (part === "0") regexParts.push("[0-9]+")
                else regexParts.push(part)
            }
            regex = `${regexParts.join("\\.")}.*`
        } else {
            // This is a IPv6 address.
            let end: string | undefined
            const parts: string[] = []

            if (range.startsWith("::")) {
                range = range.slice(2)
                parts.push(".+")
            }

            if (range.endsWith("::")) {
                range = range.slice(0, -2)
                end = ".+"
            }

            parts.push(...range.split(":"))

            if (end) parts.push(end)

            regex = `${parts.join(":")}.*`
        }
        return RegExp(regex)
    }

    // Constructs the rule.
    public constructor(rule: boolean | undefined, range: string) {
        this.rule = rule
        this.range = this._regexFromString(range)
    }
}

// Defines the SPF sandbox.
class SPFSandbox {
    // Defines the rules.
    private _rules: SPFRule[]

    // Constructs the sandbox.
    public constructor() {
        this._rules = []
    }

    // Wipes all current rules.
    public wipe() {
        this._rules = []
    }

    // Imports a SPF string. THIS DOES NOT IMPORT INCLUDES FROM THE STRING! THEY ARE EXPECTED TO BE INCLUDED!
    public import(spf: any, fetchedIps: string[], action: boolean | undefined) {
        const ips: string[] = []
        for (const p of fetchedIps) ips.push(p)
        for (const v4 of spf.ip4 || []) ips.push(v4[0][1])
        for (const v6 of spf.ip6 || []) ips.push(v6[0][1])
        for (const p of ips) this._rules.push(new SPFRule(action, p))
    }

    // Evals the IP address/range given.
    public eval(ip: string) {
        const rulesCpy: SPFRule[] = []
        for (const r of this._rules) rulesCpy.push(r)

        let hardfail: undefined | boolean
        for (let ruleIndex = 0; rulesCpy.length > ruleIndex; ruleIndex++) {
            const rule = rulesCpy[ruleIndex]
            if (ip.match(rule.range)) return null
            else hardfail = rule.rule
        }

        return hardfail
    }

    // Defines if the sandbox is empty.
    public empty() {
        return this._rules.length === 0
    }
}

// Exports the sandbox.
export default new SPFSandbox()
