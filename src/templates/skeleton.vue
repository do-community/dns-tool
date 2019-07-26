<template>
    <span>
        <span v-for="_ in records">
            <h3 v-bind:style="getSkeletonStyle(100, 300)"></h3>
            <p v-bind:style="getSkeletonStyle(300, 600)"></p>
            <br>
            <table class="table" style="border-collapse: separate; border-spacing: 0.35em;">
                <tbody>
                    <tr>
                        <td v-bind:style="getSkeletonStyle(100, 200)"></td>
                        <td v-bind:style="getSkeletonStyle(50, 100)"></td>
                        <td v-bind:style="getSkeletonStyle(100, 300)"></td>
                    </tr>
                    <tr>
                        <td v-bind:style="getSkeletonStyle(100, 200)"></td>
                        <td v-bind:style="getSkeletonStyle(50, 100)"></td>
                        <td v-bind:style="getSkeletonStyle(100, 300)"></td>
                    </tr>
                </tbody>
            </table>
            <p v-bind:style="getSkeletonStyle(400, 500)"></p>
            <hr>
        </span>
    </span>
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
            getSkeletonStyle(min, max, size) {
                return {
                    height: `${size}em`,
                    margin: `${size * .35}em 0`,
                    background: `hsl(0, 0%, ${this.getRandomInt(90, 95)}%)`,
                    borderRadius: `${size * .5}em`,
                    border: "none",
                    width: `${this.getRandomInt(min, max)}px`
                };
                //return `height: ${size}em; margin: ${size * .35}em 0; background: hsl(0, 0%, ${this.getRandomInt(90, 95)}%); border-radius: ${size * .5}em; border: none; width: ${this.getRandomInt(min, max)}px;`
            },
        }
    }
</script>
