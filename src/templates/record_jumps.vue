<template>
  <div v-if="this.$props.loaded">
    <i class="fas fa-link"></i>
    <span v-for="record in records">
      <a :href="`#${record.name}-Records`" style="display: inline-block; margin: 0.3em 0.3em 0 0">{{ record.name }} {{ i18n.recordJumps.record }}</a>
    </span>
    <hr>
  </div>
</template>

<script>
import VueifiedRecords from "../data/vueified_records"
import i18n from "../i18n"

export default {
    name: "RecordJumps",
    props: {
        loaded: Boolean,
    },
    data() {
        return {
            records: VueifiedRecords,
            i18n,
        }
    },
}
</script>
