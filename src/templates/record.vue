<template>
  <span v-if="active">
    <h3
      :id="`${this.$props.recordType}-Records`"
      class="title is-3"
    >
      {{ this.$props.recordType }} Records
      <a :href="`#${this.$props.recordType}-Records`"><i
        class="fas fa-link"
        style="color: black; font-size: 50%;"
      /></a>
    </h3>
    <p><span v-html="this.$props.recordDescription" /> <a :href="this.$props.recordUrl">Learn more</a></p>
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
                  <TruncatedRecord
                    :value="value.result"
                    :truncated="value.truncated"
                  />
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
    <p
      v-if="learnMore"
      style="margin-top: 20px"
    ><a :href="learnMore">Learn how to set {{ this.$props.recordType }} records with your DNS.</a></p>
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
import nsRegexp from "../data/ns_regexp"
import RecordTutorials from "../data/record_tutorials"

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
    },
    props: {
        recordUrl: String,
        data: String,
        recordType: String,
        recordDescription: String,
        expectsHost: Boolean,
        ns: String,
    },
    data() {
        return {
            active: false,
            recordKeys: [],
            recordRows: [],
            learnMore: null,
        }
    },
    watch: {
        data() {
            this.recordInit()
        },
        ns() {
            this.handleNs()
        },
    },
    mounted() {
        this.recordInit()
        this.handleNs()
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

            if (!json.Answer) return this.$data.active = true

            const recordsJoined = {}
            const txtRecordFragments = {}

            standardiseRecords(key, json, txtRecordFragments, recordsJoined, /[=: ]/)
            this.recordKeys = Object.keys(recordsJoined)
            const largestRecordPart = getLargestRecordPart(Object.values(recordsJoined))

            let recordRows = []

            for (let i = 0; i < largestRecordPart; i++) {
                let row = []
                for (const collectionKey of this.recordKeys) {
                    const data = {
                        values: [{
                            result: recordsJoined[collectionKey][i],
                        }],
                    }
                    if (data.values[0].result !== undefined && collectionKey === "Data") {
                        data.values[0].result = trimmers[props.recordType] ? trimmers[props.recordType](data.values[0].result) : data.values[0].result

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
                            }
                        }
                        if (props.expectsHost) {
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
        },
        async handleNs() {
            this.$data.learnMore = null
            const ns = this.$props.ns
            for (const regexp of nsRegexp.keys()) {
                if (ns.match(regexp)) {
                    const tutorial = RecordTutorials[nsRegexp.get(regexp)]
                    if (typeof tutorial === "string") {
                        this.$data.learnMore = tutorial
                    } else {
                        if (tutorial[this.$props.recordType]) this.$data.learnMore = tutorial[this.$props.recordType]
                    }
                    return
                }
            }
        },
    },
}
</script>
