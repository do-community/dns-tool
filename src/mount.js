import "babel-polyfill"

import Vue from "vue"
import App from "./templates/app.vue"

new Vue({
    render: h => h(App),
}).$mount("#app")
