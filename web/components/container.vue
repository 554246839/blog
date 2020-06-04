<template>
  <div class="__main">
    <Head @search="search" :nav="aside.cates" />
    <div class="container fixclear">
      <div :class="__class">
        <div class="searchInfo" v-if="isSearch">{{articleList}}</div>
        <slot v-else />
      </div>
      <aside-bar :info="aside" />
    </div>
  </div>
</template>

<script>
import Head from "@/components/head";
import AsideBar from "@/components/aside";

export default {
  name: "container",
  data() {
    return {
      isSearch: false,
      articleList: ""
    };
  },
  props: ["_class", "aside"],
  computed: {
    __class() {
      return this._class ? "content " + this._class : "content";
    }
  },
  components: {
    Head,
    AsideBar
  },
  methods: {
    search(res) {
      let { errcode, data } = res;
      if (errcode === 0) {
        this.isSearch = true;
        this.articleList = data;
      }
      console.log(res, "111111111111");
    }
  }
};
</script>