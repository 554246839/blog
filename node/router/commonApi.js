const visitorController = require('../controller/users')
const adminController = require('../controller/admin/verify')
const { getClientIP } = require('../common')

module.exports = {
  calcVisitors: (req) => {
    let ip = getClientIP(req)
    if (!req.headers['user-agent']) return

    visitorController.calcVisitor(ip, req.url)
  },
  verifyLoginToken: (ctx) => {
    return new Promise(async (resolve, reject) => {
      let token = ctx.request.header.token
      await adminController.verifyToken(token).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}