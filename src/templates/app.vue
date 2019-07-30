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
    <div class="container" style="display: flex; flex-direction: column;">
        <div id="top" class="has-text-centered" style="padding-left: 30%; padding-right: 30%; margin-top: 10px">
            <h2 class="title is-2">
                {{ i18n.app.title }}
            </h2>
            <h5 class="title is-5">
                {{ i18n.app.description }}
            </h5>
            <form autocomplete="on" @submit.prevent="searchDNSEvent">
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
            <RecordBase ref="RecordBase" :data="data"></RecordBase>
        </div>
        <footer class="footer" style="align-self: flex-end; padding: 20px; width: 100%;">
            <div class="content has-text-centered">
                <p>
                    <a href="#top">{{ i18n.app.backToTop }}</a>
                </p>
                <p v-html="i18n.app.cfThanks"></p>
                <p v-html="i18n.app.mattThanks"></p>
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

    const stripHttps = /(https*:\/\/)*(.+)*/
    const isHostname = /.*\.[a-z]+/

    export default {
        name: "App",
        components: {
            RecordBase,
            DODNS,
            RecordJumps,
        },
        data() {
            return {
                firstSearch: true,
                data: "",
                linked: null,
                i18n,
                siteLoading: false,
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
            async searchDNSEvent() {
                const el = document.getElementById("SearchButton")

                if (this.$data.siteLoading) return

                document.querySelectorAll("[data-skeleton]").forEach(elm => elm.style.animationPlayState = "running")

                const domainInput = document.getElementById("DomainInput")

                const regexpExec = stripHttps.exec(domainInput.value.toLowerCase())
                const text = regexpExec[2] ? regexpExec[2].replace(/\//g, "") : ""
                if (!text.match(isHostname)) return this.error("Invalid domain.")

                const domainLookup = await whoisJS(text)
                if (!(await domainLookup.json()).domain) return this.error("Invalid domain.")
                if (!this.$data.linked) window.history.pushState({}, "", `?domain=${encodeURIComponent(text)}`)

                this.$data.linked = null
                this.$data.data = text
                this.$data.firstSearch = false

                try {
                    el.classList.add("is-loading")
                    await this.searchWait()
                } finally {
                    el.classList.remove("is-loading")
                    this.$data.siteLoading = false
                }
            },
        }
    }
</script>
