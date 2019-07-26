<template>
  <span>
    <span v-for="record in records">
      <Record
        :ns="ns"
        :record-type="record.name"
        :record-url="record.url"
        :record-description="record.description"
        :data="$props.data"
        :expects-host="record.expectsHost"
      />
    </span>
  </span>
</template>

<script>
import Record from "./record"
import recordsDataset from "../data/records"
import cfDNS from "../utils/cfDNS"

export default {
    name: "RecordBase",
    components: {
        Record,
    },
    props: {
        data: String,
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
    watch: {
        data() {
            this.recordsInit()
        },
    },
    async mounted() {
        await this.recordsInit()
    },
    methods: {
        async recordsInit() {
            const json = await (await cfDNS(this.$props.data, "NS")).json()
            this.$data.ns = json.Answer ? json.Answer[0].data : ""
        },
    },
}
</script>
