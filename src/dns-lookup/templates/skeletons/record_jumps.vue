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
        <p>
            <span v-for="_ in records" class="data-skeleton" :style="{ ...getSkeletonStyle(75, 150), display: 'inline-block', marginRight: '0.2em' }"></span>
        </p>
    </div>
</template>

<script>
    import { getSkeletonStyle } from "../../../shared/utils/skeletonStyle"
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
