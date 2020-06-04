export default ({ $axios, redirect, common, req, $toast }) => {

  // $axios.defaults.baseURL = 'https://kangdong.site/api/'
  $axios.defaults.baseURL = 'http://localhost:8888/api/'
  $axios.defaults.timeout = 20000
  $axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  // 请求回调
  $axios.onRequest(config => {
    if (!config.headers.token) {
      let decodedCookie = decodeURIComponent(typeof window === "undefined" ? req.headers.cookie : document.cookie);
      config.headers.token = common.getCookie(decodedCookie, 'token')
    }
  })

  // 返回回调
  $axios.onResponse(res => {
    if (res.status === 200) {
      if (res.data.errcode === 1001) {
        redirect('/login')
        return
      }
      return res.data
    } else {
      $toast.showToast('服务器错误')
      return
    }
  })

  // 错误回调
  $axios.onError(error => {
    console.log(error, '++++++++++++++')
  })
}