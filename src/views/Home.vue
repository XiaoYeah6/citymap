<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-upload-imgs/dist/vueUploadImgs.umd.min.js"></script>

<template>
  <div>
    <el-container id="home-container">
      <el-aside id="home-aside">
        <div class="forum-header">
          <div class="block">
            <span class="demonstration"></span>
            <el-cascader
              v-model="value"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
              :show-all-levels="false"
            ></el-cascader>
          </div>
          <div class="up-btn">
            <el-row>
              <el-button type="primary" @click="drawer = true"
                >发布动态</el-button
              >
            </el-row>
          </div>
        </div>
        <div class="forum-container">
          <div class="noneShow" :style="isShowNone">
            <div class="noneText">这座城市还没有人发过动态哦！</div>
          </div>

          <el-col id="articleList" v-infinite-scroll="load">
            <el-card
              shadow="hover"
              class="forum-Item"
              v-for="(item, index) in forumItem"
              :key="index"
            >
              <div class="item-header">
                <img :src="item.userImg" alt="" class="userImg" />
                <span class="userName">{{ item.userName }}</span>
                <span class="time">{{ item.createDate }}</span>
              </div>

              <p class="userText">{{ item.text }}</p>
              <div class="imgUrl-container">
                <div
                  v-for="itemImg in item.imgs"
                  :key="itemImg.imgIndex"
                  class="imgUrl"
                >
                  <img :src="itemImg.url" alt="" />
                </div>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-aside>
      <el-main id="home-main">
        <div class="map" id="map"></div>
        <div>
          <el-row>
            <el-button
              icon="el-icon-aim"
              circle
              id="aim"
              :loading="this.isAimLoad"
              @click="toAim"
            ></el-button>
          </el-row>
        </div>
      </el-main>
    </el-container>
    <el-drawer
      id="publish-title"
      title="动态发表"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <el-row>
        <el-button
          type="primary"
          id="imgUpload-btn"
          round
          @click="uploadForum"
          :loading="this.upLoading"
          >发布动态</el-button
        >
      </el-row>
      <div class="publish-container">
        <el-input
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          v-model="textarea"
          class="publish-input"
        >
        </el-input>
        <div class="imgUpload">
          <vue-upload-imgs
            multiple
            compress
            :before-read="beforeRead"
            :after-read="afterRead"
            :before-remove="beforeRemove"
            :limit="limit"
            :type="type"
            @preview="preview"
            @exceed="exceed"
            @oversize="oversize"
            v-model="files"
          >
            <span class="imgUpload-title">图片上传</span>
            <span class="imgUpload-alert"
              >（限制9张，小于1M，png、jpg格式）</span
            >
          </vue-upload-imgs>
          <div class="preview-bg" v-show="isPreview">
            <div class="dialog">
              <button class="close-preview" @click="closePreview">关闭</button>
              <img :src="previewIMG" class="preview-img" />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";
import url from "../service.config.js";
import { mapState } from "vuex";
import AMap from "AMap";
import citys from "../../data/citys.json";

