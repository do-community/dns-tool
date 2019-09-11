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
        <div v-if="hostname !== ''">
            <p>
                <b>{{ i18n.templates.spfBase.results.replace("{hostname}", hostname) }}</b>
            </p>
            <hr v-if="loading">
        </div>
        <div v-if="loading || hostname === ''">
            <NoSearch v-if="firstSearch && !loading"></NoSearch>
            <RecordSkeleton :loading="loading"></RecordSkeleton>
        </div>
        <hr>
        <div v-for="record of $props.records">
            <SPF :data="record.data" :hostname="hostname" @done-loading="doneLoading"></SPF>
            <hr>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import SPF from "./spf"
    import RecordSkeleton from "./skeletons/record"
    import NoSearch from "./skeletons/no_search"

    export default {
        name: "SPFBase",
        components: {
            SPF,
            RecordSkeleton,
            NoSearch,
        },
        props: {
            records: Array,
        },
        data() {
            return {
                hostname: "",
                loading: false,
                firstSearch: true,
                i18n,
            }
        },
        watch: {
            records() {
                this.$data.hostname = this.$props.records[0].name
                if (this.$data.hostname.endsWith(".")) this.$data.hostname = this.$data.hostname.slice(0, -1)
            },
        },
        methods: {
            doneLoading() {
                this.$data.loading = false
            }
        }
    }
</script>
