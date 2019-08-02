<template>
    <div :class="`modal ${toggled ? 'is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    DNS Propagation
                </p>
                <button class="delete" aria-label="close" @click="toggle"></button>
            </header>
            <section class="modal-card-body" v-html="i18n.propagationModal.tutorial"></section>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"

    export default {
        name: "PropagationModal",
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
