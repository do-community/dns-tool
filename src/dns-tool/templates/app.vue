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
    <div class="all dns-tool">
        <RecordSelectionModal ref="RecordSelectionModal"></RecordSelectionModal>

        <Header :title="i18n.templates.app.title" :description="i18n.templates.app.description" :search-placeholder="i18n.templates.app.domain" :init-value="getInitDomainValue()" @search-event="searchDNSEvent">
            <button id="SearchButton" class="button is-header is-inverted">
                {{ i18n.templates.app.searchButton }}
            </button>
            <a v-if="data !== ''" class="button is-header is-inverted" @click="toggleRecordTextModal">
                {{ i18n.templates.app.textRecords }}
            </a>
        </Header>

        <div class="main container" :style="{opacity: contentOpacity}">
            <div id="content">
                <RecordJumps :loaded="data !== ''" :loading="siteLoading"></RecordJumps>
                <DODNS :loaded="data !== ''" :data="data" :loading="siteLoading"></DODNS>
                <div v-if="firstSearch">
                    <NoSearch v-if="data === ''"></NoSearch>
                    <RecordSkeleton :loading="false"></RecordSkeleton>
                    <RecordSkeleton :loading="false"></RecordSkeleton>
                    <RecordSkeleton :loading="false"></RecordSkeleton>
                </div>
                <div :style="`${firstSearch ? 'display: none; visibility: hidden;' : ''}`">
                    <RecordBase ref="RecordBase" :data="data" :registrar="registrar" :loading="siteLoading"></RecordBase>
                </div>
            </div>
        </div>

        <Footer></Footer>
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
    import cfDNS from "../../shared/utils/cfDNS"
    import NoSearch from "./skeletons/no_search"
    import RecordSkeleton from "./skeletons/record"
    import Footer from "../../shared/templates/footer"
    import Header from "../../shared/templates/header"

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
            Footer,
            Header,
        },
        data() {
            return {
                firstSearch: true,
                data: "",
                linked: null,
                i18n,
                siteLoading: false,
                registrar: "",
                contentOpacity: 1,
            }
        },
        mounted() {
            this.$data.linked = (new URLSearchParams(window.location.search)).get("domain")
            if (this.$data.linked) {
                this.searchDNSEvent()
            }
        },
        methods: {
            getInitDomainValue() {
                const query = new URLSearchParams(window.location.search)
                if (query.has("domain")) return query.get("domain")
                return ""
            },
            error(message) {
                alert(message)
                this.$data.contentOpacity = 1
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
                    this.$data.contentOpacity = 0

                    const domainInput = document.getElementById("DomainInput")

                    const regexpExec = stripHttps.exec(domainInput.value.toLowerCase())
                    const text = regexpExec[2] ? regexpExec[2].replace(/\//g, "") : ""
                    if (!text.match(isHostname)) return this.error("Invalid domain.")

                    if (this.$data.data === text) this.$data.data = ""

                    const domainLookup = await cfDNS(text, "NULL")
                    const json = await domainLookup.json()
                    if (json.Status !== 0) return this.error("Invalid domain.")

                    this.$data.firstSearch = false
                    this.$data.siteLoading = true
                    this.$data.contentOpacity = 1

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
