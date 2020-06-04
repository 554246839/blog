<template>
  <div class="toast" v-if="visible">
    <div class="msg">{{msg || '这是一条提示'}}</div>
  </div>
</template>

<script>
export default {
  name: "toast",
  data() {
    return {
      visible: false,
      msg: ""
    };
  },
  methods: {
    hide() {
      this.visible = false;
    },
    showToast(msg) {
      this.visible = true;
      this.msg = msg;
      setTimeout(() => {
        this.hide();
      }, 2000);
    }
  }
};
</script>

<style lang="scss">
.toast {
  position: fixed;
  min-width: 270px;
  padding: 5px 10px;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
  background-color: #edf2fc;
  border-radius: 2px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 9999;
  .msg {
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}
</style>