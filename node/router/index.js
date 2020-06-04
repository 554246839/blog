const router = require('koa-router')()
const serverApi = require('./server')
const webApi = require('./web')

/**
 * server 接口
 */
// 新增分类
router.post('/api/server/addCategory', serverApi.addCategory)

// 获取所有文章
router.get('/api/server/getAllArticles/:pageNo', serverApi.getAllArticles)

// 获取文章详情
router.get('/api/server/getArticleDetail', serverApi.getArticleDetail)

// 编辑文章
router.post('/api/server/updateArticleInfo', serverApi.updateArticleInfo)

// 发表文章
router.post('/api/server/issueArticle', serverApi.issueArticle)

// 删除文章
router.post('/api/server/deleteArticle', serverApi.deleteArticle)

// 上传图片
router.post('/api/server/upload', serverApi.upload)

// 获取用户信息
router.get('/api/server/getUserInfo', serverApi.getUserInfo)

// 更新个人信息
router.post('/api/server/updateUserInfo', serverApi.updateUserInfo)

// 访客数
router.get('/api/server/getVisitors/:pageNo', serverApi.getVisitors)

// 留言回复
router.post('/api/server/replyMessage', serverApi.replyMessage)

// 获取留言数据
router.get('/api/server/getMessage/:pageNo', serverApi.getMessage)

// 验证权限
router.post('/api/server/verifyCode', serverApi.verifyCode)

// 退出登录
router.post('/api/server/logout', serverApi.logout)

// 验证token
router.post('/api/server/verifyToken', serverApi.verifyToken)

/**
 * web 接口
 */
// 获取个人信息
router.get('/api/web/getUserInfo', webApi.getUserInfo)

// 留言
router.post('/api/web/sendMessage', webApi.sendMessage)

// 获取所有已发布文章
router.get('/api/web/getAllArticles/:pageNo', webApi.getAllArticles)

// 获取发布文章详情
router.get('/api/web/getArticleDetail', webApi.getArticleDetail)

// 获取侧边信息
router.get('/api/web/getAsideShow', webApi.getAsideShow)

// 获取搜索文章列表
router.get('/api/web/search', webApi.search)

// 获取标签文章列表
router.get('/api/web/tags/:id', webApi.tags)

// 获取所有分类
router.get('/api/web/getCategories', webApi.getCategories)

// 获取分类文章
router.get('/api/web/getCategoryArticles/:pageNo', webApi.getCategoryArticles)

module.exports = router.routes()