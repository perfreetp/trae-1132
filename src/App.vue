<template>
  <div class="app-layout">
    <el-container class="main-container">
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <el-icon :size="28" color="#60a5fa"><ColdDrink /></el-icon>
          <span class="logo-text">冷链监控</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="nav-menu"
          background-color="#0f172a"
          text-color="#94a3b8"
          active-text-color="#60a5fa"
          router
        >
          <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="route.path">
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </el-menu>
        <div class="duty-info">
          <div class="duty-avatar">
            <el-icon :size="32"><Avatar /></el-icon>
          </div>
          <div class="duty-detail">
            <div class="duty-name">张值班</div>
            <div class="duty-role">冷链运营中心</div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <span class="current-page">{{ currentPageTitle }}</span>
          </div>
          <div class="header-right">
            <div class="time-display">
              <el-icon><Clock /></el-icon>
              <span>{{ currentTime }}</span>
            </div>
            <el-tag type="success" effect="dark" class="status-tag">
              <span class="status-dot"></span>
              系统正常
            </el-tag>
            <el-badge :value="5" class="notification-badge">
              <el-button circle size="small" type="primary">
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
          </div>
        </el-header>
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()
const activeMenu = computed(() => route.path)
const currentPageTitle = computed(() => route.meta?.title || '')
const currentTime = ref('')
const menuRoutes = computed(() => {
  return [
    { path: '/batch', meta: { title: '批次中心', icon: 'Box' } },
    { path: '/transport', meta: { title: '运输地图', icon: 'Van' } },
    { path: '/warehouse', meta: { title: '仓库作业', icon: 'Warehouse' } },
    { path: '/exception', meta: { title: '异常处置', icon: 'Warning' } },
    { path: '/store', meta: { title: '门店反馈', icon: 'Shop' } },
    { path: '/finance', meta: { title: '费用报表', icon: 'Money' } }
  ]
})

let timer = null
const updateTime = () => {
  currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.app-layout {
  width: 100%;
  height: 100%;
}

.main-container {
  height: 100%;
}

.sidebar {
  background: #0f172a;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid #1e293b;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
}

.nav-menu {
  flex: 1;
  border-right: none !important;
  padding-top: 12px;
}

.nav-menu .el-menu-item {
  height: 52px;
  line-height: 52px;
  margin: 4px 12px;
  border-radius: 8px;
}

.nav-menu .el-menu-item:hover {
  background: #1e293b;
}

.nav-menu .el-menu-item.is-active {
  background: #1e3a5f;
}

.duty-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #1e293b;
}

.duty-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #1e3a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
}

.duty-name {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}

.duty-role {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.header {
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px !important;
}

.current-page {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;
  font-family: 'Consolas', monospace;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.main-content {
  padding: 0;
  background: #0f172a;
  overflow: hidden;
}
</style>
