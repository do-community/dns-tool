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
        <h3 :class="getClass()" :style="getSkeletonStyle(700, 800, 1.4)"></h3>
        <hr>
        <p :class="getClass()" :style="getSkeletonStyle(200, 400)"></p>
        <hr>
        <div class="record-group">
            <table class="table skeleton-table">
                <tbody>
                    <tr v-for="_ in 5">
                        <td :class="getClass()" :style="getSkeletonStyle(40, 90)"></td>
                        <td :class="getClass()" :style="getSkeletonStyle(300, 400)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-for="_ in 3" class="record-group">
            <hr>
            <p :class="getClass()" :style="getSkeletonStyle(400, 500)"></p>
            <hr>
            <div class="record-group">
                <table class="table skeleton-table">
                    <tbody>
                        <tr v-for="__ in 2">
                            <td :class="getClass()" :style="getSkeletonStyle(40, 90)"></td>
                            <td :class="getClass()" :style="getSkeletonStyle(300, 800)"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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
                return `data-skeleton${this.$props.loading ? ' skeleton-running' : ''}`
            }
        },
    }
</script>
