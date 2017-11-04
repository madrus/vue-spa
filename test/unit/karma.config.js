// jshint esversion:6,-W033
var webpackConfig = require('../../build/webpack.test.config.js')
module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack']
    },
    client: {
      mocha: {
        timeout: 6000 // 6 seconds - upped from 2 seconds
      }
    },
    plugins: [
      'karma-mocha',
      'karma-sinon-chai',
      'karma-phantomjs-launcher',
      'karma-webpack'
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
