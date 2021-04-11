<template>
  <div id="login-container">
    <div class="container">
      <div class="login-title">登录 / 注册</div>
      <div class="username">用户名</div>
      <el-input placeholder="请输入用户名" v-model="input" clearable class="input"></el-input>
      <div class="password">密码</div>
      <el-input
        placeholder="请输入密码"
        v-model="input"
        show-password
        class="input"
      ></el-input>
      <el-row class="login-button">
        <el-button type="primary" plain id="btn-login">登录</el-button>
        <el-button type="primary" plain id="btn-register">注册</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
#login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.container{
  width: 20%;
  position: absolute;
  left: 40%;
  top: 6%;
}
.login-title{
  font-size: 30px;
  text-align: center;
}
.input{
  width: 100px;
}
.login-button{
  top: 20px;
}
#btn-login #btn-register{
  position: absolute;
  text-align: center;
}

</style>
