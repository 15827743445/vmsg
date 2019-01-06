import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/home'
import Users from '@/components/users'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      // name: 'HelloWorld',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }]
    },{
      name: 'login',
      path: '/login',
      component: Login

  }
  ]
})
