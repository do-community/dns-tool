<template>
    <div :class="`modal ${toggled ? 'is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    Download Records
                </p>
                <button class="delete" aria-label="close" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <div v-for="key in reports.keys()">
                    <input :ref="key" type="checkbox" checked> {{ key }} Records
                </div>
                <br>
                <a class="button is-link" @click="downloadRecordsTxt">Download Records In Text Form</a>
                <a class="button is-link" @click="copyRecordsTxt">Copy Records In Text Form</a>
            </section>
        </div>
    </div>
</template>

<script>
    import { generateTextReport, reports } from "../plain_text_reports"

    export default {
        name: "RecordSelectionModal",
        data() {
            return {
                toggled: false,
                reports,
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
            downloadRecordsTxt() {
                const allowedRecords = this.getAllowedRecords()
                const textReport = generateTextReport(allowedRecords)
                this.download(textReport, "records.txt")
            },
            copyRecordsTxt() {
                const allowedRecords = this.getAllowedRecords()
                const textReport = generateTextReport(allowedRecords)
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
