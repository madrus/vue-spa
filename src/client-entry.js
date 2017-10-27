// jshint esversion:6,-W033
import { app } from './app'

app.$mount('#app')

if (module.hot) {
  module.hot.accept()
}
