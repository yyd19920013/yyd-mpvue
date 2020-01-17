const CONFIG_ENV = process.env.CONFIG_ENV

module.exports = {
    NODE_ENV: '"production"',
    CONFIG_ENV: '"' + CONFIG_ENV + '"',
}
