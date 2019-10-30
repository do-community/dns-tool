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
    <Landing :background-top="this.$props.backgroundTop"
             :background-bottom="this.$props.backgroundBottom"
             :title="this.$props.title"
             :description="this.$props.description"
             github="https://github.com/do-community/dns-tool"
    >
        <form autocomplete="on" @submit.prevent="emitSearchEvent">
            <div class="input-container">
                <label for="DomainInput" class="hidden">{{ i18n.common.searchButton }}</label>
                <i class="fas fa-search"></i>
                <input id="DomainInput"
                       v-model="d"
                       class="input"
                       type="text"
                       :placeholder="i18n.common.searchPlaceholder"
                       @input="execSetText"
                />
                <button :id="$props.buttonId" class="button is-primary">
                    {{ i18n.common.searchButton }}
                </button>
            </div>
        </form>
    </Landing>
</template>

<script>
    import Landing from "do-vue/src/templates/landing"
    import i18n from "../i18n"

    export default {
        name: "DNSLanding",
        components: {
            Landing,
        },
        props: {
            title: String,
            description: String,
            buttonId: String,
            initValue: String,
            backgroundTop: String,
            backgroundBottom: String,
        },
        data() {
            return {
                i18n,
                d: this.$props.initValue,
            }
        },
        methods: {
            emitSearchEvent() {
                this.$emit("search-event")
            },
            execSetText() {
                this.$emit("set-text", this.$data.d)
            }
        },
    }
</script>
