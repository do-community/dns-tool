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
    <div class="footer">
        <div class="container">
            <p>
                <a href="#top" class="button is-primary is-small">{{ i18n.templates.footer.backToTop }}</a>
            </p>
            <p>
                <span v-for="part in splitUrlText(i18n.templates.footer.oss)">
                    <span v-if="typeof part === 'string'">
                        {{ part }}
                    </span>
                    <span v-else>
                        <ExternalLink :text="part[0]" :link="part[1]"></ExternalLink>
                    </span>
                </span>
            </p>
        </div>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import ExternalLink from "./ext_link"
    import dataUrlParser from "../utils/dataUrlParser"

    export default {
        name: "Footer",
        components: {
            ExternalLink
        },
        data() {
            return {
                i18n,
            }
        },
        methods: {
            splitUrlText(text) {
                return dataUrlParser(text)
            },
        }
    }
</script>
