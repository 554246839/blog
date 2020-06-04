<template>
  <container _class="article" :aside="aside">
    <h1 class="title">{{item.title + (!item.isPublic ? ' (草稿)' : '' )}}</h1>
    <div class="markdown-body" v-html="item.content"></div>
    <div class="artInfo fixclear">
      <div>Published in {{ item.time }}</div>
      <div>阅读({{ item.read_num }})</div>
      <!-- <div>评论({{ item.comments }})</div> -->
    </div>
    <div class="tags">标签：{{item.tags}}</div>
    <div class="tags">分类：{{item.category}}</div>
    <div class="nextLink">
      <div class="prev" v-if="item.prev">
        上一篇:
        <nuxt-link :to="`/article/${item.prev._id}`">{{item.prev.title}}</nuxt-link>
      </div>
      <div class="next" v-if="item.next">
        下一篇:
        <nuxt-link :to="`/article/${item.next._id}`">{{item.next.title}}</nuxt-link>
      </div>
    </div>
  </container>
</template>

<script>
import Container from "@/components/container";

export default {
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href:
            "https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css"
        },
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/mono-blue.min.css"
        }
      ]
    };
  },
  async asyncData(ctx) {
    let id = ctx.params.id;
    let { errcode, data } = await ctx.$axios.get(
      "/web/getArticleDetail?id=" + id
    );
    let aside = await ctx.$axios.get("/web/getAsideShow");

    if (errcode === 0 && aside.errcode === 0) {
      data.time = ctx.common.$dateFtt("yyyy-MM-dd hh:mm", new Date(data.time));

      ctx.app.head.title = `${data.title} - 前端杂货铺 - 康冬的个人网站`;

      return {
        item: data,
        aside: aside.data
      };
    } else {
      ctx.redirect("/404");
    }
  },
  components: {
    Container
  }
};
</script>

<style lang="scss">
.article {
  .title {
    font-size: 30px;
    font-weight: bold;
    padding: 20px 0;
    color: #258fb8;
    margin-bottom: 10px;
  }
  .artInfo {
    padding: 10px 0;
    div {
      float: left;
      margin-right: 20px;
      color: #999;
    }
  }
  .tags {
    color: #666;
  }
  .nextLink {
    padding: 20px 0;
    .prev,
    .next {
      color: #666;
      font-size: 14px;
    }
    a {
      color: #258fb8;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>