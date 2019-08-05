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
    <span>
        <span v-if="loaded">
            <span v-if="dodns">
                <p><b>This domain is using DigitalOcean DNS.</b> <a href="https://www.digitalocean.com/docs/networking/dns/">Learn more about DigitalOcean DNS.</a></p>
            </span>
            <span v-else>
                <p v-if="subdomain"><b>This is a sub-domain and does not have any NS records.</b></p>
                <p v-else><b>This domain is not using DigitalOcean DNS.</b> <a href="https://www.digitalocean.com/docs/networking/dns/">Learn more about DigitalOcean DNS.</a></p>
            </span>
        </span>
        <span v-else>
            <DODNSSkeleton></DODNSSkeleton>
        </span>
        <hr>
    </span>
</template>

<script>
    import cfDNS from "../utils/cfDNS"
    import DODNSSkeleton from "./skeletons/dodns"

    export default {
        name: "DODNS",
        components: {
            DODNSSkeleton,
        },
        props: {
            data: String,
        },
        data() {
            return {
                dodns: false,
                subdomain: false,
                loaded: false,
            }
        },
        watch: {
            data() {
                this.recordInit()
            },
        },
        mounted() {
            this.recordInit()
        },
        methods: {
            async recordInit() {
                if (this.$props.data === "") return

                this.$data.loaded = false
                this.$data.subdomain = false
                const json = await (await cfDNS(this.$props.data, "NS")).json()
                this.$data.loaded = true
                if (!json.Answer) {
                    this.$data.dodns = false
                    this.$data.subdomain = true
                    return
                }
                this.$data.dodns = json.Answer[0].data.match(/.*digitalocean\.com\.*/)
            },
        },
    }
</script>
