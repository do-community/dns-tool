<template>
  <div>
    <div style="min-height: calc(100vh - 90px);">
      <div id="top" class="has-text-centered" style="padding-left: 30%; padding-right: 30%; margin-top: 10px">
        <h2 class="title is-2">Name here</h2>
        <h5 class="title is-5">Enter the (sub-)domain you wish to look up.</h5>
        <form autocomplete="on" @submit.prevent="searchDNSEvent">
          <input id="DomainInput" class="input" type="text" placeholder="Domain">
          <button id="SearchButton" class="button is-link" style="margin-top: 20px">Search DNS Records</button>
        </form>
      </div>
      <hr>
      <div id="content" style="margin-left: 20px; margin-right: 20px">
        <div v-if="firstSearch">
          <Skeleton/>
        </div>
        <div v-else>
          <DODNS :data="data"></DODNS>
          <RecordBase :data="data"></RecordBase>
        </div>
      </div>
    </div>
    <footer class="footer" style="padding: 20px; height: 70px">
      <div class="content has-text-centered">
        <p>
          Thanks to <a href="https://cloudflare.com">Cloudflare</a> for their great WHOIS/DNS-over-HTTPS APIs.
          You can learn more about the importance of DNS-over-HTTPS and how to use it <a href="https://developers.cloudflare.com/1.1.1.1/dns-over-https/">here.</a>
        </p>
        <p>
          Thanks to <a href="https://twitter.com/matthewgall">Matthew Gall</a> for his wonderful <a href="https://whoisjs.com/">WHOIS API.</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import RecordBase from "./record_base"
import Skeleton from "./skeleton"
import whoisJS from "../utils/whoisJS"
import DODNS from "./dodns"

const stripHttps = /(https*:\/\/)*(.+)*/
const isHostname = /.*\.[a-z]+/

export default {
    name: "App",
    components: {
        RecordBase,
        Skeleton,
        DODNS,
    },
    data() {
        return {
            firstSearch: true,
            data: "",
            linked: null,
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
            document.querySelectorAll("[data-skeleton]").forEach(elm => elm.style.animationPlayState = "paused");
            alert(message)
        },
        async searchDNSEvent() {
            document.querySelectorAll("[data-skeleton]").forEach(elm => elm.style.animationPlayState = "running");
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
        },
    }
}
</script>
