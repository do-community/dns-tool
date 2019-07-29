<template>
    <span v-if="truncate">
        <p>{{ this.$props.truncated }} <a @click="toggleTruncation">Show more...</a></p>
    </span>
    <span v-else>
        <p>{{ this.$props.value }} <a @click="toggleTruncation">Show less...</a></p>
    </span>
</template>

<script>
    export default {
        name: "TruncatedRecord",
        props: {
            truncated: String,
            value: String,
        },
        data() {
            return {
                truncate: true,
            }
        },
        methods: {
            toggleTruncation() {
                this.$data.truncate = !this.$data.truncate
            },
        },
    }
</script>
