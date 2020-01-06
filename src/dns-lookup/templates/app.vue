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
    <div :class="`all do-bulma${firstSearch? ' landing' : ''}`">
        <Landing
            v-if="firstSearch"
            :title="i18n.templates.app.title"
            :description="i18n.templates.app.description"
            button-id="SearchButton"
            :init-value="getInitDomainValue()"
            :background-top="dnsTop"
            :background-bottom="dnsBottom"
            @search-event="searchDNSEvent"
        >
        </Landing>

        <div v-else>
            <RecordSelectionModal ref="RecordSelectionModal"></RecordSelectionModal>

            <Header
                :title="i18n.templates.app.title"
                button-id="SearchButton"
                :init-value="getInitDomainValue()"
                @search-event="searchDNSEvent"
            >
                <template v-slot:description>
                    <DODNS
                        :style="{opacity: contentOpacity}"
                        :loaded="data !== ''"
                        :data="data"
                        :loading="siteLoading"
                    ></DODNS>
                </template>
                <template v-slot:header>
                    <RecordJumps
                        :style="{opacity: contentOpacity}"
                        :loaded="data !== ''"
                        :loading="siteLoading"
                    ></RecordJumps>
                </template>
                <template v-slot:buttons>
                    <a v-if="data !== ''" class="button is-primary" @click="toggleRecordTextModal">
                        {{ i18n.templates.app.textRecords }}
                    </a>
                </template>
            </Header>
        </div>

        <div class="main container" :style="{opacity: contentOpacity}">
            <div id="content">
                <RecordBase ref="RecordBase" :data="data" :registrar="registrar" :loading="siteLoading" :first-search="firstSearch"></RecordBase>
            </div>
        </div>

        <div v-if="!firstSearch">
            <Footer></Footer>
        </div>

        <ErrorModal ref="ErrorModal" :message="errorMessage"></ErrorModal>
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
    import ErrorModal from "../../shared/templates/error_modal"
    import Footer from "../../shared/templates/footer"
    import Header from "../../shared/templates/header"
    import Landing from "../../shared/templates/landing"
    import dnsTop from "../../../build/svg/dns-top.svg"
    import dnsBottom from "../../../build/svg/dns-bottom.svg"
    import { remakeController } from "../../shared/utils/backoffFetch"
    import validateDomain from "../../shared/utils/validateDomain"

    // A simple hack to handle the back/forward button.
    // This is fine since the site only consists of 3 files which will be cached anyway.
    // Reloading just ensures that it's a clean slate everytime (this could be why the user is going back - to try and solve a bug).
    const getUrlQuery = () => new URLSearchParams(window.location.search)
    const query = getUrlQuery()
    let domainQuery = query.has("domain") ? query.get("domain") : undefined
    window.addEventListener("popstate", () => {
        if (domainQuery === getUrlQuery().get("domain")) return
        window.location.reload()
    })

    export default {
        name: "App",
        components: {
            RecordBase,
            DODNS,
            RecordJumps,
            RecordSelectionModal,
            ErrorModal,
            Footer,
            Header,
            Landing,
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
                errorMessage: "",
                dnsTop,
                dnsBottom,
            }
        },
        mounted() {
            this.$data.linked = domainQuery
            if (this.$data.linked) {
                this.searchDNSEvent()
            }
        },
        methods: {
            getInitDomainValue() {
                return domainQuery || ""
            },
            error(message) {
                this.$data.errorMessage = `<p>${message}</p>`
                this.$refs.ErrorModal.open()
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

                    const domainInput = document.getElementById("DomainInput").value
                    const [domain, result] = await validateDomain(domainInput)
                    if (result !== null) return this.error(result)

                    if (this.$data.data === domain) this.$data.data = ""

                    this.$data.firstSearch = false
                    this.$data.siteLoading = true
                    this.$data.contentOpacity = 1

                    this.setRegistrar(domain)

                    if (!this.$data.linked) {
                        domainQuery = domain
                        window.history.pushState({}, "", `?domain=${encodeURIComponent(domain)}`)
                    }

                    reports.clear()
                    remakeController()
                    this.$data.linked = null
                    this.$data.data = domain
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
