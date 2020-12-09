const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common');
const webpack = require('webpack');
const { getProductionConfig, addConfigToEnvironmentPlugin, getStyleModuleConfig, getLessVars } = require('../utils.js');

module.exports = env => {
  /**
   * eg:
   * yarn build --env product=cloud
   * get product argv
   */
  const getConfig = getProductionConfig(env && env.product);

  const themeVars = getLessVars(getConfig('Theme') || 'default');

  const prodConfig = merge(common, {
    target: 'web',
    mode: 'production',
    output: {
      publicPath: getConfig('ASSET_PATH') || '/',
      path: path.resolve(__dirname, '../dist'),
      filename: 'static/js/[name]_[contenthash].js',
      chunkFilename: 'static/js/[name]_chunk_[contenthash].js',
    },
    optimization: {
      runtimeChunk: 'single',
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {},
      },
    },
    module: {
      rules: [getStyleModuleConfig(themeVars, true, true), getStyleModuleConfig(themeVars, false, true)],
    },
    plugins: [
      addConfigToEnvironmentPlugin(getConfig),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
      }),
      new webpack.ProgressPlugin({}),
    ],
    stats: {
      children: false,
      entrypoints: false,
      modules: false,
    },
  });

  return prodConfig;
};
