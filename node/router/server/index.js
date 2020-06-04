const articleController = require('../../controller/articles')
const adminController = require('../../controller/admin/verify')
const userController = require('../../controller/users')

const { result, dateFtt, getToken } = require('../../common')
const upload = require('../../common/upload')
const { verifyLoginToken } = require('../commonApi')

module.exports = {
  getAllArticles: async function getAllArticles (ctx) {
    await verifyLoginToken(ctx).then(async results => {

      let { pageNo, pageSize = 10 } = ctx.params

      await articleController.getAllArticles(+pageNo, +pageSize, 'isAdmin').then(res => {

        ctx.response.body = result(0, res)

      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  getArticleDetail: async function getArticleDetail (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let id = ctx.query.id

      await articleController.getArticleDetail(id).then(res => {

        ctx.response.body = result(0, res)

      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  updateArticleInfo: async function updateArticleInfo (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let data = ctx.request.body
      let _id = data._id
      delete data._id

      await articleController.updateArticleInfo(_id, data).then(res => {
        if (res) {
          let tags = res.tags ? res.tags.split(',') : []
          articleController.updateTags(tags, res._id, res.isPublic)
          articleController.updateCategory(data.categoryId, res._id)

          ctx.response.body = result(0, res)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  issueArticle: async function issueArticle (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let data = ctx.request.body

      await articleController.issueArticle(data).then(res => {
        if (res) {
          let data = res.ops[0]
          if (data.tags && data.isPublic) {
            articleController.updateTags(data.tags.split(','), data._id, data.isPublic)
          }
          articleController.updateCategory(data.categoryId, data._id)

          ctx.response.body = result(0, data)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  deleteArticle: async function deleteArticle (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let data = ctx.request.body

      await articleController.deleteArticle(data.id).then(({ categoryId, tags, isPublic }) => {
        if (tags && isPublic) {
          articleController.updateTags(tags.split(','), data.id, false)
        }
        articleController.updateCategory(categoryId, data.id, true)

        ctx.response.body = result(0)
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  upload: async function uploadImg (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let res = upload(ctx.request.files)

      ctx.response.body = result(0, {
        url: res.remotefilePath,
        size: res.size
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  getUserInfo: async function getUserInfo (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let isEdit = ctx.request.query.edit
      await userController.getUserInfo(isEdit).then(res => {

        ctx.response.body = result(0, res)

      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  updateUserInfo: async function updateUserInfo (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let codeInfo = JSON.parse(results)
      let data = ctx.request.body
      delete data._id

      await userController.updateUserInfo(codeInfo[0].userId, data).then(res => {
        if (res) {
          ctx.response.body = result(0)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  getVisitors: async function getVisitors (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let { pageNo, pageSize = 10 } = ctx.params

      await userController.getVisitors(+pageNo, +pageSize).then(res => {
        if (res) {
          ctx.response.body = result(0, res)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  replyMessage: async function replyMessage (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let data = ctx.request.body

      await userController.sendEmail(data).then(res => {
        if (res) {
          ctx.response.body = result(0)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  getMessage: async function getMessage (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let { pageNo, pageSize = 10 } = ctx.params

      await userController.getMessage(+pageNo, +pageSize).then(res => {
        if (res) {
          res.data.forEach(e => {
            e.date = dateFtt("yyyy-MM-dd hh:mm", new Date(e.date));
            e.replyTime && (e.replyTime = dateFtt("yyyy-MM-dd hh:mm", new Date(e.replyTime)));
          });
          ctx.response.body = result(0, res)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  verifyCode: async function verifyCode (ctx) {
    let data = ctx.request.body

    await adminController.verifyCode(data.code).then(async res => {
      let token = getToken({ code: res[0].verify_code })

      await adminController.setToken(token, res).then(rep => {
        if (rep) {
          ctx.response.body = result(0, {
            token
          })
        } else {
          ctx.response.body = result(1)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  logout: async function logout (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let token = ctx.request.header.token
      await adminController.delToken(token).then(data => {
        if (data) {
          ctx.response.body = result(0)
        }
      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  verifyToken: async function verifyToken (ctx) {
    let token = ctx.request.header.token

    await adminController.verifyToken(token).then(res => {
      if (res) {
        let data = JSON.parse(res)[0]
        data.verify_code = '********'
        ctx.response.body = result(0, data)
      } else {
        ctx.response.body = result(9999)
      }
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  },
  addCategory: async function addCategory (ctx) {
    await verifyLoginToken(ctx).then(async results => {
      let name = ctx.request.body.name
      await articleController.addCategory(name).then(res => {

        ctx.response.body = result(0)

      }).catch(err => {
        ctx.response.body = result(1)
      })
    }).catch(err => {
      ctx.response.body = result(9999)
    })
  }
}