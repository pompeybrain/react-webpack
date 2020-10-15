// @ts-nocheck
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
module.exports = merge(common, {
  target: 'web',
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
      '/nouse': {
        target: 'http://192.168.1.102',
        // changeOrigin: true,
        // pathRewrite: { '^': '' },
      },
    },
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
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
