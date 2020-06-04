<template>
  <div class="articleEdit">
    <div class="breadcrumb">{{isModify ? "文章编辑" : "文章发布"}}</div>
    <div class="editMain">
      <ul class="infoList">
        <li>
          <span class="infoTitle">标题：</span>
          <input type="text" v-model="articleInfo.title" />
        </li>
        <li>
          <span class="infoTitle">标签：</span>
          <input type="text" v-model="articleInfo.tags" />
        </li>
        <li>
          <span class="infoTitle">分类：</span>
          <div class="categories">
            <label v-for="(item, index) in categories" :key="index">
              <input
                type="radio"
                v-model="articleInfo.categoryId"
                name="category"
                :value="item._id"
              />
              {{item.name}}
            </label>
            <label>
              <input type="radio" v-model="articleInfo.categoryId" name="category" value="-1" /> 其它
            </label>
            <input type="text" v-model="newCategory" v-if="addStatus" class="typeName" />
            <button type="button" @click="addStatus = true" v-if="!addStatus">新增</button>
            <button type="button" @click="addCategory" v-if="addStatus">确定</button>
            <button type="button" @click="addStatus = false" v-if="addStatus">取消</button>
          </div>
        </li>
        <li>
          <span class="infoTitle">内容：</span>
          <div id="editor">
            <mavon-editor
              style="height: 100%"
              v-model="articleInfo.mavon"
              ref="md"
              codeStyle="mono-blue"
              :tabSize="2"
              @change="changeData"
              @imgAdd="imgAdd"
              @save="save"
            ></mavon-editor>
          </div>
        </li>
      </ul>
      <button @click="submit(true)">{{isModify ? '保存' : '发表'}}</button>
      <button @click="submit(false)">保存为草稿</button>
    </div>
  </div>
</template>

<script>
let getCategories = function(ctx) {
  return new Promise((resolve, reject) => {
    ctx.$axios.get("/web/getCategories").then(res => {
      if (res.errcode === 0) {
        resolve(res.data);
      } else {
        reject([false]);
      }
    });
  });
};
export default {
  async asyncData(ctx) {
    let id = ctx.params.id;
    let _data = {
      title: "",
      categoryId: "",
      content: "",
      read_num: 0,
      comments: 0,
      likes: 0,
      tags: "",
      mavon: ""
    };
    let categories = await getCategories(ctx);

    if (id !== "0") {
      let { errcode, data } = await ctx.$axios.get(
        "/server/getArticleDetail?id=" + id
      );
      if (errcode === 0) {
        _data = data;
      }
    }
    return {
      isModify: id !== "0",
      articleInfo: _data,
      categories: categories || []
    };
  },
  data() {
    return {
      newCategory: "",
      addStatus: false
    };
  },
  methods: {
    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("image", $file);

      this.$axios({
        url: "/server/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(data => {
        // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
        this.$refs.md.$img2Url(pos, data.data.url);
      });
    },
    changeData(value, render) {
      this.articleInfo.content = render;
    },
    addCategory() {
      let categoryName = this.newCategory;
      if (!categoryName) {
        this.$toast.showToast("请输入分类名字");
        return;
      }
      this.$axios
        .post("/server/addCategory", { name: categoryName })
        .then(res => {
          if (res.errcode === 0) {
            this.addStatus = false;
            this.newCategory = "";
            this.$toast.showToast("添加成功");

            getCategories(this).then(db => {
              if (db) {
                this.categories = db || [];
              }
            });
          } else {
            this.$toast.showToast("添加失败");
          }
        });
    },
    save(value, render) {
      this.submit(false);
    },
    // isPublic: 是否发布，否为草稿
    submit(isPublic) {
      let { title, content, categoryId } = this.articleInfo;
      if (!title || !content || !categoryId) {
        this.$toast.showToast("发布失败");
        return;
      }

      let path = "";
      let reg = /<\/?.+?\/?>/g;

      if (this.isModify) {
        path = "/server/updateArticleInfo";
      } else {
        path = "/server/issueArticle";
        this.articleInfo.time = new Date().toISOString();
      }
      this.articleInfo.isPublic = isPublic;
      this.articleInfo.desc = this.articleInfo.content
        .replace(reg, "")
        .trim()
        .substring(0, 250);

      this.$axios.post(path, this.articleInfo).then(res => {
        if (res.errcode === 0) {
          if (!isPublic) {
            this.$toast.showToast("已保存为草稿");
          } else {
            this.$toast.showToast(this.isModify ? "更新成功" : "发布成功");
            this.$router.back();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.articleEdit {
  padding: 20px 40px;
  .breadcrumb {
    margin-bottom: 20px;
    color: #aaa;
  }
  .editMain {
    input:not([type="radio"]) {
      padding: 5px;
      border-radius: 2px;
      border: 1px solid #aaa;
      outline: none;
      width: 300px;
    }
    .infoList li {
      margin-bottom: 10px;
    }
    .infoTitle {
      display: inline-block;
      width: 60px;
    }
    .categories {
      display: inline-block;
      width: 80%;
      vertical-align: top;
      label {
        margin-right: 20px;
      }
      .typeName {
        width: 100px;
      }
    }
  }
  #editor {
    display: inline-block;
    vertical-align: top;
    width: 94%;
    height: 480px;
  }
}
</style>