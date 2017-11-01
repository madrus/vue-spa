// jshint esversion:6,-W033
import { app, router, store } from './app'

export default context => {
  router.push(context.url)
  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.AsyncData) {
      return component.AsyncData(store, router.currentRoute)
    }
  })).then(() => {
    context.initialState = store.state
    return app
  })
}
