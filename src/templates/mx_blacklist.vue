<template>
  <span v-if="this.$props.hostname !== ''">
    <hr style="margin: 5px">
    <span v-if="blacklists.length !== 0">
      <p v-for="item in blacklists" style="font-size: 11px"><b>{{ item }}</b></p>
    </span>
    <span v-else>
      <p style="font-size: 11px"><b>{{ i18n.mxBlacklist.notBlacklisted }}</b></p>
    </span>
    <p style="font-size: 11px"><a href="https://www.techwalla.com/articles/what-does-it-mean-if-an-email-address-is-blacklisted">{{ i18n.mxBlacklist.whatDoesItMean }}</a></p>
  </span>
</template>

<script>
import getBlacklists from "../blacklists"
import i18n from "../i18n"

export default {
    name: "MXBlacklist",
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
        hostnane() {
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
                    this.$data.blacklists.push(i18n.mxBlacklist.ipBlacklist.replace("BLACKLIST", ipBlacklisted))
                for (const domainBlacklisted of blacklists.domain)
                    this.$data.blacklists.push(i18n.mxBlacklist.domainBlacklist.replace("BLACKLIST", domainBlacklisted))
            }
        },
    },
}
</script>
