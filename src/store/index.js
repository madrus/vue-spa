// jshint esversion:6,-W033
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isAuthenticated: false
}

const store = new Vuex.Store({
  state,
  getters: {
    isAuthenticated (state) {
      // if necessary, include here extra logic
      return state.isAuthenticated
    }
  }
})

export default store
