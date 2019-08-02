<template>
    <div>
        <PropagationModal ref="PropagationModal"></PropagationModal>
        <div v-for="record in records">
            <Record
                :ref="record.name"
                :ns="ns"
                :registrar="$props.registrar"
                :record-type="record.name"
                :record-url="record.url"
                :record-description="record.description"
                :data="$props.data"
                :expects-host="record.expectsHost"
                @propagation-toggle="toggleModal"
            />
        </div>
    </div>
</template>

<script>
    import Record from "./record"
    import VueifiedRecords from "../data/vueified_records"
    import cfDNS from "../utils/cfDNS"
    import PropagationModal from "./propagation_modal"

    export default {
        name: "RecordBase",
        components: {
            Record,
            PropagationModal,
        },
        props: {
            data: String,
            registrar: String,
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
                    promises.push(ref.wait())
                }
                await Promise.all(promises)
            },
            toggleModal() {
                this.$refs.PropagationModal.toggle()
            },
        },
    }
</script>
