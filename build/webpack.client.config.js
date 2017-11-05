// jshint esversion:6,-W033
const base = require('./webpack.base.config')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = Object.assign({}, base, {
  plugins: (base.plugins || []).concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'assets/js/[name].js'
    })
  ])
})

// extracting CSS to a separate file is only necessary for the client
config.module.rules
  .filter(r => { return r.loader === 'vue-loader' })
  .forEach(r => { r.options.extractCSS = true })

config.plugins.push(
  new ExtractTextPlugin('assets/css/styles.css')
)

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = config
