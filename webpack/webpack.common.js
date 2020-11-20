// @ts-nocheck
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      // https://github.com/TypeStrong/ts-loader
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
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
    new CopyPlugin({
      patterns: [{ from: 'public', to: 'static' }],
    }),
    new WebpackBar(),
    // has warning for DEP_WEBPACK_COMPILATION_ASSETS
    new HtmlWebpackPlugin({
      title: 'index',
      template: 'src/index.html',
    }),
  ],
};
