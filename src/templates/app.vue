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
    <div>
        <GHLink repo="https://github.com/do-community/dns-tool"></GHLink>
        <RecordSelectionModal ref="RecordSelectionModal"></RecordSelectionModal>
        <div class="header">
            <div class="container">
                <h1>{{ i18n.templates.app.title }}</h1>
                <p>{{ i18n.templates.app.description }}</p>
                <form autocomplete="on" @submit.prevent="searchDNSEvent">
                    <input id="DomainInput" class="input" type="text" :placeholder="i18n.templates.app.domain">
                    <div class="buttons">
                        <button id="SearchButton" class="button is-link">
                            {{ i18n.templates.app.searchButton }}
                        </button>
                        <a v-if="data !== ''" class="button is-success" @click="toggleRecordTextModal">
                            {{ i18n.templates.app.textRecords }}
                        </a>
                    </div>
                </form>
            </div>
        </div>
        <div class="container" style="display: flex; flex-direction: column;">
            <div id="content">
                <RecordJumps :loaded="data !== ''" :loading="siteLoading"></RecordJumps>
                <DODNS :loaded="data !== ''" :data="data" :loading="siteLoading"></DODNS>
                <div v-if="firstSearch">
                    <NoSearch v-if="data === ''"></NoSearch>
                    <RecordSkeleton :loading="false"></RecordSkeleton>
                    <RecordSkeleton :loading="false"></RecordSkeleton>
                    <RecordSkeleton :loading="false"></RecordSkeleton>
                </div>
                <div v-else>
                    <RecordBase ref="RecordBase" :data="data" :registrar="registrar" :loading="siteLoading"></RecordBase>
                </div>
            </div>
        </div>
        <footer class="footer">
            <div class="container">
                <p><a href="#top" class="button is-primary is-small">{{ i18n.templates.app.backToTop }}</a></p>
                <p v-html="i18n.templates.app.oss"></p>
                <p v-html="i18n.templates.app.cfThanks"></p>
                <p v-html="i18n.templates.app.mattThanks"></p>
            </div>
        </footer>
    </div>
</template>

<script>
    import whoisJS from "../utils/whoisJS"
    import DODNS from "./dodns"
    import RecordBase from "./record_base"
    import RecordJumps from "./record_jumps"
    import i18n from "../i18n"
    import { reports } from "../plain_text_reports"
    import RecordSelectionModal from "./record_selection_modal"
    import GHLink from "./gh_link"
    import cfDNS from "../utils/cfDNS"
    import NoSearch from "./skeletons/no_search"
    import RecordSkeleton from "./skeletons/record"

    const stripHttps = /(https*:\/\/)*(.+)*/
    const isHostname = /.*\.[a-z]+/

    export default {
        name: "App",
        components: {
            NoSearch,
            RecordSkeleton,
            RecordBase,
            DODNS,
            RecordJumps,
            RecordSelectionModal,
            GHLink,
        },
        data() {
            return {
                firstSearch: true,
                data: "",
                linked: null,
                i18n,
                siteLoading: false,
                registrar: "",
            }
        },
        mounted() {
            this.$data.linked = (new URLSearchParams(window.location.search)).get("domain")
            if (this.$data.linked) {
                document.getElementById("DomainInput").value = this.$data.linked
                this.searchDNSEvent()
            }
        },
        methods: {
            error(message) {
                alert(message)
            },
            async searchWait() {
                await this.$refs.RecordBase.wait()
            },
            toggleRecordTextModal() {
                this.$refs.RecordSelectionModal.toggle()
            },
            async setRegistrar(text) {
                const whoisLookup = await whoisJS(text)
                if (!whoisLookup.ok) return this.$data.registrar = ""
                const lookupJson = await whoisLookup.json()
                const registrarObject = lookupJson.registrar || {}
                this.$data.registrar = registrarObject.url || ""
            },
            async searchDNSEvent() {
                const el = document.getElementById("SearchButton")

                try {
                    el.classList.add("is-loading")

                    if (this.$data.siteLoading) return
                    this.$data.firstSearch = false
                    this.$data.siteLoading = true

                    const domainInput = document.getElementById("DomainInput")

                    const regexpExec = stripHttps.exec(domainInput.value.toLowerCase())
                    const text = regexpExec[2] ? regexpExec[2].replace(/\//g, "") : ""
                    if (!text.match(isHostname)) return this.error("Invalid domain.")

                    if (this.$data.data === text) this.$data.data = ""

                    const domainLookup = await cfDNS(text, "NULL")
                    const json = await domainLookup.json()
                    if (json.Status !== 0) return this.error("Invalid domain.")

                    this.setRegistrar(text)

                    if (!this.$data.linked) window.history.pushState({}, "", `?domain=${encodeURIComponent(text)}`)

                    reports.clear()
                    this.$data.linked = null
                    this.$data.data = text
                    await this.searchWait()
                } finally {
                    el.classList.remove("is-loading")
                    this.$data.siteLoading = false
                    const hash = window.location.hash === "" ? null : window.location.hash.substr(1)
                    if (!hash) return
                    const anchorEl = document.getElementById(hash)
                    if (anchorEl) anchorEl.scrollIntoView()
                }
            },
        }
    }
</script>
