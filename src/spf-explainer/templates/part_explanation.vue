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
    <div :class="`modal${toggled ? ' is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ i18n.templates.partExplanation.mechanism.replace("$", slug) }}
                </p>
                <button class="delete" @click="hide"></button>
            </header>
            <section class="modal-card-body" v-html="text"></section>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"

    export default {
        name: "PartExplanation",
        data() {
            return {
                slug: "",
                text: "",
                toggled: false,
                i18n,
            }
        },
        methods: {
            show(slug, text) {
                this.$data.toggled = true
                this.$data.slug = slug.trim()
                this.$data.text = text
            },
            hide() {
                this.$data.toggled = false
            },
        },
    }
</script>
