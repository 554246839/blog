<template>
  <div class="messageInfo">
    <div class="breadcrumb">留言管理</div>
    <div v-if="list.data.length">
      <div class="info">
        <ul class="articleList">
          <li class="liHeader">
            <div class="msgDate">日期</div>
            <div class="msgNick">昵称</div>
            <div class="msgEmail">邮箱</div>
            <div class="msgContent">留言内容</div>
            <div class="msgReply">回复内容</div>
            <div class="msgReplyTime">回复时间</div>
            <div class="msgEdit">操作</div>
          </li>
          <li v-for="item in list.data" :key="item._id">
            <div class="msgDate">{{item.date}}</div>
            <div class="msgNick">{{item.nickname}}</div>
            <div class="msgEmail">{{item.email}}</div>
            <div class="msgContent" :title="item.content">{{item.content}}</div>
            <div class="msgReply" :title="item.reply">{{item.reply}}</div>
            <div class="msgReplyTime" :title="item.replyTime">{{item.replyTime}}</div>
            <div class="msgEdit">
              <a href="javascript:;" v-if="item.reply">已回复</a>
              <a href="javascript:;" v-else @click="reply(item)">回复</a>
            </div>
          </li>
        </ul>
      </div>
      <pagination
        :count="list.count"
        :total="list.total"
        :pageNo="list.pageNo"
        path="/admin/message/"
      />
    </div>
    <div class="nodata" v-else>暂无数据</div>

    <modal title="发送邮件" okText="发送" :visible.sync="showModal" @okFun="sendEmail">
      <ul class="emailContent">
        <li>
          <span>主题：</span>
          <input v-model="subject" type="text" />
        </li>
        <li>
          <span>内容：</span>
          <textarea v-model="reContent"></textarea>
        </li>
      </ul>
    </modal>
  </div>
</template>

<script>
import Pagination from "@/components/pagination";
import modal from "@/components/modal";

export default {
  async asyncData({ params, $axios, redirect, common }) {
    let pageNo = params.pageNo;
    let { errcode, data = {} } = await $axios.get(
      `/server/getMessage/${pageNo}`
    );
    if (errcode === 0) {
      let path = "";

      if (data.pageNo > data.total && data.total) {
        path = `/admin/message/${data.total}`;
      } else if (data.pageNo < 1) {
        path = `/admin/message/1`;
      }

      path && redirect(path);
    }

    return { list: data };
  },
  data() {
    return {
      reContent: "",
      subject: "前端杂货铺的回复留言",
      showModal: false,
      activeItem: ""
    };
  },
  components: {
    Pagination,
    modal
  },
  methods: {
    init() {
      this.$axios.get(`/server/getMessage/${this.list.pageNo}`).then(res => {
        if (res.errcode === 0) {
          this.list = res.data;
        }
      });
    },
    reply(item) {
      this.showModal = true;
      this.activeItem = item;
      this.reContent = "";
    },
    sendEmail() {
      let to = this.activeItem.email;
      let _id = this.activeItem._id;
      let html = this.reContent;
      let subject = this.subject;
      this.$axios
        .post("/server/replyMessage", { to, subject, html, _id })
        .then(res => {
          if (res.errcode === 0) {
            this.$toast.showToast("回复成功");
            this.init();
          } else {
            this.$toast.showToast("发送失败");
          }
        });
    }
  }
};
</script>

<style lang="scss">
.messageInfo {
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
      .msgDate,
      .msgReplyTime {
        width: 10%;
      }
      .msgNick {
        width: 7%;
      }
      .msgEmail {
        width: 12%;
      }
      .msgContent,
      .msgReply {
        width: 25%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      .msgEdit {
        text-align: right;
        width: 7%;
      }
    }
  }
  .emailContent {
    li {
      margin-bottom: 10px;
    }
    input,
    textarea {
      padding: 5px;
      border-radius: 2px;
      border: 1px solid #aaa;
      outline: none;
      width: 300px;
    }
    textarea {
      vertical-align: top;
      height: 100px;
      width: 500px;
    }
  }
}
</style>