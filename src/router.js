// jshint esversion:6,-W033
import Vue from 'vue'
import VueRouter from 'vue-router'
import Category from './theme/Category.vue'

Vue.use(VueRouter)

// VueRouter accepts JSON as its options
const router = new VueRouter({
  routes: [
    { path: '/', component: Category }
  ]
})

export default router
