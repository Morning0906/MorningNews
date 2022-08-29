import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'

// 路由懒加载

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
    beforeEnter (to, from, next) {
      if (getToken()?.length > 0) { // vuex里有token(代表登录过, 但是一定要注意过期和主动退出要先清除vuex和本地的token, 让其跳转登录页)
        next('/layout/home')
      }
      next()
    }
  },
  {
    path: '/layout',
    // component: Layout,
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        // component: Home
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页滚动条设置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult')
  },
  {
    path: '/detail',
    component: () => import(/* webpackChunkName: "Detail" */ '@/views/ArticleDetail')
  },
  {
    // 用户编辑页
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  {
    // 聊天室
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 全局守卫
// router.beforeEach((to, from, next) => {
//   // 有token, 不能去登录页
//   // 无token, 需要用户"权限"的才需要去登录页
//   if (getToken()?.length > 0 && to.path === '/login') {
//     // 证明有token-已经登录了
//     next(false) // 阻止跳转原地呆着
//   } else {
//     next()
//   }
// })

export default router
