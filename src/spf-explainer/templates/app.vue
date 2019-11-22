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
    <div class="all do-bulma">
        <Landing
            v-if="firstSearch && !loading"
            :title="i18n.templates.app.title"
            :description="i18n.templates.app.description"
            button-id="DomainSearch"
            :init-value="domain"
            :background-top="spfTop"
            :background-bottom="spfBottom"
            @search-event="searchEvent"
            @set-text="setDomain"
        >
        </Landing>

        <div v-else>
            <NoSPFRecords ref="NoSPFRecords"></NoSPFRecords>
            <AllPartExplanations ref="AllPartExplanations"></AllPartExplanations>

            <Header
                :title="i18n.templates.app.title"
                button-id="DomainSearch"
                :init-value="domain"
                @search-event="searchEvent"
                @set-text="setDomain"
            >
                <template v-slot:description>
                    <p>
                        <a @click="openMechanismModal">{{ i18n.templates.app.whatDoTheyDo }}</a>
                    </p>
                </template>
                <template v-slot:header>
                    <EvalNotif ref="EvalNotif" :ip="ipEval"></EvalNotif>
                </template>
                <template v-slot:buttons>
                    <form v-if="!SPFSandbox.empty()" autocomplete="on" @submit.prevent="">
                        <div class="input-container">
                            <label for="EvaluateInput" class="hidden">Evaluate</label>
                            <input id="EvaluateInput"
                                   v-model="ipEval"
                                   class="input"
                                   type="text"
                                   placeholder="255.255.255.0"
                            />
                            <button class="button is-inline" @click="openEvalNotif">
                                {{ i18n.templates.app.eval }}
                            </button>
                        </div>
                    </form>
                </template>
            </Header>
        </div>

        <div class="main container">
            <SPFBase
                v-if="(firstSearch && loading) || !firstSearch"
                ref="SPFBase"
                :records="records"
                :loading="loading"
                :d="domain"
            ></SPFBase>
        </div>

        <div v-if="!firstSearch">
            <Footer></Footer>
        </div>

        <ErrorModal ref="ErrorModal" :message="errorMessage"></ErrorModal>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import cfDNS from "../../shared/utils/cfDNS"
    import SPFBase from "./spf_base"
    import { spawnLine } from "../utils/line_spawn"
    import NoSPFRecords from "./no_spf_records"
    import SPFSandbox from "../utils/spf_sandbox"
    import EvalNotif from "./eval_notif"
    import AllPartExplanations from "./all_part_explanations"
    import ErrorModal from "../../shared/templates/error_modal"
    import Footer from "../../shared/templates/footer"
    import Header from "../../shared/templates/header"
    import Landing from "../../shared/templates/landing"
    import spfTop from "../../../build/svg/spf-top.svg"
    import spfBottom from "../../../build/svg/spf-bottom.svg"
    import { remakeController } from "../../shared/utils/backoffFetch"
    import validateDomain from "../../shared/utils/validateDomain"

    // A simple hack to handle the back/forward button.
    // This is fine since the site only consists of 3 files which will be cached anyway.
    // Reloading just ensures that it's a clean slate everytime (this could be why the user is going back - to try and solve a bug).
    window.addEventListener("popstate", () => window.location.reload())

    export default {
        name: "App",
        components: {
            SPFBase,
            NoSPFRecords,
            EvalNotif,
            AllPartExplanations,
            ErrorModal,
            Footer,
            Header,
            Landing,
        },
        data() {
            return {
                firstSearch: true,
                SPFSandbox,
                i18n,
                lastDomain: null,
                domain: "",
                loading: false,
                records: [],
                ipEval: "",
                errorMessage: "",
                spfTop,
                spfBottom,
            }
        },
        mounted() {
            const query = new URLSearchParams(window.location.search)
            if (query.has("domain")) {
                this.$data.domain = query.get("domain")
                this.searchEvent()
            }
        },
        methods: {
            setDomain(d) {
                this.$data.domain = d
            },
            openMechanismModal() {
                this.$refs.AllPartExplanations.toggle()
            },
            openEvalNotif() {
                this.$refs.EvalNotif.open()
            },
            error(message) {
                this.$data.errorMessage = `<p>${message}</p>`
                this.$refs.ErrorModal.open()
            },
            async cfPart(input) {
                const [domain, result] = await validateDomain(input)
                if (result !== null) return this.error(result)

                const res = await cfDNS(domain, "TXT")
                if (!res.ok) return this.error(i18n.templates.app.fetchError)
                let json
                try {
                    json = await res.json()
                } catch {
                    // Sometimes Cloudflare's DNS sends invalid JSON in the event that it is invalid.
                    // That has happened here.
                    return this.error(i18n.templates.app.fetchError)
                }

                if (!json.Answer) {
                    this.$refs.NoSPFRecords.toggle()
                    return false
                }

                return json
            },
            async lookup(domain, json) {
                if (this.$data.lastDomain === domain) this.$data.records = []

                const records = []
                for (const answer of json.Answer) {
                    answer.data = answer.data.substr(1).slice(0, -1)
                    if (answer.data.startsWith("v=spf1")) records.push(answer)
                }
                if (records.length === 0) {
                    return this.$refs.NoSPFRecords.toggle()
                }

                this.$data.records = records
                window.history.pushState({}, "", `?domain=${domain}`)
                SPFSandbox.wipe()
                remakeController()
                this.$data.firstSearch = false
                this.$data.lastDomain = domain
            },
            async searchEvent() {
                const el = document.getElementById("DomainSearch")

                try {
                    el.classList.add("is-loading")
                    const domain = this.$data.domain.toLowerCase().replace(/^https*:\/\//, "").replace(/\/+$/, "")
                    const j = await this.cfPart(domain)
                    if (!j) return
                    this.$data.loading = true
                    spawnLine(undefined)
                    await this.lookup(domain, j)
                } finally {
                    el.classList.remove("is-loading")
                    this.$data.loading = false
                }
            },
        },
    }
</script>
