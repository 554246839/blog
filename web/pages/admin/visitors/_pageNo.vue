<template>
  <div class="visitors">
    <div class="breadcrumb">访客数据</div>
    <div v-if="list.data.length">
      <div class="info">
        <ul class="visitorList">
          <li class="liHeader">
            <div class="visitDate">日期</div>
            <div class="visitNum">访问数</div>
            <div class="artEdit">操作</div>
          </li>
          <li v-for="item in list.data" :key="item._id">
            <div class="visitDate">{{item.date}}</div>
            <div class="visitNum">{{item.totals}}</div>
            <div class="artEdit">
              <a href="javascript:;" @click="showDetail(item)">查看详情</a>
            </div>
          </li>
        </ul>
      </div>
      <pagination
        :count="list.count"
        :total="list.total"
        :pageNo="list.pageNo"
        path="/admin/visitors/"
      />
    </div>
    <div class="nodata" v-else>暂无数据</div>

    <modal :title="`所有IP - ${currDate}`" :visible.sync="showModal" :showCancelBtn="false">
      <ul class="ipContent">
        <li v-for="item in ipList" :key="item.ip">
          <span class="ipTag">
            <strong>ip:</strong>
            {{item.ip}}
          </span>
          <span class="timeTag">
            <strong>time:</strong>
            {{item.time}}
          </span>
          <strong>url:</strong>
          {{item.url}}
        </li>
      </ul>
    </modal>
  </div>
</template>

<script>
import Pagination from "@/components/pagination";
import modal from "@/components/modal";

export default {
  async asyncData({ params, $axios, redirect }) {
    let pageNo = params.pageNo;
    let { errcode, data = {} } = await $axios.get(
      `/server/getVisitors/${pageNo}`
    );
    if (errcode === 0) {
      let path = "";

      if (data.pageNo > data.total) {
        path = `/admin/visitors/${data.total}`;
      } else if (data.pageNo < 1) {
        path = `/admin/visitors/1`;
      }

      path && redirect(path);
    }

    return { list: data };
  },
  data() {
    return {
      showModal: false,
      ipList: [],
      currDate: ""
    };
  },
  components: {
    Pagination,
    modal
  },
  methods: {
    showDetail(data) {
      this.currDate = data.date;
      let arr = [];
      let _data = data.visitors;
      for (let k in _data) {
        arr.push({
          ip: k.replace(/\-/g, "."),
          ..._data[k]
        });
      }
      this.ipList = arr;
      this.showModal = true;
    }
  }
};
</script>

<style lang="scss">
.visitors {
  padding: 20px 40px;
  .breadcrumb {
    margin-bottom: 20px;
    color: #aaa;
  }
  .visitorList {
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
      .visitDate {
        width: 30%;
      }
      .visitNum {
        text-align: center;
        width: 35%;
      }
      .artEdit {
        text-align: right;
        width: 30%;
      }
    }
  }
  .ipContent {
    overflow: auto;
    white-space: nowrap;
    span {
      margin-right: 10px;
    }
    .ipTag {
      display: inline-block;
      width: 160px;
    }
    .timeTag {
      display: inline-block;
      width: 100px;
    }
  }
}
</style>