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
    <div :class="`modal ${toggled ? 'is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ i18n.templates.partExplanation.allMechanisms }}
                </p>
                <button class="delete" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <p v-for="(value, key) in longDescriptions" :key="key">
                    <code class="slim">{{ key }}</code>: <span v-html="value"></span>
                </p>
            </section>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import longDescriptions from "../data/long_descriptions"

    export default {
        name: "AllPartExplanations",
        data() {
            return {
                toggled: false,
                i18n,
                longDescriptions,
            }
        },
        methods: {
            toggle() {
                this.$data.toggled = !this.$data.toggled
            },
        },
    }
</script>
