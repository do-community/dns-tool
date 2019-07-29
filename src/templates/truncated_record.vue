<template>
  <span v-if="truncate">
    <p>{{ this.$props.truncated }} <a @click="toggleTruncation">{{ i18n.truncatedRecord.showMore }}</a></p>
  </span>
  <span v-else>
    <p>{{ this.$props.value }} <a @click="toggleTruncation">{{ i18n.truncatedRecord.showLess }}</a></p>
  </span>
</template>

<script>
import i18n from "../i18n"

export default {
    name: "TruncatedRecord",
    props: {
        truncated: String,
        value: String,
    },
    data() {
        return {
            truncate: true,
            i18n,
        }
    },
    methods: {
        toggleTruncation() {
            this.$data.truncate = !this.$data.truncate
        },
    },
}
</script>
