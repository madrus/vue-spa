// jshint esversion:6,-W033
import 'es6-promise/auto'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../../../src/store/index'
import Category from '../../../src/theme/Category.vue'

describe('Category.vue', () => {
  it('should load front-end links', (done) => {
    Vue.use(VueRouter)

    const router = new VueRouter({
      routes: [
        { path: '/', component: Category }
      ]
    })

    const vm = new Vue({
      el: document.createElement('div'),
      router,
      store,
      render: h => h('router-view')
    })

    // console.log(vm.$el)
    store.watch(
      // watch the changes in the posts through this getter...
      state => state.postsModule.posts,
      () => {
        expect(vm.$el.querySelectorAll('.column').length).to.equal(6)
        done()
      }
    )
  })
})
