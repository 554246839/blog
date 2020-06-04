<template>
  <div class="container __main">
    <div class="notFound">
      <div class="tips">页面找不到了</div>
      <nuxt-link to="/" tag="button">返回首页</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `页面不存在 - 康冬的个人网站 - Kang Dong's Personal Website`
    };
  }
};
</script>

<style lang="scss">
.notFound {
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .tips {
    text-align: inherit;
    margin-bottom: 20px;
  }
}
</style>
