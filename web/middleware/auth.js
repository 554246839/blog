export default async function ({ route, req, $axios, redirect, common }) {
  let isAdmin = /^\/admin/ig.test(route.path)

  if (isAdmin) {
    let decodedCookie = decodeURIComponent(typeof window === "undefined" ? req.headers.cookie : document.cookie);
    let token = common.getCookie(decodedCookie, 'token')

    if (token) {
      $axios.defaults.headers['token'] = token

      let res = await $axios.post('/server/verifyToken')
      if (res.errcode !== 0) {
        redirect('/login')
      }
    } else {
      redirect('/login')
    }
  }
}