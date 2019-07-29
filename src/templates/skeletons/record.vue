<template>
  <div>
    <h3 data-skeleton :style="getSkeletonStyle(100, 300, 1.4)"></h3>
    <p data-skeleton :style="getSkeletonStyle(300, 600)"></p>
    <br>
    <table class="table" style="border-collapse: separate; border-spacing: 0.35em;">
      <tbody>
        <tr v-for="index in getRandomInt(1, 3)" :key="index">
          <td data-skeleton :style="getSkeletonStyle(100, 200)"></td>
          <td data-skeleton :style="getSkeletonStyle(50, 100)"></td>
          <td data-skeleton :style="getSkeletonStyle(100, 300)"></td>
        </tr>
      </tbody>
    </table>
    <p data-skeleton :style="getSkeletonStyle(400, 500)"></p>
  </div>
</template>

<script>
import { getRandomInt, getSkeletonStyle } from "../../utils/skeletonStyle"

export default {
  name: "RecordSkeleton",
  methods: { getRandomInt, getSkeletonStyle },
}
</script>
