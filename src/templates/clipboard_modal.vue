<template>
    <div :class="`modal ${toggled ? 'is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ i18n.templates.clipboardModal.clipboardResult }}
                </p>
                <button class="delete" :aria-label="i18n.common.close" @click="hide"></button>
            </header>
            <section class="modal-card-body">
                <p>{{ i18n.templates.clipboardModal.thisHasBeenCopied }}</p>
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
