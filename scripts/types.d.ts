import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
declare module 'webpack' {
  interface Configuration {
    /**
     * Can be used to configure the behaviour of webpack-dev-server when
     * the webpack config is passed to webpack-dev-server CLI.
     */
    devServer?: WebpackDevServer.Configuration;
    aa?: string;
  }
}

// copyed from https://webpack.js.org/api/stats/#errors-and-warnings
interface WebpackCompileError {
  moduleIdentifier: string;
  moduleName: string;
  loc: string;
  message: string;
  moduleId: number;
  moduleTrace: {
    originIdentifier: string;
    originName: string;
    moduleIdentifier: string;
    moduleName: string;
    dependencies: {
      loc: string;
    }[];
    originId: number;
    moduleId: number;
  }[];
  details: string;
  stack: string;
}

// 配置文件字段定义
interface ProjectConfig {
  // 生产环境服务器前端部署时文件夹，对应url的前缀，默认为服务器根路径 (React-Router的BrowserHistory所需的basename)，需要以 / 结尾
  ServerBase: string;
  // 项目的主题 默认default
  Theme: string;
  // 静态资源的地址，若使用CDN (webpack output.publicPath)，需要以 / 结尾
  ASSET_PATH: string;
  // 开发时可由webpack-dev-server，反向代理到具体服务，因此需要配置为true，
  // 关闭反向代理，需要前端判断并拼接具体服务器地址，同时后端服务要处理跨域问题
  // 开启反向代理，只需要拼接default地址，由default所指地址实现反向代理（一般是nginx或后端gateway）
  ReverseProxy: boolean;
  DefaultServer: string;
  //各个服务的Server地址，用于接口请求地址，需要以http或https开头
  ApiServers: { [service: string]: string };
}
