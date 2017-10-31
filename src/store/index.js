// jshint esversion:6,-W033
import Vue from 'vue'
import Vuex from 'vuex'
import appService from '../app.service'

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
  },
  actions: {
    logout (context) {
      context.commit('logout')
    },
    login (context, credentials) {
      return new Promise(resolve => {
        appService.login(credentials)
          .then((data) => {
            context.commit('login', data)
            resolve()
          }).catch(() => window.alert('Could not log in!'))
      })
    }
  },
  mutations: {
    logout (state) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', null)
        window.localStorage.setItem('tokenExpiration', null)
      }
      state.isAuthenticated = false
    },
    login (state, token) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', token.token)
        window.localStorage.setItem('tokenExpiration', token.expiration)
      }
      state.isAuthenticated = true
    }
  }
})

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', (event) => {
    let expiration = window.localStorage.getItem('tokenExpiration')
    var unixTimestamp = new Date().getTime() / 1000
    if (expiration && parseInt(expiration) - unixTimestamp > 0) {
      // to be very disciplined, you may want to create
      // another mutation for this, and another action
      store.state.isAuthenticated = true
    }
  })
}

export default store
