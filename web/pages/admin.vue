<template>
  <div class="admin">
    <div>
      <div class="title">
        <span class="title-s">后台管理中心</span>
        <button @click="logout" class="logoutBtn">退出登录</button>
        <nuxt-link to="/" class="gotoHome">去首页</nuxt-link>
      </div>
      <div class="content fixclear">
        <div class="side">
          <ul class="navList">
            <li>
              <nuxt-link to="/admin">个人信息</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/articleEdit/0">发布文章</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/articles/1">文章管理</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/message/1">留言管理</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/visitors/1">访问数据</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="main">
          <nuxt-child></nuxt-child>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "管理中心 - 康冬的个人网站 - Kang Dong's Personal Website"
    };
  },
  methods: {
    logout() {
      this.$axios.post("/server/logout").then(res => {
        if (res.errcode === 0) {
          this.common.delCookie("token");
          this.$router.push("/");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.admin {
  .title {
    background: #2b303b;
    height: 50px;
    color: #fff;
    line-height: 50px;
    font-size: 20px;
    padding: 0 20px;
    .title-s {
      color: inherit;
    }
    a {
      color: #fff;
    }
  }
  .content {
    height: calc(100vh - 50px);
    overflow-y: hidden;
    .side {
      float: left;
      height: 100%;
      width: 105px;
      background-color: #f7f8fa;
      padding-top: 20px;
      border-right: 1px solid #ccc;
    }
    .main {
      float: left;
      background: #fff;
      height: 100%;
      width: calc(100vw - 105px);
      overflow-y: auto;
    }
  }
  .navList {
    a {
      line-height: 40px;
      padding: 0 10px;
      width: 100%;
      margin-top: 1px;
      font-size: 14px;
      &:hover,
      &.nuxt-link-exact-active {
        color: #00a4ff;
      }
    }
  }
  .gotoHome {
    float: right;
    margin-top: 20px;
    font-size: 14px;
    line-height: 24px;
    margin-right: 40px;
  }
  .logoutBtn {
    float: right;
    margin-top: 20px;
  }
}
</style>