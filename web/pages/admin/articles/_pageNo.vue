<template>
  <div class="articleInfo">
    <div class="breadcrumb">文章管理</div>
    <div v-if="list.data.length">
      <div class="info">
        <ul class="articleList">
          <li class="liHeader">
            <div class="artTitle">标题</div>
            <div class="artCategory">分类</div>
            <div class="artStatus">状态</div>
            <div class="artRead">查看数</div>
            <div class="artComment">评论数</div>
            <div class="artEdit">操作</div>
          </li>
          <li v-for="item in list.data" :key="item._id">
            <div class="artTitle">
              <nuxt-link :to="'/article/' + item._id">{{item.title}}</nuxt-link>
            </div>
            <div class="artCategory">{{item.category}}</div>
            <div class="artStatus">{{item.isPublic ? '已发布' : '未发布'}}</div>
            <div class="artRead">{{item.read_num || 0}}</div>
            <div class="artComment">{{item.comments || 0}}</div>
            <div class="artEdit">
              <nuxt-link :to="`/admin/articleEdit/${item._id}`">编辑</nuxt-link>
              <a href="javascript:;" @click="deleteArticle(item._id)">删除</a>
            </div>
          </li>
        </ul>
      </div>
      <pagination
        :count="list.count"
        :total="list.total"
        :pageNo="list.pageNo"
        path="/admin/articles/"
      />
    </div>
    <div class="nodata" v-else>暂无数据</div>
  </div>
</template>

<script>
import Pagination from "@/components/pagination";

export default {
  async asyncData({ params, $axios, redirect }) {
    let pageNo = params.pageNo;
    let { errcode, data = {} } = await $axios.get(
      `/server/getAllArticles/${pageNo}`
    );
    if (errcode === 0) {
      let path = "";

      if (data.pageNo > data.total && data.total) {
        path = `/admin/articles/${data.total}`;
      } else if (data.pageNo < 1) {
        path = `/admin/articles/1`;
      }

      path && redirect(path);
    }

    return { list: data };
  },
  components: {
    Pagination
  },
  methods: {
    init() {
      this.$axios
        .get(`/server/getAllArticles/${this.list.pageNo}`)
        .then(res => {
          if (res.errcode === 0) {
            this.list = res.data;
          }
        });
    },
    deleteArticle(id) {
      if (confirm("确认删除")) {
        this.$axios.post("/server/deleteArticle", { id }).then(res => {
          if (res.errcode === 0) {
            this.init();
            this.$toast.showToast("删除成功");
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.articleInfo {
  padding: 20px 40px;
  .breadcrumb {
    margin-bottom: 20px;
    color: #aaa;
  }
  .articleList {
    width: 100%;
    .liHeader div {
      font-weight: bold;
      font-size: 14px;
    }
    li {
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      font-size: 14px;
      a:hover {
        color: #999;
      }
      div {
        display: inline-block;
      }
      .artTitle {
        width: 57%;
      }
      .artCategory,
      .artStatus,
      .artRead,
      .artComment {
        text-align: center;
        width: 6%;
      }
      .artCategory {
        width: 10%;
      }
      .artEdit {
        text-align: right;
        width: 10%;
      }
    }
  }
}
</style>