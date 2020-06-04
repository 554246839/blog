const env = process.env.NODE_ENV
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '康冬的个人网站 - Kang Dong\'s Personal Website' || process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/style/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/common'
    }, {
      src: '@/plugins/toast',
      ssr: false
    }, {
      src: "@/plugins/axios"
    }, {
      src: '@/plugins/mavon-editor',
      ssr: false
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  router: {
    middleware: 'auth',
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  axios: {
  },
  proxy: {
    '/web/': {
      target: 'http://112.74.50.222:8888/',
      changeOrigin: true
    },
    '/server/': {
      target: 'http://112.74.50.222:8888/',
      changeOrigin: true
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  server: {
    port: 8080, // default: 3000
    host: env === 'development' ? 'localhost' : '0.0.0.0', // default: localhost
  }
}
