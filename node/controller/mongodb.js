const db = require('../mdb')

const getAllData = () => {
  return new Promise((resolve, reject) => {
    db.find('article').then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

const insertOne = (obj) => {
  return new Promise((resolve, reject) => {
    db.insertOne('article', obj).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

const deleteData = (obj) => {
  return new Promise((resolve, reject) => {
    db.removeOne('article', obj).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

const deleteAllData = (obj) => {
  return new Promise((resolve, reject) => {
    db.removeMany('article', obj).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

const updateOne = (condi, obj) => {
  return new Promise((resolve, reject) => {
    db.updateOne('article', condi, obj).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

const updateMany = (condi, obj) => {
  return new Promise((resolve, reject) => {
    db.updateMany('article', condi, obj).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

module.exports = {
  getAllData,
  insertOne,
  deleteData,
  deleteAllData,
  updateOne,
  updateMany
}