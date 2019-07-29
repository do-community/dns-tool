<template>
  <div>
    <p>
      <span v-for="_ in records" data-skeleton :style="{ ...getSkeletonStyle(75, 150), display: 'inline-block', marginRight: '0.2em' }"></span>
    </p>
    <hr>
  </div>
</template>

<script>
import { getSkeletonStyle } from "../../utils/skeletonStyle"
import VueifiedRecords from "../../data/vueified_records"

export default {
    name: "RecordJumpsSkeleton",
    props: {
        loaded: Boolean,
    },
    data() {
        return {
            records: VueifiedRecords,
        }
    },
    methods: { getSkeletonStyle },
}
</script>
