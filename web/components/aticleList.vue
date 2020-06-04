<template>
  <ul class="article_list">
    <li class="artItem" v-for="item in list.data" :key="item._id">
      <div class="title">
        <nuxt-link :to="'/article/' + item._id">{{ item.title }}</nuxt-link>
      </div>
      <div class="desc">{{ item.desc }}</div>
      <div class="artInfo fixclear">
        <div>Published in {{ item.time }}</div>
        <div>阅读({{ item.read_num }})</div>
        <!-- <div>评论({{ item.comments }})</div> -->
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["list"]
};
</script>  

<style lang="scss">
.article_list {
  .artItem {
    padding: 10px;
    border-bottom: 1px dashed #bbb;
    margin-bottom: 20px;
  }
  .title {
    font-size: 25px;
    padding: 10px 0;
    padding-left: 10px;
    background-color: rgba(238, 238, 238, 0.5);
    margin-bottom: 10px;
    :hover {
      color: #258fb8;
    }
  }
  .desc {
    line-height: 1.5;
  }
  .artInfo {
    padding-top: 10px;
    div {
      float: left;
      margin-right: 20px;
      color: #999;
    }
  }
}
</style>
