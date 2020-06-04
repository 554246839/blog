
<template>
  <container _class="artiList" :aside="aside">
    <div v-if="list.data.length">
      <AticleList :list="list" />
      <pagination
        :count="list.count"
        :total="list.total"
        :pageNo="list.pageNo"
        :path="`/category/${categoryId}/`"
      />
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
      title: `文章分类 - 康冬的个人网站 - Kang Dong's Personal Website`
    };
  },
  async asyncData(ctx) {
    let pageNo = ctx.params.pageNo;
    let categoryId = ctx.params.categoryId;

    let { errcode, data = {} } = await ctx.$axios.get(
      `/web/getCategoryArticles/${pageNo}?id=${categoryId}`
    );

    if (errcode === 0) {
      let path = ``;

      data.data.forEach(e => {
        e.time = ctx.common.$dateFtt("yyyy-MM-dd hh:mm", new Date(e.time));
      });

      if (data.total && data.pageNo > data.total) {
        path = `/category/${categoryId}/${data.total}`;
      } else if (data.pageNo < 1) {
        path = `/category/${categoryId}/1`;
      }

      path && ctx.redirect(path);
    }

    let aside = await ctx.$axios.get("/web/getAsideShow");
    return {
      list: data,
      categoryId,
      aside: aside.data || {}
    };
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
