/**
 * 对数据库的操作
 */

const query = require('../mysql')

// 查询所有用户
const getallusers = () => {
  const _sql = 'SELECT * FROM tb_user'

  return query(_sql)
}

// 查询单个用户信息
const getuser = (username) => {
  const _sql = 'SELECT * FROM tb_user WHERE username = ?'

  return query(_sql, [username])
}

// 添加用户
const adduser = (val) => {
  const { name, pwd } = val
  const _sql = 'INSERT INTO tb_user (username, password) VALUES (?, ?)'

  return query(_sql, [name, pwd])
}

// 修改密码
const modifypwd = (val) => {
  const { name, pwd } = val
  const _sql = 'UPDATE tb_user SET password = ? WHERE username = ?'

  return query(_sql, [pwd, name])
}

module.exports = {
  getallusers,
  getuser,
  adduser,
  modifypwd
}