<!--
Copyright 2022 DigitalOcean

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
    <div>
        <div v-if="active">
            <h3 :id="`${recordType}-Records`" class="title is-3">
                {{ recordType }} {{ i18n.common.records }}
                <a :href="`#${recordType}-Records`">
                    <i class="fas fa-link"></i>
                </a>
            </h3>
            <p>
                <span v-html="recordDescription"></span>
                <ExternalLink :link="recordUrl" :text="i18n.templates.records.learnMore" />
            </p>
            <div v-if="recordKeys.length === 0">
                <p><b>{{ i18n.templates.records.noRecords }}</b></p>
                <p v-if="recordType === 'SRV' || recordType === 'TLSA'" v-html="insertHtmlPlaceholders()"></p>
            </div>
            <div v-else>
                <p v-if="recordType === 'DMARC'">
                    <a @click="openDmarcModal">{{ i18n.templates.records.dmarcMechanisms }}</a>
                </p>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th v-for="recordKey in recordKeys">
                                    {{ recordKey }}
                                    <i
                                        v-if="recordKey in recordKeyHelp"
                                        v-tippy
                                        :title="recordKeyHelp[recordKey]"
                                        class="far fa-question-circle help"
                                    ></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in recordRows">
                                <td v-for="valueNode in row">
                                    <div v-for="value in valueNode.values">
                                        <div v-if="value.truncated">
                                            <TruncatedRecord
                                                :value="value.result"
                                                :truncated="value.truncated"
                                            />
                                        </div>
                                        <div v-else>
                                            {{ value.result }}
                                            <div v-if="value.hostname">
                                                <hr />
                                                <WHOIS :ip="value.ip"></WHOIS>
                                                <div v-if="recordType === 'MX'">
                                                    <MXBlocklist :ip="value.ip" :hostname="value.hostname ? value.hostname : ''"></MXBlocklist>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="valueNode.description">
                                        <hr />
                                        <p>
                                            <small>
                                                <b v-html="valueNode.description"></b>
                                            </small>
                                        </p>
                                    </div>
                                    <a
                                        v-if="valueNode.button"
                                        :href="valueNode.button.link"
                                        class="button is-primary is-mini"
                                    >{{ valueNode.button.text }}</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p style="margin-top: 20px">
                <a @click="propagationToggle">{{ i18n.templates.records.propagation }}</a>
            </p>
            <div v-if="dnsDifferences.length !== 0">
                <p><a @click="toggleDnsDifferences"><b>{{ i18n.templates.records.propagationNote }}</b></a></p>
                <DNSDiff ref="DNSDiff" :dns-differences="dnsDifferences" :record-type="recordType"></DNSDiff>
            </div>
            <p v-if="learnMore" style="margin-top: 20px">
                <ExternalLink
                    :link="learnMore"
                    :text="i18n.templates.records.learnHow.replace('{record}', recordType)"
                ></ExternalLink>
            </p>
        </div>
        <div v-else>
            <RecordSkeleton :loading="loading"></RecordSkeleton>
        </div>
        <hr>
        <DMARCExplainerModal ref="DMARCExplainerModal"></DMARCExplainerModal>
    </div>
</template>

