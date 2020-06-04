const mdb = require('../../mdb')
const Redis = require('../../redis')
const ObjectId = require('mongodb').ObjectId

const getIdIndex = (ids, id) => {
  let _idIndex = -1
  ids.some((v, i) => { // id为object类型，需要转化
    if (v.toString() === id.toString()) {
      _idIndex = i
      return true
    }
  });
  return _idIndex
}

module.exports = {
  /**
   * 查询所有的文章
   * @param {*} pageNo 当前页数
   * @param {*} pageSize 每一页条数
   * @param {*} isAdmin 是否为管理模块
   * @param {Object} condition 查询条件
   */
  getAllArticles (pageNo, pageSize, isAdmin, condition = {}) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let articleColl = db.collection('article')
        let cateColl = db.collection('category')

        let catesArr = await cateColl.find().project({ articles: 0 }).toArray()
        let catesObj = { '-1': '其它' }
        catesArr.forEach(v => {
          catesObj[v._id.toString()] = v.name
        })

        if (isAdmin !== 'isAdmin') {
          condition.isPublic = true
        }

        // let condition =  ? '' : { isPublic: true }
        let count = await articleColl.find(condition).count()

        let total = Math.ceil(count / pageSize)
        articleColl.find(condition).project({ mavon: 0, content: 0 }).sort({ _id: -1 }).skip((pageNo - 1) * pageSize).limit(pageSize).toArray((err, res) => {
          if (!err) {
            res.forEach((val, idx) => {
              val.category = catesObj[val.categoryId]
              delete val.categoryId
            })
            resolve({
              count,
              total,
              pageNo,
              pageSize,
              data: res
            })
          } else {
            reject(err)
          }
        })
      })
    })
  },

  // 查询单篇文章详情
  getArticleDetail (id, ip, isLogin) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let articleColl = db.collection('article')
        let cateColl = db.collection('category')

        let [_data] = await articleColl.find({ _id: ObjectId(id) }).toArray()

        if (ip) {
          if (!_data.isPublic && !isLogin) {
            reject(err)
            return
          }

          let [_prev] = await articleColl.find({ _id: { '$gt': ObjectId(id) } }).limit(1).toArray()
          let [_next] = await articleColl.find({ _id: { '$lt': ObjectId(id) } }).sort({ _id: -1 }).limit(1).toArray()

          let categoryId = _data.categoryId;
          let category = ''

          if (categoryId === '-1') {
            category = '其它'
          } else {
            category = await cateColl.find({ _id: ObjectId(categoryId) }).project({ name: 1 }).toArray()
            category = category[0].name
          }
          _data.category = category
          delete _data.categoryId

          _data.prev = _prev ? {
            _id: _prev._id,
            title: _prev.title
          } : null

          _data.next = _next ? {
            _id: _next._id,
            title: _next.title
          } : null

          Redis.smembers(ip).then(res => {
            if (!res || (res.indexOf(id) === -1)) {

              articleColl.updateOne({ _id: ObjectId(id) }, {
                $set: { read_num: _data.read_num + 1 }
              }, (err, res) => {
                if (err) console.log(err, '-----阅读量更新失败')
              })

              Redis.pipeline()
                .sadd(ip, id)
                .expire(ip, ~~((24 * 3600 * 1000 - new Date() + new Date().setHours(0, 0, 0, 0)) / 1000)) // 时间单位为秒
                .exec()
            }
          }).catch(err => {
            console.log(err, 'err-----')
          })
        }

        resolve(_data)

      }).catch(err => {
        reject(err)
      })
    })
  },

  // 更新文章
  updateArticleInfo (id, data) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let articleColl = db.collection('article')

        articleColl.updateOne({ _id: ObjectId(id) }, {
          $set: data
        }, async (err, res) => {
          if (!err) {
            let [_data] = await articleColl.find({ _id: ObjectId(id) }).toArray()
            resolve(_data)
            return
          }
          reject(err)
        })
      })
    })
  },

  // 发表文章
  issueArticle (data) {
    return new Promise((resolve, reject) => {
      mdb.insertOne('article', data).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  },

  // 删除文章
  deleteArticle (id) {
    return new Promise(async (resolve, reject) => {
      let [{ categoryId, tags, isPublic }] = await mdb.find('article', { _id: ObjectId(id) })

      mdb.removeOne('article', { _id: ObjectId(id) }).then(res => {
        resolve({ categoryId, tags, isPublic })
      }, err => {
        reject(err)
      })
    })

  },

  // 侧边信息
  getAsideShow () {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let articleColl = db.collection('article')
        let tagColl = db.collection('tags')
        let cateColl = db.collection('category')

        try {
          let [latest] = await articleColl.find({ isPublic: true }).project({ title: 1, desc: 1 }).sort({ _id: -1 }).limit(1).toArray()
          let reads = await articleColl.find({ isPublic: true }).project({ title: 1, read_num: 1 }).sort({ read_num: -1 }).limit(5).toArray()
          let likes = await articleColl.find({ isPublic: true }).project({ title: 1, likes: 1 }).sort({ likes: -1 }).limit(5).toArray()
          let tags = await tagColl.find({ ids: { $gt: [] } }).toArray()
          let cates = await cateColl.find({ articles: { $gt: [] } }).toArray()
          resolve({ latest, reads, likes, tags, cates })
        } catch (err) {
          reject(err)
        }
      })
    })
  },

  // 模糊搜索
  search (key, pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let articleColl = db.collection('article')
        const reg = new RegExp(key, 'i');

        let count = await articleColl.find({ isPublic: true, title: { $regex: reg } }).count()
        let total = Math.ceil(count / pageSize)
        await articleColl.find({ isPublic: true, title: { $regex: reg } }).sort({ _id: -1 })
          .skip((pageNo - 1) * pageSize).limit(pageSize).toArray((err, res) => {
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

  // 标签更新
  updateTags (tags, id, isPublic) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let tagsColl = db.collection('tags')

        let tagsArr = await tagsColl.find().toArray()
        if (tagsArr.length) {
          tagsArr.forEach(v => {
            let { tag_name, ids } = v
            let _tagIndex = tags.indexOf(tag_name)
            if (_tagIndex !== -1) {
              tags.splice(_tagIndex, 1)

              let _idIndex = getIdIndex(ids, id) // id为object类型，需要转化

              if (_idIndex === -1 && isPublic) { // 新增标签
                tagsColl.updateOne({ tag_name }, {
                  $set: { ids: [...ids, id] }
                }, async (err, res) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
              if (_idIndex !== -1 && !isPublic) { // 删除标签
                ids.splice(_idIndex, 1)
                tagsColl.updateOne({ tag_name }, {
                  $set: { ids }
                }, async (err, res) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
            } else {
              let _index = getIdIndex(ids, id)
              if (_index !== -1) { // 删除标签
                ids.splice(_index, 1)
                tagsColl.updateOne({ tag_name }, {
                  $set: { ids }
                }, async (err, res) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
            }
          })
        }
        if (tags.length) {
          tags.forEach(v => {
            tagsColl.insertOne({ tag_name: v, ids: [id] }, (err, res) => {
              if (err) {
                reject(err)
              }
            })
          })
        }
        resolve(1)
      })
    })
  },

  // 查询标签文章
  getTags (id, pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let tagsColl = db.collection('tags')
        let articleColl = db.collection('article')

        let [{ tag_name }] = await tagsColl.find({ _id: ObjectId(id) }).toArray()
        const reg = new RegExp(`(,|^)${tag_name}(,|$)`, 'i');

        let count = await articleColl.find({ isPublic: true, tags: { $regex: reg } }).count()
        let total = Math.ceil(count / pageSize)

        await articleColl.find({ isPublic: true, tags: { $regex: reg } }).sort({ _id: -1 })
          .skip((pageNo - 1) * pageSize).limit(pageSize).toArray((err, res) => {
            if (!err) {
              resolve({
                count,
                total,
                pageNo,
                pageSize,
                data: res,
                tag_name
              })
              return
            }
            reject(err)
          })
      })
    })
  },

  // 所有分类
  getCategories () {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let cateColl = db.collection('category')

        await cateColl.find().project({ name: 1 }).toArray((err, res) => {
          if (!err) {
            resolve({
              data: res
            })
            return
          }
          reject(err)
        })
      })
    })
  },

  /**
   * 新增分类
   * @param {String} name 分类名称
   */
  addCategory (name) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let cateColl = db.collection('category')

        let isExist = await cateColl.find({ name }).toArray()

        if (!isExist.length) {
          await cateColl.insertOne({ name, articles: [] }, (err, res) => {
            if (!err) {
              resolve(res)
              return
            }
            reject(err)
          })
        } else {
          reject('添加失败')
        }
      })
    })
  },

  /**
   * 更新分类
   * @param {*} cateId 分类ID
   * @param {*} articleId 文章ID
   * @param {*} isDelete 是否为删除
   */
  updateCategory (cateId, articleId, isDelete) {
    return new Promise((resolve, reject) => {
      mdb.connect().then(async db => {
        let cateColl = db.collection('category')

        let catesArr = await cateColl.find().toArray()
        if (catesArr.length) {
          for (let i = 0, len = catesArr.length; i < len; i++) {
            let { _id, articles } = catesArr[i];
            let _idIndex = getIdIndex(articles, articleId) // id为object类型，需要转化

            if (cateId.toString() === _id.toString()) {
              if (_idIndex !== -1) {
                if (isDelete) {
                  articles.splice(_idIndex, 1)
                  cateColl.updateOne({ _id: ObjectId(_id) }, {
                    $set: { articles }
                  }, async (err, res) => {
                    if (err) {
                      reject(err)
                    }
                  })
                  return
                }
                resolve(1)
                return
              } else {
                cateColl.updateOne({ _id: ObjectId(_id) }, {
                  $set: { articles: [...articles, articleId] }
                }, async (err, res) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
            } else {
              if (_idIndex !== -1) {
                articles.splice(_idIndex, 1)
                cateColl.updateOne({ _id: ObjectId(_id) }, {
                  $set: { articles }
                }, async (err, res) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
            }
          }
        }
        resolve(1)
      })
    })
  }
}