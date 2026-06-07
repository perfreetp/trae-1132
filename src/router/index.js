import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/batch'
  },
  {
    path: '/batch',
    name: 'Batch',
    component: () => import('@/views/BatchCenter.vue'),
    meta: { title: '批次中心', icon: 'Box' }
  },
  {
    path: '/transport',
    name: 'Transport',
    component: () => import('@/views/TransportMap.vue'),
    meta: { title: '运输地图', icon: 'Van' }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('@/views/WarehouseOps.vue'),
    meta: { title: '仓库作业', icon: 'Warehouse' }
  },
  {
    path: '/exception',
    name: 'Exception',
    component: () => import('@/views/ExceptionHandle.vue'),
    meta: { title: '异常处置', icon: 'Warning' }
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/StoreFeedback.vue'),
    meta: { title: '门店反馈', icon: 'Shop' }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/views/FinanceReport.vue'),
    meta: { title: '费用报表', icon: 'Money' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
