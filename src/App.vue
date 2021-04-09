<template>
  <div id="app">
    <div id="header">
      <div id="web-title">城市印象</div>
      <div id="head-user">
        <div id="avatar">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>
        <div id="head-logininfo">
          <router-link to="/user">未登录</router-link>
        </div>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
#app{
  background: #e5e9f2;
}
#header{
  position: fixed;
  width: 100%;
  height: 10%;
  background: #ff0036;
}
#web-title{
  text-align: center;
  line-height: 70px;
  font-size: 30px;
}
#head-user{
  position: absolute;
  right: 0.1rem;
  top: 5px;
}
#avatar{
  font-size: 0.1rem;
}
#head-logininfo{
  font-size: 0.01rem;
  position: relative;
  top: -10px;
}
</style>
