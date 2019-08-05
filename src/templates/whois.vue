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
    import VueTippy from "vue-tippy"
    import Vue from "vue"

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
            }
        },
        watch: {
            ip() {
                this.handleInit()
            },
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
