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

<style>
  @keyframes skeleton-loading {
    0% { opacity: 0.7; }
    25% { opacity: 0.9; }
    50% { opacity: 0.7; }
    75% { opacity: 0.5; }
    100% { opacity: 0.7; }
  }
</style>

<template>
    <div>
        <GHLink colour="0069ff" repo="https://github.com/do-community/dns-tool"></GHLink>     
        <div class="container" style="display: flex; flex-direction: column;">
            <RecordSelectionModal ref="RecordSelectionModal"></RecordSelectionModal>
            <div id="top" class="has-text-centered" style="padding-left: 30%; padding-right: 30%; margin-top: 10px">
                <h2 class="title is-2">
                    {{ i18n.app.title }}
                </h2>
                <h5 class="title is-5">
                    {{ i18n.app.description }}
                </h5>
                <span v-if="data !== ''">
                    <hr style="margin: 10px">
                    <p><a @click="toggleRecordTextModal">{{ i18n.app.textRecords }}</a></p>
                </span>
                <form autocomplete="on" style="margin-top: 20px" @submit.prevent="searchDNSEvent">
                    <input id="DomainInput" class="input" type="text" placeholder="Domain">
                    <button id="SearchButton" class="button is-link" style="margin-top: 20px">
                        {{ i18n.app.searchButton }}
                    </button>
                </form>
            </div>
            <hr>
            <div id="content">
                <RecordJumps :loaded="data !== ''"></RecordJumps>
                <DODNS :loaded="data !== ''" :data="data"></DODNS>
                <RecordBase ref="RecordBase" :data="data" :registrar="registrar"></RecordBase>
            </div>
            <footer class="footer" style="align-self: flex-end; padding: 20px; width: 100%;">
                <div class="content has-text-centered">
                    <p>
                        <a href="#top">{{ i18n.app.backToTop }}</a>
                    </p>
                    <p v-html="i18n.app.oss"></p>
                    <p v-html="i18n.app.cfThanks"></p>
                    <p v-html="i18n.app.mattThanks"></p>
                </div>
            </footer>
        </div>
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

    const stripHttps = /(https*:\/\/)*(.+)*/
    const isHostname = /.*\.[a-z]+/

    export default {
        name: "App",
        components: {
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
                document.querySelectorAll("[data-skeleton]").forEach(elm => elm.style.animationPlayState = "paused")
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

                    document.querySelectorAll("[data-skeleton]").forEach(elm => elm.style.animationPlayState = "running")

                    reports.clear()
                    this.$data.linked = null
                    this.$data.firstSearch = false
                    this.$data.data = text
                    await this.searchWait()
                } finally {
                    el.classList.remove("is-loading")
                    this.$data.siteLoading = false
                }
            },
        }
    }
</script>
