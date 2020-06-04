<template>
  <div class="userinfo">
    <div class="breadcrumb">
      个人信息
      <button class="editBtn">
        <nuxt-link to="/admin/userEdit">编辑</nuxt-link>
      </button>
    </div>
    <div class="info">
      <ul>
        <li>姓名：{{userInfo.username}}</li>
        <li>星座：{{userInfo.star}}</li>
        <li>学历：{{userInfo.edu}}</li>
        <li>
          自我介绍：
          <span class="contentBox" v-html="userInfo.self_intro"></span>
        </li>
        <li>毕业院校：{{userInfo.graduate_institutions}}</li>
        <li>
          工作经历：
          <div class="experience">
            <ul v-for="(item, index) in userInfo.work_experience" :key="index">
              <li>公司名称：{{item.corp_name}}</li>
              <li>在职时期：{{item.start_time + ' - ' + item.end_time}}</li>
              <li>在职职位：{{item.post}}</li>
              <li>
                在职职责：
                <span class="contentBox" v-html="item.responsibility"></span>
              </li>
            </ul>
          </div>
        </li>
        <li>
          负责项目：
          <ul v-for="(i, ind) in userInfo.project" :key="ind" class="projectInfo">
            <li>项目名称：{{i.project_name}}</li>
            <li>起始时间：{{i.start_name + ' - ' + i.end_name}}</li>
            <li>
              工作职责：
              <span class="contentBox" v-html="i.projectContent"></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ isLogined, req, $axios }) {
    let { errcode, data } = await $axios.get("/server/getUserInfo");
    if (errcode === 0) {
      return { userInfo: data };
    }
  }
};
</script>

<style lang="scss">
.userinfo {
  padding: 20px 40px;
  .breadcrumb {
    margin-bottom: 20px;
    color: #aaa;
    .editBtn {
      float: right;
    }
  }
  .info {
    li {
      line-height: 40px;
    }
    .experience {
      margin-left: 20px;
      vertical-align: top;
      width: 70%;
      ul {
        margin-bottom: 20px;
      }
    }
    .projectInfo {
      margin-left: 20px;
    }
  }
  .contentBox {
    display: inline-block;
    vertical-align: top;
    line-height: 1.8;
    margin-top: 5px;
  }
}
</style>