<template>
  <div class="header">
    <div class="title">
      <h1 class="userName">
        <nuxt-link to="/">前端便利店</nuxt-link>
      </h1>
      <div class="subTitle">吾生有涯，而知无涯</div>
    </div>
    <div class="navContainer">
      <div class="fixclear navContent">
        <ul class="navList fixclear">
          <li class="navItem">
            <nuxt-link to="/">首页</nuxt-link>
          </li>
          <li class="navItem" v-for="(item, index) in nav" :key="index">
            <nuxt-link :to="`/category/${item._id}/1`">{{item.name}}</nuxt-link>
          </li>
          <li class="navItem">
            <nuxt-link to="/category/other/1">其它</nuxt-link>
          </li>
          <li class="navItem">
            <nuxt-link to="/message">留言</nuxt-link>
          </li>
          <li class="navItem">
            <nuxt-link to="/admin">管理</nuxt-link>
          </li>
        </ul>
        <div class="search">
          <input
            type="text"
            v-model="value"
            placeholder="请输入想搜索的内容"
            @keyup.enter="search('isKeyup')"
          />
          <button type="button" @click="search('btn')">搜索</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: this.$route.query.searchkey
    };
  },
  props: ["nav"],
  methods: {
    search(type) {
      if (this.value) {
        this.$router.replace(`/search/1?searchkey=${this.value}`);
      } else if (type === "isKeyup") {
        this.$router.push(`/`);
      }
    }
  }
};
</script>

<style lang="scss">
.header {
  padding: 40px 0 0;
  margin-bottom: 5px;
  width: 100%;
  line-height: 40px;
  background-color: #aaf;
  .title {
    max-width: 1200px;
    margin: 0 auto 40px;
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
  .navContainer {
    background-color: #4a4a4a;
    .navContent {
      max-width: 1200px;
      margin: 0 auto;
      font-size: 20px;
    }
  }
  .navList {
    float: left;
    .navItem {
      float: left;
      // width: 80px;
      margin: 0 10px;
      padding: 10px;
      color: #fff;
      text-align: center;
      a {
        color: rgba(255, 255, 255, 0.8);
        &:hover {
          color: #aaf;
        }
      }
      .nuxt-link-exact-active {
        font-weight: bold;
      }
    }
  }
  .search {
    float: right;
    margin-top: 10px;
    input {
      padding: 7px;
      border-radius: 2px;
      border: none;
      font-size: 12px;
    }
    button {
      cursor: pointer;
      border-style: none;
      border-radius: 2px;
      padding: 4px 15px;
    }
  }
}
</style>