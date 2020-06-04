<template>
  <aside class="sideRight">
    <div class="sideItem" v-if="info.latest">
      <div class="title">最新文章</div>
      <div class="articleIntro">
        <nuxt-link :to="'/article/' + info.latest._id">
          <h3 class="articleName">{{info.latest.title}}</h3>
          <div class="articleDesc">{{info.latest.desc}}</div>
        </nuxt-link>
      </div>
    </div>
    <div class="sideItem" v-if="info.reads.length">
      <div class="title">阅读排行</div>
      <ul class="articleIntro">
        <li class="articleRank" v-for="item in info.reads" :key="item._id">
          <nuxt-link :to="'/article/' + item._id">{{item.title}} ({{item.read_num}})</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="sideItem" v-if="info.likes.length">
      <div class="title">推荐排行</div>
      <ul class="articleIntro">
        <li class="articleRank" v-for="item in info.likes" :key="item._id">
          <nuxt-link :to="'/article/' + item._id">{{item.title}} ({{item.likes}})</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="sideItem" v-if="info.tags.length">
      <div class="title">我的标签</div>
      <div class="articleIntro">
        <span class="articleRank tagsItem" v-for="item in info.tags" :key="item._id">
          <nuxt-link :to="'/tags/1?id=' + item._id">{{item.tag_name}}({{item.ids.length}})</nuxt-link>
        </span>
      </div>
    </div>
    <div class="sideItem">
      <div class="title">有兴趣可加好友一起讨论</div>
      <div class="articleIntro imgBox">
        <img src="https://www.kangdong.site/uploads/blog-15757285902295170.png" alt />
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  props: ["info"]
};
</script>

<style lang="scss">
.sideRight {
  float: right;
  width: 325px;
  min-height: 100vh;
  .sideItem {
    padding: 10px 10px 20px;
    border-radius: 3px;
    background-color: #fff;
    margin-bottom: 20px;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
  }
  .title {
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
  }
  .articleIntro {
    padding-top: 10px;
    &:hover .articleName {
      color: #258fb8;
    }
    .articleDesc {
      margin-top: 5px;
      color: #999;
      max-height: 120px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
    .articleRank {
      color: #258fb8;
      &.tagsItem {
        width: 50%;
        display: inline-block;
      }
      a {
        color: inherit;
        &:hover {
          text-decoration-line: underline;
        }
      }
    }
  }
  .imgBox {
    padding: 20px 40px 10px;
    img {
      width: 100%;
    }
  }
}
</style>