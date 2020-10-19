// @ts-nocheck
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const prodConfig = merge(common, {
  target: 'web',
  mode: 'production',
  output: {
    publicPath: 'http://server', // 由于是单页面，最好是决定地址而不是相对地址， 根地址时可以写作 /，带有文件夹，要加上文件夹前缀
    // refer to https://webpack.js.org/configuration/output/#outputpublicpath
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {},
    },
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
          // 'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    }),
  ],
  stats: {
    children: false,
    entrypoints: false,
    modules: false,
  },
});
// use npm run build --analyzer option to use this plugin
if (process.env.npm_config_argv.indexOf('analyzer') !== -1) {
  prodConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = prodConfig;
