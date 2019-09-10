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
    <div class="all spf-explainer">
        <NoSPFRecords ref="NoSPFRecords"></NoSPFRecords>
        <EvalModal ref="EvalModal"></EvalModal>
        <AllPartExplanations ref="AllPartExplanations"></AllPartExplanations>

        <div class="header">
            <ghLink repo="https://github.com/do-community/spf-explainer"></ghLink>
            <div class="container">
                <h1>{{ i18n.templates.app.title }}</h1>
                <p>{{ i18n.templates.app.description }}</p>

                <form autocomplete="on" @submit.prevent="searchEvent">
                    <div class="input-container">
                        <label for="DomainInput" class="hidden">Search</label>
                        <i class="fas fa-search"></i>
                        <input id="DomainInput" v-model="domain" class="input" type="text" :placeholder="i18n.templates.app.domain">
                    </div>
                    <div class="buttons">
                        <button id="DomainSearch" :class="`button is-header is-inverted is-link${loading ? ' is-loading' : ''}`">
                            {{ i18n.templates.app.searchButton }}
                        </button>
                        <button v-if="!SPFSandbox.empty()" :class="`button is-header is-inverted is-link${loading ? ' is-loading' : ''}`" @click="openEvalModal">
                            {{ i18n.templates.app.eval }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="main container">
            <p>
                <a @click="openMechanismModal" class="button is-header is-mini">
                    {{ i18n.templates.app.whatDoTheyDo }}
                </a>
            </p>
            <hr>
            <SPFBase ref="SPFBase" :records="records"></SPFBase>
        </div>

        <div class="footer">
            <div class="container">
                <p><a href="#top" class="button is-primary is-small">{{ i18n.templates.app.backToTop }}</a></p>
                <p v-html="i18n.templates.app.oss"></p>
            </div>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import cfDNS from "../utils/cfDNS"
    import SPFBase from "./spf_base"
    import spawnLine from "../utils/line_spawn"
    import NoSPFRecords from "./no_spf_records"
    import SPFSandbox from "../utils/spf_sandbox"
    import EvalModal from "./eval_modal"
    import AllPartExplanations from "./all_part_explanations"
    import ghLink from "../../templates/gh_link"

    export default {
        name: "App",
        components: {
            SPFBase,
            NoSPFRecords,
            EvalModal,
            AllPartExplanations,
            ghLink,
        },
        data() {
            return {
                SPFSandbox,
                i18n,
                lastDomain: null,
                domain: "",
                loading: false,
                records: [],
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
            openMechanismModal() {
                this.$refs.AllPartExplanations.toggle()
            },
            openEvalModal() {
                this.$refs.EvalModal.toggle()
            },
            error(message) {
                this.$refs.SPFBase.loading = false
                alert(message)
            },
            async lookup(domain) {
                domain = domain.toLowerCase().replace(/^https*:\/\//, "").replace(/\/+$/, "")
                if (this.$data.lastDomain === domain) return this.$refs.SPFBase.loading = false

                const res = await cfDNS(domain, "TXT")
                if (!res.ok) return this.error("Invalid domain.")
                let json
                try {
                    json = await res.json()
                } catch(_) {
                    // Sometimes Cloudflare's DNS sends invalid JSON in the event that it is invalid.
                    // That has happened here.
                    return this.error("Invalid domain.")
                }
                if (json.Status !== 0) return this.error("Invalid domain.")
                if (!json.Answer) return this.$refs.NoSPFRecords.toggle()

                const records = []
                for (const answer of json.Answer) {
                    answer.data = answer.data.substr(1).slice(0, -1)
                    if (answer.data.startsWith("v=spf1")) records.push(answer)
                }
                if (records.length === 0) {
                    this.$refs.SPFBase.loading = false
                    return this.$refs.NoSPFRecords.toggle()
                }

                this.$data.records = records
                window.history.pushState({}, "", `?domain=${domain}`)
                SPFSandbox.wipe()
                this.$refs.SPFBase.firstSearch = false
                this.$data.lastDomain = domain
            },
            async searchEvent() {
                try {
                    spawnLine(undefined)
                    this.$refs.SPFBase.loading = true
                    this.$data.loading = true
                    const domain = this.$data.domain
                    await this.lookup(domain)
                } finally {
                    this.$data.loading = false
                }
            },
        },
    }
</script>
