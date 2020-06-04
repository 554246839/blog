<template>
  <div class="footer">
    <div class="title">
      <a href="http://beian.miit.gov.cn">粤ICP备19141637号</a>
    </div>
  </div>
</template>

<style lang="scss">
.header {
  padding: 40px 0 10px;
  margin-bottom: 5px;
  width: 100%;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  .title {
    margin-bottom: 40px;
  }
  .userName {
    display: inline-block;
    margin-right: 40px;
    margin-left: 20px;
    a {
      font-weight: bold;
    }
  }
  .subTitle {
    display: inline-block;
    font-size: 20px;
  }
  .navList {
    font-size: 20px;
    .navItem {
      float: left;
      width: 80px;
      margin: 0 10px;
      padding: 0 10px;
      .nuxt-link-exact-active {
        font-weight: bold;
      }
    }
  }
}
</style>