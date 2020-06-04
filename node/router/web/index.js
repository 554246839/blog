const artController = require('../../controller/articles')
const userController = require('../../controller/users')
const { result, getClientIP, dateFtt } = require('../../common')

const { verifyLoginToken } = require('../commonApi')

module.exports = {
  getUserInfo: async function getUserInfo (ctx) {
    await userController.getUserInfo().then(res => {
      ctx.response.body = result(0, res[0])

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  sendMessage: async function sendMessage (ctx) {

    let { nickname, email, content } = ctx.request.body

    await userController.sendMessage(nickname, email, content).then(res => {
      ctx.response.body = result(0)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  getAllArticles: async function getAllArticles (ctx) {
    let { pageNo, pageSize = 10 } = ctx.params
    await artController.getAllArticles(+pageNo, +pageSize).then(res => {

      res.data.forEach(e => {
        e.time = dateFtt("yyyy-MM-dd hh:mm", new Date(e.time));
      });
      ctx.response.body = result(0, res)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  getArticleDetail: async function getArticleDetail (ctx) {
    let id = ctx.query.id
    let ip = getClientIP(ctx.req)

    let isLogin = await verifyLoginToken(ctx)

    await artController.getArticleDetail(id, ip, isLogin).then(res => {

      ctx.response.body = result(0, res)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  getAsideShow: async function getAsideShow (ctx) {

    await artController.getAsideShow().then(res => {

      ctx.response.body = result(0, res)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  search: async function search (ctx) {
    let key = ctx.query.key
    let pageNo = ctx.query.pageNo
    let pageSize = ctx.query.pageSize || 10

    await artController.search(key, +pageNo, +pageSize).then(res => {

      ctx.response.body = result(0, res)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  tags: async function tags (ctx) {
    let id = ctx.params.id
    let pageNo = ctx.query.pageNo
    let pageSize = ctx.query.pageSize || 10

    await artController.getTags(id, +pageNo, +pageSize).then(res => {

      ctx.response.body = result(0, res)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  getCategories: async function (ctx) {
    await artController.getCategories().then(res => {

      ctx.response.body = result(0, res.data)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  },
  getCategoryArticles: async function (ctx) {
    let { pageNo, pageSize = 10 } = ctx.params
    let categoryId = ctx.query.id

    categoryId = categoryId === "other" ? "-1" : categoryId;

    await artController.getAllArticles(+pageNo, +pageSize, '', { categoryId }).then(res => {

      ctx.response.body = result(0, res)

    }).catch(err => {
      ctx.response.body = result(1)
    })
  }
}