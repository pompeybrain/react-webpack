const { merge } = require('webpack-merge');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');
const { getProductionConfig, addConfigToEnvironmentPlugin, generateProxyMap } = require('./utils.js');

/**
 * @type {import("webpack").Configuration }
 */
const common = require('./webpack.common');

// Read the less file in as string
const themeLess = fs.readFileSync(path.resolve(__dirname, '../src/assets/styles/custom-antd-theme.less'), 'utf8');
// Pass in file contents
const themeVars = lessToJs(themeLess, { resolveVariables: true, stripPrefix: true });

const getConfig = getProductionConfig('development');

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
    publicPath: '/', // 开发时使用 /static/
  },
  mode: 'development',
  devServer: {
    hot: true,
    contentBase: './dist',
    open: false,
    // open: 'Google Chrome',
    host: '0.0.0.0',
    public: 'localhost:3000',
    port: 3000,
    stats: 'errors-only',
    overlay: true,
    historyApiFallback: true,
    proxy: proxyMap,
    quiet: true,
    clientLogLevel: 'none',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /module\.less$/,
        include: /src/, // less file in pages dir use css module
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                modifyVars: themeVars,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                modifyVars: themeVars,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    addConfigToEnvironmentPlugin(getConfig),
  ],
});
