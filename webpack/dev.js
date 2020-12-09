/**
 * dev-server script
 * don't use webpack serve --config webpack/webpack.dev.js because it can't manage console output
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('./webpack.dev.js');
const devServerOptions = devConfig.devServer || {};

const originalInfo = console.info;
/**
 * (err, stats) => {
      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    }
 */
try {
  //prohibit WebpackDevServer log
  // console.info = () => {};
  console.log('Starting the development server...');
  const compiler = webpack(devConfig);

  compiler.hooks.done.tap('CustomMyDev', stats => {
    if (!stats.hasErrors() && !stats.hasWarnings()) {
      console.log('Building Success!');
    }
  });

  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(devServerOptions.port || '3000', err => {
    if (!err) {
      // console.info = originalInfo;
      console.log('Building Success!');
    } else {
      console.error(err);
    }
  });
} catch (error) {
  console.error(error);
  process.exit(-1);
}
