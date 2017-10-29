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

---

## Notes

### path

`path` resolves all paths relative to the calling JavaScript file

```js
path.resolve(__dirname, `./index.html`)
```

---

### webpack: how it works

The `[name]` in `webpack.base.config.js` inside `output` will be substituted with `app` inside `entry`.

```js
const config ={
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

### Routing

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

### Add Service Layer

Using Axios we can read posts from an API.

- add `app.service.js` and specify how to make async gets
- use the new `getPosts` service method in the `loadPosts` method of `Categories.js` to read posts instead hardcoding them.
- refactor the template to use the field names from the actual response
- sanitize the serialized HTML with `v-html` directive

---

## References

- [EditorConfig website](http://editorconfig.org/)

---