export default {
  data() {
    return {
      upLoading: false,
      isAimLoad: false,
      currentProId: "110000",
      currentCityId: "110000",
      currentAddress: "北京市西城区大栅栏街道",
      value: ["110000", "110000"],
      options: citys,
      forumItem: [],
      drawer: false,
      direction: "rtl",
      textarea: "",
      articleStart: 0,
      articleLimit: 30,

      //是否显示无人发表动态提示
      isShowNone: "display: none;",

      //上传图片
      files: [],
      maxSize: 1024 * 1024, // 1024 KB
      previewIMG: null,
      limit: 9,
      isPreview: false,
      type: 0, // 0 预览模式 1 列表模式 2 预览模式 + 上传按钮
    };
  },

  mounted() {
    this.MapInit();
  },

  methods: {
    //初次加载以及点击定位按
    toAim() {
      var map = new AMap.Map("map", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 13,
      });
      //定位
      AMap.plugin("AMap.Geolocation", () => {
        var geolocation = new AMap.Geolocation({
          showButton: false,
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          buttonPosition: "RB", //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition((status, result) => {
          if (status == "complete") {
            var addLat = result.position.lat;
            var addLng = result.position.lng;
            var add = addLng + "," + addLat;
            //获取当前城市id
            AMap.plugin("AMap.Geocoder", () => {
              var geocoder = new AMap.Geocoder({
                extensions: "base",
              });
              map.addControl(geocoder);
              geocoder.getAddress(add, (status, result) => {
                if (status === "complete" && result.regeocode) {
                  var currentAddressId =
                    result.regeocode.addressComponent.adcode;
                  this.currentAddress =
                    result.regeocode.addressComponent.province +
                    result.regeocode.addressComponent.city +
                    result.regeocode.addressComponent.district;
                  this.currentCityId = currentAddressId.substring(0, 4) + "00";
                  this.currentProId = currentAddressId.substring(0, 2) + "0000";
                  this.value = [this.currentProId, this.currentCityId];
                  this.getArticle();
                } else {
                  const h = this.$createElement;
                  this.$notify({
                    title: "城市信息",
                    message: h(
                      "i",
                      { style: "color: teal" },
                      "获取当前城市失败！"
                    ),
                    duration: 2000,
                  });
                  this.getArticle();
                }
              });
            });
          } else {
            const h = this.$createElement;
            this.$notify({
              title: "定位信息",
              message: h("i", { style: "color: teal" }, "获取当前位置失败！"),
              duration: 2000,
            });
            this.getArticle();
          }
        });
      });
    },

    //初始化地图
    MapInit() {
      this.toAim();
    },

    // 级联选择器, 点击城市列表时
    handleChange(value) {
      this.forumItem = [];
      this.currentCityId = value[1];
      this.getArticle();
    },
    handleClose(done) {
      if (this.textarea == "" && this.files.length == []) {
        done();
      } else {
        this.$confirm("确认退出吗？")
          .then((_) => {
            done();
          })
          .catch((_) => {});
      }
    },
    //发布动态
    uploadForum() {
      if (this.userInfo.userName == "未登录") {
        alert("请先登录！");
        this.$router.push("/login");
      } else {
        if (this.textarea == "" && this.files == "") {
          alert("请输入内容！");
        } else {
          //上传信息
          this.upLoading = true;
          axios({
            url: url.writeArticle,
            method: "post",
            data: {
              userName: this.userInfo.userName,
              userImg: this.userInfo.userImg,
              text: this.textarea,
              imgs: this.files,
              address: this.currentAddress,
              cityId: this.currentCityId,
            },
          })
            .then((res) => {
              if (res.data.code == 200) {
                const h = this.$createElement;
                this.$notify({
                  title: "发布信息",
                  message: h("i", { style: "color: teal" }, "发布成功！"),
                  duration: 2000,
                });
                this.textarea = "";
                this.files = [];
                this.upLoading = false;
                this.getArticle();
                this.$router.push("/");
              } else {
                const h = this.$createElement;
                this.$notify({
                  title: "发布信息",
                  message: h(
                    "i",
                    { style: "color: teal" },
                    "抱歉，发布失败（502）！"
                  ),
                  duration: 2000,
                });
                this.upLoading = false;
              }
            })
            .catch((err) => {
              const h = this.$createElement;
              this.$notify({
                title: "发布信息",
                message: h(
                  "i",
                  { style: "color: teal" },
                  "出现了一点问题（400）！"
                ),
                duration: 2000,
              });
              this.upLoading = false;
            });
        }
      }
    },
    //获取数据库动态
    getArticle() {
      this.forumItem = [];
      this.isShowNone = "display: none;";
      axios({
        url: url.getArticle,
        method: "get",
        params: {
          cityId: this.currentCityId,
          start: this.articleStart,
          limit: this.articleLimit,
        },
      })
        .then((res) => {
          var i;
          for (i = 0; i < res.data.length; i++) {
            console.log(res.data[i].createDate);
            var originTime = parseInt(res.data[i].createDate.substring(11, 13));
            var zoneTime = 8;
            var currentTime = originTime + zoneTime;
            res.data[i].createDate =
              res.data[i].createDate.substring(5, 10) +
              " " +
              currentTime +
              ":" +
              res.data[i].createDate.substring(14, 16);
          }
          this.forumItem = res.data;
          if (res.data.length == 0) {
            this.isShowNone = "display: ;";
          }
        })
        .catch((err) => {
          console.log("err");
          const h = this.$createElement;
          this.$notify({
            title: "动态信息",
            message: h("i", { style: "color: teal" }, "获取动态失败！"),
            duration: 2000,
          });
        });
    },

    load() {
      getArticle();
    },

    //上传图片
    beforeRemove(index, file) {
      return true;
    },

    preview(index, file) {
      this.previewIMG = file.url;
      this.isPreview = true;
    },

    exceed() {
      alert(`只能上传${this.limit}张图片`);
    },

    beforeRead(files) {
      for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i];
        if (file.type != "image/jpeg" && file.type != "image/png") {
          alert("只能上传jpg和png格式的图片");
          return false;
        }
      }
      return true;
    },

    closePreview() {
      this.isPreview = false;
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>

<style lang="scss">
//地图
#mapcontainer {
  height: 300px;
  width: 500px;
  font-size: 13px;
}

