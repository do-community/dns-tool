<template>
    <div>
        <div v-for="record in records">
            <Record
                :ref="record.name"
                :ns="ns"
                :record-type="record.name"
                :record-url="record.url"
                :record-description="record.description"
                :data="$props.data"
                :expects-host="record.expectsHost"
            />
        </div>
    </div>
</template>

<script>
    import Record from "./record"
    import VueifiedRecords from "../data/vueified_records"
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
            return {
                records: VueifiedRecords,
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
                if (this.$props.data === "") return

                const json = await (await cfDNS(this.$props.data, "NS")).json()
                this.$data.ns = json.Answer ? json.Answer[0].data : ""
            },
            async wait() {
                const promises = []
                for (const record of this.$data.records) {
                    const ref = this.$refs[record.name][0]
                    ref.$data.active = false
                    if (ref.$props.data === this.$props.data) ref.recordInit()
                    promises.push(ref.wait())
                }
                await Promise.all(promises)
            },
        },
    }
</script>
