<template>
    <span>
        <span v-for="record in records">
            <Record :ns="ns" :recordType="record.name" :recordUrl="record.url" :recordDescription="record.description" :data="$props.data" :expectsHost="record.expectsHost"></Record>
        </span>
    </span>
</template>

<script>
import Record from "./record"
import recordsDataset from "../data/records"
import cfDNS from "../utils/cfDNS"

export default {
    name: "RecordBase",
    props: {
        data: String,
    },
    methods: {
        async recordsInit() {
            const dnsRes = await cfDNS(this.$props.data, "NS")
            const json = await dnsRes.json()
            if (json.Answer) {
                this.$data.ns = json.Answer[0].data
            } else {
                this.$data.ns = ""
            }
        },
    },
    async mounted() {
        await this.recordsInit()
    },
    watch: {
        data() {
            this.recordsInit()
        },
    },
    data() {
        const setRecords = []
        for (const recordKey in recordsDataset) {
            const record = recordsDataset[recordKey]
            setRecords.push({
                name: recordKey,
                description: record.info,
                url: record.url,
                expectsHost: Boolean(record.expectsHost),
            })
        }
        return {
            records: setRecords,
            ns: "",
        }
    },
    components: {
        Record,
    },
}
</script>
