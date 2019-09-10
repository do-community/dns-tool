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
    <div>
        <h3 :class="getClass()" :style="getSkeletonStyle(100, 300, 1.4)"></h3>
        <p :class="getClass()" :style="getSkeletonStyle(300, 600)"></p>
        <br>
        <table class="table" style="border-collapse: separate; border-spacing: 0.35em;">
            <tbody>
                <tr v-for="index in getRandomInt(1, 3)" :key="index">
                    <td :class="getClass()" :style="getSkeletonStyle(100, 200)"></td>
                    <td :class="getClass()" :style="getSkeletonStyle(50, 100)"></td>
                    <td :class="getClass()" :style="getSkeletonStyle(100, 300)"></td>
                </tr>
            </tbody>
        </table>
        <p :class="getClass()" :style="getSkeletonStyle(400, 500)"></p>
    </div>
</template>

<script>
    import { getRandomInt, getSkeletonStyle } from "../../../shared/utils/skeletonStyle"

    export default {
        name: "RecordSkeleton",
        props: { loading: Boolean, },
        methods: {
            getRandomInt,
            getSkeletonStyle,
            getClass() {
                return `data-skeleton ${this.$props.loading ? 'skeleton-running' : ''}`
            }
        },
    }
</script>
