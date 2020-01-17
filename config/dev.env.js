var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

var devEnv = merge(prodEnv, {
    NODE_ENV: '"development"',
})
console.log(devEnv)
module.exports = devEnv
