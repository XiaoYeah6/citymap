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
export default {};
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
</style>
