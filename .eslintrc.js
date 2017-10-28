module.exports = {
  // apply the rules to all projects
  root: true,
  // we will be using ECMA script modules
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint .vue files
  plugins: [
    'html'
  ]
}
