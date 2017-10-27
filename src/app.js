// jshint esversion:6,-W033
import Vue from 'vue'

const app = new Vue({
  data: {
    hello: 'hi there Kisa',
  },
  template: '<div id="app">{{ hello }}</div>'
})

export { app }
