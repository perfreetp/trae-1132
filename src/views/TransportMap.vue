<template>
  <div class="page-container">
    <div class="page-title">
      <el-icon :size="24" color="#60a5fa"><Van /></el-icon>
      运输地图
      <span style="font-size:14px;color:#64748b;font-weight:normal;">在途定位 · 车辆预约 · 多屏看板</span>
    </div>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="4">
        <div class="stat-card">
          <el-icon :size="28" color="#60a5fa"><Van /></el-icon>
          <div class="stat-value" style="font-size:28px;">{{ vehicleList.length }}</div>
          <div class="stat-label">在途车辆</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card" style="border-color: #22c55e;">
          <el-icon :size="28" color="#22c55e"><CircleCheck /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#22c55e;">{{ transitCount }}</div>
          <div class="stat-label">运输中</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card" style="border-color: #f59e0b;">
          <el-icon :size="28" color="#f59e0b"><Loading /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#f59e0b;">{{ loadingCount }}</div>
          <div class="stat-label">装卸货</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card" style="border-color: #8b5cf6;">
          <el-icon :size="28" color="#8b5cf6"><Clock /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#8b5cf6;">3</div>
          <div class="stat-label">今日预约</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card" style="border-color: #06b6d4;">
          <el-icon :size="28" color="#06b6d4"><Shop /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#06b6d4;">{{ deliveryCount }}</div>
          <div class="stat-label">门店配送</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card" style="border-color: #ef4444;">
          <el-icon :size="28" color="#ef4444"><Warning /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#ef4444;">1</div>
          <div class="stat-label">异常车辆</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="17">
        <div class="card-dark">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">冷链运输监控地图</div>
            <div class="flex-between" style="gap: 12px;">
              <el-radio-group v-model="mapView" size="small">
                <el-radio-button value="all">全部</el-radio-button>
                <el-radio-button value="transit">运输中</el-radio-button>
                <el-radio-button value="warning">异常</el-radio-button>
              </el-radio-group>
              <el-button size="small" type="primary" plain @click="refreshMap">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
          <div class="map-container">
            <svg width="100%" height="100%" viewBox="0 0 500 450">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.8" />
                </linearGradient>
              </defs>
              
              <path d="M 280 120 Q 300 140 320 160" stroke="url(#lineGradient)" stroke-width="3" fill="none" stroke-dasharray="8,4">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 260 380 Q 255 360 250 340" stroke="url(#lineGradient)" stroke-width="3" fill="none" stroke-dasharray="8,4">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 120 300 Q 135 290 150 280" stroke="url(#lineGradient)" stroke-width="3" fill="none" stroke-dasharray="8,4">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 350 80 L 340 110" stroke="url(#lineGradient)" stroke-width="3" fill="none" stroke-dasharray="8,4">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 330 180 Q 335 175 340 170" stroke="#22c55e" stroke-width="3" fill="none" stroke-dasharray="8,4">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
              </path>

              <g v-for="loc in locationList" :key="loc.name">
                <circle :cx="loc.x" :cy="loc.y" :r="loc.type === 'origin' ? 10 : loc.type === 'warehouse' ? 12 : 8"
                  :fill="loc.type === 'origin' ? '#f59e0b' : loc.type === 'warehouse' ? '#3b82f6' : '#22c55e'"
                  opacity="0.8" />
                <circle :cx="loc.x" :cy="loc.y" :r="loc.type === 'origin' ? 6 : loc.type === 'warehouse' ? 7 : 5"
                  fill="#fff" />
                <text :x="loc.x + 14" :y="loc.y + 4" fill="#94a3b8" font-size="11">{{ loc.name }}</text>
              </g>

              <g v-for="(v, idx) in filteredVehicles" :key="v.id" @click="selectVehicle(v)" style="cursor: pointer;">
                <rect :x="getVehiclePos(v).x - 12" :y="getVehiclePos(v).y - 8" width="24" height="16" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="2" />
                <text :x="getVehiclePos(v).x" :y="getVehiclePos(v).y + 4" fill="#60a5fa" font-size="10" text-anchor="middle">
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  车
                </text>
                <rect v-if="v.status === 'transit'" :x="getVehiclePos(v).x - 14" :y="getVehiclePos(v).y - 26" width="28" height="14" rx="2" fill="#065f46">
                  <animate attributeName="opacity" values="1;0.7;1" dur="1s" repeatCount="indefinite" />
                </rect>
                <text v-if="v.status === 'transit'" :x="getVehiclePos(v).x" :y="getVehiclePos(v).y - 16" fill="#6ee7b7" font-size="9" text-anchor="middle">{{ v.temperature }}℃</text>
              </g>
            </svg>

            <div class="map-legend">
              <div class="legend-item">
                <span class="legend-dot" style="background: #f59e0b;"></span>
                产地
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: #3b82f6;"></span>
                仓库
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: #22c55e;"></span>
                门店
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: #1e293b; border: 2px solid #3b82f6;"></span>
                车辆
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="card-dark mb-16">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">车辆列表</div>
            <el-button size="small" type="primary" @click="showBookingDialog = true">
              <el-icon><Calendar /></el-icon>
              车辆预约
            </el-button>
          </div>
          <div class="vehicle-list">
            <div v-for="v in filteredVehicles" :key="v.id" class="vehicle-item"
              :class="{ 'active': selectedVehicle?.id === v.id }"
              @click="selectVehicle(v)">
              <div class="flex-between">
                <span class="vehicle-plate">{{ v.plate }}</span>
                <el-tag :class="'status-' + (v.status === 'transit' ? 'normal' : v.status === 'warning' ? 'warning' : 'info')" size="small">
                  {{ v.statusText }}
                </el-tag>
              </div>
              <div class="vehicle-info">
                <span><el-icon><User /></el-icon> {{ v.driver }}</span>
                <span><el-icon><Phone /></el-icon> {{ v.phone }}</span>
              </div>
              <div class="vehicle-loc">
                <el-icon><Location /></el-icon>
                {{ v.currentLocation }} → {{ v.destination }}
              </div>
              <div class="vehicle-progress">
                <div class="flex-between" style="margin-bottom: 4px;">
                  <span style="font-size:12px;color:#94a3b8;">运输进度</span>
                  <span style="font-size:12px;color:#60a5fa;">{{ v.progress }}%</span>
                </div>
                <el-progress :percentage="v.progress" :show-text="false" :stroke-width="6" color="#3b82f6" />
              </div>
            </div>
          </div>
        </div>

        <div class="card-dark" v-if="selectedVehicle">
          <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">
            车辆实时监控 - {{ selectedVehicle.plate }}
          </div>
          <div class="monitor-grid">
            <div class="monitor-item">
              <div class="monitor-label">当前温度</div>
              <div class="monitor-value" :class="selectedVehicle.temperature > 5 ? 'text-warning' : 'text-normal'">
                {{ selectedVehicle.temperature }}℃
              </div>
            </div>
            <div class="monitor-item">
              <div class="monitor-label">当前湿度</div>
              <div class="monitor-value text-normal">{{ selectedVehicle.humidity }}%</div>
            </div>
            <div class="monitor-item">
              <div class="monitor-label">预计到达</div>
              <div class="monitor-value" style="font-size:14px;">{{ selectedVehicle.eta }}</div>
            </div>
            <div class="monitor-item">
              <div class="monitor-label">运输货物</div>
              <div class="monitor-value" style="font-size:12px;">{{ selectedVehicle.cargo }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="showBookingDialog" title="车辆预约" width="500px">
      <el-form :model="bookingForm" label-width="100px">
        <el-form-item label="预约日期">
          <el-date-picker v-model="bookingForm.date" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="预约时段">
          <el-select v-model="bookingForm.timeSlot" placeholder="选择时段" style="width: 100%;">
            <el-option label="08:00 - 10:00" value="08:00-10:00" />
            <el-option label="10:00 - 12:00" value="10:00-12:00" />
            <el-option label="14:00 - 16:00" value="14:00-16:00" />
            <el-option label="16:00 - 18:00" value="16:00-18:00" />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆牌号">
          <el-select v-model="bookingForm.vehicle" placeholder="选择车辆" style="width: 100%;">
            <el-option v-for="v in vehicleList" :key="v.id" :label="v.plate" :value="v.plate" />
          </el-select>
        </el-form-item>
        <el-form-item label="运输货物">
          <el-input v-model="bookingForm.cargo" placeholder="请输入货物信息" />
        </el-form-item>
        <el-form-item label="起点">
          <el-select v-model="bookingForm.origin" placeholder="选择起点" style="width: 100%;">
            <el-option label="山东烟台产地A" value="山东烟台产地A" />
            <el-option label="海南三亚产地B" value="海南三亚产地B" />
            <el-option label="华东中心仓" value="华东中心仓" />
          </el-select>
        </el-form-item>
        <el-form-item label="终点">
          <el-select v-model="bookingForm.dest" placeholder="选择终点" style="width: 100%;">
            <el-option label="华东中心仓" value="华东中心仓" />
            <el-option label="华南中心仓" value="华南中心仓" />
            <el-option label="上海浦东店" value="上海浦东店" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBookingDialog = false">取消</el-button>
        <el-button type="primary" @click="submitBooking">确认预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { vehicleList, locationList } from '@/data/mockData'

const mapView = ref('all')
const selectedVehicle = ref(vehicleList[0] || null)
const showBookingDialog = ref(false)
const bookingForm = ref({
  date: '',
  timeSlot: '',
  vehicle: '',
  cargo: '',
  origin: '',
  dest: ''
})

const transitCount = computed(() => vehicleList.filter(v => v.status === 'transit').length)
const loadingCount = computed(() => vehicleList.filter(v => v.status === 'loading' || v.status === 'unloading').length)
const deliveryCount = computed(() => vehicleList.filter(v => v.status === 'delivery').length)

const filteredVehicles = computed(() => {
  if (mapView.value === 'all') return vehicleList
  if (mapView.value === 'transit') return vehicleList.filter(v => v.status === 'transit')
  if (mapView.value === 'warning') return vehicleList.filter(v => v.status === 'warning' || v.temperature > 5)
  return vehicleList
})

const vehiclePositions = {
  'V001': { x: 300, y: 145 },
  'V002': { x: 258, y: 370 },
  'V003': { x: 135, y: 290 },
  'V004': { x: 340, y: 110 },
  'V005': { x: 337, y: 172 }
}

const getVehiclePos = (vehicle) => {
  return vehiclePositions[vehicle.id] || { x: 250, y: 225 }
}

const selectVehicle = (vehicle) => {
  selectedVehicle.value = vehicle
}

const refreshMap = () => {
  ElMessage.success('地图数据已刷新')
}

const submitBooking = () => {
  ElMessage.success('车辆预约成功')
  showBookingDialog.value = false
}

onMounted(() => {
  if (vehicleList.length > 0) {
    selectedVehicle.value = vehicleList[0]
  }
})
</script>

<style scoped>
.map-legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(15, 23, 42, 0.9);
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  border: 1px solid #334155;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.vehicle-list {
  max-height: 320px;
  overflow-y: auto;
}

.vehicle-item {
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.vehicle-item:hover,
.vehicle-item.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.vehicle-plate {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}

.vehicle-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #94a3b8;
  margin: 8px 0;
}

.vehicle-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vehicle-loc {
  font-size: 12px;
  color: #60a5fa;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.monitor-item {
  background: #0f172a;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.monitor-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.monitor-value {
  font-size: 20px;
  font-weight: 700;
}

.text-normal {
  color: #22c55e;
}

.text-warning {
  color: #f59e0b;
}
</style>
