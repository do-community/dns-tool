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
    <Modal ref="Modal" :title="i18n.templates.partExplanation.mechanism.replace('$', slug)">
        <span v-html="text"></span>
    </Modal>
</template>

<script>
    import i18n from "../i18n"
    import Modal from "do-vue/src/templates/modal"

    export default {
        name: "PartExplanation",
        components: {
            Modal,
        },
        data() {
            return {
                slug: "",
                text: "",
                i18n,
            }
        },
        methods: {
            show(slug, text) {
                this.$refs.Modal.toggle()
                this.$data.slug = slug.trim()
                this.$data.text = text
            },
        },
    }
</script>
