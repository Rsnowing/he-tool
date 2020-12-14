const Koa = require('koa');
const KoaRouter = require('koa-router');

//app 实例
const app = new Koa();
//router 实例
const router = new KoaRouter();

//请求中间件，解决跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'content-type,token,accept');
  ctx.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  ctx.set('Content-Type', 'application/json');
  ctx.set('Access-Control-Max-Age', 10);
  //处理 options
  if (ctx.request.method.toLowerCase() === 'options') {
    ctx.response.status = 200;
    ctx.body = '';
  } else await next();
});

//接口测试地址
router.get('/', async ctx => {
  ctx.body = {
    data: 'Hello World'
  };
});

router.get('/user/info', async ctx => {
  ctx.body = {
    name: 'Chris',
    msg: 'Hello World'
  };
});

router.post('/sign', async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.body = {
    errorCode: 0,
    errorMsg: '',
    data: {
      name: '1'
    }
  };
});

app.use(router.routes());

//启动服务
app.listen(3000, function () {
  console.log('app is running ~');
});
