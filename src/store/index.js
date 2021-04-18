import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      userName: '未登录',
      userImg: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    }
  },
  mutations: {
    changeLogin(state, status){
      state.userInfo = status;
    }
  },
  actions: {
    loginAction({commit}, user){
      commit('changeLogin', user);
    }
  },
  modules: {
  }
})
