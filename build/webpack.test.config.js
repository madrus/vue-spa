// jshint esversion:6,-W033
const base = require('./webpack.base.config')

let config = Object.assign({}, base, {})

// no need for app entry during tests
delete config.entry

module.exports = config
