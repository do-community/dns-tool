<!--
Copyright 2024 DigitalOcean

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
            <hr v-if="loadingInner">
        </div>
        <div v-if="loading || hostname === ''">
            <RecordSkeleton :loading="loadingInner"></RecordSkeleton>
        </div>
        <hr>
        <div v-for="record of $props.records">
            <SPF :data="record" :hostname="hostname" @done-loading="doneLoading" />
            <hr>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import SPF from "./spf"
    import RecordSkeleton from "./skeletons/record"

    export default {
        name: "SPFBase",
        components: {
            SPF,
            RecordSkeleton,
        },
        props: {
            records: Array,
            loading: Boolean,
            d: String,
        },
        data() {
            return {
                hostname: "",
                i18n,
                loadingInner: false,
            }
        },
        watch: {
            loading() {
                this.$data.hostname = this.$props.d
                if (this.$data.hostname.endsWith(".")) this.$data.hostname = this.$data.hostname.slice(0, -1)
                this.$data.loadingInner = this.$props.loading
            },
        },
        methods: {
            doneLoading() {
                this.$data.loadingInner = false
            },
        },
    }
</script>
