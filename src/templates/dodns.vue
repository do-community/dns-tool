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
            <p><i>Loading NS record information...</i></p>
        </span>
        <hr>
    </span>
</template>

<script>
import cfDNS from "../utils/cfDNS"

export default {
    name: "DODNS",
    data() {
        return {
            dodns: false,
            subdomain: false,
            loaded: false,
        }
    },
    props: {
        data: String,
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
            this.$data.loaded = false
            const cfdnsRes = await cfDNS(this.$props.data, "NS")
            const json = await cfdnsRes.json()
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
