<template>
  <div class="page-container">
    <div class="page-title">
      <el-icon :size="24" color="#60a5fa"><Box /></el-icon>
      批次中心
      <span style="font-size:14px;color:#64748b;font-weight:normal;">批次建档 · 温度监控 · 保质期预警</span>
    </div>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="6">
        <div class="stat-card">
          <el-icon :size="32" color="#60a5fa"><Box /></el-icon>
          <div class="stat-value">{{ batchList.length }}</div>
          <div class="stat-label">今日批次总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #22c55e;">
          <el-icon :size="32" color="#22c55e"><CircleCheck /></el-icon>
          <div class="stat-value" style="color: #22c55e;">{{ normalCount }}</div>
          <div class="stat-label">正常批次</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #f59e0b;">
          <el-icon :size="32" color="#f59e0b"><Warning /></el-icon>
          <div class="stat-value" style="color: #f59e0b;">{{ warningCount }}</div>
          <div class="stat-label">临期预警</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #ef4444;">
          <el-icon :size="32" color="#ef4444"><CircleClose /></el-icon>
          <div class="stat-value" style="color: #ef4444;">{{ dangerCount }}</div>
          <div class="stat-label">紧急处理</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="12">
        <div class="card-dark">
        <div class="flex-between mb-16">
          <div style="font-size:16px;font-weight:600;color:#f1f5f9;">温度曲线（近24小时）</div>
          <el-select v-model="selectedBatch" size="small" style="width: 200px;">
            <el-option v-for="b in batchList" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </div>
        <div ref="tempChartRef" class="chart-container"></div>
      </div>
      </el-col>
      <el-col :span="12">
        <div class="card-dark">
        <div class="flex-between mb-16">
          <div style="font-size:16px;font-weight:600;color:#f1f5f9;">湿度记录（近24小时）</div>
          <el-select v-model="selectedBatch" size="small" style="width: 200px;">
            <el-option v-for="b in batchList" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </div>
        <div ref="humidityChartRef" class="chart-container"></div>
      </div>
      </el-col>
    </el-row>

    <div class="card-dark">
      <div class="flex-between mb-16">
        <div style="font-size:16px;font-weight:600;color:#f1f5f9;">批次列表</div>
        <div class="flex-between" style="gap: 12px;">
          <el-input v-model="searchKeyword" placeholder="搜索批次号/产品名" size="default" style="width: 250px;">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>
            新建批次
          </el-button>
        </div>
      </div>

      <div class="table-dark">
        <el-table :data="filteredBatches" stripe style="width: 100%">
          <el-table-column prop="id" label="批次号" width="160" />
          <el-table-column prop="name" label="产品名称" min-width="180" />
          <el-table-column prop="origin" label="产地" width="140" />
          <el-table-column prop="warehouse" label="目标仓库" width="140" />
          <el-table-column label="数量" width="100">
            <template #default="{ row }">
              {{ row.quantity }} {{ row.unit }}
            </template>
          </el-table-column>
          <el-table-column label="温度(℃)" width="100">
            <template #default="{ row }">
              <span :class="getTempClass(row.temperature)">
                {{ row.temperature }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="湿度(%)" width="100">
            <template #default="{ row }">
              {{ row.humidity }}
            </template>
          </el-table-column>
          <el-table-column label="剩余保质期" width="120">
            <template #default="{ row }">
              <el-tag :type="getShelfLifeType(row.remainingDays)" size="small">
                {{ row.remainingDays }}天
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :class="'status-' + row.status" size="small">
                {{ row.statusText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="建档时间" width="170" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="viewDetail(row)">查看</el-button>
              <el-button link type="primary" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="flex-between" style="margin-top: 16px;">
        <el-pagination
          layout="prev, pager, next, total"
          :total="filteredBatches.length"
          :page-size="10"
        />
      </div>
    </div>

    <el-dialog v-model="showCreateDialog" title="新建批次" width="600px">
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="batchForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产地">
          <el-select v-model="batchForm.origin" placeholder="请选择产地" style="width: 100%;">
            <el-option label="山东烟台产地A" value="山东烟台产地A" />
            <el-option label="海南三亚产地B" value="海南三亚产地B" />
            <el-option label="云南昆明产地C" value="云南昆明产地C" />
            <el-option label="内蒙古锡林郭勒" value="内蒙古锡林郭勒" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标仓库">
          <el-select v-model="batchForm.warehouse" placeholder="请选择仓库" style="width: 100%;">
            <el-option label="华东中心仓" value="华东中心仓" />
            <el-option label="华南中心仓" value="华南中心仓" />
            <el-option label="华北中心仓" value="华北中心仓" />
            <el-option label="西南中心仓" value="西南中心仓" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="batchForm.quantity" :min="1" />
          <el-select v-model="batchForm.unit" style="margin-left: 8px; width: 100px;">
            <el-option label="kg" value="kg" />
            <el-option label="吨" value="吨" />
            <el-option label="束" value="束" />
            <el-option label="箱" value="箱" />
          </el-select>
        </el-form-item>
        <el-form-item label="保质期(天)">
          <el-input-number v-model="batchForm.shelfLife" :min="1" />
        </el-form-item>
        <el-form-item label="运输车辆">
          <el-select v-model="batchForm.vehicle" placeholder="请选择车辆" style="width: 100%;">
            <el-option label="沪A·12345" value="沪A·12345" />
            <el-option label="粤B·67890" value="粤B·67890" />
            <el-option label="云A·11111" value="云A·11111" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createBatch">确认创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDetailDialog" title="批次详情" width="700px">
      <div v-if="currentBatch" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="批次号">{{ currentBatch.id }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ currentBatch.name }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ currentBatch.origin }}</el-descriptions-item>
          <el-descriptions-item label="目标仓库">{{ currentBatch.warehouse }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentBatch.quantity }} {{ currentBatch.unit }}</el-descriptions-item>
          <el-descriptions-item label="保质期">{{ currentBatch.shelfLife }}天</el-descriptions-item>
          <el-descriptions-item label="当前温度">{{ currentBatch.temperature }}℃</el-descriptions-item>
          <el-descriptions-item label="当前湿度">{{ currentBatch.humidity }}%</el-descriptions-item>
          <el-descriptions-item label="运输车辆">{{ currentBatch.vehicle }}</el-descriptions-item>
          <el-descriptions-item label="建档时间">{{ currentBatch.createTime }}</el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 20px;">
          <div style="font-size:14px;font-weight:600;margin-bottom:12px;">流转记录</div>
          <el-steps :active="3" finish-status="success" align-center>
            <el-step title="产地采收" description="2024-06-07 08:30" />
            <el-step title="出库检验" description="2024-06-07 10:00" />
            <el-step title="运输中" description="进行中" />
            <el-step title="入库验收" description="待完成" />
          </el-steps>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { batchList, generateTempData, generateHumidityData, createBatch as addNewBatch } from '@/data/mockData'

