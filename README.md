# Single Page Application with Vue.js

## Installation

- install `editorconfig` plugin
- make sure you have the latest version of `yarn` installed:

  ```bash
  curl -o- -L https://yarnpkg.com/install.sh | bash
  ```

Project Initialisation

- `npm init -y`
- `yarn`
- `yarn add vue`
- `yarn add express`

Hot reload without `vue-loader`

- `yarn add webpack webpack-dev-middleware webpack-hot-middleware -D`

ESLINT

- `yarn add eslint eslint-loader eslint-plugin-html eslint-config-standard -D`
- `yarn add eslint-plugin-promise eslint-plugin-standard -D`
- `yarn add eslint-plugin-import eslint-plugin-node -D`
- `yarn add eslint-friendly-formatter eslint-plugin-vue -D`

Hot reload with `vue-loader`

- `yarn add vue-loader vue-template-compiler -D`

Babel

- `yarn add babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-stage-2 -D`

Bulma Styling

- `yarn add bulma`
- `yarn add css-loader node-sass sass-loader -D`

Extract Styles

- `yarn add extract-text-webpack-plugin -D`

Vue Router

- `yarn add vue-router`

Axios

- `yarn add axios`

Vuex

- `yarn add vuex`

Server-side rendering

- `yarn add vue-server-renderer`
- `yarn add webpack-node-externals -D`

---

## Environment Setup

### path

`path` resolves all paths relative to the calling JavaScript file

```js
path.resolve(__dirname, `./index.html`)
```

---

### webpack: how it works

The `[name]` in `webpack.base.config.js` inside `output` will be substituted with `app` inside `entry`.

```js
const config = {
  entry: {
    app: path.resolve(__dirname, '../src/client-entry.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'assets/js/[name].js'
  }
}
```

To see how this works, run the following command:

```bash
node ./node_modules/webpack/bin/webpack --config ./build/webpack.base.config.js
```

Now, `app.js` will be generated in `dist/assets/js` folder.

---

### Hot Reloading

Inside `build/dev-server.js`, we use two middleware plugins:

- `webpack-dev-middleware` - to automatically rebuild the distribution files in memory instead of on disk
- `webpack-hot-middleware` - to hot reload the changed section in the browser

There are a couple of tricks we will need to do for the mechanism to start working.

#### New entrypoint

First, we will add a new entry point `webpack-hot-middleware/client` to the entry array.
This added script will connect to the server to receive notifications
when the bundler rebuilds, and then update the client bundle accordingly.

```js
module.exports = function setupDevServer (app) {
  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    clientConfig.entry.app
  ]
  ...
}
```

Also, we need to add two extra plugins:

```js
clientConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
)
```

#### Handling of the change events

Inside `src/client-entry.js`, we add the trigger mechanism for hot reload after changes:

```js
if (module.hot) {
  module.hot.accept()
}
```

This will tell the hot module to stop the hot reloading propagation and flag
that everything is reloaded correctly.

__NOTE:__ this piece of code can be removed when we start using `vue-loader`

Now, when Vue.js receives the update, it rebuilds the app. Unfortunately, this is not enough.
It will still need to rerender the templates. For that to happen, we need to include the template
in our Vue instantiation in `app.js`, so it can know how to render the section that it is mounted on:

```js
template: '<div id="app">{{ hello }}</div>'
```

---

### Vue Render Function

The render function inside the Vue initialisation

```js
const app = new Vue({
  render: h => h(AppLayout)
})
```

is similar to using this template:

```js
template: '<app></app>'
```

---

### Vue Component Render Function

If we `console.log()` our component, we will notice it has its own `render()` function.
We can use the spread of the component instead of the Vue `render` function:

```js
const app = new Vue({
  ...AppLayout
})
```

But in order to be able to render spreads, we need __Babel__ as not all browsers/version
understand ES6 syntax.

---

### Babel

- add Babel plugins (see above)
- configure `.babelrc`
- add babel to eslint parsing
- add a rule to `build/webpack.base.config.js` to load `babel-loader`

---

### Styling with Bulma

