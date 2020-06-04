
<template>
  <container _class="tags" :aside="aside">
    <div v-if="list.data.length">
      <h2 class="tagsTitle">{{list.tag_name}} 标签专题</h2>
      <ul>
        <li class="artItem" v-for="item in list.data" :key="item._id">
          <div class="title">
            <nuxt-link :to="'/article/' + item._id">{{ item.title }}</nuxt-link>
          </div>
          <div class="desc">{{ item.desc }}</div>
          <div class="artInfo fixclear">
            <div>Published in {{ item.time }}</div>
            <div>阅读({{ item.read_num }})</div>
            <div>评论({{ item.comments }})</div>
          </div>
        </li>
      </ul>
      <pagination
        :count="list.count"
        :total="list.total"
        :pageNo="list.pageNo"
        path="/tags/"
        :query="`?id=${id}`"
      />
    </div>
    <div class="nodata" v-else>暂无数据</div>
  </container>
</template>

<script>
import Pagination from "@/components/pagination";
import Container from "@/components/container";

export default {
  async asyncData(ctx) {
    let id = ctx.query.id;
    let pageNo = ctx.params.pageNo;

    if (pageNo < 1) {
      ctx.redirect(`/tags/1?id=${id}`);
      return;
    }
    let { errcode, data } = await ctx.$axios.get(
      `/web/tags/${id}?pageNo=${pageNo}`
    );

    if (errcode === 0) {
      data.data.forEach(e => {
        e.time = ctx.common.$dateFtt("yyyy-MM-dd hh:mm", new Date(e.time));
      });

      if (pageNo > data.total && data.total > 0) {
        ctx.redirect(`/tags/${data.total}?id=${id}`);
        return;
      }
    }

    let aside = await ctx.$axios.get("/web/getAsideShow");

    ctx.app.head.title = `${data.tag_name}专题 - 前端杂货铺 - 康冬的个人网站`;
    return {
      id,
      list: data,
      aside: aside.data || {}
    };
  },
  components: {
    Pagination,
    Container
  },
  watch: {
    $route() {
      if (this.id !== this.$route.query.id) {
        this.$router.go(0);
      }
      console.log(this.searchKey, this.$route.query.searchkey);
    }
  }
};
</script>

<style lang="scss">
.tags {
  .tagsTitle {
    margin-bottom: 10px;
  }
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
