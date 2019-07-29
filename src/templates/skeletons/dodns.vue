<template>
    <p>
        <span data-skeleton :style="{ ...getSkeletonStyle(400, 600), display: 'inline-block', marginRight: '0.2em' }"></span>
        <span data-skeleton :style="{ ...getSkeletonStyle(200, 500), display: 'inline-block', marginRight: '0.2em' }"></span>
    </p>
</template>

<script>
    import { getSkeletonStyle } from "../../utils/skeletonStyle"

    export default {
        name: "DODNSSkeleton",
        methods: { getSkeletonStyle },
    }
</script>
