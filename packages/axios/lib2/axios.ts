/* eslint-disable @typescript-eslint/no-explicit-any */
import { mergeConfig, deepClone } from './utils';
import Interceptor from './interceptor';

interface AxiosHeader {
  [propName: string]: any;
}

interface AxiosRequest {
  url?: string;
  baseURL?: string;
  method?: string;
  headers?: AxiosHeader;
  timeout?: number;
  data?: any;
}

interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
}

export default class Axios {
  private option: {};
  private interceptors: { request: any; response: any };
  constructor(option: AxiosRequest) {
    this.option = deepClone(option);
    // 拦截器
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };
  }

  // 发送请求
  send(config: AxiosRequest | any): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = config.timeout;
      xhr.onload = () => {
        resolve({
          data: JSON.parse(xhr.responseText),
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.onerror = e => {
        reject(e);
      };

      xhr.ontimeout = e => {
        reject(e);
      };
      xhr.open(config.method, config.baseURL + config.url, true); // true表示异步执行操作
      // 添加header头
      for (const key in config.headers) {
        xhr.setRequestHeader(key, config.headers[key]);
      }
      console.log(config, '---config');
      xhr.send(config.data);
    });
  }

  request(config) {
    const userConfig = config;
    // mergeConfig(this.option, config);

    let promise = Promise.resolve(userConfig);
    // 请求拦截器，遍历 interceptors.request 里的处理函数
    const requestHandles = this.interceptors.request.handlers;
    requestHandles.forEach(handler => {
      promise = promise.then(handler.resolvedHandler, handler.rejectedHandler);
    });

    //数据请求
    promise = promise.then(this.send);

    //返回拦截器，遍历 interceptors.response 里的处理函数
    const responseHandlers = this.interceptors.response.handlers;
    responseHandlers.forEach(handler => {
      promise = promise.then(handler.resolvedHandler, handler.rejectedHandler);
    });

    return promise;
  }

  get(url: string, config: AxiosRequest) {
    config.method = 'get';
    config.url = url;
    return this.request(config);
  }

  post(url, config: AxiosRequest = {}) {
    config.method = 'post';
    config.url = url;
    return this.request(config);
  }
}
