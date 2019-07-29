<template>
  <span v-if="done">
    <p style="font-size: 11px">
      <b>Owner:</b> <a @click="toggleExpand">{{ netname }}</a>
      <span
        id="countryInfo"
        v-tippy
        :class="`flag-icon flag-icon-${countryCode}`"
        :title="countryInfo"
      />
    </p>
    <span v-if="expand">
      <p style="font-size: 11px"><b>ASN:</b> {{ asn }}</p>
      <p style="font-size: 11px"><b>CIDR:</b> {{ cidr }}</p>
      <p style="font-size: 11px"><b>{{ i18n.whois.abuseContact }}:</b> {{ abuse }}</p>
    </span>
  </span>
  <span v-else>
    <p style="font-size: 11px"><i>{{ i18n.whois.loading }}</i></p>
  </span>
</template>

<script>
import cfWHO from "../utils/cfWHO"
import geoJS from "../utils/geoJS"
import VueTippy from "vue-tippy"
import Vue from "vue"
import i18n from "../i18n"

Vue.use(VueTippy)

export default {
    name: "WHOIS",
    props: {
        ip: String,
    },
    data() {
        return {
            done: false,
            asn: "",
            cidr: "",
            abuse: "",
            netname: "",
            expand: false,
            countryCode: "",
            countryInfo: "",
            i18n,
        }
    },
    mounted() {
        this.handleInit()
    },
    methods: {
        toggleExpand() {
            this.$data.expand = !this.$data.expand
        },
        async handleInit() {
            const json = await (await cfWHO(this.$props.ip)).json()
            const geoIpJson = await (await geoJS(this.$props.ip)).json()
            this.countryCode = geoIpJson.country_code ? geoIpJson.country_code.toLowerCase() : ""
            this.netname = json.results[0].netname ? json.results[0].netname : "Not Specified"
            this.asn = json.results[0].asn ? json.results[0].asn[0] : "None"
            this.cidr = json.results[0].cidr ? json.results[0].cidr : "None"
            this.abuse = json.results[0].services.abusix[0]
            this.countryInfo = geoIpJson.city ? `${geoIpJson.city}, ${geoIpJson.country}` : geoIpJson.country
            this.done = true
        },
    }
}
</script>
