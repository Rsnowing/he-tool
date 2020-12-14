import { mergeConfig, deepClone } from './utils.js';
import Interceptor from './interceptor.js';
class Axios {
  constructor(options) {
    this.default = deepClone(options);
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };
  }

  request(config) {
    const userConfig = mergeConfig(config, this.default);
    let promise = Promise.resolve(userConfig);
    // 请求拦截器，遍历 interceptors.request 里的处理函数
    const requestHandles = this.interceptors.request.handlers;
    requestHandles.forEach(handler => {
      promise = promise.then(handler.resolvedHandler, handler.rejectedHandler);
    });

    //数据请求
    promise = promise.then(res => this.send(res));

    //返回拦截器，遍历 interceptors.response 里的处理函数
    const responseHandlers = this.interceptors.response.handlers;
    responseHandlers.forEach(handler => {
      promise = promise.then(handler.resolvedHandler, handler.rejectedHandler);
    });

    return promise;
  }

  send(config) {
    console.log(config, '-----config');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = config.timeout || 100000;
      xhr.onload = () => {
        console.log(xhr.responseText);
        resolve({
          data: JSON.parse(xhr.responseText),
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.error = e => {
        reject(e);
      };

      xhr.timeout = e => {
        reject(e);
      };

      xhr.open(config.method, config.baseURL + config.url, true); // true表示异步执行操作
      // 添加header头
      for (const key in config.headers) {
        xhr.setRequestHeader(key, config.headers[key]);
      }
      xhr.send(JSON.stringify(config.data));
    });
  }

  get(url, config) {
    config.method = 'get';
    config.url = url;
    return this.request(config);
  }

  post(url, data, config = {}) {
    config.method = 'post';
    config.url = url;
    data && (config.data = data);
    return this.request(config);
  }
}

export default Axios;
