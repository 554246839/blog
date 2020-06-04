<template>
  <container _class="message" :aside="aside">
    <div class="tips">如果您有什么建议和反馈请留言，收到后会将以邮件方式回复</div>
    <ul class="form">
      <li>
        <span>昵称：</span>
        <input type="text" placeholder="请输入昵称" v-model="nickname" />
      </li>
      <li>
        <span>邮箱：</span>
        <input type="text" placeholder="请输入回复邮件地址" v-model="email" />
      </li>
      <li>
        <span>内容：</span>
        <textarea type="text" class="msgContent" placeholder="请输入内容" v-model="content"></textarea>
      </li>
      <li class="btnCont">
        <button type="button" class="sendBtn" @click="send">发送</button>
      </li>
    </ul>
  </container>
</template>

<script>
import Container from "@/components/container";

export default {
  head() {
    return {
      title: "留言 - 康冬的个人网站 - Kang Dong's Personal Website"
    };
  },
  async asyncData(ctx) {
    let aside = await ctx.$axios.get("/web/getAsideShow");
    if (aside.errcode === 0) {
      return {
        aside: aside.data
      };
    }
  },
  data() {
    return {
      nickname: "",
      email: "",
      content: ""
    };
  },
  components: {
    Container
  },
  methods: {
    send() {
      if (this.content) {
        let _data = {
          nickname: this.nickname,
          email: this.email,
          content: this.content
        };
        this.$axios.post("/web/sendMessage", _data).then(res => {
          if (res.errcode === 0) {
            this.$toast.showToast("发送成功! 感谢您的反馈");

            this.nickname = "";
            this.email = "";
            this.content = "";
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.message {
  .tips {
    margin-bottom: 20px;
  }
  .form {
    padding-bottom: 200px;
    li {
      margin-bottom: 10px;
    }
  }
  input,
  textarea {
    padding: 5px;
    border-radius: 2px;
    border: 1px solid #aaa;
    outline: none;
    width: 300px;
  }
  .msgContent {
    vertical-align: top;
    height: 100px;
    width: 500px;
  }
  .sendBtn {
    width: 100px;
    height: 25px;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 55px;
  }
}
</style>
