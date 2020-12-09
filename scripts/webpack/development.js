const { merge } = require('webpack-merge');
const path = require('path');
const {
  getProductionConfig,
  addConfigToEnvironmentPlugin,
  generateProxyMap,
  getStyleModuleConfig,
  getLessVars,
} = require('../utils.js');

/**
 * @type {import("webpack").Configuration }
 */
const common = require('./common');

const getConfig = getProductionConfig('development');
const themeVars = getLessVars(getConfig('Theme') || 'default');

/**
 * @type boolean
 */
const ReverseProxy = getConfig('ReverseProxy');
const DefaultServer = getConfig('DefaultServer');
const ApiServers = getConfig('ApiServers');

/**
 * @type {import('webpack-dev-server').ProxyConfigMap}
 */
let proxyMap;

if (ReverseProxy) {
  proxyMap = generateProxyMap(ApiServers, DefaultServer);
}

module.exports = merge(common, {
  target: 'web',
  output: {
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name]_chunk.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  mode: 'development',
  devServer: {
    hot: true,
    contentBase: './dist',
    open: 'Google Chrome',
    host: '0.0.0.0',
    public: 'localhost:3002',
    port: 3002,
    stats: 'errors-only',
    overlay: true,
    historyApiFallback: true,
    proxy: proxyMap,
    // quiet: true,
    clientLogLevel: 'none',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [getStyleModuleConfig(themeVars, true), getStyleModuleConfig(themeVars, false)],
  },

  plugins: [addConfigToEnvironmentPlugin(getConfig)],
});
