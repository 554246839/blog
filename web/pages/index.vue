<template>
  <container _class="articleList" :aside="aside">
    <div v-if="list.data.length">
      <AticleList :list="list" />
      <pagination :count="list.count" :total="list.total" :pageNo="list.pageNo" path="/page/" />
    </div>
    <div class="nodata" v-else>暂无数据</div>
  </container>
</template>

<script>
import Pagination from "@/components/pagination";
import Container from "@/components/container";
import AticleList from "@/components/aticleList";

export default {
  head() {
    return {
      title: "康冬的个人网站 - Kang Dong's Personal Website"
    };
  },
  async asyncData(ctx) {
    let { errcode, data = {} } = await ctx.$axios.get("/web/getAllArticles/1");
    let aside = await ctx.$axios.get("/web/getAsideShow");
    if (errcode === 0 && aside.errcode === 0) {
      return {
        list: data,
        aside: aside.data
      };
    }
  },
  components: {
    Pagination,
    Container,
    AticleList
  }
};
</script>

<style lang="scss">
</style>
