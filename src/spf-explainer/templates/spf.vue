<!--
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
-->

<template>
    <div v-if="!loading">
        <h5 class="title is-5">
            <span v-for="(_, key) in links" :key="key" :ref="key">
                <a @click="goToIndex(key)" @mouseover="markActive(key)">{{ key }} </a>
            </span>
        </h5>
        <div v-for="part in parts" :key="part[0]">
            <hr class="hr-small-pad">
            <div :ref="part[0]">
                <p>
                    <code class="slim">{{ part[0] }}</code>
                    <a
                        v-if="part[4] !== undefined && longDescriptionExists(part[4])"
                        @click="displayLongDescription(part[4])"
                    >
                        <i class="far fa-question-circle help"></i>
                    </a>
                    : <span v-html="part[1]"></span>
                </p>
                <span v-if="part[3] !== undefined && part[3].length !== 0">
                    <p>
                        This includes the IP address<span v-if="part[3].length !== 1">es</span>
                        <span v-for="(p, index) in part[3]">
                            <code class="slim">{{ p }}</code>
                            <span v-if="index !== part[3].length - 1">, </span>
                        </span>.
                    </p>
                </span>
                <span v-if="part[2] !== undefined">
                    <div v-for="record in part[2]">
                        <hr class="hr-small-pad">
                        <SPF :data="record" :hostname="hostname" class="record-group"></SPF>
                        <br>
                    </div>
                </span>
            </div>
        </div>
        <PartExplanation ref="PartExplanation"></PartExplanation>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import cfDNS from "../../shared/utils/cfDNS"
    import explanations from "../data/explanations"
    import { spawnLine, setFreezeSpawning } from "../utils/line_spawn"
    import longDescriptions from "../data/long_descriptions"
    import PartExplanation from "./part_explanation"
    import SPFSandbox from "../utils/spf_sandbox"

    export default {
        name: "SPF",
        components: {
            PartExplanation,
        },
        props: {
            data: String,
            hostname: String
        },
        data() {
            return {
                i18n,
                parts: [],
                links: {},
                activeLine: null,
                loading: false,
            }
        },
        watch: {
            data() {
                this.$data.links = {}
                this.init()
            },
        },
        mounted() {
            this.init()
        },
        methods: {
            longDescriptionExists(slug) {
                return longDescriptions[slug] !== undefined
            },
            displayLongDescription(slug) {
                this.$refs.PartExplanation.show(slug, longDescriptions[slug])
            },
            goToIndex(index) {
                setFreezeSpawning(true)
                const refArr = this.$refs[this.$data.links[index]]
                const ref = refArr[refArr.length - 1]
                window.scrollTo({
                    top: ref.getBoundingClientRect().y + window.pageYOffset - 32,
                })
                setTimeout(() => setFreezeSpawning(false), 500)
            },
            markActive(index) {
                const from = this.$refs[index][0]
                const refArr = this.$refs[this.$data.links[index]]
                const ref = refArr[refArr.length - 1]
                spawnLine([from, ref])
            },
            sanitize(data) {
                const lt = /</g,
                      gt = />/g,
                      ap = /'/g,
                      ic = /"/g

                return data.replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;")
            },
            async init() {
                // These are the parts which are given to Vue in a way which is easy to iterate.
                const parts = []

                // Splits the data into string parts.
                const dataSplit = this.$props.data.split(/ (?!\")/)

                // Chunks the records together by the same name. This is so we can combine ip4/ip6 values.
                const chunks = {}

                // Goes through each part of the raw data.
                for (const part of dataSplit) {
                    // Ignore blank parts.
                    if (part === "") continue
                    
                    // Defines if a match was found.
                    let done = false

                    // Iterate through the explanation keys.
                    for (const key of explanations.keys()) {
                        // Defines if the match is recursive (this means it'll lookup the argument and call the SPF object for it).
                        const recursive = key instanceof Array ? key[1] : false

                        // Defines if something matches the part.
                        const match = part.match(key instanceof Array ? key[0] : key)
                        if (match) {
                            // This is the record included with the SPF record. If this is defined, the SPF object will be called with this.
                            let include

                            // Defines the regex match for the URL to get the record to include from.
                            let lookup = match[1] ? match[1].replace(/\" \"/g, "") : undefined
                            if (recursive && lookup !== "") {
                                // Looks up the TXT record for the domain specified. If it exists and getting it was ok, set include to the data. 
                                const res = await cfDNS(lookup, "TXT")
                                if (res.ok) {
                                    const json = await res.json()
                                    if (json.Status === 0 && json.Answer) {
                                        const records = []
                                        for (const answer of json.Answer) {
                                            answer.data = answer.data.substr(1).slice(0, -1)
                                            if (answer.data.startsWith("v=spf1")) records.push(answer.data)
                                        }
                                        include = records
                                    }
                                }
                            }

                            // Defines all included IP's.
                            const ipInclude = []

                            // Defines the record type to do a IP result lookup in. This might be undefined, in which case it will not be done.
                            const recordType = key[2]

                            // Splits by the last space.
                            const splitLastSpace = text => {
                                const mSplit = text.split(/ /)
                                return mSplit[mSplit.length - 1]
                            }

                            // Runs the request against Cloudflare DNS. If everything is ok, append all responses to ipInclude.
                            const cfRun = async host => {
                                const cfRecord = await cfDNS(host, recordType)
                                if (cfRecord.ok) {
                                    const j = await cfRecord.json()
                                    if (j.Answer) {
                                        for (const x of j.Answer) {
                                            if (x.data.match(/.*\.[a-z]+/)) await cfRun(splitLastSpace(splitLastSpace(x.data)))
                                            else ipInclude.push(splitLastSpace(x.data))
                                        }
                                    }
                                }
                            }

                            // If record type exists, run the IP lookup.
                            if (recordType) await cfRun(splitLastSpace(match[1] ? match[1] : this.$props.hostname))

                            // Get the record part to chunk by.
                            const recordChunk = part.split(/:|=/)[0]

                            // Finalise this bit by setting the chunk value and breaking.
                            const arr = [match, include, ipInclude, key]
                            if (chunks[recordChunk] === undefined) chunks[recordChunk] = [arr]
                            else chunks[recordChunk].push(arr)
                            done = true
                            break
                        }
                    }

                    // If the mechanism was not found, return unknown.
                    if (!done) {
                        parts.push([part, i18n.data.explanations.unknown])
                        this.$data.links[part] = part
                    }
                }

                // Defines all IP addresses. This is used in the SPF sandbox.
                const ips = []

                for (const chunk in chunks) {
                    // Defines the chunk.
                    const chunkArr = chunks[chunk]

                    // Get the description.
                    let v = explanations.get(chunkArr[0][3])

                    // Sort out the "??<value>??" operator. This adds the text in the question marks if the length is greater than 0.
                    const gt0Matches = v.match(/\?\?(.+)\?\?/g) || []
                    for (const m of gt0Matches) {
                        const x = m.substr(2).slice(0, -2)
                        v = v.replace(m, chunkArr.length !== 1 ? x : "")
                    }

                    if (v.includes("{R}")) {
                        // This neatly writes out all of the IP addresses in a chunk.
                        let key = chunkArr.length === 1 ? chunkArr[0][0][0] : chunk
                        let commaSepList = []
                        if (key.match(/^ip[0-9]$/)) key = `${key}:<IP range>`
                        for (const chunkItem of chunkArr) {
                            ips.push(chunkItem[0][0])
                            const san = this.sanitize(chunkItem[0][1])
                            if (commaSepList.includes(san)) continue
                            commaSepList.push(san)
                            this.$data.links[chunkItem[0][0]] = key
                        }
                        let value = v.replace("{R}", commaSepList.join(`</code>, <code class="slim">`))
                        parts.push([key, value, chunkArr[0][1], chunkArr[0][2], chunk])
                    } else {
                        // This just handles the basic templating. We do not need to worry about iteration of all values, just go through each bit seperately.
                        for (const chunkItem of chunkArr) {
                            let value = v
                            const numberMatches = v.match(/\{[0-9]+\}/g)
                            if (numberMatches) {
                                for (const n of numberMatches) {
                                    const x = Number(n.substr(1).slice(0, -1))
                                    value = v.replace(n, this.sanitize(chunkItem[0][x]))
                                }
                            }
                            this.$data.links[chunkItem[0][0]] = chunkItem[0][0]

                            // Detect IP address record dupes and fix them.
                            if (chunkItem[2]) {
                                const i = []
                                for (const ip of chunkItem[2]) {
                                    if (!i.includes(ip)) {
                                        i.push(ip)
                                        ips.push(ip)
                                    }
                                }
                                chunkItem[2] = i
                            }

                            // Adds this to parts (described above).
                            parts.push([chunkItem[0][0].trim(), value, chunkItem[1], chunkItem[2], chunk])
                        }
                    }
                }

                // ?all will be undefined anyway, hence it not here.
                const action = chunks["~all"] ? true : chunks["-all"] ? false : undefined
                SPFSandbox.import(chunks, ips, action)

                // Sets the parts to the component and emits that it is done loading.
                this.$data.parts = parts
                this.$emit("done-loading")
            },
        },
    }
</script>
