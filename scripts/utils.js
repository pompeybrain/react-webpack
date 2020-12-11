/**
 * 读取build时的配置
 * 1. Command-line argument: --product bar
 */
const path = require('path');
const fs = require('fs');
const nconf = require('nconf');
const webpack = require('webpack');
const chalk = require('chalk');
const { networkInterfaces } = require('os');
const lessToJs = require('less-vars-to-js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @param product string
 */
function getProductionConfig(product) {
  const configFile = product ? `${product}.jsonc` : 'default.jsonc';
  // 确认config file是否存在
  const configFilePath = path.resolve(__dirname, '../config', configFile);
  try {
    fs.accessSync(configFilePath, fs.constants.R_OK);
  } catch (err) {
    throw err;
  }

  nconf.file({
    file: configFilePath,
    format: require('hjson'),
  });
  nconf.get('ReverseProxy');
  return key => {
    return nconf.get(key);
  };
}

/**
 * @param getConfig (key)=>value
 */
function addConfigToEnvironmentPlugin(getConfig) {
  return new webpack.EnvironmentPlugin({
    ServerBase: getConfig('ServerBase'),
    ReverseProxy: getConfig('ReverseProxy'),
    DefaultServer: getConfig('DefaultServer'),
    ApiServers: getConfig('ApiServers'),
  });
}

/**
 * 从 {service:url}生成 webpack-dev-server的proxyMap
 * @param ApiServers {{[server:string]:string}}
 * @param DefaultServer {string}
 * @return  {import('webpack-dev-server').ProxyConfigMap}
 */
function generateProxyMap(ApiServers, DefaultServer) {
  let services = Object.keys(ApiServers);
  /**
   * @type {import('webpack-dev-server').ProxyConfigMap}
   */
  let map = {};
  services.forEach(serviceName => {
    map[`/${serviceName}`] = { target: ApiServers[serviceName], logLevel: 'silent' };
  });
  map['/api'] = { target: DefaultServer, logLevel: 'silent' };
  return map;
}
/**
 * copied from create-react-app/react-scripts
 * clear console thoroughly
 */
function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

const DevLogger = {
  log(message, clear = true) {
    if (clear) clearConsole();
    if (message) console.log(chalk.gray(message));
  },
  info(message, clear = true) {
    if (clear) clearConsole();
    if (message) console.log(chalk.cyan(message));
  },
  error(message, clear = true) {
    if (clear) clearConsole();
    if (message) console.log(chalk.red(message));
  },
  warn(message, clear = true) {
    if (clear) clearConsole();
    if (message) console.log(chalk.yellow(message));
  },
};

function createLogger(purpose) {
  const Logger = {
    log(message) {
      DevLogger.log(message, true);
    },
    info(message) {
      DevLogger.log(message, true);
    },
    error(message) {
      DevLogger.log(message, true);
    },
    warn(message) {
      DevLogger.log(message, true);
    },
  };

  if (purpose === 'forkts') {
    //ignore forktsplugin info
    Logger.log = () => {};
    Logger.info = () => {};
  }
  return Logger;
}

function getLocalIp() {
  let localIpInfo = Object.values(networkInterfaces())
    .flatMap(infos => {
      return infos?.filter(i => i.family === 'IPv4');
    })
    .filter(info => !info.internal)[0];
  return localIpInfo.address;
}

function getLessVars(theme) {
  const varsPath = path.resolve(__dirname, '../src/assets/styles/themes/', `${theme}.less`);
  let themeVars = {};
  try {
    const themeLess = fs.readFileSync(varsPath, 'utf8');
    themeVars = lessToJs(themeLess, { resolveVariables: true, stripPrefix: true });
  } catch (error) {
    DevLogger.error(error);
  }
  return themeVars;
}

function getStyleModuleConfig(lessVars, module, production = false) {
  const testReg = module ? /module\.less$/ : /\.less$/;
  /**
   * @type {import('webpack').RuleSetRule}
   */
  const config = {
    test: testReg,
    use: [],
  };

  if (Array.isArray(config.use)) {
    if (production) {
      config.use.push(MiniCssExtractPlugin.loader);
    } else {
      config.use.push('style-loader');
    }
  }
  /**
   * @type {import('webpack').RuleSetUse}
   */
  let cssLoader = 'css-loader';
  if (module) {
    // less file in src dir use css module
    config.include = /src/;
    cssLoader = {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: {
          localIdentName: '[local]--[hash:base64:5]',
        },
      },
    };
  }
  if (Array.isArray(config.use)) {
    config.use.push(cssLoader);
    config.use.push({
      loader: 'less-loader',
      options: {
        sourceMap: true,
        lessOptions: {
          modifyVars: lessVars,
          javascriptEnabled: true,
        },
      },
    });
  }
  return config;
}

module.exports = {
  getLessVars,
  getProductionConfig,
  addConfigToEnvironmentPlugin,
  generateProxyMap,
  DevLogger,
  createLogger,
  getLocalIp,
  clearConsole,
  getStyleModuleConfig,
};
