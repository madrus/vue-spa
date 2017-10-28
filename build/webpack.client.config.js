// jshint esversion:6,-W033
const base = require('./webpack.base.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = Object.assign({}, base, {
  plugins: base.plugins || []
})

// extracting CSS to a separate file is only necessary for the client
config.module.rules
  .filter(r => { return r.loader === 'vue-loader' })
  .forEach(r => { r.options.extractCSS = true })

config.plugins.push(
  new ExtractTextPlugin('assets/css/styles.css')
)

module.exports = config
