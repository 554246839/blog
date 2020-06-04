var mysql = require('mysql')
var { MYSQL } = require('../config/default.js')

var pool = mysql.createPool({
  host: MYSQL.HOST,
  port: MYSQL.PORT,
  user: MYSQL.USERNAME,
  password: MYSQL.PASSWORD,
  database: MYSQL.DATABASE
})

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, params, (error, results, fields) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }

          connection.release(err => {
            if (err) {
              console.log('DB-关闭数据库连接异常')
            }
          })
        })
      }
    })
  })
}

module.exports = query