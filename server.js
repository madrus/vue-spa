// jshint esversion:6,-W033
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
let renderer

const indexHTML = (() => {
  return fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
})()

// include all static assets
app.use('/dist', express.static(path.resolve(__dirname, './dist')))

// here we are passing our specific onUpdate callback
require('./build/dev-server')(app, bundle => {
  renderer = createBundleRenderer(bundle)
})

app.get('*', (req, res) => {
  renderer.renderToString({ url: req.url }, (err, html) => {
    if (err) {
      console.log(err) // temp: don't use in production!
      return res.status(500).send('Server Error')
    }
    console.log(html)
    res.write(indexHTML)
    res.end()
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
