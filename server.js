// jshint esversion:6,-W033
const express = require('express')
const serialize = require('serialize-javascript')
const app = express()
const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const isProd = typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production'
let renderer

const indexHTML = (() => {
  return fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
})()

if (isProd) {
  // include all static assets
  app.use('/', express.static(path.resolve(__dirname, './dist')))
  const bundlePath = path.resolve(__dirname, './dist/server/main.js')
  renderer = createBundleRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else { // isDevelopment
  // include all static assets
  app.use('/dist', express.static(path.resolve(__dirname, './dist')))
  // here we are passing our specific onUpdate callback
  require('./build/dev-server')(app, bundle => {
    renderer = createBundleRenderer(bundle)
  })
}

app.get('*', (req, res) => {
  const context = { url: req.url }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return res.status(500).send('Server Error')
    }
    // console.log(html)
    html = indexHTML.replace('{{ APP }}', html)
    html = html.replace('{{ STATE }}',
      `<script>window.__INITIAL_STATE__=${serialize(context.initialState, { isJSON: true })}</script>`)
    res.write(html)
    res.end()
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
