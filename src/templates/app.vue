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
                Name here
            </h2>
            <h5 class="title is-5">
                Enter the (sub-)domain you wish to look up.
            </h5>
            <form autocomplete="on" @submit.prevent="searchDNSEvent">
                <input id="DomainInput" class="input" type="text" placeholder="Domain">
                <button id="SearchButton" class="button is-link" style="margin-top: 20px">
                    Search DNS Records
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
                    <a href="#top">Back to Top</a>
                </p>
                <p>
                    Thanks to <a href="https://cloudflare.com">Cloudflare</a> for their great WHOIS/DNS-over-HTTPS APIs.
                    You can learn more about the importance of DNS-over-HTTPS and how to use it
                    <a href="https://developers.cloudflare.com/1.1.1.1/dns-over-https/">here.</a>
                </p>
                <p>
                    Thanks to <a href="https://twitter.com/matthewgall">Matthew Gall</a> for his wonderful
                    <a href="https://whoisjs.com/">WHOIS API.</a>
                </p>
            </div>
        </footer>
    </div>
</template>

<script>
    import whoisJS from "../utils/whoisJS"
    import DODNS from "./dodns"
    import RecordBase from "./record_base"
    import RecordJumps from "./record_jumps"

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
            async searchDNSEvent() {
                const el = document.getElementById("SearchButton")

                try {
                    el.classList.add("is-loading")

                    if (this.$data.siteLoading) return

                    const domainInput = document.getElementById("DomainInput")

                    const regexpExec = stripHttps.exec(domainInput.value.toLowerCase())
                    const text = regexpExec[2] ? regexpExec[2].replace(/\//g, "") : ""
                    if (!text.match(isHostname)) return this.error("Invalid domain.")

                    const domainLookup = await whoisJS(text)
                    const json = await domainLookup.json()
                    if (!json.domain) return this.error("Invalid domain.")
                    this.$data.registrar = json.registrar.url
                    if (!this.$data.linked) window.history.pushState({}, "", `?domain=${encodeURIComponent(text)}`)

                    document.querySelectorAll("[data-skeleton]").forEach(elm => elm.style.animationPlayState = "running")

                    this.$data.linked = null
                    this.$data.data = text
                    this.$data.firstSearch = false
                    await this.searchWait()
                } finally {
                    el.classList.remove("is-loading")
                    this.$data.siteLoading = false
                }
            },
        }
    }
</script>
