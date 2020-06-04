const Koa = require('koa')
const { PORT, TIMEOUT } = require('./config/default.js')
const router = require('./router')
const commonApi = require('./router/commonApi')
const { logger, accessLogger } = require('./logger')
const koaBody = require('koa-body') //解析上传文件的插件

const static = require('koa-static')

const app = new Koa()

app.use(static('public', {
  maxAge: 30 * 24 * 3600 * 1000 // 静态资源缓存时间 ms
}));

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 10000 * 1024 * 1024    // 设置上传文件大小最大限制，默认20M
  }
}))

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);

  ctx.set('Access-Control-Allow-Origin', '*');//*表示可以跨域任何域名都行 也可以填域名表示只接受某个域名
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,token');//可以支持的消息首部列表
  ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');//可以支持的提交方式
  ctx.set('Content-Type', 'application/json;charset=utf-8');//请求头中定义的类型

  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 200
  }

  try {
    commonApi.calcVisitors(ctx.req);
    await next();
  } catch (err) {
    console.log(err, 'errmessage')
    logger.error(err.message)
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      errcode: 500,
      msg: err.message
    }
    ctx.app.emit('error', err, ctx);
  }
})


app.use(accessLogger())

app.on('error', err => {
  logger.error(err)
})

app.use(router)

const server = app.listen(PORT, '0.0.0.0')
server.timeout = TIMEOUT

console.log(`listening on port ${PORT}`)