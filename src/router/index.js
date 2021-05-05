import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'
import Regist from '../views/Regist.vue'
import Publish from '../views/Publish.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/user',
    name: 'User',
    component: User
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/regist',
    name: 'Regist',
    component: Regist
  }, {
    path: '/publish',
    name: 'Publish',
    component: Publish
  }
]

const router = new VueRouter({
  routes
})

export default router
