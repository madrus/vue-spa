# Single Page Application with Vue.js

## Installation

- install `editorconfig` plugin
- `npm init -y`
- `yarn`
- `yarn add vue`
- `yarn add express`
- `yarn add webpack-dev-middleware webpack-hot-middleware -D`
- `yarn add eslint eslint-loader eslint-plugin-html eslint-config-standard -D`
- `yarn add eslint-plugin-promise eslint-plugin-standard -D`
- `yarn add eslint-plugin-import eslint-plugin-node -D`

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

Now, when Vue.js receives the update, it rebuilds the app. Unfortunately, this is not enough.
It will still need to rerender the templates. For that to happen, we need to include the template
in our Vue instantiation in `app.js`, so it can know how to render the section that it is mounted on:

```js
template: '<div id="app">{{ hello }}</div>'
```

---

## References

- [EditorConfig website](http://editorconfig.org/)

---
