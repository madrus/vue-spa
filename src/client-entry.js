// jshint esversion:6,-W033
import { app, router } from './app'

router.onReady(() => {
  app.$mount('#app')
})
