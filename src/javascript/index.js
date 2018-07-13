import "vuetify/dist/vuetify.min.css"
import "style.styl"
import "diagram.scss"

import Vue from "vue"
import VueRouter from "vue-router"
import Vuetify from "vuetify"
import App from "./App.vue"
import VeeValidate from 'vee-validate'
import { formatDate } from './util/helpers'
import VueUploadComponent from 'vue-upload-component'

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(VeeValidate)

Vue.filter('formatDate', formatDate)

Vue.filter('fixed2', function (value) {
    return value.toFixed(2)
})

Vue.component('file-upload', VueUploadComponent)

new Vue(App)
