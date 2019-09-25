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
        <div class="record-group">
            <table class="table skeleton-table">
                <tbody>
                    <tr v-for="outerIndex in 10">
                        <td :class="classes[outerIndex - 1][0]" :style="getSkeletonStyle(40, 90)"></td>
                        <td :class="classes[outerIndex - 1][1]" :style="getSkeletonStyle(300, 400)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { getRandomInt, getSkeletonStyle } from "../../../shared/utils/skeletonStyle"

    const getInitParts = () => {
        const parts = []
        for (let i = 0; i < 10; i++) {
            parts.push([
                "data-skeleton",
                "data-skeleton",
            ])
        }
        return parts
    }

    export default {
        name: "SmallSPFSkeleton",
        data() {
            return {
                classes: getInitParts(),
            }
        },
        mounted() {
            for (const index in this.$data.classes) {
                (async() => {
                    this.$set(this.$data.classes, index, [
                        await this.getClass(),
                        await this.getClass(),
                    ])
                })()
            }
        },
        methods: {
            getRandomInt,
            getSkeletonStyle,
            async getClass() {
                await new Promise(x => setTimeout(x, getRandomInt(10, 30)))
                return "data-skeleton skeleton-running"
            },
        },
    }
</script>
