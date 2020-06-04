import Vue from 'vue'

const common = {
  $dateFtt(fmt, date) {
    let o = {
      "M+": date.getMonth() + 1,     //月份 
      "d+": date.getDate(),     //日 
      "h+": date.getHours(),     //小时 
      "m+": date.getMinutes(),     //分 
      "s+": date.getSeconds(),     //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds()    //毫秒 
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
  },
  setCookie(name, value, day) {
    if (day !== 0) {     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
      let expires = day * 24 * 60 * 60 * 1000;
      let date = new Date(+new Date() + expires);
      document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + "; path=/";
    } else {
      document.cookie = name + "=" + escape(value);
    }
  },
  getCookie(cookie, name) {
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  delCookie(name) {
    this.setCookie(name, ' ', -1);
  }
}
Vue.prototype.common = common

export default (ctx) => {
  ctx.common = common
}