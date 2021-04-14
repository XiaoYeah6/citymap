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
              <el-button type="primary" round>发表主题</el-button>
            </el-row>
          </div>
        </div>
        <div class="forum-container">
          <ul>
            <li
              class="forum-Item"
              v-for="(item, index) in forumItem"
              :key="index"
            >
              <div class="item-header">
                <img :src="item.userImg" alt="" class="userImg" />
                <span class="userName">{{ item.userName }}</span>
                <span class="time">{{ item.time }}</span>
              </div>

              <p class="userText">{{ item.text }}</p>
              <div class="imgUrl-container">
                <div
                  v-for="itemImg in item.imgs"
                  :key="itemImg.imgIndex"
                  class="imgUrl"
                >
                  <img :src="itemImg.imgUrl" alt="" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-main id="home-main">
        <div id="map"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import BMap from "BMap";

export default {
  mounted() {
    this.mapBD();
  },
  data() {
    return {
      value: [],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
            },
            {
              value: "daohang",
              label: "导航",
            },
          ],
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
            },
            {
              value: "form",
              label: "Form",
            },
            {
              value: "data",
              label: "Data",
            },
            {
              value: "notice",
              label: "Notice",
            },
            {
              value: "navigation",
              label: "Navigation",
            },
            {
              value: "others",
              label: "Others",
            },
          ],
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components",
            },
            {
              value: "sketch",
              label: "Sketch Templates",
            },
            {
              value: "jiaohu",
              label: "组件交互文档",
            },
          ],
        },
      ],
      forumItem: [
        {
          userId: "123",
          userName: "xxx",
          userImg: "https://cdn.v2ex.com/gravatar",
          text:
            "沙发打发撒旦法阿斯蒂芬asfjdosajfpiosajnfddsanfiujsndfijskdhjfuosanfd;",
          time: "2021-03-05",
          imgs: [
            {
              imgIndex: "123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
            {
              imgIndex: "123132123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
            {
              imgIndex: "123132123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
            {
              imgIndex: "123132123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
        {
          userId: "124",
          userName: "x",
          userImg: "https://cdn.v2ex.com/gravatar",
          text: "的说法是否阿斯蒂芬沙发",
          time: "2025-03-01",
          imgs: [
            {
              imgIndex: "123123123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
        {
          userId: "124",
          userName: "x",
          userImg: "https://cdn.v2ex.com/gravatar",
          text: "的说法是否阿斯蒂芬沙发",
          time: "2025-03-01",
          imgs: [
            {
              imgIndex: "123123123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
        {
          userId: "124",
          userName: "x",
          userImg: "https://cdn.v2ex.com/gravatar",
          text: "的说法是否阿斯蒂芬沙发",
          time: "2025-03-01",
          imgs: [
            {
              imgIndex: "123123123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
        {
          userId: "124",
          userName: "x",
          userImg: "https://cdn.v2ex.com/gravatar",
          text: "的说法是否阿斯蒂芬沙发",
          time: "2025-03-01",
          imgs: [
            {
              imgIndex: "123123123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
        {
          userId: "124",
          userName: "x",
          userImg: "https://cdn.v2ex.com/gravatar",
          text: "的说法是否阿斯蒂芬沙发",
          time: "2025-03-01",
          imgs: [
            {
              imgIndex: "123123123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
        {
          userId: "124",
          userName: "x",
          userImg: "https://cdn.v2ex.com/gravatar",
          text: "的说法是否阿斯蒂芬沙发",
          time: "2025-03-01",
          imgs: [
            {
              imgIndex: "123123123123",
              imgUrl: "https://cdn.v2ex.com/gravatar",
            },
          ],
        },
      ],
    };
  },

  methods: {
    // 级联选择器
    handleChange(value) {
      console.log(value);
    },
    // mounted时创建地图并定位
    mapBD() {
      var map = new BMap.Map("map"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 17); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.addControl(new BMap.NavigationControl()); //平移缩放控件
      map.addControl(new BMap.ScaleControl()); //比例尺
      map.addControl(new BMap.GeolocationControl());

      //浏览器定位
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
        } else {
          alert("定位失败，请刷新重试或者手动更换城市！" + this.getStatus());
        }
      });

      //IP定位
      //   function myFun(result) {
      //     var cityName = result.name;
      //     map.setCenter(cityName);
      //     alert("当前定位城市:" + cityName);
      //   }
      //   var myCity = new BMap.LocalCity();
      //   myCity.get(myFun);
    },
  },
};
</script>

<style lang="scss">
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
#map {
  width: 100%;
  height: 100%;
}

// 论坛样式
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
  background: #e8ecf3;
  border-radius: 8px;
  margin-top: 70px;
  height: 89%;
  box-sizing: border-box;
  transform: translate(0, 0);
}
.item-header {
  padding-top: 10px;
}
.forum-Item {
  margin-bottom: 7px;
  background-color: #fff;
  border-radius: 8px;
}
.userImg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-left: 6px;
  margin-right: 6px;
}
.time {
  position: fixed;
  right: 10px;
  color: #94a4b8;
}
// 图片样式
.imgUrl-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin-left: 9px;
  padding-bottom: 6px;
}
.imgUrl {
  float: left;
  margin-left: 10px;
  margin-bottom: 10px;
}
.imgUrl img {
  width: 80px;
  height: 90px;
}
.userText {
  margin-top: 6px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
</style>
