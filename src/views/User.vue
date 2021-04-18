<template>
  <div id="user-container">
    <div class="container">
      <el-row>
        <el-button type="warning" round id="logout-btn" @click="logout"
          >退出登录</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      initInfo: {
        userName: "未登录",
        userImg:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      },
    };
  },
  methods: {
    ...mapActions(["loginAction"]),
    logout() {
      this.loginAction(this.initInfo);
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
#user-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
.container {
  width: 600px;
  position: absolute;
  height: 300px;
  background-color: #fff;
  left: 410px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding-top: 20px;
  padding-left: 20px;
  border-radius: 10px;
  top: 50px;
}
#logout-btn {
  width: 130px;
}
</style>
