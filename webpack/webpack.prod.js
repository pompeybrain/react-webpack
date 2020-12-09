const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const { getProductionConfig, addConfigToEnvironmentPlugin } = require('./utils.js');

// Read the less file in as string
const themeLess = fs.readFileSync(path.resolve(__dirname, '../src/assets/styles/custom-antd-theme.less'), 'utf8');
// Pass in file contents
const themeVars = lessToJs(themeLess, { resolveVariables: true, stripPrefix: true });

module.exports = env => {
  /**
   * eg:
   * yarn build --env product=cloud
   * get product argv
   */
  const getConfig = getProductionConfig(env.product);

  const prodConfig = merge(common, {
    target: 'web',
    mode: 'production',
    output: {
      /**
       * 在入口文件中 赋值 __webpack_public_path__ 来确定
       由于是单页面，最好是绝对地址而不是相对地址， 根地址时可以写作 /，部署在文件夹内，要加上文件夹前缀
       refer to https://webpack.js.org/configuration/output/#outputpublicpath
       */
      publicPath: getConfig('ASSET_PATH') || '/',
      path: path.resolve(__dirname, '../dist'),
      filename: 'static/js/[name][contenthash].js',
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
      rules: [
        {
          test: /module\.less$/,
          include: /src/, // less file in pages dir use css module
          use: [
            MiniCssExtractPlugin.loader,
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
      addConfigToEnvironmentPlugin(getConfig),
      // @ts-ignore TODO: upgrade this plugin when it new release to support webpack5
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
  // use npm run build --analyzer option to use this plugin
  if (process.env.npm_config_argv.indexOf('analyzer') !== -1) {
    prodConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return prodConfig;
};
