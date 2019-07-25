<template>
    <span v-if="done">
        <p style="font-size: 11px">
            <b>Owner:</b> <a v-on:click="toggleExpand">{{ netname }}</a>
            <tippy :content="countryInfo" arrow>
                <span id="countryInfo" :class="`flag-icon flag-icon-${countryCode}`"></span>
            </tippy>
        </p>
        <span v-if="expand">
            <p style="font-size: 11px"><b>ASN:</b> {{ asn }}</p>
            <p style="font-size: 11px"><b>CIDR:</b> {{ cidr }}</p>
            <p style="font-size: 11px"><b>Abuse Contact:</b> {{ abuse }}</p>
        </span>
    </span>
    <span v-else>
        <p style="font-size: 11px"><i>Loading WHOIS data...</i></p>
    </span>
</template>

<script>
import cfWHO from "../utils/cfWHO"
import geoJS from "../utils/geoJS"

export default {
    name: "WHOIS",
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
        }
    },
    props: {
        ip: String,
    },
    mounted() {
        this.handleInit()
    },
    updated() {
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
        }
    }
}
</script>
