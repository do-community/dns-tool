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

<style scoped>
    div {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
        padding: 0 0 10%;
        background: linear-gradient(to bottom, hsla(0, 0%, 100%, 0.7) 0%, hsla(0, 0%, 100%, 0.5) 90%, hsla(0, 0%, 100%, 0) 100%)
    }

    h2 {
        padding: 32px;
        margin: 0;
        background: hsla(0, 0%, 100%, 0.2);
        color: #505159;
    }

    img {
        width: 512px;
        max-width: 100%;
    }
</style>

<template>
    <div>
        <img src="../../assets/dns.svg" alt="" />
        <h2>No domain has been searched yet</h2>
    </div>
</template>

<script>
    export default {
        name: "NoSearch",
    }
</script>
