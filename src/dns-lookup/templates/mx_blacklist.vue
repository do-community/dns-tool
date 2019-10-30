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
    <div v-if="this.$props.hostname !== ''">
        <hr />
        <div v-if="blacklists.length !== 0">
            <p v-for="item in blacklists">
                <small>
                    <b>{{ item }}</b>
                </small>
            </p>
        </div>
        <div v-else>
            <p>
                <small>
                    <b>{{ i18n.templates.mxBlacklist.notBlacklisted }}</b>
                </small>
            </p>
        </div>
        <p>
            <small>
                <ExternalLink :text="i18n.templates.mxBlacklist.whatDoesItMean"
                              link="https://www.techwalla.com/articles/what-does-it-mean-if-an-email-address-is-blacklisted"
                ></ExternalLink>
            </small>
        </p>
    </div>
</template>

<script>
    import getBlacklists from "../blacklists"
    import i18n from "../i18n"
    import ExternalLink from "do-vue/src/templates/external_link"

    export default {
        name: "MXBlacklist",
        components: {
            ExternalLink,
        },
        props: {
            ip: String,
            hostname: String,
        },
        data() {
            return {
                blacklists: [],
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
                this.$data.blacklists = []
                const hostname = this.$props.hostname
                if (hostname !== "") {
                    const ip = this.$props.ip
                    const blacklists = await getBlacklists(ip, hostname)
                    for (const ipBlacklisted of blacklists.ip)
                        this.$data.blacklists.push(`IP blacklisted by ${ipBlacklisted}.`)
                    for (const domainBlacklisted of blacklists.domain)
                        this.$data.blacklists.push(`Domain blacklisted by ${domainBlacklisted}.`)
                }
            },
        },
    }
</script>
