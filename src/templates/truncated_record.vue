<template>
    <span v-if="truncate">
        <p>{{ this.$props.truncated }} <a v-on:click="toggleTruncation">Show more...</a></p>
    </span>
    <span v-else>
        <p>{{ this.$props.value }} <a v-on:click="toggleTruncation">Show less...</a></p>
    </span>
</template>

<script>
export default {
    name: "TruncatedRecord",
    data() {
        return {
            truncate: true,
        }
    },
    props: {
        truncated: String,
        value: String,
    },
    methods: {
        toggleTruncation() {
            this.$data.truncate = !this.$data.truncate
        },
    },
}
</script>
