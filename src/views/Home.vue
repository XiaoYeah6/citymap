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
        </div>
        <div class="forum-container"></div>
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
.forum-header {
  background: #fff;
  padding-top: 6px;
  padding-left: 6px;
  height: 8%;
  border-radius: 8px;
}
.block {
  width: 120px;
  height: 80px;
}
.forum-container {
  background: #fff;
  border-radius: 10px;
  margin-top: 2%;
  height: 89%;
}
</style>
