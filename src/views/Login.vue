<template>
  <div id="login-container">
    <div class="container">
      <div class="loginTitle">登录</div>
      <div class="text-container">
        <span class="name">用户名</span>
        <el-input
          placeholder="请输入内容"
          v-model="loginUsername"
          id="nameInput"
        >
        </el-input>
        <span class="password">密码</span>
        <el-input
          placeholder="请输入密码"
          v-model="loginPassword"
          show-password
          id="passInput"
        ></el-input>
        <el-row>
          <el-button type="primary" round id="loginBtn" @click="loginHandler" :loading=isLoading>登录</el-button>
        </el-row>
        <div class="toRegist">
          <el-link type="primary" @click="goRegist">去注册</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/service.config.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loginUsername: "",
      loginPassword: "",
      isLoading: false,
    };
  },
  methods: {
    goRegist(){
      this.$router.push('/regist')
    },
    ...mapActions(["loginAction"]),
    loginHandler() {
      this.isLoading = true;
      axios({
        url: url.loginUser,
        method: "post",
        data: {
          userName: this.loginUsername,
          passWord: this.loginPassword,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            const h = this.$createElement;
            this.$notify({
              title: "登录信息",
              message: h("i", { style: "color: teal" }, "登录成功！"),
              duration: 2000,
            });
            //保存登录状态
            this.loginAction(res.data.userInfo);
            this.isLoading = false;
            this.$router.push("/");
          } else if (res.data.code == 201) {
            const h = this.$createElement;
            this.$notify({
              title: "登录信息",
              message: h("i", { style: "color: teal" }, "用户名不存在！"),
              duration: 2000,
            });
            this.isLoading = false;
          } else if (res.data.code == 202) {
            const h = this.$createElement;
            this.$notify({
              title: "登录信息",
              message: h("i", { style: "color: teal" }, "密码错误！"),
              duration: 2000,
            });
            this.isLoading = false;
          }
        })
        .catch((err) => {
          const h = this.$createElement;
          this.$notify({
            title: "登录信息",
            message: h("i", { style: "color: teal" }, "登录失败！请联系管理员"),
            duration: 2000,
          });
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.name{
  position: relative;
  right: 130px;
  top: 33px;
}
.password{
  position: relative;
  right: 130px;
  top: 33px;
}


#login-container {
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
.loginTitle {
  font-size: 30px;
  text-align: center;
}
#loginBtn{
  margin-top: 20px;
  width: 100px;
}
</style>
