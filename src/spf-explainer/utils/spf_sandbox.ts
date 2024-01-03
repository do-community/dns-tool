/*
Copyright 2024 DigitalOcean

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

import CIDRMatcher from "cidr-matcher"

// Defines a SPF rule.
class SPFRule {
    // Defines public values in the class.
    public rule: boolean | undefined
    public matcher: CIDRMatcher

    // Constructs the rule.
    public constructor(rule: boolean | undefined, ips: string[]) {
        this.rule = rule
        this.matcher = new CIDRMatcher(ips)
    }
}

// Defines the SPF sandbox.
class SPFSandbox {
    // Defines the rules and listeners.
    private _rules: SPFRule[]
    private _listeners: (() => void)[]

    // Constructs the sandbox.
    public constructor() {
        this._rules = []
        this._listeners = []
    }

    // Wipes all current rules and listeners.
    public wipe() {
        this._rules = []
        this._listeners = []
    }

    // Imports a SPF string.
    // THIS DOES NOT IMPORT INCLUDES FROM THE STRING! THEY ARE EXPECTED TO BE INCLUDED!
    public import(spf: Record<string, any>, action: boolean | undefined) {
        const ips = new Set<string>()
        for (const v4 of spf.ip4 || []) ips.add(v4[0][1])
        for (const v6 of spf.ip6 || []) ips.add(v6[0][1])
        this._rules.push(new SPFRule(action, [...ips]))
        this._listeners.forEach(listener => listener())
    }

    // Evals the IP address/range given.
    // Returns null if the IP is allowed, true for a hard fail, false for a soft fail, undefined for a neutral fail.
    public eval(ip: string) {
        let hardFail: undefined | boolean

        for (const rule of this._rules) {
            if (rule.matcher.contains(ip)) return null
            hardFail = rule.rule
        }

        return hardFail
    }

    // Listen for imports.
    public listen(listener: () => void) {
        this._listeners.push(listener)
    }

    // Defines if the sandbox is empty.
    public empty() {
        return this._rules.length === 0
    }
}

// Exports the sandbox.
export default new SPFSandbox()
