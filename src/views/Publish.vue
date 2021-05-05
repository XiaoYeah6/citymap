<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-upload-imgs/dist/vueUploadImgs.umd.min.js"></script>

<template>
  <div>
    <div id="container">
      <div id="map-container" class="map" tabindex="0"></div>
      <div class="pub-container">
        <div class="allPub">
          <div class="showPosition">您当前所选择的位置是:</div>
          <div class="position">{{ this.currentAddress }}</div>
          <el-input
            type="textarea"
            :rows="9"
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
          <div class="block">
            <span id="demonstration">请选择照片拍摄日期</span>
            <div id="chooseDate">
              <el-date-picker
                v-model="imgDate"
                type="month"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </div>
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
            id="imgs-container"
          >
          </vue-upload-imgs>
          <div class="preview-bg" v-show="isPreview">
            <div class="dialog">
              <button class="close-preview" @click="closePreview">关闭</button>
              <img :src="previewIMG" class="preview-img" />
            </div>
          </div>
          <el-row id="upBtn">
            <el-button type="primary" round @click="uploadForum"
              >发布动态</el-button
            >
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amap from "AMap";
import axios from "axios";
import url from "../service.config.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      currentPoint: [116.397428, 39.90923],
      currentAddress: "北京市西城区大栅栏街道",
      textarea: "",
      currentMarker: [116.397428, 39.90923],
      currentRegionId: "",

      //上传图片
      files: [],
      maxSize: 1024 * 1024 * 10, // 1024 KB
      previewIMG: null,
      limit: 8,
      isPreview: false,
      type: 0, // 0 预览模式 1 列表模式 2 预览模式 + 上传按钮

      //日期选择
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      imgDate: "",
    };
  },

  mounted() {
    this.initMap();
  },

  created() {
    var param = this.$route.query.param;
    console.log(param)
    var formatPoint = param[0].split(",");
    var point = formatPoint.map((item) => {
      return Number(item);
    });
    this.currentPoint = point;
    this.currentRegionId = this.$route.query.regionId;
  },

  methods: {
    initMap() {
      AMapUI.loadUI(["misc/PositionPicker"], (PositionPicker) => {
        var map = new AMap.Map("map-container", {
          resizeEnable: true,
          scrollWheel: true,
          center: this.currentPoint,
          zoom: 15,
        });
        var positionPicker = new PositionPicker({
          mode: "dragMap",
          map: map,
        });

        positionPicker.on("success", (positionResult) => {
          console.log(positionResult.position);
          this.currentAddress = positionResult.address;
          var lng = positionResult.position.lng.toFixed(3);
          var lat = positionResult.position.lat.toFixed(3);
          var tempPosition = [lng, lat];
          var point = tempPosition.map((item) => {
            return Number(item);
          });
          this.currentMarker = point;
        });
        positionPicker.on("fail", (positionResult) => {});
        positionPicker.start();
        map.panBy(0, 1);

        map.addControl(
          new AMap.ToolBar({
            liteStyle: true,
          })
        );
      });
    },

    //发布动态
    uploadForum() {
      if (this.userInfo.userName == "未登录") {
        alert("请先登录！");
        this.$router.push("/login");
      } else {
        if (this.textarea == "" && this.files.length == 0) {
          alert("请输入内容！");
        } else {
          //上传信息
          if (this.imgDate == "" && this.files.length != 0) {
            alert("请选择照片拍摄时间！");
          } else {
            if (false) {
              alert("请上传图片！");
            } else {
              console.log(this.files);
              axios({
                url: url.writeArticle,
                method: "post",
                data: {
                  userName: this.userInfo.userName,
                  userImg: this.userInfo.userImg,
                  text: this.textarea,
                  imgs: this.files,
                  imgsDate: this.imgDate,
                  address: this.currentAddress,
                  regionId: this.currentRegionId,
                  marker: this.currentMarker,
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
                  console.log(err)
                });
            }
          }
        }
      }
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
    afterRead(file) {
      console.log(file);
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
#container {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #e8ecf3;
  display: flex;
  flex-direction: row;
}
#map-container {
  flex: 1.2;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

//右侧
.pub-container {
  flex: 0.8;
  background: #fff;
  margin-left: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.allPub {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
}
.showPosition {
  width: 100%;
  height: 20px;
  color: #677d9a;
}
.position {
  font-size: 16px;
  margin-bottom: 6px;
  margin-left: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
#demonstration {
  font-size: 14px;
  color: #677d9a;
  width: 400px;
  position: relative;
  top: 6px;
}
#chooseDate {
  position: relative;
  top: -35px;
  right: -240px;
}

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
.upload-div-add-img,
.upload-div-img {
  min-width: 100px !important;
  height: 100px !important;
  width: 100px !important;
}
#imgs-container {
  width: 100%;
  height: 120px;
}
#upBtn {
  position: relative;
  top: 110px;
  left: 420px;
}
</style>
