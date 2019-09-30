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
    <div v-if="done">
        <p>
            <small>
                <b>{{ i18n.templates.whois.owner }}:</b> <a @click="toggleExpand">{{ netname }}</a>
                <span
                    id="countryInfo"
                    v-tippy
                    :class="`flag-icon flag-icon-${countryCode}`"
                    :title="countryInfo"
                />
            </small>
        </p>
        <div v-if="expand">
            <p>
                <small>
                    <b>ASN:</b> {{ asn }}
                </small>
            </p>
            <p>
                <small>
                    <b>CIDR:</b> {{ cidr }}
                </small>
            </p>
            <p>
                <small>
                    <b>{{ i18n.templates.whois.abuseContact }}:</b> {{ abuse }}
                </small>
            </p>
        </div>
    </div>
    <div v-else>
        <p>
            <small>
                <i>{{ i18n.templates.whois.loading }}</i>
            </small>
        </p>
    </div>
</template>

<script>
    import cfAbuseData from "../utils/cfAbuseData"
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
                const json = await (await cfAbuseData(this.$props.ip)).json()
                const geoIpJson = await (await geoJS(this.$props.ip)).json()
                this.countryCode = geoIpJson.country_code ? geoIpJson.country_code.toLowerCase() : ""
                this.netname = json.results[0].netname ? json.results[0].netname : i18n.templates.whois.notSpecified
                this.asn = json.results[0].asn ? json.results[0].asn[0] : i18n.common.none
                this.cidr = json.results[0].cidr ? json.results[0].cidr : i18n.common.none
                this.abuse = json.results[0].services.abusix[0]
                this.countryInfo = geoIpJson.city ? `${geoIpJson.city}, ${geoIpJson.country}` : geoIpJson.country
                this.done = true
            },
        }
    }
</script>
