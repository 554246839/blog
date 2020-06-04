<template>
  <div class="userEdit">
    <div class="breadcrumb">
      <nuxt-link to="/admin">个人信息</nuxt-link>&nbsp;> 信息编辑
    </div>
    <div class="form">
      <ul class="infoList">
        <li>
          <span class="infoTitle">姓名：</span>
          <input type="text" v-model="info.username" />
        </li>
        <li>
          <span class="infoTitle">生日：</span>
          <input type="text" v-model="info.birthday" />
        </li>
        <li>
          <span class="infoTitle">星座：</span>
          <input type="text" v-model="info.star" />
        </li>
        <li>
          <span class="infoTitle">学历：</span>
          <input type="text" v-model="info.edu" />
        </li>
        <li>
          <span class="infoTitle">毕业院校：</span>
          <input type="text" v-model="info.graduate_institutions" />
        </li>
        <li>
          <span class="infoTitle">自我介绍：</span>
          <textarea rows="6" class="areaContent" v-model="info.self_intro"></textarea>
        </li>
        <li>
          <span class="infoTitle">工作经历：</span>
          <button class="addItem" @click="addExperience">+</button>
          <div class="experience">
            <ul v-for="(item, index) in info.work_experience" :key="index">
              <li>
                <span class="infoTitle">公司名称：</span>
                <input type="text" v-model="item.corp_name" />
                <button class="delItem" @click="delExperience(index)">删除经历</button>
              </li>
              <li>
                <span class="infoTitle">起始时间：</span>
                <input type="date" v-model="item.start_time" /> -
                <input type="date" v-model="item.end_time" />
              </li>
              <li>
                <span class="infoTitle">在职职位：</span>
                <input type="text" v-model="item.post" />
              </li>
              <li>
                <span class="infoTitle">在职职责：</span>
                <textarea rows="6" class="areaContent" v-model="item.responsibility"></textarea>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <span class="infoTitle">参与项目：</span>
          <button class="addItem" @click="addProject()">+</button>
          <div class="projectList">
            <ul v-for="(i, ind) in info.project" :key="ind">
              <li>
                <span>项目名称：</span>
                <input type="text" v-model="i.project_name" />
                <button class="delItem" @click="delProject(ind)">删除项目</button>
              </li>
              <li>
                <span>项目时间：</span>
                <input type="date" v-model="i.start_name" /> -
                <input type="date" v-model="i.end_name" />
              </li>
              <li>
                <span>负责内容：</span>
                <textarea rows="6" class="areaContent" v-model="i.projectContent"></textarea>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData(ctx) {
    let res = await ctx.$axios.get("/server/getUserInfo?edit=true");
    if (res.errcode === 0) {
      return {
        info: res.data
      };
    }
  },
  data() {
    return {
      experienceItem: {
        corp_name: "",
        start_time: "",
        end_time: "",
        post: "",
        responsibility: ""
      },
      projectItem: {
        project_name: "",
        start_name: "",
        end_name: "",
        projectContent: ""
      }
    };
  },
  mounted() {
    console.log(this.info);
  },
  methods: {
    addExperience() {
      this.info.work_experience.push(this.experienceItem);
    },
    addProject() {
      this.info.project.push(this.experienceItem);
    },
    delExperience(index) {
      this.info.work_experience.splice(index, 1);
    },
    delProject(index) {
      this.info.project.splice(index, 1);
    },
    save() {
      this.$axios.post("/server/updateUserInfo", this.info).then(res => {
        if (res.errcode === 0) {
          this.$toast.showToast("更新成功");
          this.$router.push("/admin");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.userEdit {
  padding: 20px 40px;
  .breadcrumb {
    margin-bottom: 20px;
    color: #aaa;
    .editBtn {
      float: right;
    }
  }
  .form {
    input {
      padding: 5px;
      border-radius: 2px;
      border: 1px solid #aaa;
      outline: none;
      width: 300px;
      &[type="date"] {
        width: 134px;
      }
    }
    .infoList li {
      margin-bottom: 10px;
    }
    .infoTitle {
      display: inline-block;
      width: 80px;
    }
    .areaContent {
      vertical-align: top;
      width: 300px;
      padding: 5px;
      border-radius: 2px;
      border: 1px solid #aaa;
      outline: none;
    }
    .addItem {
      height: 24px;
      width: 40px;
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 10px;
    }
    .delItem {
      line-height: 20px;
      width: 80px;
    }
    .experience {
      margin-left: 20px;
    }
    .projectList {
      margin-left: 20px;
    }
  }
}
</style>