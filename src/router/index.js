import Vue from 'vue'
import VueRouter from 'vue-router'

import layout from "@/layouts/index.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'index',
        component: () =>
            import ('@/views/index'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: '/alreadyExisted',
        name: 'index',
        component: () =>
            import ('@/views/alreadyExisted'),
        meta: { title: '已有任务', keepAlive: false }
      },
      {
        path: '/extractionShow',
        name: 'index',
        component: () =>
            import ('@/views/extractionShow'),
        meta: { title: '抽取展示', keepAlive: false }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
