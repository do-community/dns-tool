<template>
    <span v-if="active">
        <h3 class="title is-3" :id="`${this.$props.recordType}-Records`">
            {{ this.$props.recordType }} Records
            <a :href="`#${this.$props.recordType}-Records`"><i class="fas fa-link" style="color: black; font-size: 50%;"></i></a>
        </h3>
        <p><span v-html="this.$props.recordDescription"></span> <a :href="this.$props.recordUrl">Learn more</a></p>
        <span v-if="recordKeys.length === 0">
            <p><b>Could not find any records of this type.</b></p>
        </span>
        <span v-else>
            <br>
            <table class="table is-bordered">
                <thead>
                    <tr>
                        <th v-for="recordKey in recordKeys">
                            {{ recordKey }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in recordRows">
                        <td v-for="valueNode in row">
                            <span v-for="value in valueNode.values">
                                <span v-if="value.truncated">
                                    <TruncatedRecord :value="value.result" :truncated="value.truncated" />
                                </span>
                                <span v-else>
                                    {{ value.result }}
                                    <span v-if="value.hostname">
                                        <hr style="margin: 5px">
                                        <WHOIS :ip="value.ip" />
                                    </span>
                                </span>
                            </span>
                            <span v-if="valueNode.description">
                                <hr style="margin: 5px"><p style="font-size: 11px"><b>{{ valueNode.description }}</b></p>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </span>
        <hr>
    </span>
</template>

<script>
import TruncatedRecord from "./truncated_record"
import WHOIS from "./whois"
import cfDNS from "../utils/cfDNS"
import standardiseRecords from "../standardise_records"
import { getLargestRecordPart } from "../table"
import records from "../data/records"
import txtFragments from "../data/txt"

const trimmers = {}
for (const recordKey in records) {
    if (records[recordKey].additionalDataParsing) {
        trimmers[recordKey] = records[recordKey].additionalDataParsing
    }
}

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
    },
    data() {
        return {
            active: false,
            recordKeys: [],
            recordRows: [],
        }
    },
    props: {
        recordUrl: String,
        data: String,
        recordType: String,
        recordDescription: String,
        expectsHost: Boolean,
    },
    async mounted() {
        await this.recordInit()
    },
    watch: {
        data() {
            this.recordInit()
        },
    },
    methods: {
        async recordInit() {
            this.$data.recordKeys = []
            this.$data.recordRows = []

            this.$data.active = false
            const props = this.$props

            const key = props.recordType
            let text = props.data
            let changedKey = props.recordType

            if (key === "DMARC") {
                text = `_dmarc.${text}`
                changedKey = "TXT"
            }

            const fetchRes = await cfDNS(text, changedKey)
            if (!fetchRes.ok) throw fetchRes
            const json = await fetchRes.json()

            if (!json.Answer) {
                this.$data.active = true
                return
            }

            const recordsJoined = {}
            const txtRecordFragments = {}

            standardiseRecords(key, json, txtRecordFragments, recordsJoined, /[=: ]/)
            const keys = Object.keys(recordsJoined)
            this.recordKeys = keys
            const largestRecordPart = getLargestRecordPart(Object.values(recordsJoined))

            let recordRows = []

            for (let i = 0; i < largestRecordPart; i++) {
                let row = []
                for (const collectionKey of keys) {
                    const data = {
                        values: [{
                            result: recordsJoined[collectionKey][i],
                        }],
                    }
                    if (data.values[0].result !== undefined && collectionKey === "Data") {
                        data.values[0].result = trimmers[props.recordType] ? trimmers[props.recordType](data.values[0].result) : data.values[0].result

                        const newLineSplit = data.values[0].result.toString().split(/\n/g)
                        const newParts = []
                        for (const splitPart of newLineSplit) {
                            let part = splitPart

                            let tSplit

                            for (const splitPart of newLineSplit) {
                                let part = splitPart

                                if (key === "TXT") {
                                    tSplit = part.split(/[=: ]/)
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
                                    if (txtFragments[truncated]) {
                                        data.description = txtFragments[truncated]
                                    }
                                    if (part.length > 20) {
                                        data.values[0].truncated = truncated
                                    }
                                }
                            }
                        }
                        if (props.expectsHost) {
                            const ip = await getIpFromHostname(data.values[0].result)
                            data.values[0].ip = ip
                            data.values[0].hostname = data.values[0].result
                            if (ip !== data.values[0].result) {
                                data.values[0].result = `${data.values[0].hostname} (${data.values[0].ip})`
                            }
                        }
                    } else if (collectionKey === "Name") {
                        const last = data.values[0].result[data.values[0].result.length - 1]
                        if (last === ".") {
                            data.values[0].result = data.values[0].result.slice(0, -1)
                        }
                    } else {
                        data.values[0].result = data.values[0].result.toString()
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
                    const key = `${name}%${ttl}%${trunc}`
                    if (recordGlue[key]) {
                        recordGlue[key].push(row)
                    } else {
                        recordGlue[key] = [row]
                    }
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
        },
    },
}
</script>
