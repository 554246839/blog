
<template>
  <container _class="search" :aside="aside">
    <div v-if="list.data.length">
      <div class="searchResult">共搜索到 {{list.count}} 条数据：</div>

      <AticleList :list="list" />

      <pagination
        :count="list.count"
        :total="list.total"
        :pageNo="list.pageNo"
        path="/search/"
        :query="`?searchkey=${searchKey}`"
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
  async asyncData(ctx) {
    let pageNo = ctx.params.pageNo;
    let searchKey = ctx.query.searchkey;

    if (pageNo < 1) {
      ctx.redirect(`/search/1?searchkey=${searchKey}`);
      return;
    }
    let { errcode, data } = await ctx.$axios.get(
      `/web/search?key=${searchKey}&pageNo=${pageNo}`
    );

    if (errcode === 0) {
      data.data.forEach(e => {
        e.time = ctx.common.$dateFtt("yyyy-MM-dd hh:mm", new Date(e.time));
      });

      if (pageNo > data.total && data.total > 0) {
        ctx.redirect(`/search/${data.total}?searchkey=${searchKey}`);
        return;
      }
    }

    let aside = await ctx.$axios.get("/web/getAsideShow");
    return {
      searchKey,
      list: data,
      aside: aside.data || {}
    };
  },
  components: {
    Pagination,
    Container,
    AticleList
  },
  watch: {
    $route() {
      if (this.searchKey !== this.$route.query.searchkey) {
        this.$router.go(0);
      }
      console.log(this.searchKey, this.$route.query.searchkey);
    }
  }
};
</script>

<style lang="scss">
.search {
  .searchResult {
    color: #999;
    margin-bottom: 10px;
  }
}
</style>