<script>
    import TruncatedRecord from "./truncated_record"
    import WHOIS from "./whois"
    import cfDNS from "../../shared/utils/cfDNS"
    import googleDNS from "../utils/googleDNS"
    import standardiseRecords from "../standardise_records"
    import { getLargestRecordPart } from "../table"
    import records from "../data/records"
    import recordKeyHelp from "../data/record_key_help"
    import txtFragments from "../data/txt"
    import dmarcFragments from "../data/dmarc"
    import registrarRegexp from "../data/registrar_regexp"
    import nsRegexp from "../data/ns_regexp"
    import RecordTutorials from "../data/record_tutorials"
    import MXBlocklist from "./mx_blocklist"
    import RecordSkeleton from "./skeletons/record"
    import i18n from "../i18n"
    import DNSDiff from "./dns_diff"
    import { reports } from "../plain_text_reports"
    import ExternalLink from "do-vue/src/templates/external_link"
    import DMARCExplainerModal from "./dmarc_explainer_modal"

    const trimmers = {}
    for (const recordKey in records)
        if (records[recordKey].additionalDataParsing) trimmers[recordKey] = records[recordKey].additionalDataParsing

    const isHostname = /.*\.[a-z]+/

    // Gets the IP address for a hostname.
    const getIpFromHostname = async (hostname) => {
        if (!hostname.match(isHostname)) return hostname

        const res = await cfDNS(hostname, "A")

        if (!res.ok) throw new Error()

        const json = await res.json()
        if (!json.Answer) throw new Error()

        return json.Answer[0].data
    }

    export default {
        name: "Record",
        components: {
            TruncatedRecord,
            WHOIS,
            MXBlocklist,
            RecordSkeleton,
            DNSDiff,
            ExternalLink,
            DMARCExplainerModal,
        },
        props: {
            recordUrl: String,
            data: String,
            recordType: String,
            recordDescription: String,
            expectsHost: Boolean,
            ns: String,
            registrar: String,
            loading: Boolean,
        },
        data() {
            return {
                active: false,
                recordKeys: [],
                recordRows: [],
                dnsDifferences: [],
                learnMore: null,
                recordKeyHelp,
                i18n,
            }
        },
        watch: {
            data() {
                this.recordInit()
            },
            ns() {
                this.handleNs()
            },
            registrar() {
                this.handleRegistrar()
            },
        },
        mounted() {
            this.recordInit()
            this.handleNs()
            this.handleRegistrar()
        },
        methods: {
            openDmarcModal() {
                this.$refs.DMARCExplainerModal.toggle()
            },
            insertHtmlPlaceholders() {
                return i18n.templates.records.srvTlsaFormat
                    .replace(/{record}/g, this.$props.recordType)
                    .replace(/{sub}/g, this.$props.recordType === 'SRV' ? 'service' : 'port')
                    .replace(/{a}/g, this.$props.recordType === 'SRV' ? 'an' : 'a')
            },
            toggleDnsDifferences() {
                this.$refs.DNSDiff.toggle()
            },
            async wait() {
                return new Promise(res => {
                    const checkIfTrue = () => {
                        if (this.$data.active) {
                            res()
                            return
                        }
                        setTimeout(checkIfTrue, 10)
                    }
                    checkIfTrue()
                })
            },
            standardiseGoogleCf(item, record) {
                const numberSpaceItem = /[0-9]+ (.+)/
                const oddSpfEdgecase = /include:_spf\" +\"/g
                item = item.toString().trim()
                const numberSpaceMatch = item.match(numberSpaceItem)
                if (numberSpaceMatch) item = numberSpaceMatch[1]
                if (item.match(oddSpfEdgecase)) item = item.replace(oddSpfEdgecase, "include:_spf\"\"")
                if (record === "SSHFP" || record === "TLSA") item = item.toLowerCase()
                return item
            },
            async handleSecondaryLookup(answer, record, name) {
                const googleDNSLookup = await googleDNS(name, record)
                const json = await googleDNSLookup.json()
                const gAnswer = json.Answer || []

                const googleData = []
                const cfData = []
                for (const a of answer) {
                    if (a.data) cfData.push(this.standardiseGoogleCf(a.data, record))
                }
                for (const a of gAnswer) {
                    if (a.data) googleData.push(this.standardiseGoogleCf(a.data, record))
                }

                const differences = []
                for (const item of cfData) {
                    if (!googleData.includes(item)) {
                        differences.push([name, item, null])
                    }
                }
                for (const item of googleData) {
                    if (!cfData.includes(item)) {
                        differences.push([name, null, item])
                    }
                }

                this.$data.dnsDifferences = differences
            },
            async recordInit() {
                if (this.$props.data === "") return

                // Reset the records
                this.$data.recordKeys = []
                this.$data.recordRows = []

                // If we're requesting DMARC, actually look at _dmarc.hostname w/ TXT
                const key = this.$props.recordType
                let changedKey = this.$props.recordType
                let text = this.$props.data
                if (key === "DMARC") {
                    text = `_dmarc.${text}`
                    changedKey = "TXT"
                }

                // Get the raw result from Cloudflare DoH
                const fetchRes = await cfDNS(text, changedKey)
                if (!fetchRes.ok) throw fetchRes
                const json = await fetchRes.json()

                // Reset the Cloudflare/Google differences
                this.$data.dnsDifferences = []

                // If no results, exit early
                if (!json.Answer) {
                    this.$data.active = true
                    this.$data.recordRows = []
                    this.$data.recordKeys = []
                    reports.set(key, {})
                    return
                }

                // Handle hex rdata
                for (const answer of json.Answer) {
                    if (answer.data.startsWith('\\#')) {
                        const words = answer.data.split(' ')
                        const length = words.length > 1 ? Number(words[1]) : 0

                        // Drop the # and length, and any extra bytes beyond the declared length
                        words.splice(0, 2)
                        words.splice(length)

                        // CAA
                        if (changedKey === 'CAA' && words.length > 1) {
                            const tagLength = Number(words[1])
                            words.splice(0, 2)

                            // Get the tag, dropping any non alpha-numeric bytes per
                            //  https://tools.ietf.org/html/rfc6844#section-5.1
                            const tag = words.splice(0, tagLength)
                                .map(part => String.fromCharCode(parseInt(part, 16))).join('').trim()
                                .replace(/[^a-z0-9]/gi, '')

                            // Get the value
                            const value = words.map(part => String.fromCharCode(parseInt(part, 16))).join('').trim()

                            // Combine and output
                            answer.data = `${tag} "${value}"`
                            continue
                        }

                        // Normal hex data
                        answer.data = words.map(part => String.fromCharCode(parseInt(part, 16))).join('').trim()
                    }
                }

                // Run the Google difference lookup in the background
                this.handleSecondaryLookup(json.Answer, changedKey, text).then()

                // Standardise the records for display
                const recordsJoined = {}
                const txtRecordFragments = {}
                standardiseRecords(key, json, txtRecordFragments, recordsJoined, /[=: ]/)
                this.$data.recordKeys = Object.keys(recordsJoined)
                const largestRecordPart = getLargestRecordPart(Object.values(recordsJoined))

                // Process the records into the output rows
                let recordRows = []
                for (let i = 0; i < largestRecordPart; i++) {
                    let row = []
                    for (const collectionKey of this.$data.recordKeys) {
                        const data = {
                            values: [{
                                result: recordsJoined[collectionKey][i],
                            }],
                        }
                        if (data.values[0].result !== undefined && collectionKey === "Data") {
                            data.values[0].result = trimmers[changedKey] ? trimmers[changedKey](data.values[0].result) : data.values[0].result

                            const newLineSplit = data.values[0].result.toString().split(/\n/g)
                            let tSplit
                            for (const splitPart of newLineSplit) {
                                let part = splitPart

                                if (key === "TXT") {
                                    tSplit = part.split(/[=: ]/)
                                    let truncated
                                    if (tSplit.length > 1) {
                                        truncated = (tSplit[0] === "v" && tSplit[1] === "spf1") ? `${tSplit[0]}=${tSplit[1]}` : tSplit[0]
                                    } else {
                                        truncated = part.substr(0, 30)
                                    }
                                    if (txtFragments[truncated]) data.description = txtFragments[truncated]
                                    if (part.length > 20) data.values[0].truncated = truncated
                                    if (truncated === "v=spf1") {
                                        data.button = {
                                            link: `https://www.digitalocean.com/community/tools/spf?domain=${text}`,
                                            text: "Explore and evaluate SPF record",
                                        }
                                    }
                                } else if (key === "DMARC") {
                                    const split = part.split("=")
                                    const whitespaceGone = split[0].trim()
                                    if (dmarcFragments[whitespaceGone]) data.description = dmarcFragments[whitespaceGone]
                                }
                            }
                            if (this.$props.expectsHost) {
                                data.values[0].ip = await getIpFromHostname(data.values[0].result)
                                data.values[0].hostname = data.values[0].result
                                if (data.values[0].ip !== data.values[0].result) {
                                    data.values[0].result = `${data.values[0].hostname} (${data.values[0].ip})`
                                }
                            }
                        } else if (collectionKey === "Name") {
                            const last = data.values[0].result[data.values[0].result.length - 1]
                            if (last === ".") data.values[0].result = data.values[0].result.slice(0, -1)
                        } else {
                            data.values[0].result = data.values[0].result ? data.values[0].result  : "--"
                        }

                        row.push(data)
                    }
                    recordRows.push(row)
                }

                if (key === "TXT") {
                    const recordGlue = {}
                    for (const row of recordRows) {
                        const name = row[0].values[0].result
                        const ttl = row[1].values[0].result
                        const trunc = row[2].values[0].truncated
                        const glueKey = `${name}%${ttl}%${trunc}`
                        if (recordGlue[glueKey]) recordGlue[glueKey].push(row)
                        else recordGlue[glueKey] = [row]
                    }
                    recordRows = []
                    for (const glueValues of Object.values(recordGlue)) {
                        const first = glueValues.shift()
                        for (const value of glueValues) {
                            first[2].values.push(value[2].values[0])
                        }
                        recordRows.push(first)
                    }
                }

                this.$data.recordRows = recordRows
                this.$data.active = true
                reports.set(key, json)
            },
            set(regexp, registrar) {
                const map = registrar ? registrarRegexp : nsRegexp
                const tutorial = RecordTutorials[map.get(regexp)]
                if (typeof tutorial === "string") {
                    this.$data.learnMore = tutorial
                } else {
                    if (tutorial[this.$props.recordType]) this.$data.learnMore = tutorial[this.$props.recordType]
                }
            },
            async handleRegistrar() {
                if (this.$props.recordType === "NS") {
                    this.$data.learnMore = null
                    for (const regexp of registrarRegexp.keys()) {
                        if (this.$props.registrar.match(regexp)) return this.set(regexp, true)
                    }
                }
            },
            async handleNs() {
                if (this.$props.recordType !== "NS") {
                    this.$data.learnMore = null
                    const ns = this.$props.ns

                    for (const regexp of nsRegexp.keys()) {
                        if (ns.match(regexp)) return this.set(regexp)
                    }
                }
            },
            propagationToggle() {
                this.$emit("propagation-toggle")
            },
        },
    }
</script>
