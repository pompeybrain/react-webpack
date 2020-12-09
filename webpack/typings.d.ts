import * as webpack from 'webpack';
declare module 'webpack' {
  interface Configuration {
    /**
     * Can be used to configure the behaviour of webpack-dev-server when
     * the webpack config is passed to webpack-dev-server CLI.
     */
    devServer?: WebpackDevServer.Configuration;
  }
}