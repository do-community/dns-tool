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
    <CoreModal ref="CoreModal" :title="i18n.templates.dmarcExplainer.title">
        <div v-html="i18n.templates.dmarcExplainer.intro"></div>
        <hr>
        <p v-for="(value, key) in dmarc" :key="key">
            <b>{{ key }}</b>: <span v-html="value"></span>
        </p>
        <hr>
        <p>
            {{ i18n.templates.dmarcExplainer.learnMore }}
            <ExternalLink link="https://dmarc.org/" text="dmarc.org"></ExternalLink>.
        </p>
    </CoreModal>
</template>

<script>
    import i18n from "../i18n"
    import dmarc from "../data/dmarc"
    import ExternalLink from "../../shared/templates/ext_link"
    import CoreModal from "../../shared/templates/core_modal"

    export default {
        name: "DMARCExplainerModal",
        components: { CoreModal, ExternalLink },
        data() {
            return {
                i18n,
                dmarc,
            }
        },
        methods: {
            toggle() {
                this.$refs.CoreModal.toggle()
            },
        },
    }
</script>
