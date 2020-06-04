const Redis = require('../redis')

const redisFun = {
  async set(key, value) {
    return new Promise((resolve, reject) => {
      Redis.set(key, value).then(res => {
        resolve()
      }).catch(err => {
        reject()
      })
    })
  },
  async get(key) {
    return new Promise((resolve, reject) => {
      Redis.get(key).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = redisFun