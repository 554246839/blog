<template>
  <div class="modal" v-if="innerVisible">
    <div class="modal-container">
      <div class="modal-header">{{title}}</div>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-footer">
        <button type="button" @click="okFun">{{okText}}</button>
        <button type="button" @click="cancelFun" v-if="showCancelBtn">{{cancelText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "提示"
    },
    okText: {
      type: String,
      default: "确认"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    innerVisible: {
      get: function() {
        return this.visible;
      },
      set: function(newValue) {
        this.$emit("update:visible", newValue);
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    okFun() {
      this.innerVisible = false;
      this.$emit("okFun");
    },
    cancelFun() {
      this.innerVisible = false;
    }
  }
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  .modal-container {
    position: absolute;
    min-width: 400px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 2px;
  }
  .modal-header {
    border-bottom: 1px solid #ccc;
    padding: 5px 10px;
  }
  .modal-content {
    padding: 10px;
    max-height: 350px;
    max-width: 1000px;
    overflow: auto;
  }
  .modal-footer {
    padding: 10px;
    button {
      width: 100px;
      height: 25px;
      cursor: pointer;
      margin-top: 20px;
    }
  }
}
</style>