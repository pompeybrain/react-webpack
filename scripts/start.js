/**
 * dev-server script
 * don't use webpack serve --config webpack/webpack.dev.js because it can't manage console output
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('./webpack/development.js');
const devServerOptions = devConfig.devServer || {};
const { DevLogger, getLocalIp, clearConsole } = require('./utils.js');
const OriginalInfo = console.info;
const LocalIp = getLocalIp();
const chalk = require('chalk');
const logUpdate = require('log-update');
const projectName = 'your project';

let compilingTimer;

function infoSuccess() {
  clearInterval(compilingTimer);
  clearConsole();
  console.log(chalk.green('Compiled successfully!\n'));
  console.log(`You can now view ${projectName} in the browser.`);
  console.log(
    `
    ${chalk.red('Local')}:    http://localhost:${devServerOptions.port}
    ${chalk.red('Network')}:  http://${LocalIp}:${devServerOptions.port}
  
  `
  );
}

function outputWarnings(warnings) {
  clearInterval(compilingTimer);
  // console.log(warnings);
}

/**
 * @param errors {import("./types").WebpackCompileError[]}
 */
function outputErrors(errors) {
  clearInterval(compilingTimer);
  clearConsole();
  console.log(chalk.redBright('Compile Failed'));
  errors.forEach(compilerError => {
    console.log(chalk.red('ERROR in ' + compilerError.moduleName));
    console.log(compilerError.message);
  });
}

function infoCompiling() {
  clearConsole();
  // 需要动画更新
  const frames = ['', '.', '..', '...'];
  let i = 0;

  compilingTimer = global.setInterval(() => {
    const frame = frames[(i = ++i % frames.length)];
    logUpdate(chalk.cyan(`Compiling${frame}`));
  }, 500);
}

try {
  //prohibit WebpackDevServer log
  console.info = () => {};
  devServerOptions.quiet = true;

  DevLogger.info('Starting the development server...');
  const compiler = webpack(devConfig);

  compiler.hooks.compile.tap('CustomMyDev', () => {
    infoCompiling();
  });

  compiler.hooks.done.tap('CustomMyDev', stats => {
    if (!stats.hasErrors() && !stats.hasWarnings()) {
      infoSuccess();
    } else {
      const info = stats.toJson();

      if (stats.hasErrors()) {
        outputErrors(info.errors);
      }

      if (stats.hasWarnings()) {
        outputWarnings(info.warnings);
      }
    }
  });

  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(devServerOptions.port || 3000, err => {
    if (!err) {
      // console.info = OriginalInfo;
      infoSuccess();
    } else {
      DevLogger.error(err);
    }
  });
} catch (error) {
  DevLogger.error(error);
  process.exit(-1);
}
