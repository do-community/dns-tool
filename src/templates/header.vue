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
    <div class="header">
        <ghLink repo="https://github.com/do-community/dns-tool"></ghLink>
        <div class="container">
            <h1>{{ $props.title }}</h1>
            <p>{{ $props.description }}</p>

            <form autocomplete="on" @submit.prevent="emitSearchEvent">
                <div class="input-container">
                    <label for="DomainInput" class="hidden">Search</label>
                    <i class="fas fa-search"></i>
                    <input id="DomainInput" v-model="d" class="input" type="text" :placeholder="$props.searchPlaceholder" @input="execSetText">
                </div>
                <div class="buttons">
                    <slot></slot>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import ghLink from "./gh_link"

    export default {
        name: "Header",
        components: {
            ghLink,
        },
        props: {
            title: String,
            description: String,
            searchPlaceholder: String,
            initValue: String,
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
