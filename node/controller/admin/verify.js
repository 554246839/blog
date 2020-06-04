// 数据层操作
const db = require('../../mdb')
const Redis = require('../../redis')
// const ObjectId = require('mongodb').ObjectId

module.exports = {
  verifyCode (code) {
    return new Promise((resolve, reject) => {
      db.find('verify', { verify_code: code }).then(res => {
        if (res.length) {
          resolve(res)
        } else {
          reject(res)
        }
      }, err => {
        reject(err)
      })
    })
  },
  setToken (token, info) {
    return new Promise((resolve, reject) => {
      try {
        Redis.pipeline()
          .set(token, JSON.stringify(info))
          .expire(token, 60 * 60 * 12)
          .exec((err, results) => {
            if (!err && results[0][1] === 'OK') {
              resolve(true)
            } else {
              reject(err)
            }
          })
      } catch (err) {
        reject(err)
      }
    })
  },
  verifyToken (token) {
    return new Promise((resolve, reject) => {
      try {
        resolve(Redis.get(token))
      } catch (err) {
        reject(err)
      }
    })
  },
  delToken (token) {
    return new Promise((resolve, reject) => {
      try {
        resolve(Redis.del(token))
      } catch (err) {
        reject(err)
      }
    })
  }
}