[Bulma](https://bulma.io/) is a light-weight CSS-framework like Bootstrap. (see also [BulmaSwatch](https://jenil.github.io/bulmaswatch/))

- all css and sass loaders (see above)
- add loader options to `vue-loader` in `build/webpack.base.config.js`

```js
{
  test: /(\.vue$)/,
  loader: 'vue-loader',
  options: {
    css: 'css-loader',
    'scss': 'css-loader|sass-loader'
  }
},
```

Now, in our .vue files we can use `scss`:

```scss
<style lang="scss">
$primary: #287ab1;
@import '~bulma';

.columns {
  flex-wrap: wrap;
}
</style>
```

---

### Vue Components

> Creating a single file component and adding a `script` section with `default export`
> in fact creates a __Vue instance__

```js
<script>
export default {}
</script>
```

---

### Slots

__Slots__ are placeholder components that can be dynamically filled with real components.
They can be anonymous or named. An example of how these slots can be used can be found
in `Category.vue` and `Post.vue`.

---

### Extract Styles

By default, out styles are included inside the generated JavaScript files.
However, it is possible to combine all the style files in a separate file.
Add `extract-text-webpack-plugin` (see above).

In the `webpack.client.config.js` configure the plugin:

```js
// extracting CSS to a separate file is only necessary for the client
config.module.rules
  .filter(r => { return r.loader === 'vue-loader' })
  .forEach(r => { r.options.extractCSS = true })

config.plugins.push(
  new ExtractTextPlugin('assets/css/styles.css')
)
```

Here, we are adding a new property to the `vue-loader` rule but only for the client.

Of course, we also need to add the generated stylesheet to the `index.html`:

```html
<link rel="stylesheet" href="/assets/css/styles.css" />
```

---

## Routing

### vue-router

Start by installing `vue-router` plugin into the project (see above).
Then create the new `router.js` file and link the Category component
to the root path:

```js
const router = new VueRouter({
  routes: [
    { path: '/', component: Category }
  ]
})
```

After that we can delete Category from `Layout.vue` and replace `<category></category>`
with `<router-view></router-view>`. This will be a placeholder to load routed components
in between the header and the footer.

E.g. when the root page is loaded, the router finds the component linked to it, `category`,
and load it in the `router-view` section.

### History mode

If we add `mode: 'history'` to the VueRouter, the hash in the url will disappear,
and we will be able to walk back and forth through the browser history.

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Category }
  ]
})
```

### Scrolling

We would like to reload only the component that is linked to the route and not the whole page.
To achieve this, we need to replace `<a>` tag with `<router-link>`

In the `router.js`, specify what should happen when a new path is loaded.
We can choose from three types of bahavior based on three parameters:

- where we are going to
- where we are coming from
- last saved position of the screen

The three types of bahavior are:

- scroll to the fixed position e.g. top of the screen
- scroll to the last saved position
- scroll to the element with the id of the saved link hash value

__Scroll to the top of the screen__

```js
scrollBehavior: (to, from, savedPosition) => ({ x: 0, y: 0 }),
```

__Scroll to the last saved position__

```js
scrollBehavior: (to, from, savedPosition) => ({
  if (savedPosition) {
    return savedPosition
  }
}),
```

__Scroll to the element with the id of the saved link hash value__

```js
scrollBehavior: (to, from, savedPosition) => ({
  if (to.hash) {
    return {
      selector: to.hash
  }
}),
```

---

### Route Parameters

- set route parameters in `router.js`
- make sure they match `router-link` tags
- in `Category.vue` add a watcher and make sure the component is refreshed if the route changes:
  - create `loadPosts` method
  - call it in `Created` hook
  - call it again in the watcher if the route changes

```js
data () {
  return {
    id: this.$route.params.id,
    ...
},
methods: {
  loadPosts () {
    if (this.id === 'front-end') {
      this.posts = this.postsFrontEnd
    } else {
      this.posts = this.postsMobile
    }
  }
},
watch: {
  '$route' (to, from) {
    this.id = to.params.id
    this.loadPosts()
  }
},
created () {
  this.loadPosts()
}
```

---

### Route Query

We can extract the query parameters from our route.
E.g. if our route ends with `?page=2`, we can get the value `2` like this:

```js
this.$route.query.page
```

---

### Named Routes

Added a name to a route makes it possible to use routes as variables.

```js
routes: [
  ...
  { path: '/category/:id', name: 'category', component: Category },
  ...
]
```

Now, we can use this name instead of hard-coded route. Compare:

```html
<router-link class="nav-item is-tab"
  to="/category/front-end">Front-end</router-link>
<router-link class="nav-item is-tab"
  :to="{ name: 'category', params: { id: 'mobile' } }">Mobile</router-link>
```

---

### Lazy Loading

We can improve the performance of the website by loading components only
when they are needed.

Compare:

```js
// loading everything all at once
import Category from './theme/Category.vue'
import Login from './theme/Login.vue'
import NotFound from './theme/NotFound.vue'

//vs

// lazy loading
const Category = () => System.import('./theme/Category.vue')
const Login = () => System.import('./theme/Login.vue')
const NotFound = () => System.import('./theme/NotFound.vue')
```

You can see in the webpack console log and in DevTools in the Network tab
that the JavaScript file being loaded is now broken in three chunks:
`0.js`, `1.js`, and `2.js`

---

## API Communication

### Add Service Layer

Using Axios we can read posts from an API.

- add `app.service.js` and specify how to make async gets
- use the new `getPosts` service method in the `loadPosts` method of `Categories.js` to read posts instead hardcoding them.
- refactor the template to use the field names from the actual response
- sanitize the serialized HTML with `v-html` directive

---

### Authentication with JWT token

Go to [JWT website](https://jwt.io/)

We added a new `login` method to our service layer:

```js
login (credentials) {
  return new Promise((resolve, reject) => {
    axios.post(`/services/auth.php`, credentials)
      .then(response => {
        resolve(response.data)
      })
      .catch(response => {
        reject(response.status)
      })
  })
}
```

> Token expiration date is set inside the token itself but in this course, the expiration date is returned for simplicity to avoid token decryption.

We can test our new login form using `bill/vuejs` as username and password.

---

### Intercepting Requests

In order to consume a secure API, we need to send the `Authorization` header with every request.
We can simplify this task by using interception mechanism in the `app.service.js`:

```js
axios.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## State Management

### Naive approach via event-bus

In different components, we want to know if the user is authenticated.
We can use an __Event Bus__ to notify about state changes.
Then we can show `Logout` menu option if the user is authenticated, and `Login` otherwise.
Unfortunately, this does not help us if we browse to the category menu options.
And we don't want to repeat the same code in every component that is interested
in this event.

We better use __State Management__.

---

### Vuex Store

- install `vuex` (see above)
- create `src/store/index.js` file
- add `isAuthenticated` to the store
- import `store` in `app.js`, and add it to exports
- run the application and see the variable in `Vuex` section of the __Vue.js Dev Tools__
- click on `Components` and notice the exact name of the `$vm` variable like `$vm0` on the picture:

  ![$vm](./images/$vm0.png)

- in console, type `$vm0.$store.state` to the value of the `isAuthenticated` value

### Getters

__Getters__ are like computed properties of the Vuex Store.

We added a getter for the `isAuthenticated` property in `store/index.js`:

```js
getters: {
  isAuthenticated (state) {
    // if necessary, include here extra logic
    return state.isAuthenticated
  }
}
```

Now, we can rewrite the script in the `AppHeader.vue`:

```js
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([`isAuthenticated`])
  }
}
</script>
```

### Actions and Mutations

The 'logout' __action__ will commit the 'logout' __command__. The commit of a command
will trigger the 'logout' __mutation__ that will eventually __update the state__.

We can now rewrite the `logout` method in `Login.vue` to use the `logout` action from the store.

```js
import { mapGetters, mapActions } from 'vuex'

export default {
  ...
  methods: {
    ...mapGetters({
      logout: 'logout'
    }),
    ...
  },
  ...
}
```

Calling this method will make __Vuex__ trigger the following method:

```js
logout () {
  this.$store.dispatch('logout')
}
```

This method in turn will trigger the `logout` action from the store.

We will also rewrite the `login` method to use its own action and mutation.
The extra trick here is to replace the `created` method in the `Login.vue` component
with attaching a DOM-listener waiting for the `document` to be loaded.
This listener will then check the expiration date of the token in the store,
and, if all is ok, set the value of `isAuthenticated` store variable to `true`.

```js
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', (event) => {
    let expiration = window.localStorage.getItem('tokenExpiration')
    var unixTimestamp = new Date().getTime() / 1000
    if (expiration && parseInt(expiration) - unixTimestamp > 0) {
      store.state.isAuthenticated = true
    }
  })
}
```

### Modules

We can further split the store to make everything more manageable,
e.g. separate everything related to posts in a separate `posts.js` module.
We can further wrap everything in a virtual namespace by using the `namespaced` property:

```js
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
```

We add `postsModule` to the store:

```js
import postsModule from './posts'

const store = new Vuex.Store({
  modules: {
    postsModule
  },
  state,
  ...
}
```

Then in `Category.vue`, we can use the getters from this module by specifying its name as the first parameter:

```js
computed: {
  ...mapGetters('postsModule', ['posts'])
},
```

Here is how a namespaced action is being dispatched:

```js
methods: {
  loadPosts () {
    let categoryId = 2 // front-end links
    if (this.$route.params.id === 'mobile') {
      categoryId = 11 // mobile links
    }
    this.$store.dispatch('postsModule/updateCategory', categoryId)
  }
},
```

---

## Server Side Rendering

### Memory File System

For this we start by creating `server-entry.js` and `webpack.server.config.js`.

The "magic" begins in the `dev-server.js`.

- Next to the client configuration, we add the above-mentioned server configuration.
- We also include and instantiate the MFS (Memory File System) module.
- We set the __output path file system__ of our server-entry to the __memory file system__ we initialized.

> This is done only in __development mode__. So, we don't actually create the files in our file system but compile everything in memory. Later on, when we want actually to deploy our application, we will create these files optimized in our file system. For now, we keep things fast while in development.

- Additionally, we grab the output path of our server configuration
- We create a watch handler to trigger an event every time our source code changes. Every time it changes, webpack will compile a new bundle and will read the new bundle file that is created from our memory file system.
- For now, we include in our server a callback and name it `onUpdate`.
- We run this callback when the server bundle is updated, passing in the new server bundle.

### Vue Server Renderer

- We install the `vue-server-renderer` that has been created by the Vue.js team, which contains the `createBundleRenderer` method.
- This methods receives the server bundle, which is basically our Vue.js application, and generates a renderer.
- This renderer will then receive the url that we are at, and will generate the final html.
- We also included the variable called `renderer`, and in the dev-server we pass it in the `onUpdate` callback.
- Every time the server bundle changes, we will receive a new bundle, and generate a new renderer.

Until now, we are still serving a static `index.html` page. But we want to server the end result rendered by the server.

- When we receive a request, we will now run `renderer.renderToString` method and pass in the url.
- As a callback we will receive an error or the final html.
- If we get an error, we return the 500 server error code back to the user
- If all is ok, we embed the html result to our `index.html` page
- in the `index.html` file, replace `<div id="app"></div>` with moustaches: `{{ APP }}`
- we add the id of `app` in the `Layout.vue` component, so that after the site loads, Vue.js will be mounted in this area
- in the `server.js`, we can now load our `index.html` and replace the `{{ APP }}` with our generated code, and return the end result.

If we run the server, we notice that the page is loaded immediately but [in the beginning] there is no content on the page. This is because some of the methods like `loadPosts` have not run yet. That is because `created` method runs __after__ the component is attached to the document. The header and footer are not being rendered, the load asynchronously and appear immediately.

### Server Side Route Handling

We added server side route handling in the `server-entry.js`. The trainer suggested to add `onReady` callback to the `client-entry.js` as well because his page still would not render:

```js
import { app, router } from './app'

router.onReady(() => {
  app.$mount('#app')
})
```

Yet, in my case this would lead to the following error in the console when I click on different menu options:

```none
(node:11716) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): ReferenceError: window is not defined
(node:11716) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

Therefore, I have returned back to the initial code:

```js
import { app } from './app'

app.$mount('#app')
```

I can still see __a small glitch__:

If I start clicking around the menu items in this order: `Login`, `Front-end`, `Mobile`, etc., every time I click `Front-end` I see the content flash with the `Mobile` page content and after that immediately switch to the right content for the `Front-end` menu option. This does not happen however for the content of the `Mobile` page itself.

---

## References

- [EditorConfig website](http://editorconfig.org/)

---
