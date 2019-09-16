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
    <CoreModal ref="CoreModal" :title="i18n.templates.propagationModal.title">
        <span v-for="part in splitUrlText(tutorial)">
            <span v-if="typeof part === 'string'" v-html="part"></span>
            <span v-else>
                <ExternalLink :text="part[0]" :link="part[1]"></ExternalLink>
            </span>
        </span>
    </CoreModal>
</template>

<script>
    import i18n from "../i18n"
    import dataUrlParser from "../../shared/utils/dataUrlParser"
    import ExternalLink from "../../shared/templates/ext_link"
    import CoreModal from "../../shared/templates/core_modal"

    let recordType, recordHost
    const deeplink = () => {
        const link = 'https://dnschecker.org/'
        if (!recordType || !recordHost) return link
        return `${link}#${recordType.toUpperCase()}/${recordHost}`
    }
    const content = () => i18n.templates.propagationModal.tutorial.replace("{{DEEPLINK}}", deeplink())

    export default {
        name: "PropagationModal",
        components: {
            ExternalLink,
            CoreModal,
        },
        data() {
            return {
                tutorial: content(),
                i18n,
            }
        },
        methods: {
            splitUrlText(text) {
                return dataUrlParser(text)
            },
            setData(newRecordType, newRecordHost) {
                recordType = newRecordType
                recordHost = newRecordHost
                this.$data.tutorial = content()
            },
            toggle() {
                this.$refs.CoreModal.toggle()
            },
        },
    }
</script>
