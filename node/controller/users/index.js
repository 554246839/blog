const mdb = require('../../mdb')
const Redis = require('../../redis')
const sendEmailer = require('../../common/sendEmail')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  getUserInfo (isEdit) {
    return new Promise((resolve, reject) => {
      mdb.find('userinfo').then(res => {
        let data = {}
        if (res.length) {
          data = res[0]
          if (isEdit !== 'true') {
            data.self_intro && (data.self_intro = data.self_intro
              .replace(/\r\n/g, "<br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\s/g, " "))

            data.work_experience && data.work_experience.forEach(v => {
              v.responsibility = v.responsibility
                .replace(/\r\n/g, "<br/>")
                .replace(/\n/g, "<br/>")
                .replace(/\s/g, " ");
            })

            data.project && data.project.forEach(v => {
              v.projectContent = v.projectContent
                .replace(/\r\n/g, "<br/>")
                .replace(/\n/g, "<br/>")
                .replace(/\s/g, " ");
            })
          }
        }

        resolve(data)
      }, err => {
        reject(err)
      })
    })
  },
  updateUserInfo (id, info) {
    return new Promise((resolve, reject) => {
      mdb.updateOne('userinfo', { _id: ObjectId(id) }, info).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  },

  // 统计访客数
  calcVisitor (ip, url) {
    ip = ip.replace(/\./g, '-')
    Redis.smembers('visitors').then(res => {
      if (!res || res.indexOf(ip) === -1) {
        let now = new Date()
        let day = now.getDate()
        day = day < 10 ? '0' + day : day
        let date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + day

        let minutes = now.getMinutes()
        minutes = minutes < 10 ? '0' + minutes : minutes
        let time = now.getHours() + ':' + minutes

        Redis.pipeline()
          .sadd('visitors', ip)
          .expire('visitors', ~~((24 * 3600 * 1000 - new Date() + new Date().setHours(0, 0, 0, 0)) / 1000)) // 时间单位为秒
          .exec();

        mdb.connect().then(async db => {
          let visitorsColl = db.collection('visitors')

          visitorsColl.find({ date }).toArray((err, res) => {
            if (!err) {
              if (res.length) {
                let _data = res[0]

                if (!_data.visitors[ip]) {
                  _data.visitors[ip] = { time, url }
                  visitorsColl.updateOne({ _id: ObjectId(_data._id) }, {
                    $set: {
                      visitors: _data.visitors,
                      totals: _data.totals + 1
                    }
                  }, async (err, res) => {
                    if (!err) {
                      return
                    }
                  })
                }
              } else {
                let visitors = {}
                visitors[ip] = { time, url }
                visitorsColl.insertOne({
                  date,
                  visitors,
                  totals: 1
                }, (err, res) => {
                  if (!err) {
                    return
                  }
                })
              }
            }
          })
        })
      }
    })
  },

  // 获取访客数据
  getVisitors (pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let visitorsColl = db.collection('visitors')

        let count = await visitorsColl.find().count()
        let total = Math.ceil(count / pageSize)
        visitorsColl.find().sort({ _id: -1 }).skip((pageNo - 1) * pageSize).limit(pageSize).toArray((err, res) => {
          if (!err) {
            resolve({
              count,
              total,
              pageNo,
              pageSize,
              data: res
            })
            return
          }
          reject(err)
        })
      })
    })
  },

  // 邮件发送
  sendEmail (opts) {
    return new Promise((resolve, reject) => {
      sendEmailer(opts).then(res => {
        mdb.connect().then(async db => {
          let messageColl = db.collection('message')

          messageColl.updateOne({ _id: ObjectId(opts._id) }, {
            $set: {
              reply: opts.html,
              replyTime: new Date().toISOString()
            }
          }, async (err, res) => {
            if (!err) {
              resolve(res)
              return
            }
            reject(err)
          })
        })
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 留言
  sendMessage (nickname, email, content) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let messageColl = db.collection('message')
        messageColl.insertOne({
          nickname,
          email,
          content,
          date: new Date().toISOString(),
          reply: '',
          replyTime: ''
        }, (err, res) => {
          if (err) {
            reject(err)
            return
          }
          resolve(res)
        })
      })
    })
  },

  // 获取留言数据
  getMessage (pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let messageColl = db.collection('message')

        let count = await messageColl.find().count()
        let total = Math.ceil(count / pageSize)
        messageColl.find().sort({ _id: -1 }).skip((pageNo - 1) * pageSize).limit(pageSize).toArray((err, res) => {
          if (err) {
            reject(err)
            return
          }
          resolve({
            count,
            total,
            pageNo,
            pageSize,
            data: res
          })
        })
      })
    })
  }
}