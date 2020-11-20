// @ts-nocheck
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

// Read the less file in as string
const themeLess = fs.readFileSync(path.resolve(__dirname, '../src/assets/styles/custom-antd-theme.less'), 'utf8');
// Pass in file contents
const themeVars = lessToJs(themeLess, { resolveVariables: true, stripPrefix: true });

const prodConfig = merge(common, {
  target: 'web',
  mode: 'production',
  output: {
    publicPath: '/', // 由于是单页面，最好是决定地址而不是相对地址， 根地址时可以写作 /，部署在文件夹内，要加上文件夹前缀
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
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
