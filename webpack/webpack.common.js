const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { createLogger } = require('./utils.js');

/**
 * @type {import("webpack").Configuration }
 */
const common = {
  entry: {
    app: './src/index.tsx',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@component-styles': path.resolve(__dirname, '../src/assets/styles/component-style'),
    },
    symlinks: false,
  },
  module: {
    rules: [
      // https://github.com/TypeStrong/ts-loader
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // transpileOnly: true,
            },
          },
        ],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'static/fonts/[contenthash].[ext]',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'static/images/[contenthash].[ext]',
        },
      },
    ],
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   logger: { infrastructure: 'silent', issues: createLogger('forkts'), devServer: false },
    // }), // 31.57s
    new CopyPlugin({
      patterns: [{ from: 'public', to: 'static' }],
    }),
    // has warning for DEP_WEBPACK_COMPILATION_ASSETS
    new HtmlWebpackPlugin({
      title: 'index',
      template: 'src/index.html',
    }),
  ],
};
module.exports = common;
