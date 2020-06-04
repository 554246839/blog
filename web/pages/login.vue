<template>
  <div class="login">
    <p>请输入ping码进入管理页面</p>
    <input
      class="pingInput"
      autofocus
      type="password"
      placeholder="请输入ping码"
      v-model="pingCode"
      @keydown.enter="submit"
    />
    <div>
      <button class="submit" @click="cancel">取消</button>
      <button class="submit" @click="submit">确认</button>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "登录 - 康冬的个人网站 - Kang Dong's Personal Website"
    };
  },
  data() {
    return {
      pingCode: ""
    };
  },
  methods: {
    cancel() {
      this.$router.push("/");
    },
    submit() {
      if (!this.pingCode) {
        this.$toast.showToast("请输入ping码");
      }
      this.$axios
        .post("/server/verifyCode", {
          code: this.pingCode
        })
        .then(res => {
          console.log(res);
          if (res.errcode === 0 && res.data.token) {
            this.pingCode = "";
            this.common.setCookie("token", res.data.token, 1 / 2);
            this.$router.push("/admin");
          } else {
            this.$toast.showToast(res.msg);
          }
        });
    }
  }
};
</script>

<style lang="scss">
.login {
  background: #fff;
  width: 500px;
  padding: 40px 80px;
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .pingInput {
    padding: 5px;
    margin: 10px 0 40px;
    border: 1px solid #666;
    border-radius: 2px;
    width: 300px;
  }
  button {
    margin-right: 10px;
    width: 100px;
    cursor: pointer;
    height: 30px;
  }
}
</style>