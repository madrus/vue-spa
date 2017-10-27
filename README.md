# Single Page Application with Vue.js

## Installation

- install `editorconfig` plugin
- `npm init -y`
- `yarn`
- `yarn add vue`
- `yarn add express`
- `arn add webpack-dev-middleware webpack-hot-middleware -D`
- `node server`

---

## Notes

### path

`path` resolves all paths relative to the calling JavaScript file

```js
path.resolve(__dirname, `./index.html`)
```

### webpack

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

We will add a new entry point `webpack-hot-middleware/client` to the entry array.
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

---

## References

- [EditorConfig website](http://editorconfig.org/)

---
