const errmsg = require('../config/errcode')
const jwt = require('jsonwebtoken')
/**
 * 将 string 解析成 object
 * @param {string} str 
 */
const _parseUrl = (str) => {
  let obj = {}
  let arr = str.split('&')
  arr.forEach((e, i) => {
    let temparr = e.split('=')
    obj[temparr[0]] = temparr[1]
  });
  return obj
}

/**
 * 解析post请求的参数
 * @param {object} ctx 请求回调的上下文对象
 */
const parseData = (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      let str = ''
      ctx.req.on('data', (data) => {
        str += data
      })
      ctx.req.addListener('end', () => {
        try {
          let db = JSON.parse(str)
          if (typeof db === 'object') {
            resolve(db)
          }
        } catch (err) {
          resolve(_parseUrl(str))
        }
      })
    } catch (err) {
      reject(err)
    }
  });
}
/**
 * 返回前端数据
 * @param {number} errcode 返回前端的错误码
 * @param {any} data 返回前端的数据
 * @param {string} msg 返回前端提示语
 */
const result = (errcode = 0, data = null) => {

  return {
    data,
    errcode,
    msg: errmsg[errcode] || '未知错误'
  }
}

/**
 * 生成token
 */
const getToken = (obj) => {
  return jwt.sign(obj, 'personalVerifyCode', { expiresIn: '24h' })
}

const verifyToken = (token) => {
  return jwt.verify(token, 'personalVerifyCode')
}

const getCookie = (cookie, name) => {
  var arr;
  var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}
const dateFtt = (fmt, date) => {
  if (typeof date === 'string') return '-'
  let o = {
    "M+": date.getMonth() + 1,      //月份 
    "d+": date.getDate(),           //日 
    "h+": date.getHours(),          //小时 
    "m+": date.getMinutes(),        //分 
    "s+": date.getSeconds(),        //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3),  //季度 
    "S": date.getMilliseconds()     //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt;
}
/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

module.exports = {
  parseData,
  result,
  getToken,
  verifyToken,
  getCookie,
  dateFtt,
  getClientIP
}