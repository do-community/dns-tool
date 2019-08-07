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
                    {{ i18n.recordSelectionModal.downloadRecords }}
                </p>
                <button class="delete" aria-label="close" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <div v-for="key in reports.keys()">
                    <input :ref="key" type="checkbox" checked> {{ key }} {{ i18n.recordSelectionModal.records }}
                </div>
                <br>
                <a class="button is-link" @click="downloadRecords(false)">{{ i18n.recordSelectionModal.downloadTextForm }}</a>
                <a class="button is-link" @click="copyRecords(false)">{{ i18n.recordSelectionModal.copyTextForm }}</a>
                <a class="button is-link" style="margin-top: 10px" @click="downloadRecords(true)">{{ i18n.recordSelectionModal.downloadMd }}</a>
                <a class="button is-link" style="margin-top: 10px" @click="copyRecords(true)">{{ i18n.recordSelectionModal.copyMd }}</a>
            </section>
        </div>
    </div>
</template>

<script>
    import { generateMdReport, generateTextReport, reports } from "../plain_text_reports"
    import i18n from "../i18n"

    export default {
        name: "RecordSelectionModal",
        data() {
            return {
                toggled: false,
                reports,
                i18n,
            }
        },
        methods: {
            toggle() {
                this.$data.toggled = !this.$data.toggled
            },
            download(text, filename) {
                const a = document.createElement("a")
                document.body.appendChild(a)
                const url = window.URL.createObjectURL(new Blob([text], {type: "text/plain;charset=utf-8"}))
                a.href = url
                a.download = filename
                a.click()
                window.URL.revokeObjectURL(url)
                a.remove()
            },
            getAllowedRecords() {
                const refs = Object.keys(this.$refs)
                const allowedRecords = []
                for (const i of refs) {
                    const input = this.$refs[i][0]
                    if (input.checked) allowedRecords.push(i)
                }
                return allowedRecords
            },
            downloadRecords(md) {
                const allowedRecords = this.getAllowedRecords()
                const textReport = md ? generateMdReport(allowedRecords) : generateTextReport(allowedRecords)
                this.download(textReport, `records.${md ? "md" : "txt"}`)
            },
            copyRecords(md) {
                const allowedRecords = this.getAllowedRecords()
                const textReport = md ? generateMdReport(allowedRecords) : generateTextReport(allowedRecords)
                const textarea = document.createElement("textarea")
                document.body.appendChild(textarea)
                textarea.value = textReport
                textarea.select()
                document.execCommand("copy")
                textarea.remove()
            },
        },
    }
</script>
