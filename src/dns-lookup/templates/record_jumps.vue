<!--
Copyright 2022 DigitalOcean

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
    <div v-if="loaded">
        <p>
            <b>Jump to:</b>
            <span v-for="record in records">
                <a
                    :href="`#${record.name}-Records`"
                    class="jump-link"
                    v-text="`${record.name} ${i18n.common.records}`"
                ></a>
            </span>
        </p>
    </div>
    <div v-else>
        <RecordJumpsSkeleton :loading="loading"></RecordJumpsSkeleton>
    </div>
</template>

<script>
    import VueifiedRecords from "../data/vueified_records"
    import RecordJumpsSkeleton from "./skeletons/record_jumps"
    import i18n from "../i18n"

    export default {
        name: "RecordJumps",
        components: {
            RecordJumpsSkeleton,
        },
        props: {
            loaded: Boolean,
            loading: Boolean,
        },
        data() {
            return {
                records: VueifiedRecords,
                i18n,
            }
        },
    }
</script>