const searchKeyword = ref('')
const selectedBatch = ref(batchList[0]?.id || '')
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const currentBatch = ref(null)
const tempChartRef = ref(null)
const humidityChartRef = ref(null)
let tempChart = null
let humidityChart = null

const batchForm = ref({
  name: '',
  origin: '',
  warehouse: '',
  quantity: 1000,
  unit: 'kg',
  shelfLife: 30,
  vehicle: ''
})

const filteredBatches = computed(() => {
  if (!searchKeyword.value) return batchList
  const keyword = searchKeyword.value.toLowerCase()
  return batchList.filter(item => 
    item.id.toLowerCase().includes(keyword) || 
    item.name.toLowerCase().includes(keyword)
  )
})

const normalCount = computed(() => batchList.filter(b => b.status === 'normal' || b.status === 'transit' || b.status === 'warehouse').length)
const warningCount = computed(() => batchList.filter(b => b.status === 'warning').length)
const dangerCount = computed(() => batchList.filter(b => b.status === 'danger').length)

const getTempClass = (temp) => {
  if (temp < 0) return 'color: #60a5fa;'
  if (temp > 5) return 'color: #f59e0b;'
  return 'color: #22c55e;'
}

const getShelfLifeType = (days) => {
  if (days <= 3) return 'danger'
  if (days <= 7) return 'warning'
  return 'success'
}

const viewDetail = (row) => {
  currentBatch.value = row
  showDetailDialog.value = true
}

const createBatch = () => {
  if (!batchForm.value.name || !batchForm.value.origin || !batchForm.value.warehouse) {
    ElMessage.warning('请填写完整信息')
    return
  }
  const newBatch = addNewBatch(batchForm.value)
  selectedBatch.value = newBatch.id
  ElMessage.success(`批次 ${newBatch.id} 创建成功`)
  showCreateDialog.value = false
  batchForm.value = {
    name: '',
    origin: '',
    warehouse: '',
    quantity: 1000,
    unit: 'kg',
    shelfLife: 30,
    vehicle: ''
  }
}

const initTempChart = () => {
  if (!tempChartRef.value) return
  tempChart = echarts.init(tempChartRef.value)
  const data = generateTempData()
  tempChart.setOption({
    backgroundColor: 'transparent',
    grid: { left: '10%', right: '5%', top: '15%', bottom: '15%' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.time),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      name: '℃',
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [{
      data: data.map(d => d.temp),
      type: 'line',
      smooth: true,
      lineStyle: { color: '#60a5fa', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(96, 165, 250, 0.3)' },
          { offset: 1, color: 'rgba(96, 165, 250, 0.05)' }
        ])
      },
      itemStyle: { color: '#60a5fa' }
    }]
  })
}

const initHumidityChart = () => {
  if (!humidityChartRef.value) return
  humidityChart = echarts.init(humidityChartRef.value)
  const data = generateHumidityData()
  humidityChart.setOption({
    backgroundColor: 'transparent',
    grid: { left: '10%', right: '5%', top: '15%', bottom: '15%' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.time),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      name: '%',
      min: 60,
      max: 100,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [{
      data: data.map(d => d.humidity),
      type: 'line',
      smooth: true,
      lineStyle: { color: '#22c55e', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
          { offset: 1, color: 'rgba(34, 197, 94, 0.05)' }
        ])
      },
      itemStyle: { color: '#22c55e' }
    }]
  })
}

watch(selectedBatch, () => {
  nextTick(() => {
    initTempChart()
    initHumidityChart()
  })
})

onMounted(() => {
  nextTick(() => {
    initTempChart()
    initHumidityChart()
  })
  window.addEventListener('resize', () => {
    tempChart?.resize()
    humidityChart?.resize()
  })
})
</script>

<style scoped>
.detail-content {
  color: #e2e8f0;
}
</style>
