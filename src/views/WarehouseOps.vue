<template>
  <div class="page-container">
    <div class="page-title">
      <el-icon :size="24" color="#60a5fa"><Warehouse /></el-icon>
      仓库作业
      <span style="font-size:14px;color:#64748b;font-weight:normal;">装卸检查 · 库位分配 · 损耗登记</span>
    </div>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="6">
        <div class="stat-card">
          <el-icon :size="28" color="#60a5fa"><Warehouse /></el-icon>
          <div class="stat-value" style="font-size:28px;">4</div>
          <div class="stat-label">运营仓库</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #22c55e;">
          <el-icon :size="28" color="#22c55e"><Upload /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#22c55e;">12</div>
          <div class="stat-label">今日入库</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #06b6d4;">
          <el-icon :size="28" color="#06b6d4"><Download /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#06b6d4;">15</div>
          <div class="stat-label">今日出库</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #f59e0b;">
          <el-icon :size="28" color="#f59e0b"><Delete /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#f59e0b;">150</div>
          <div class="stat-label">今日损耗(kg)</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="warehouse-tabs">
      <el-tab-pane label="装卸检查" name="loading">
        <div class="card-dark">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">装卸任务列表</div>
            <div class="flex-between" style="gap: 12px;">
              <el-select v-model="warehouseFilter" size="default" placeholder="选择仓库" style="width: 160px;">
                <el-option label="全部仓库" value="" />
                <el-option v-for="w in warehouseList" :key="w.id" :label="w.name" :value="w.id" />
              </el-select>
              <el-button type="primary" @click="showCheckDialog = true">
                <el-icon><DocumentAdd /></el-icon>
                新增检查
              </el-button>
            </div>
          </div>

          <div class="table-dark">
            <el-table :data="loadingTasks" stripe style="width: 100%">
              <el-table-column prop="taskNo" label="任务编号" width="140" />
              <el-table-column prop="type" label="类型" width="80">
                <template #default="{ row }">
                  <el-tag :type="row.type === '入库' ? 'success' : 'primary'" size="small">{{ row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="batch" label="批次号" width="160" />
              <el-table-column prop="product" label="产品名称" min-width="160" />
              <el-table-column prop="warehouse" label="仓库" width="130" />
              <el-table-column prop="vehicle" label="车辆" width="110" />
              <el-table-column label="温度检查" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.tempOk ? 'success' : 'danger'" size="small">
                    {{ row.tempOk ? '合格' : '异常' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="包装检查" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.packageOk ? 'success' : 'warning'" size="small">
                    {{ row.packageOk ? '合格' : '待复检' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作员" width="100" />
              <el-table-column prop="time" label="时间" width="150" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :class="'status-' + row.status" size="small">
                    {{ row.statusText }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" size="small" @click="viewCheckDetail(row)">详情</el-button>
                  <el-button link type="primary" size="small">打印</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="库位分配" name="location">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="card-dark">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">仓库选择</div>
              <div class="warehouse-selector">
                <div v-for="w in warehouseList" :key="w.id" class="warehouse-card"
                  :class="{ active: selectedWarehouse?.id === w.id }"
                  @click="selectWarehouse(w)">
                  <div class="flex-between">
                    <span class="wh-name">{{ w.name }}</span>
                    <el-tag :type="w.status === 'normal' ? 'success' : 'warning'" size="small">正常</el-tag>
                  </div>
                  <div class="wh-loc">{{ w.location }}</div>
                  <div class="wh-stats">
                    <span>容量使用率</span>
                    <el-progress :percentage="Math.round(w.usedArea / w.totalArea * 100)" :show-text="false" :stroke-width="8" />
                    <span style="color: #60a5fa;">{{ w.usedArea }}/{{ w.totalArea }}㎡</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="card-dark">
              <div class="flex-between mb-16">
                <div style="font-size:16px;font-weight:600;color:#f1f5f9;">
                  {{ selectedWarehouse?.name || '请选择仓库' }} - 库位分布图
                </div>
                <el-button type="primary" size="small" @click="showAllocateDialog = true">
                  <el-icon><SetUp /></el-icon>
                  分配库位
                </el-button>
              </div>
              <div v-if="selectedWarehouse" class="location-grid">
                <div v-for="zone in selectedWarehouse.temperatureZones" :key="zone" class="zone-section">
                  <div class="zone-title">{{ zone }}</div>
                  <div class="zone-grid">
                    <div v-for="i in 6" :key="i" class="location-cell"
                      :class="getLocationCellClass(zone, i)"
                      @click="viewLocationDetail(zone, i)">
                      <span class="cell-code">{{ getLocationCode(zone, i) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-tip">
                <el-icon :size="48" color="#475569"><Warehouse /></el-icon>
                <p>请从左侧选择一个仓库查看库位分布</p>
              </div>
              <div class="location-legend">
                <span><em class="dot empty"></em>空闲</span>
                <span><em class="dot occupied"></em>已占用</span>
                <span><em class="dot reserved"></em>已预约</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="损耗登记" name="damage">
        <div class="card-dark">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">损耗记录</div>
            <el-button type="danger" @click="showDamageDialog = true">
              <el-icon><Warning /></el-icon>
              登记损耗
            </el-button>
          </div>

          <div class="table-dark">
            <el-table :data="damageRecords" stripe style="width: 100%">
              <el-table-column prop="id" label="记录编号" width="140" />
              <el-table-column prop="batch" label="批次号" width="160" />
              <el-table-column prop="product" label="产品名称" min-width="160" />
              <el-table-column prop="type" label="损耗类型" width="120">
                <template #default="{ row }">
                  <el-tag size="small" :class="row.type === '变质' ? 'status-danger' : row.type === '破损' ? 'status-warning' : 'status-info'">
                    {{ row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="损耗数量" width="120">
                <template #default="{ row }">
                  <span style="color: #f87171; font-weight: 600;">{{ row.quantity }} {{ row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="lossAmount" label="损失金额(元)" width="140">
                <template #default="{ row }">
                  <span style="color: #f87171;">¥{{ row.lossAmount }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="location" label="发生环节" width="120" />
              <el-table-column prop="reason" label="原因" min-width="150" />
              <el-table-column prop="operator" label="登记人" width="100" />
              <el-table-column prop="time" label="登记时间" width="160" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button link type="primary" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showCheckDialog" title="装卸检查" width="650px">
      <el-form :model="checkForm" label-width="110px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="任务类型">
              <el-radio-group v-model="checkForm.type">
                <el-radio value="入库">入库</el-radio>
                <el-radio value="出库">出库</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次号">
              <el-select v-model="checkForm.batch" placeholder="选择批次" style="width: 100%;">
                <el-option v-for="b in batchList" :key="b.id" :label="b.id" :value="b.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="目标仓库">
              <el-select v-model="checkForm.warehouse" placeholder="选择仓库" style="width: 100%;">
                <el-option v-for="w in warehouseList" :key="w.id" :label="w.name" :value="w.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输车辆">
              <el-select v-model="checkForm.vehicle" placeholder="选择车辆" style="width: 100%;">
                <el-option v-for="v in vehicleList" :key="v.id" :label="v.plate" :value="v.plate" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="温度检测">
          <el-input-number v-model="checkForm.temperature" :precision="1" :step="0.5" /> ℃
          <span style="margin-left: 20px; color: #94a3b8;">标准范围: 0-4℃</span>
        </el-form-item>
        <el-form-item label="包装检查">
          <el-checkbox v-model="checkForm.packageIntact">包装完整</el-checkbox>
          <el-checkbox v-model="checkForm.noDamage" style="margin-left: 20px;">无破损</el-checkbox>
          <el-checkbox v-model="checkForm.sealed" style="margin-left: 20px;">密封完好</el-checkbox>
        </el-form-item>
        <el-form-item label="质检照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="checkForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCheckDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCheck">提交检查</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showAllocateDialog" title="库位分配" width="500px">
      <el-form :model="allocateForm" label-width="100px">
        <el-form-item label="批次号">
          <el-select v-model="allocateForm.batch" placeholder="选择批次" style="width: 100%;">
            <el-option v-for="b in batchList" :key="b.id" :label="b.id + ' - ' + b.name" :value="b.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="温区选择">
          <el-select v-model="allocateForm.zone" placeholder="选择温区" style="width: 100%;">
            <el-option label="冷藏(0-4℃)" value="冷藏(0-4℃)" />
            <el-option label="冷冻(-18℃)" value="冷冻(-18℃)" />
            <el-option label="恒温(15-20℃)" value="恒温(15-20℃)" />
          </el-select>
        </el-form-item>
        <el-form-item label="库位编号">
          <el-select v-model="allocateForm.location" placeholder="选择库位" style="width: 100%;">
            <el-option v-for="loc in availableLocations" :key="loc.id" :label="loc.id + ' (空闲)'" :value="loc.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="存放数量">
          <el-input-number v-model="allocateForm.quantity" :min="1" /> kg
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAllocateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAllocate">确认分配</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDamageDialog" title="损耗登记" width="600px">
      <el-form :model="damageForm" label-width="100px">
        <el-form-item label="批次号">
          <el-select v-model="damageForm.batch" placeholder="选择批次" style="width: 100%;">
            <el-option v-for="b in batchList" :key="b.id" :label="b.id + ' - ' + b.name" :value="b.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="损耗类型">
          <el-radio-group v-model="damageForm.type">
            <el-radio value="变质">变质</el-radio>
            <el-radio value="破损">破损</el-radio>
            <el-radio value="其他">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="损耗数量">
              <el-input-number v-model="damageForm.quantity" :min="0" :precision="1" /> kg
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="损失金额">
              <el-input-number v-model="damageForm.lossAmount" :min="0" :precision="2" /> 元
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发生环节">
          <el-select v-model="damageForm.location" placeholder="选择环节" style="width: 100%;">
            <el-option label="运输途中" value="运输途中" />
            <el-option label="装卸作业" value="装卸作业" />
            <el-option label="仓储期间" value="仓储期间" />
            <el-option label="门店配送" value="门店配送" />
          </el-select>
        </el-form-item>
        <el-form-item label="损耗原因">
          <el-input v-model="damageForm.reason" type="textarea" :rows="2" placeholder="请详细描述损耗原因" />
        </el-form-item>
        <el-form-item label="现场照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDamageDialog = false">取消</el-button>
        <el-button type="danger" @click="submitDamage">确认登记</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { batchList, vehicleList, warehouseList, loadingTasks, damageRecords, allocatedLocations, createLoadingTask, createDamageRecord } from '@/data/mockData'
import dayjs from 'dayjs'

const activeTab = ref('loading')
const warehouseFilter = ref('')
const selectedWarehouse = ref(warehouseList[0] || null)
const showCheckDialog = ref(false)
const showAllocateDialog = ref(false)
const showDamageDialog = ref(false)

const warehouseLocationStatus = reactive({
  W001: ['occupied', 'occupied', 'empty', 'reserved', 'occupied', 'empty', 'empty', 'occupied', 'occupied', 'empty', 'empty', 'reserved', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  W002: ['empty', 'empty', 'occupied', 'empty', 'empty', 'empty', 'occupied', 'empty', 'empty', 'empty', 'reserved', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  W003: ['empty', 'occupied', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'occupied', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'reserved'],
  W004: ['empty', 'empty', 'empty', 'occupied', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'occupied', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']
})

const getLocationStatus = (warehouseId, idx) => {
  return warehouseLocationStatus[warehouseId]?.[idx] || 'empty'
}

const setLocationStatus = (warehouseId, idx, status) => {
  if (warehouseLocationStatus[warehouseId]) {
    warehouseLocationStatus[warehouseId][idx] = status
  }
}

const allLocations = [
  { id: '冷藏-01', zone: '冷藏(0-4℃)', index: 0 },
  { id: '冷藏-02', zone: '冷藏(0-4℃)', index: 1 },
  { id: '冷藏-03', zone: '冷藏(0-4℃)', index: 2 },
  { id: '冷藏-04', zone: '冷藏(0-4℃)', index: 3 },
  { id: '冷藏-05', zone: '冷藏(0-4℃)', index: 4 },
  { id: '冷藏-06', zone: '冷藏(0-4℃)', index: 5 },
  { id: '冷冻-01', zone: '冷冻(-18℃)', index: 6 },
  { id: '冷冻-02', zone: '冷冻(-18℃)', index: 7 },
  { id: '冷冻-03', zone: '冷冻(-18℃)', index: 8 },
  { id: '冷冻-04', zone: '冷冻(-18℃)', index: 9 },
  { id: '冷冻-05', zone: '冷冻(-18℃)', index: 10 },
  { id: '冷冻-06', zone: '冷冻(-18℃)', index: 11 },
  { id: '恒温-01', zone: '恒温(15-20℃)', index: 12 },
  { id: '恒温-02', zone: '恒温(15-20℃)', index: 13 },
  { id: '恒温-03', zone: '恒温(15-20℃)', index: 14 },
  { id: '恒温-04', zone: '恒温(15-20℃)', index: 15 },
  { id: '恒温-05', zone: '恒温(15-20℃)', index: 16 },
  { id: '恒温-06', zone: '恒温(15-20℃)', index: 17 }
]

const availableLocations = computed(() => {
  let locs = allLocations
  if (allocateForm.zone) {
    locs = locs.filter(loc => loc.zone === allocateForm.zone)
  }
  const whId = selectedWarehouse.value?.id
  return locs.filter(loc => {
    const allocated = allocatedLocations.find(a => a.warehouseId === whId && a.location === loc.id)
    return !allocated && getLocationStatus(whId, loc.index) === 'empty'
  })
})

const isLocationOccupied = (idx) => {
  const whId = selectedWarehouse.value?.id
  const loc = allLocations[idx]
  if (!whId || !loc) return false
  if (getLocationStatus(whId, idx) === 'occupied' || getLocationStatus(whId, idx) === 'reserved') return true
  return allocatedLocations.some(a => a.warehouseId === whId && a.location === loc.id)
}

const getZoneStartIndex = (zone) => {
  if (zone.startsWith('冷藏')) return 0
  if (zone.startsWith('冷冻')) return 6
  if (zone.startsWith('恒温')) return 12
  return 0
}

const getLocationCode = (zone, i) => {
  const prefix = zone.substring(0, 2)
  return `${prefix}-${String(i).padStart(2, '0')}`
}

const getLocationCellClass = (zone, i) => {
  const startIdx = getZoneStartIndex(zone)
  const idx = startIdx + i - 1
  const occupied = isLocationOccupied(idx)
  const whId = selectedWarehouse.value?.id
  const status = getLocationStatus(whId, idx)
  const reserved = status === 'reserved' && !allocatedLocations.some(a => a.warehouseId === whId && a.location === allLocations[idx]?.id)
  return {
    occupied,
    empty: !occupied && status === 'empty',
    reserved
  }
}

const checkForm = reactive({
  type: '入库',
  batch: '',
  warehouse: '',
  vehicle: '',
  temperature: 2.5,
  packageIntact: true,
  noDamage: true,
  sealed: true,
  remark: ''
})

const allocateForm = reactive({
  batch: '',
  zone: '',
  location: '',
  quantity: 1000
})

const damageForm = reactive({
  batch: '',
  type: '变质',
  quantity: 0,
  lossAmount: 0,
  location: '',
  reason: ''
})

const selectWarehouse = (w) => {
  selectedWarehouse.value = w
}

const viewCheckDetail = (row) => {
  ElMessage.info(`查看任务 ${row.taskNo} 详情`)
}

const viewLocationDetail = (zone, idx) => {
  ElMessage.info(`库位 ${zone.substring(0,2)}-${String(idx).padStart(2, '0')} 详情`)
}

const submitCheck = () => {
  if (!checkForm.batch || !checkForm.warehouse || !checkForm.vehicle) {
    ElMessage.warning('请填写完整信息')
    return
  }
  const batch = batchList.find(b => b.id === checkForm.batch)
  const tempOk = checkForm.temperature >= 0 && checkForm.temperature <= 4
  const packageOk = checkForm.packageIntact && checkForm.noDamage && checkForm.sealed
  let status = 'normal', statusText = '已完成'
  if (!tempOk || !packageOk) { status = 'warning'; statusText = '待复检' }
  if (!tempOk && !packageOk) { status = 'danger'; statusText = '异常' }
  
  const newTask = createLoadingTask({
    type: checkForm.type,
    batch: checkForm.batch,
    product: batch?.name || '',
    warehouse: checkForm.warehouse,
    vehicle: checkForm.vehicle,
    tempOk,
    packageOk,
    operator: '王仓管',
    status,
    statusText
  })
  ElMessage.success(`检查记录 ${newTask.taskNo} 已提交`)
  showCheckDialog.value = false
  checkForm.batch = ''
  checkForm.warehouse = ''
  checkForm.vehicle = ''
  checkForm.temperature = 2.5
  checkForm.packageIntact = true
  checkForm.noDamage = true
  checkForm.sealed = true
  checkForm.remark = ''
}

const submitAllocate = () => {
  if (!allocateForm.batch || !allocateForm.zone || !allocateForm.location) {
    ElMessage.warning('请填写完整信息')
    return
  }
  const whId = selectedWarehouse.value?.id
  const locInfo = allLocations.find(l => l.id === allocateForm.location)
  if (locInfo && whId) {
    setLocationStatus(whId, locInfo.index, 'occupied')
  }
  allocatedLocations.push({
    id: 'A' + Date.now(),
    warehouseId: whId,
    warehouse: selectedWarehouse.value?.name || '',
    batch: allocateForm.batch,
    zone: allocateForm.zone,
    location: allocateForm.location,
    quantity: allocateForm.quantity,
    operator: '王仓管',
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
  ElMessage.success(`库位 ${allocateForm.location} 分配成功`)
  showAllocateDialog.value = false
  allocateForm.batch = ''
  allocateForm.zone = ''
  allocateForm.location = ''
  allocateForm.quantity = 1000
}

const submitDamage = () => {
  if (!damageForm.batch || !damageForm.quantity || !damageForm.location) {
    ElMessage.warning('请填写完整信息')
    return
  }
  const batch = batchList.find(b => b.id === damageForm.batch)
  const newDamage = createDamageRecord({
    batch: damageForm.batch,
    product: batch?.name || '',
    type: damageForm.type,
    quantity: damageForm.quantity,
    lossAmount: damageForm.lossAmount,
    location: damageForm.location,
    reason: damageForm.reason,
    operator: '王仓管'
  })
  ElMessage.success(`损耗记录 ${newDamage.id} 已登记`)
  showDamageDialog.value = false
  damageForm.batch = ''
  damageForm.type = '变质'
  damageForm.quantity = 0
  damageForm.lossAmount = 0
  damageForm.location = ''
  damageForm.reason = ''
}
</script>

<style scoped>
.warehouse-tabs :deep(.el-tabs__item) {
  color: #94a3b8;
  font-size: 15px;
}

.warehouse-tabs :deep(.el-tabs__item.is-active) {
  color: #60a5fa;
}

.warehouse-tabs :deep(.el-tabs__active-bar) {
  background-color: #60a5fa;
}

.warehouse-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: #334155;
}

.warehouse-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warehouse-card {
  padding: 16px;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.warehouse-card:hover,
.warehouse-card.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.wh-name {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.wh-loc {
  font-size: 12px;
  color: #64748b;
  margin: 8px 0;
}

.wh-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.location-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.zone-section {
  margin-bottom: 8px;
}

.zone-title {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 3px solid #3b82f6;
}

.zone-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.location-cell {
  aspect-ratio: 1;
  border: 2px solid #334155;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #0f172a;
}

.location-cell:hover {
  border-color: #60a5fa;
  transform: scale(1.05);
}

.location-cell.empty {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.location-cell.occupied {
  border-color: #64748b;
  background: rgba(100, 116, 139, 0.2);
}

.location-cell.reserved {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.cell-code {
  font-size: 11px;
  color: #94a3b8;
  font-family: monospace;
}

.location-legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #334155;
  font-size: 13px;
  color: #94a3b8;
}

.location-legend span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  font-style: normal;
}

.dot.empty { background: #22c55e; }
.dot.occupied { background: #64748b; }
.dot.reserved { background: #f59e0b; }

.empty-tip {
  text-align: center;
  padding: 80px 0;
  color: #64748b;
}

.empty-tip p {
  margin-top: 16px;
  font-size: 14px;
}
</style>
