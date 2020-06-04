const MongoClient = require('mongodb').MongoClient

const { MONGO } = require('../config/default')

let url = 'mongodb://' + MONGO.HOST + ':' + MONGO.PORT + '/'

if (MONGO.USERNAME && MONGO.PASSWORD) {
  url = 'mongodb://' + MONGO.USERNAME + ':' +
    encodeURIComponent(MONGO.PASSWORD) + '@' + MONGO.HOST + ':' + MONGO.PORT + '/'
}

class Mongo {
  static getInstance() {
    if (!Mongo.instance) {
      Mongo.instance = new Mongo
    }
    return Mongo.instance
  }

  constructor() {
    this.client = ''
    this.connect()
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true }).connect((err, client) => {
          if (err) {
            reject(err)
          } else {
            this.client = client.db(MONGO.DATABASE)
            resolve(this.client)
          }
        })
      } else {
        resolve(this.client)
      }
    })
  }

  insertOne(collectionName, obj) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertOne(obj, (err, res) => {
          if (!err) {
            resolve(res)
            return
          }
          reject(err)
        })
      })
    })
  }

  removeOne(collectionName, obj) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).removeOne(obj, (err, res) => {
          if (!err) {
            resolve(res)
            return
          }
          reject(err)
        })
      })
    })
  }

  removeMany(collectionName, obj) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).removeMany(obj, (err, res) => {
          if (!err) {
            resolve(res)
            return
          }
          reject(err)
        })
      })
    })
  }

  // 更新指定字段
  updateOne(collectionName, condition, obj) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).updateOne(condition, {
          $set: obj
        }, (err, res) => {
          if (!err) {
            resolve(res)
            return
          }
          reject(err)
        })
      })
    })
  }

  updateMany(collectionName, condition, obj) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).updateMany(condition, {
          $set: obj
        }, (err, res) => {
          if (!err) {
            resolve(res)
            return
          }
          reject(err)
        })
      })
    })
  }

  find(collectionName, obj) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).find(obj).toArray((err, res) => {
          if (!err) {
            resolve(res)
            return
          }
          reject(err)
        })
      })
    })
  }

}

module.exports = Mongo.getInstance()
