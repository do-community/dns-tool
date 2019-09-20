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
    <CoreModal ref="CoreModal" :title="i18n.templates.evalModal.title">
        <p>{{ message }}</p>
    </CoreModal>
</template>

<script>
    import i18n from "../i18n"
    import SPFSandbox from "../utils/spf_sandbox"
    import CoreModal from "../../shared/templates/core_modal"

    export default {
        name: "EvalModal",
        components: {
            CoreModal,
        },
        props: {
            ip: String,
        },
        data() {
            return {
                i18n,
                message: "",
            }
        },
        methods: {
            toggle() {
                const res = SPFSandbox.eval(this.$props.ip)
                if (res === null) this.$data.message = i18n.templates.evalModal.goThrough
                else if (res === undefined) this.$data.message = i18n.data.explanations.neutral
                else if (res) this.$data.message = i18n.templates.evalModal.softFail
                else this.$data.message = i18n.templates.evalModal.ignored
                this.$refs.CoreModal.toggle()
            },
        },
    }
</script>
