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
    <div v-if="truncate">
        <p>{{ truncated }} <a @click="toggleTruncation">{{ i18n.templates.truncatedRecord.showMore }}</a></p>
    </div>
    <div v-else>
        <p>{{ value }} <a @click="toggleTruncation">{{ i18n.templates.truncatedRecord.showLess }}</a></p>
    </div>
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
