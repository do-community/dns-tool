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
        <div class="record-group data-skeleton skeleton-running">
            <table class="table skeleton-table">
                <tbody>
                    <tr v-for="_ in 10">
                        <td :style="getSkeletonStyle(40, 90)"></td>
                        <td :style="getSkeletonStyle(300, 400)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { getRandomInt, getSkeletonStyle } from "../../../shared/utils/skeletonStyle"
    export default {
        name: "SmallSPFSkeleton",
        methods: {
            getRandomInt,
            getSkeletonStyle,
        },
    }
</script>
