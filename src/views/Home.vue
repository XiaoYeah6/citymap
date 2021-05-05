<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-upload-imgs/dist/vueUploadImgs.umd.min.js"></script>

<template>
  <div>
    <div id="home-container">
      <div id="home-main">
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
      </div>
      <el-aside id="home-aside">
        <div class="forum-header">
          <div class="block">
            <span class="demonstration"></span>
            <el-cascader
              v-model="value"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader>
          </div>
          <div class="up-btn">
            <el-row>
              <el-button type="primary" @click="toPublish" :loading=isLoading>发布动态</el-button>
            </el-row>
          </div>
        </div>
        <div class="forum-container">
          <div class="noneShow" :style="isShowNone">
            <div class="noneText">这片区域还没有人发过动态哦！</div>
          </div>

          <el-col id="articleList" v-infinite-scroll="load">
            <el-card
              shadow="hover"
              class="forum-Item"
              v-for="(item, index) in forumItem"
              :key="index"
            >
              <div class="item-header">
                <img :src="item.userImg" alt="" id="userImg" />
                <span class="userName">{{ item.userName }}</span>
                <div class="address">{{ item.address }}</div>
              </div>

              <p class="userText">{{ item.text }}</p>
              <div class="imgUrl-container">
                <div v-for="itemImg in item.imgs" :key="itemImg.imgIndex">
                  <img :src="itemImg.url" alt="" id="imgUrl"/>
                </div>
              </div>
              <span class="time">{{ item.createDate }}</span>
            </el-card>
          </el-col>
        </div>
      </el-aside>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../service.config.js";
import { mapState } from "vuex";
import AMap from "AMap";
import citys from "../../data/citys.json";
import moment from "moment";

export default {
  data() {
    return {
      isLoading: false,
      isAimLoad: false,
      currentProId: "110000",
      currentCityId: "110000",
      currentRegionId: "110102",
      currentPoint: [116.397428, 39.90923],
      currentMarker: [116.392952, 39.892855],
      currentAddress: "北京市西城区大栅栏街道",
      currentMarkerAddress: "北京市西城区大栅栏街道",
      value: ["110000", "110000", "110102"],
      options: citys,
      forumItem: [],
      direction: "rtl",
      showArticlePoint: [],

      markerList: [],
      chooseRegion: [],

      //是否显示无人发表动态提示
      isShowNone: "display: none;",
    };
  },

  mounted() {
    this.MapInit();
  },

  methods: {
    //去发布页面
    toPublish() {
      this.$router.push({
        path: "/publish",
        query: {
          param: this.chooseRegion,
          regionId: this.currentRegionId,
        },
      });
    },

    //获取marker
    formatMarker() {
      var temp = this.markerList.map((item) => {
        var tempA = new AMap.Marker({
          position: new AMap.LngLat(...item), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        tempA.on("click", () => {
          this.showArticlePoint = item;
          this.getArticleByMarker(item);
        });
        return tempA;
      });
      this.markerList = temp;
    },

    //定位
    getLocation() {
      var map = new AMap.Map("map", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 11,
      });
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
            this.currentPoint = [add];
            //获取当前城市id
            AMap.plugin("AMap.Geocoder", () => {
              var geocoder = new AMap.Geocoder({
                extensions: "base",
              });
              map.addControl(geocoder);
              geocoder.getAddress(add, (status, result) => {
                if (status === "complete" && result.regeocode) {
                  console.log(result);
                  var currentAddressId =
                    result.regeocode.addressComponent.adcode;
                  this.currentAddress =
                    result.regeocode.addressComponent.province +
                    result.regeocode.addressComponent.city +
                    result.regeocode.addressComponent.district;
                  this.currentCityId = currentAddressId.substring(0, 4) + "00";
                  this.currentProId = currentAddressId.substring(0, 2) + "0000";
                  this.currentRegionId = currentAddressId;
                  this.value = [
                    this.currentProId,
                    this.currentCityId,
                    this.currentRegionId,
                  ];
                  this.chooseRegion = this.currentPoint;
                  this.getArticleById().then(() => {
                    this.formatMarker();
                    map.add(this.markerList);
                  });
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
                  this.getArticleById();
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
            this.getArticleById();
          }
        });
      });
    },

    //初次加载以及点击定位按
    toAim() {
      //定位
      this.getLocation();
    },

    //初始化地图
    MapInit() {
      this.toAim();
    },

    // 级联选择器, 点击城市列表时
    async handleChange(value) {
      this.forumItem = [];
      this.currentRegionId = value[3];
      const res = await axios({
        url: "https://restapi.amap.com/v3/config/district?parameters",
        method: "get",
        params: {
          key: "0f1d9599c9ab0432e6c4d7542d37915e",
          keywords: this.value[2],
          subdistrict: 0,
        },
      });
      this.chooseRegion = [res.data.districts[0].center];
      var lng = res.data.districts[0].center.substring(0, 10);
      var lat = res.data.districts[0].center.substring(11, 21);
      var map = new AMap.Map("map", {
        resizeEnable: true,
        center: [lng, lat],
        zoom: 15,
      });

      this.getArticleById();
    },

    //获取数据库动态
    getArticleById() {
      this.forumItem = [];
      this.isShowNone = "display: none;";
      return axios({
        url: url.getArticleById,
        method: "get",
        params: {
          regionId: this.currentRegionId,
        },
      })
        .then((res) => {
          var i;
          var tempmarkerList = [];
          res.data.map((item) => {
            item.createDate = moment(item.createDate).format("lll");
            return item;
          });
          for (i = 0; i < res.data.length; i++) {
            // res.data[i].marker
            tempmarkerList.push(res.data[i].marker);
          }
          this.markerList = tempmarkerList;
          this.forumItem = res.data;
          if (res.data.length == 0) {
            this.isShowNone = "display: ;";
          }
          console.log(res.data);
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

    //根据marker点获取文章
    getArticleByMarker(mk) {
      this.forumItem = [];
      console.log(mk);
      axios({
        url: url.getArticleByMarker,
        method: "post",
        data: {
          markerPoint: mk,
        },
      })
        .then((res) => {
          console.log(res);
          res.data.map((item) => {
            item.createDate = moment(item.createDate).format("lll");
            return item;
          });
          this.forumItem = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    load() {
      getArticleById();
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
  background-color: #e8ecf3;
  display: flex;
  flex-direction: row;
}

// 地图样式
#home-main {
  flex: 1.2;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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
#home-aside {
  flex: 0.5;
  margin-left: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.noneShow {
  position: absolute;
  width: 420px;
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
  width: 412px;
  z-index: 999;
}
.address{
  font-size: 10px;
  width: 300px;
  color: #94a4b8;
  height: 20px;
  position: relative;
  left: 90px;
  top: -25px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.block {
  width: 240px;
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
  margin-bottom: 10px;
}
.item-header {
  margin-bottom: 10px;
  height: 30px;
}
#userImg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.userName {
  margin-left: 6px;
  position: relative;
  top: 3px;
}
.userText {
  font-size: 16px;
  margin-left: 3px;
}
#imgUrl {
  width: 160px;
  height: 160px;
}
.time{
  color: #94a4b8;
  position: relative;
  top: 10px;
  left: 240px;
}
</style>
