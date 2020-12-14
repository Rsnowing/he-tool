import axios from './index.js';
// console.log(axios, 1222);
axios.default.baseURL = 'http://127.0.0.1:3000';

axios.interceptors.request.use(config => {
  console.log('请求配置信息：', config);
  return config;
});
axios.interceptors.response.use(res => {
  console.log('返回', res);
  return res;
});

// axios
//   .get('/user/info', {
//     headers: {
//       token: '323232'
//     }
//   })
//   .then(res => {
//     console.log(res);
//   });

axios
  .post(
    '/sign',
    {
      name: 'koa'
    },
    {
      'content-type': '2222'
    }
  )
  .then(res => {
    console.log(res, 'post');
  });
