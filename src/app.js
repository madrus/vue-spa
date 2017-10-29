// jshint esversion:6,-W033
import Vue from 'vue'
import AppLayout from './theme/Layout.vue'
import router from './router'

// console.log(AppLayout)

const app = new Vue({
  router,
  // jshint ignore:start
  ...AppLayout
  // jshint ignore:end
})

export { app, router }
