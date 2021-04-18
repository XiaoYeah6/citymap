<template>
  <div id="app">
    <div id="header">
      <div id="web-title">
        <span @click="goToHome" class="title-text">城市印象</span>
      </div>
      <div id="head-user">
        <div id="avatar">
          <el-avatar
            :src=userInfo.userImg
          ></el-avatar>
        </div>
        <div id="head-logininfo" @click="goToLogin">
          <div>{{ userInfo.userName }}</div>
        </div>
      </div>
    </div>
    <div id="web-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  methods: {
    goToHome (){
      this.$router.push("/");
    },
    goToLogin (){
      if(this.userInfo.userName == '未登录'){
        this.$router.push("/login");
      }else{
        this.$router.push("/user");
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>


<style lang="scss">
body{
  background: #e8ecf3;
}
#app {
  background: #e5e9f2;
}
#header {
  position: fixed;
  width: 100%;
  height: 10%;
  background: #49afcd;
}
#web-title {
  text-align: center;
  line-height: 70px;
  font-size: 30px;
}
.title-text{
  cursor: pointer;
}
#head-user {
  position: absolute;
  right: 0.1rem;
  top: 5px;
}
#avatar {
  font-size: 0.1rem;
}
#head-logininfo {
  font-size: 0.01rem;
  position: relative;
  top: -10px;
  text-align: center;
  cursor: pointer;
}

#web-body {
  position: absolute;
  top: 80px;
  width: 94%;
  height: 85%;
  left: 3%;
}

</style>
