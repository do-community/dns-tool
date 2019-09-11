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
    <div :class="`modal${toggled ? ' is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ i18n.templates.evalModal.title }}
                </p>
                <button class="delete" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <p>
                    <b>{{ i18n.templates.evalModal.in }}:</b>
                </p>
                <div v-if="message !== ''" class="notification is-primary">
                    <button class="delete" @click="wipeMessage"></button>
                    {{ message }}
                </div>
                <form autocomplete="on" @submit.prevent="runEval">
                    <input v-model="text" class="input" type="text" :placeholder="i18n.templates.evalModal.in">
                    <button class="button">
                        {{ i18n.templates.evalModal.run }}
                    </button>
                </form>
            </section>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import SPFSandbox from "../utils/spf_sandbox"

    export default {
        name: "EvalModal",
        data() {
            return {
                i18n,
                text: "",
                message: "",
                toggled: false,
            }
        },
        methods: {
            wipeMessage() {
                this.$data.message = ""
            },
            toggle() {
                this.wipeMessage()
                this.$data.toggled = !this.$data.toggled
            },
            runEval() {
                const res = SPFSandbox.eval(this.$data.text)
                if (res === null) this.$data.message = i18n.templates.evalModal.goThrough
                else if (res === undefined) this.$data.message = i18n.data.explanations.neutral
                else if (res) this.$data.message = i18n.templates.evalModal.softFail
                else this.$data.message = i18n.templates.evalModal.ignored
            },
        },
    }
</script>
