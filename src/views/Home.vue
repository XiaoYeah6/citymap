<template>
  <div>
    <el-container id="home-container">
      <el-aside id="home-aside"></el-aside>
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
  methods: {
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
          alert("定位失败" + this.getStatus());
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
#home-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
#home-aside {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
#home-main {
  padding: 0;
  margin-left: 1%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
#map {
  width: 100%;
  height: 100%;
}
</style>
