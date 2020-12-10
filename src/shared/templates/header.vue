<!--
Copyright 2020 DigitalOcean

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
    <Header :title="this.$props.title" @form-event="emitSearchEvent">
        <template #description>
            <slot name="description"></slot>
        </template>
        <template #header>
            <slot name="header"></slot>
        </template>
        <template #buttons>
            <slot name="buttons"></slot>
        </template>

        <template #input>
            <label for="DomainInput" class="hidden">Search</label>
            <i class="fas fa-search"></i>
            <input id="DomainInput"
                   v-model="d"
                   class="input"
                   type="text"
                   :placeholder="i18n.common.searchPlaceholder"
                   @input="execSetText"
            />
            <button :id="$props.buttonId" class="button is-inline">
                {{ i18n.common.searchButton }}
            </button>
        </template>
    </Header>
</template>

<script>
    import Header from "do-vue/src/templates/header"
    import i18n from "../i18n"

    const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`

    export default {
        name: "DNSHeader",
        components: {
            Header,
        },
        props: {
            title: String,
            buttonId: String,
            initValue: String,
        },
        data() {
            return {
                i18n,
                baseUrl,
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
