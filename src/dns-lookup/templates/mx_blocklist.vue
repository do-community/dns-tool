<!--
Copyright 2022 DigitalOcean

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
    <div v-if="hostname !== ''">
        <hr />
        <div v-if="blocklists.length !== 0">
            <p v-for="item in blocklists">
                <small>
                    <b>{{ item }}</b>
                </small>
            </p>
        </div>
        <div v-else>
            <p>
                <small>
                    <b>{{ i18n.templates.mxBlocklist.notBlocked }}</b>
                </small>
            </p>
        </div>
        <p>
            <small>
                <ExternalLink
                    :text="i18n.templates.mxBlocklist.whatDoesItMean"
                    link="https://www.mailchannels.com/what-are-email-blocklists/"
                ></ExternalLink>
            </small>
        </p>
    </div>
</template>

<script>
    import getBlocklists from "../blocklists"
    import i18n from "../i18n"
    import ExternalLink from "do-vue/src/templates/external_link"

    export default {
        name: "MXBlocklist",
        components: {
            ExternalLink,
        },
        props: {
            ip: String,
            hostname: String,
        },
        data() {
            return {
                blocklists: [],
                i18n,
            }
        },
        watch: {
            ip() {
                this.init()
            },
            hostname() {
                this.init()
            },
        },
        mounted() {
            this.init()
        },
        methods: {
            async init() {
                this.$data.blocklists = []
                const hostname = this.$props.hostname
                if (hostname !== "") {
                    const ip = this.$props.ip
                    const blocklists = await getBlocklists(ip, hostname)
                    for (const blocklist of blocklists.ip)
                        this.$data.blocklists.push(i18n.templates.mxBlocklist.ipBlocked.replace("BLOCKLIST", blocklist))
                    for (const blocklist of blocklists.domain)
                        this.$data.blocklists.push(i18n.templates.mxBlocklist.domainBlocked.replace("BLOCKLIST", blocklist))
                }
            },
        },
    }
</script>
