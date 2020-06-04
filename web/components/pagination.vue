<template>
  <div class="pagination">
    <button v-if="pageNo !== 1" @click="prevPage(pageNo - 1)">上一页</button>
    <input type="text" v-model="curPage" class="curPage" @change="change" />
    / {{total}} 页
    <button v-if="pageNo !== total" @click="nextPage(pageNo + 1)">下一页</button>
    总 {{count}} 条
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number
    },
    total: {
      type: Number
    },
    pageNo: {
      type: Number
    },
    path: {
      type: String
    },
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      curPage: ""
    };
  },
  created() {
    this.curPage = this.pageNo;
  },
  methods: {
    change() {
      let { curPage, path, total } = this;

      let _pageNo = curPage;
      if (_pageNo < 1) {
        this.curPage = _pageNo = 1;
      } else if (_pageNo > total) {
        this.curPage = _pageNo = total;
      }

      this.$router.push(path + _pageNo + this.query);
    },
    prevPage(index) {
      this.curPage = index;
      this.$router.push(this.path + index + this.query);
    },
    nextPage(index) {
      this.curPage = index;
      this.$router.push(this.path + index + this.query);
    }
  }
};
</script>

<style lang="scss">
.pagination {
  padding: 20px 0 15px;
  background-color: inherit;
  text-align: center;
  .curPage {
    width: 50px;
    text-align: center;
  }
}
</style>