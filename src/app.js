// jshint esversion:6,-W033
import Vue from 'vue'
import store from './store/index'
import AppLayout from './theme/Layout.vue'
import router from './router'

// console.log(AppLayout)

const app = new Vue({
  router,
  store,
  // jshint ignore:start
  ...AppLayout
  // jshint ignore:end
})

export { app, router, store }
