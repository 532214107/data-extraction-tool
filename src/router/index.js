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
        meta: { title: '首页 - 数据抽取工具', keepAlive: false }
      },
      {
        path: '/alreadyExisted',
        name: 'alreadyExisted',
        component: () =>
            import ('@/views/alreadyExisted'),
        meta: { title: '已有任务 - 数据抽取工具', keepAlive: false }
      },
      {
        path: '/extractionShow',
        name: 'extractionShow',
        component: () =>
            import ('@/views/extractionShow'),
        meta: { title: '抽取展示 - 数据抽取工具', keepAlive: false }
      }
    ]
  },
  {
    path: '/showMessage',
    name: 'showMessage',
    component: () =>
        import ('@/views/showMessage'),
    meta: { title: '数据统计 - 数据抽取工具', keepAlive: false }
  }
]

const router = new VueRouter({
  routes
})

export default router
