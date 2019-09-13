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
                    {{ i18n.templates.dnsDiff.title }} {{ i18n.templates.dnsDiff.XRecords.replace("{record}", this.$props.recordType) }}
                </p>
                <button class="delete" :aria-label="i18n.common.close" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <table class="table is-bordered">
                    <thead>
                        <tr>
                            <th>{{ i18n.templates.dnsDiff.host }}</th>
                            <th>{{ i18n.templates.dnsDiff.cfDns }}</th>
                            <th>{{ i18n.templates.dnsDiff.gDns }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in $props.dnsDifferences">
                            <td v-for="value in row">
                                <p>{{ value ? value : i18n.common.none }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"

    export default {
        name: "DNSDiff",
        props: {
            dnsDifferences: Array,
            recordType: String,
        },
        data() {
            return {
                toggled: false,
                i18n,
            }
        },
        methods: {
            toggle() {
                this.$data.toggled = !this.$data.toggled
            },
        },
    }
</script>
