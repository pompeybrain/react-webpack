/**
 * 读取build时的配置
 * 1. Command-line argument: --product bar
 */
const path = require('path');
const fs = require('fs');
const nconf = require('nconf');
const webpack = require('webpack');

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
    map[`/${serviceName}`] = ApiServers[serviceName];
  });
  map['/api'] = DefaultServer;
  // { target: DefaultServer };
  return map;
}

function createLogger(purpose) {
  const Logger = {
    log(message) {
      console.log(message);
    },
    info(message) {
      console.info(message);
    },
    error(message) {
      console.error(message);
    },
    warn(message) {
      console.warn(message);
    },
  };

  if (purpose === 'forkts') {
    //ignore forktsplugin info
    Logger.log = () => {};
    Logger.info = () => {};
  }
  return Logger;
}

module.exports = { getProductionConfig, addConfigToEnvironmentPlugin, generateProxyMap, createLogger };
