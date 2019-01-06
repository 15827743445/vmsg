import Vue from "vue"

import Router from "vue-touter"

import Login from "@components/login"

Vue.use(Router)

export default new router({
    routes: [
        {
            path: "/",
            component: Login
        }
    ]
})