// 全局样式
#home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #e8ecf3;
}

// 地图样式
#home-main {
  padding: 0;
  margin-left: 1%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 20px;
}
.map {
  width: 100%;
  height: 100%;
}
//定位按钮
#aim {
  position: absolute;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  font-size: 15px;
}

// 论坛样式
.noneShow {
  position: absolute;
  width: 300px;
  height: 571px;
  background: #fff;
}
.noneText {
  font-size: 30px;
  margin-top: 30px;
  margin-right: 20px;
  margin-left: 20px;
  text-align: center;
  color: #94a4b8;
}
.el-aside {
  border-radius: 8px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}
.el-aside::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.forum-header {
  background: #fff;
  padding-top: 6px;
  padding-left: 6px;
  height: 52px;
  border-radius: 8px;
  position: fixed;
  top: 80px;
  width: 294px;
  z-index: 999;
}
.block {
  width: 130px;
  height: 80px;
  line-height: 45px;
  margin-left: 10px;
}
.up-btn {
  position: absolute;
  top: 8px;
  right: 15px;
}
.forum-container {
  background-color: #e8ecf3;
  border-radius: 8px;
  margin-top: 70px;
  height: 89%;
  box-sizing: border-box;
  transform: translate(0, 0);
  position: relative;
}
// 文章样式
.forum-Item {
  margin-bottom: 8px;
}
.userImg {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.userName {
  font-size: 16px;
  margin-left: 10px;
}
.time {
  color: #94a4b8;
  position: relative;
  left: 120px;
}
.userText {
  font-size: 18px;
  margin-top: 10px;
  margin-left: 3px;
}
.imgUrl {
  width: 80px;
  height: 80px;
  float: left;
  margin-right: 6px;
  margin-bottom: 5px;
}

//发表页面样式
#publish-title {
  font-size: 25px;
}
.publish-container {
  width: 400px;
}
.publish-input {
  position: relative;
  left: 30px;
}
.imgUpload {
  margin-top: 20px;
  margin-right: 30px;
  margin-left: 30px;
}
.imgUpload-title {
  font-size: 20px;
}
.upload-div-add-img,
.upload-div-img {
  min-width: 100px !important;
  height: 100px !important;
  width: 100px !important;
}
.imgUpload-alert {
  font-size: 5px;
}
#imgUpload-btn {
  position: absolute;
  top: -75px;
  right: 90px;
  width: 130px;
}
</style>
