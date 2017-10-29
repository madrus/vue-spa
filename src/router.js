// jshint esversion:6,-W033
import Vue from 'vue'
import VueRouter from 'vue-router'
import Category from './theme/Category.vue'
import Login from './theme/Login.vue'

Vue.use(VueRouter)

const scrollBehavior = (to, from, savedPosition) => {
  if (to.hash) {
    return { selector: to.hash }
  } else if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}

// VueRouter accepts JSON as its options
const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior,
  routes: [
    { path: '/login', component: Login },
    { path: '/category/:id', name: 'category', component: Category },
    { path: '/', redirect: '/category/front-end' }
  ]
})

export default router
