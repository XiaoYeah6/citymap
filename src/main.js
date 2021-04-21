import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueUploadImgs from 'vue-upload-imgs'

Vue.config.productionTip = false

import '@/assets/css/reset.css'
import '@/assets/js/rem.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../mock/mock.js'

Vue.use(ElementUI);
Vue.use(VueUploadImgs);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
