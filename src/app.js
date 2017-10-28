// jshint esversion:6,-W033
import Vue from 'vue'

const app = new Vue({
  data () {
    return {
      hello: 'hi there and nowhere'
    }
  },
  template: '<div id="app">{{ hello }}</div>'
})

export { app }
