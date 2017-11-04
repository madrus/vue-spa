// jshint esversion:6,-W033
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
