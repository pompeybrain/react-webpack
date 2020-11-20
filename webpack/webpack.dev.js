// @ts-nocheck
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');

// Read the less file in as string
const themeLess = fs.readFileSync(path.resolve(__dirname, '../src/assets/styles/custom-antd.less'), 'utf8');
// Pass in file contents
const themeVars = lessToJs(themeLess, { resolveVariables: true, stripPrefix: true });

module.exports = merge(common, {
  target: 'web',
  output: {
    publicPath: '/', // 开发时使用 /static/
  },
  mode: 'development',
  devServer: {
    contentBase: './dist',
    open: 'Google Chrome',
    host: '0.0.0.0',
    public: 'localhost:3000',
    port: 3000,
    stats: 'errors-only',
    overlay: true,
    noInfo: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.11:8021',
        // changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
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
  plugins: [new webpack.HotModuleReplacementPlugin({})],
});
