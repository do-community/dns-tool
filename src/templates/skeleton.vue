<style>
    @keyframes skeleton-loading {
        0% { opacity: 0.7; }
        25% { opacity: 0.9; }
        50% { opacity: 0.7; }
        75% { opacity: 0.5; }
        100% { opacity: 0.7; }
    }
</style>

<template>
    <div>
        <div v-for="_ in records">
            <h3 data-skeleton v-bind:style="getSkeletonStyle(100, 300, 1.4)"></h3>
            <p data-skeleton v-bind:style="getSkeletonStyle(300, 600)"></p>
            <br>
            <table class="table" style="border-collapse: separate; border-spacing: 0.35em;">
                <tbody>
                <tr v-for="_ in getRandomInt(1, 3)">
                    <td data-skeleton v-bind:style="getSkeletonStyle(100, 200)"></td>
                    <td data-skeleton v-bind:style="getSkeletonStyle(50, 100)"></td>
                    <td data-skeleton v-bind:style="getSkeletonStyle(100, 300)"></td>
                </tr>
                </tbody>
            </table>
            <p data-skeleton v-bind:style="getSkeletonStyle(400, 500)"></p>
            <hr>
        </div>
    </div>
</template>

<script>
    import recordsDataset from "../data/records"

    export default {
        name: "Skeleton",
        data() {
            return {
                records: Object.keys(recordsDataset),
            }
        },
        methods: {
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            getSkeletonStyle(min, max, size = 1) {
                return {
                    height: `${size}em`,
                    margin: `${size * .35}em 0`,
                    background: `hsl(0, 0%, ${this.getRandomInt(80, 90)}%)`,
                    borderRadius: `${size * .5}em`,
                    border: "none",
                    width: `${this.getRandomInt(min, max)}px`,
                    opacity: "0.7",
                    animation: `skeleton-loading ${this.getRandomInt(900, 1200)}ms linear ${this.getRandomInt(0, 600)}ms infinite`,
                    animationPlayState: "paused",
                }
            },
        }
    }
</script>
