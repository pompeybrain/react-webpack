// request.ts
/**
 * 使用umi-request封装的请求方法
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 * @packageDocumentation
 */
import { extend, RequestOptionsInit, ResponseError } from 'umi-request';
import { notification, Modal } from 'antd';
import { getApiUrl } from '@/services';
import { getToken } from '@/services/auth';

/**
 * 后端接口返回的数据模型
 */
interface ServerResponse {
  /**
   * 错误码
   */
  code: number;
  /**
   * 返回的数据
   */
  data: any;
  /**
   * 报错信息
   */
  message: string;
  /**
   * 是否成功
   */
  success: boolean;
}

class ApiResponseError extends Error {
  response: any;
  constructor(message: string, request: any, response: any) {
    super(message);
    // this.message = message;
    this.response = response;
    this.request = request;
    this.type = 'error';
    // this.stack = process.e
  }
  name: string = 'ApiResponseError';
  // message: string;
  stack?: string | undefined;
  data: any;
  request: { url: string; options: RequestOptionsInit };
  type: string;
}

/**
 * HTTP status code message
 */
const HttpCodeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户未登录，请重新登录',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const ServerCodeMessage: { [key: number]: string } = {
  998: '未登录，请登录网页',
  999: '登录超时，请重新登录',
};

/**
 * 请求的出错处理
 */
const errorHandler = (error: ResponseError | ServerResponse) => {
  const { response } = <ResponseError>error;
  if (response && response && response.status) {
    const errorText = HttpCodeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else {
    // 通用处理部分后台给出的错误code
    const { code } = <ServerResponse>error;
    const errorText = code && ServerCodeMessage[code];
    if (errorText) {
      if (code === 998 || code === 999) {
        const reloginModal = Modal.warning({
          title: '未登录',
          content: errorText,
          okText: '去登录',
          onOk() {
            window.location.href = '/login';
            reloginModal.destroy();
          },
        });
      } else {
        notification.error({
          description: errorText,
          message: '请求错误',
        });
      }
    } else {
      //没有对应状态码时，抛出异常给后续处理
      throw error;
    }
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler: errorHandler, // HTTP请求的错误处理
});

// FIXME: can't goto errorHandler
// maybe should use extends ResponseError
request.use(async (ctx, next) => {
  ctx.req.url = getApiUrl(ctx.req.url);
  let accessToken = getToken();
  if (accessToken) {
    // ctx.req.options.headers = { ...ctx.req.options.headers, Authorization: accessToken };
    ctx.req.options.headers = { ...ctx.req.options.headers, Token: accessToken };
  }
  // accessToken && ctx.req.options.headers ['Authorization'] = accessToken;
  await next();
  let data: ServerResponse = ctx.res;
  // 刷新token时refreshToken失效时不走errHandler

  if (!data.success) {
    // ctx.req.url.indexOf('auth/update') === -1
    // throw new Error(data.message);
    return Promise.reject(data);
    // throw new ApiResponseError(data.message || '', ctx.req, ctx.res);
  } else {
    return (ctx.res = data.data);
  }
});

/**
 * http get request
 */
async function get(url: string): Promise<any> {
  return request(url, {
  });
}

/**
 * http post request with content-type application/json
 */
function post(url: string, data: any): Promise<any> {
  return request(url, {
    method: 'post',
    requestType: 'json',
    data: data,
  });
}

/**
 * post form with content-type application/x-www-form-urlencoded
 */
function postEncodedForm(url: string, data: { [key: string]: any }): Promise<any> {
  return request(url, {
    requestType: 'form',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  });
}

/**
 * post form with content-type multi-part/form-data
 */
function postFormData(url: string, data: { [key: string]: any }) {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return request(url, {
    method: 'post',
    data: formData,
  });
}

export { request, get, post, postFormData, postEncodedForm, ServerResponse };
