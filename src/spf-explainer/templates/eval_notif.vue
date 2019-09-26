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
    <article v-if="toggled" class="message">
        <div class="message-header">
            <p>{{ i18n.templates.evalNotif.title }}</p>
            <button class="delete" aria-label="delete" @click="close"></button>
        </div>
        <div class="message-body">
            <p v-html="message"></p>
        </div>
    </article>
</template>

<script>
    import i18n from "../i18n"
    import SPFSandbox from "../utils/spf_sandbox"

    export default {
        name: "EvalNotif",
        props: {
            ip: String,
        },
        data() {
            return {
                i18n,
                message: "",
                toggled: false,
            }
        },
        methods: {
            close() {
                this.$data.message = ""
                this.$data.toggled = false
            },
            open() {
                this.close()
                const res = SPFSandbox.eval(this.$props.ip)
                if (res === null) this.$data.message = i18n.templates.evalNotif.goThrough
                else if (res === undefined) this.$data.message = i18n.templates.evalNotif.neutral
                else if (res) this.$data.message = i18n.templates.evalNotif.softFail
                else this.$data.message = i18n.templates.evalNotif.ignored
                this.$data.message = this.$data.message.replace("{{IP}}", `<code class="slim">${this.$props.ip}</code>`)
                this.$data.toggled = true
            },
        },
    }
</script>
