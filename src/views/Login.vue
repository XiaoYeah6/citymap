<template>
  <div id="login-container">
    <div class="container">
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="登录" name="login">
            <div class="login-container">
              <el-form ref="form" label-width="80px">
                <el-form-item label="用户名">
                  <el-input v-model="loginUsername" id="name-btn"></el-input>
                </el-form-item>
                <el-form-item type="password" label="密码">
                  <el-input
                    v-model="loginPassword"
                    id="pswd-btn"
                    type="password"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-row>
                <el-button type="primary" id="login-btn" @click="loginHandler"
                  >登录</el-button
                >
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <div class="register-container">
              <el-form ref="form" label-width="80px">
                <el-form-item label="用户名">
                  <el-input v-model="registUsername" id="rename-btn"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input
                    v-model="registPassword"
                    id="repswd-btn"
                    type="password"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-row>
                <el-button
                  @click="registHandler"
                  type="primary"
                  id="register-btn"
                  :loading="this.isLoading"
                  >注册</el-button
                >
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
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
      activeName: "login",
      loginUsername: "",
      loginPassword: "",
      registUsername: "",
      registPassword: "",
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(["loginAction"]),
    registHandler() {
      this.isLoading = true;
      if (this.registPassword == "" || this.registUsername == "") {
        this.$alert("用户名或密码不能为空！", "Tips", {
          confirmButtonText: "确定",
        });
        this.isLoading = false;
      } else {
        axios({
          url: url.registUser,
          method: "post",
          data: {
            userName: this.registUsername,
            passWord: this.registPassword,
            userImg: "https://i.loli.net/2021/04/17/uatZ6dsYSrQwLDi.jpg",
          },
        })
          .then((res) => {
            if (res.data.code == 200) {
              const h = this.$createElement;
              this.$notify({
                title: "注册信息",
                message: h("i", { style: "color: teal" }, "恭喜，注册成功！"),
                duration: 2000,
              });
              this.registUsername = this.registPassword = "";
              this.isLoading = false;
              this.activeName = "login";
            } else {
              const h = this.$createElement;
              this.$notify({
                title: "注册信息",
                message: h(
                  "i",
                  { style: "color: teal" },
                  "用户名重复啦，请重试！"
                ),
                duration: 2000,
              });
              this.isLoading = false;
            }
          })
          .catch((err) => {
            const h = this.$createElement;
            this.$notify({
              title: "注册信息",
              message: h(
                "i",
                { style: "color: teal" },
                "抱歉，出现了一点问题！"
              ),
              duration: 2000,
            });
            this.isLoading = false;
          });
      }
    },
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
          }else if(res.data.code == 202){
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
#btn-login #btn-register {
  position: absolute;
  text-align: center;
}
#name-btn {
  width: 200px;
}
#rename-btn {
  width: 200px;
}
#pswd-btn {
  width: 200px;
}
#repswd-btn {
  width: 200px;
}
#login-btn {
  margin-left: 100px;
  width: 150px;
}
#register-btn {
  margin-left: 100px;
  width: 150px;
}
.login-container {
  padding-left: 120px;
}
.register-container {
  padding-left: 120px;
}
</style>
