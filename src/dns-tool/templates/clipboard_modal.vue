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
                    {{ i18n.templates.clipboardModal.clipboardResult }}
                </p>
                <button class="delete" :aria-label="i18n.common.close" @click="hide"></button>
            </header>
            <section class="modal-card-body">
                <p>
                    <span class="tag is-success">
                        {{ i18n.templates.clipboardModal.thisHasBeenCopied }}
                    </span>
                </p>
                <pre class="clipboard textarea has-fixed-size"><code>{{ textReport }}</code></pre>
            </section>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"

    export default {
        name: "ClipboardModal",
        data() {
            return {
                textReport: "",
                toggled: false,
                i18n,
            }
        },
        methods: {
            show(textReport) {
                this.$data.textReport = textReport
                this.$data.toggled = true
            },
            hide() {
                this.$data.toggled = false
            },
            showParent() {
                this.$data.toggled = false
                this.$emit("toggle-root")
            },
        },
    }
</script>
