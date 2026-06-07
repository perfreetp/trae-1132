<template>
  <div class="page-container">
    <div class="page-title">
      <el-icon :size="24" color="#60a5fa"><Money /></el-icon>
      费用报表
      <span style="font-size:14px;color:#64748b;font-weight:normal;">费用核对 · 日报生成</span>
    </div>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="6">
        <div class="stat-card">
          <el-icon :size="28" color="#60a5fa"><Wallet /></el-icon>
          <div class="stat-value" style="font-size:28px;">¥{{ todayTotal.toLocaleString() }}</div>
          <div class="stat-label">今日费用</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #22c55e;">
          <el-icon :size="28" color="#22c55e"><CircleCheck /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#22c55e;">¥{{ confirmedTotal.toLocaleString() }}</div>
          <div class="stat-label">已确认</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #f59e0b;">
          <el-icon :size="28" color="#f59e0b"><Clock /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#f59e0b;">¥{{ pendingTotal.toLocaleString() }}</div>
          <div class="stat-label">待核对</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #8b5cf6;">
          <el-icon :size="28" color="#8b5cf6"><TrendCharts /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#8b5cf6;">-8.3%</div>
          <div class="stat-label">较昨日</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="finance-tabs">
      <el-tab-pane label="费用核对" name="check">
        <div class="card-dark">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">运输费用明细</div>
            <div class="flex-between" style="gap: 12px;">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="default"
              />
              <el-select v-model="statusFilter" placeholder="状态筛选" size="default" style="width: 130px;">
                <el-option label="全部" value="" />
                <el-option label="待核对" value="pending" />
                <el-option label="已确认" value="confirmed" />
              </el-select>
              <el-button type="primary" @click="exportData">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </div>
          </div>

          <div class="table-dark">
            <el-table :data="filteredExpenses" stripe style="width: 100%">
              <el-table-column prop="id" label="费用单号" width="140" />
              <el-table-column prop="date" label="日期" width="110" />
              <el-table-column prop="carrier" label="承运商" width="120" />
              <el-table-column prop="batch" label="关联批次" width="160" />
              <el-table-column prop="route" label="运输路线" min-width="180" />
              <el-table-column prop="distance" label="里程(km)" width="100" />
              <el-table-column prop="weight" label="重量(kg)" width="100" />
              <el-table-column label="单价(元/kg)" width="110">
                <template #default="{ row }">
                  ¥{{ row.unitPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column label="费用金额" width="130">
                <template #default="{ row }">
                  <span style="color: #60a5fa; font-weight: 600;">¥{{ row.amount.toLocaleString() }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'confirmed' ? 'success' : 'warning'" size="small">
                    {{ row.statusText }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" size="small" @click="viewExpenseDetail(row)">详情</el-button>
                  <el-button v-if="row.status === 'pending'" link type="success" size="small" @click="confirmExpense(row)">确认</el-button>
                  <el-button link type="danger" size="small">异议</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="flex-between" style="margin-top: 16px;">
            <div style="color: #94a3b8;">
              共 {{ filteredExpenses.length }} 条记录，
              合计金额: <span style="color: #60a5fa; font-weight: 600;">¥{{ totalAmount.toLocaleString() }}</span>
            </div>
            <el-pagination
              layout="prev, pager, next"
              :total="filteredExpenses.length"
              :page-size="10"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="日报生成" name="report">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="card-dark">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">报表参数</div>
              <el-form :model="reportForm" label-width="100px">
                <el-form-item label="报表日期">
                  <el-date-picker v-model="reportForm.date" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="报表类型">
                  <el-select v-model="reportForm.type" style="width: 100%;">
                    <el-option label="运营日报" value="daily" />
                    <el-option label="运输费用日报" value="transport" />
                    <el-option label="仓储费用日报" value="warehouse" />
                    <el-option label="综合日报" value="comprehensive" />
                  </el-select>
                </el-form-item>
                <el-form-item label="统计维度">
                  <el-checkbox-group v-model="reportForm.dimensions">
                    <el-checkbox value="batch">批次统计</el-checkbox>
                    <el-checkbox value="carrier">承运商统计</el-checkbox>
                    <el-checkbox value="warehouse">仓库统计</el-checkbox>
                    <el-checkbox value="store">门店统计</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="包含内容">
                  <el-checkbox-group v-model="reportForm.includes">
                    <el-checkbox value="temperature">温度数据</el-checkbox>
                    <el-checkbox value="exception">异常记录</el-checkbox>
                    <el-checkbox value="cost">费用明细</el-checkbox>
                    <el-checkbox value="loss">损耗统计</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateReport" style="width: 100%;">
                    <el-icon><Document /></el-icon>
                    生成日报
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="card-dark">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">历史报表</div>
              <div class="report-list">
                <div v-for="r in reportHistory" :key="r.id" class="report-item">
                  <div class="flex-between">
                    <span class="report-name">{{ r.name }}</span>
                    <el-tag size="small" :type="r.status === 'generated' ? 'success' : 'info'">
                      {{ r.status === 'generated' ? '已生成' : '生成中' }}
                    </el-tag>
                  </div>
                  <div class="report-meta">
                    <span>{{ r.date }}</span>
                    <span>{{ r.generator }}</span>
                  </div>
                  <div class="report-actions">
                    <el-button size="small" link type="primary" @click="previewReport(r)">预览</el-button>
                    <el-button size="small" link type="primary" @click="downloadReport(r)">下载</el-button>
                    <el-button size="small" link type="danger">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="16">
            <div class="card-dark">
              <div class="flex-between mb-16">
                <div style="font-size:16px;font-weight:600;color:#f1f5f9;">
                  费用趋势分析（近7天）
                </div>
                <el-radio-group v-model="chartType" size="small">
                  <el-radio-button value="bar">柱状图</el-radio-button>
                  <el-radio-button value="line">折线图</el-radio-button>
                </el-radio-group>
              </div>
              <div ref="trendChartRef" class="chart-container" style="height: 320px;"></div>
            </div>

            <div class="card-dark mt-16">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">
                承运商费用占比
              </div>
              <div ref="pieChartRef" class="chart-container" style="height: 300px;"></div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showDetailDialog" title="费用详情" width="600px">
      <div v-if="currentExpense">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="费用单号">{{ currentExpense.id }}</el-descriptions-item>
          <el-descriptions-item label="日期">{{ currentExpense.date }}</el-descriptions-item>
          <el-descriptions-item label="承运商">{{ currentExpense.carrier }}</el-descriptions-item>
          <el-descriptions-item label="关联批次">{{ currentExpense.batch }}</el-descriptions-item>
          <el-descriptions-item label="运输路线">{{ currentExpense.route }}</el-descriptions-item>
          <el-descriptions-item label="里程">{{ currentExpense.distance }} km</el-descriptions-item>
          <el-descriptions-item label="货物重量">{{ currentExpense.weight }} kg</el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ currentExpense.unitPrice.toFixed(2) }}/kg</el-descriptions-item>
          <el-descriptions-item label="费用金额" :span="2">
            <span style="color: #60a5fa; font-size: 18px; font-weight: 700;">
              ¥{{ currentExpense.amount.toLocaleString() }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 20px;">
          <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:#f1f5f9;">费用明细</div>
          <el-table :data="expenseDetails" size="small">
            <el-table-column prop="item" label="费用项目" />
            <el-table-column prop="desc" label="说明" />
            <el-table-column label="金额" align="right">
              <template #default="{ row }">¥{{ row.amount }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button v-if="currentExpense?.status === 'pending'" type="success" @click="confirmExpense(currentExpense)">
          确认费用
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showReportDialog" title="预览日报" width="900px">
      <div class="report-preview">
        <div class="report-header">
          <h2>生鲜供应链冷链运营日报</h2>
          <p>报告日期：2024年06月07日 &nbsp;&nbsp; 生成时间：2024-06-07 16:30:00</p>
        </div>
        <div class="report-section">
          <h3>一、运营概览</h3>
          <div class="report-stats">
            <div class="r-stat"><span class="r-val">28</span><span class="r-lab">今日批次</span></div>
            <div class="r-stat"><span class="r-val">15</span><span class="r-lab">在途车辆</span></div>
            <div class="r-stat"><span class="r-val">4</span><span class="r-lab">异常事件</span></div>
            <div class="r-stat"><span class="r-val">¥44,500</span><span class="r-lab">今日费用</span></div>
          </div>
        </div>
        <div class="report-section">
          <h3>二、温度监控汇总</h3>
          <p>今日所有批次平均温度：2.8℃，合格率：96.2%</p>
          <p>温度异常批次：1批次（B20240607003 云南昆明鲜花玫瑰）</p>
        </div>
        <div class="report-section">
          <h3>三、异常事件汇总</h3>
          <ul>
            <li>温度异常：1起，已处理完成</li>
            <li>临期预警：1起，紧急配送中</li>
            <li>损耗异常：1起，已登记上报</li>
            <li>配送延误：1起，处理中</li>
          </ul>
        </div>
        <div class="report-section">
          <h3>四、费用汇总</h3>
          <p>今日运输费用总计：¥44,500，其中：</p>
          <ul>
            <li>顺丰冷链：¥12,500</li>
            <li>京东冷链：¥8,400</li>
            <li>中通冷链：¥17,600</li>
            <li>其他：¥6,000</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="showReportDialog = false">关闭</el-button>
        <el-button type="primary" @click="printReport">
          <el-icon><Printer /></el-icon>
          打印
        </el-button>
        <el-button type="success" @click="downloadReport(null)">
          <el-icon><Download /></el-icon>
          导出PDF
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { expenseList } from '@/data/mockData'
import dayjs from 'dayjs'

const activeTab = ref('check')
const dateRange = ref([dayjs().subtract(7, 'day').toDate(), new Date()])
const statusFilter = ref('')
const chartType = ref('bar')
const showDetailDialog = ref(false)
const showReportDialog = ref(false)
const currentExpense = ref(null)
const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChart = null
let pieChart = null

const reportForm = reactive({
  date: new Date(),
  type: 'comprehensive',
  dimensions: ['batch', 'carrier'],
  includes: ['temperature', 'exception', 'cost', 'loss']
})

const reportHistory = [
  { id: 'RP20240607001', name: '20240607运营日报', date: '2024-06-07', generator: '张值班', status: 'generated' },
  { id: 'RP20240606001', name: '20240606运营日报', date: '2024-06-06', generator: '李值班', status: 'generated' },
  { id: 'RP20240605001', name: '20240605运营日报', date: '2024-06-05', generator: '王值班', status: 'generated' }
]

const expenseDetails = [
  { item: '基础运费', desc: '里程850km × 1.2元/km', amount: 10200 },
  { item: '冷链温控费', desc: '冷藏运输附加费', amount: 1500 },
  { item: '装卸费', desc: '人工装卸费用', amount: 800 },
  { item: '保险费', desc: '货物运输保险', amount: 0 }
]

const filteredExpenses = computed(() => {
  return expenseList.filter(e => {
    if (statusFilter.value && e.status !== statusFilter.value) return false
    return true
  })
})

const todayTotal = computed(() => 44500)
const confirmedTotal = computed(() => expenseList.filter(e => e.status === 'confirmed').reduce((sum, e) => sum + e.amount, 0))
const pendingTotal = computed(() => expenseList.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0))
const totalAmount = computed(() => filteredExpenses.value.reduce((sum, e) => sum + e.amount, 0))

const viewExpenseDetail = (row) => {
  currentExpense.value = row
  showDetailDialog.value = true
}

const confirmExpense = (row) => {
  ElMessage.success(`费用 ${row.id} 已确认`)
  row.status = 'confirmed'
  row.statusText = '已确认'
  showDetailDialog.value = false
}

const exportData = () => {
  ElMessage.success('数据导出中...')
}

const generateReport = () => {
  ElMessage.success('日报生成中，请稍候...')
  setTimeout(() => {
    showReportDialog.value = true
  }, 1000)
}

const previewReport = (r) => {
  showReportDialog.value = true
}

const downloadReport = (r) => {
  ElMessage.success('报表下载中...')
}

const printReport = () => {
  ElMessage.success('正在打印...')
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)
  const days = []
  const amounts = []
  for (let i = 6; i >= 0; i--) {
    days.push(dayjs().subtract(i, 'day').format('MM-DD'))
    amounts.push(Math.round(35000 + Math.random() * 15000))
  }
  trendChart.setOption({
    backgroundColor: 'transparent',
    grid: { left: '10%', right: '5%', top: '15%', bottom: '15%' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
      formatter: (params) => {
        return `${params[0].name}<br/>费用: ¥${params[0].value.toLocaleString()}`
      }
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      name: '元',
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [{
      data: amounts,
      type: chartType.value,
      barWidth: '40%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#60a5fa' },
          { offset: 1, color: '#3b82f6' }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      smooth: true,
      lineStyle: { color: '#60a5fa', width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(96, 165, 250, 0.3)' },
          { offset: 1, color: 'rgba(96, 165, 250, 0.05)' }
        ])
      }
    }]
  })
}

const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
      formatter: '{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#94a3b8' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0f172a',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' }
      },
      labelLine: { show: false },
      data: [
        { value: 12500, name: '顺丰冷链', itemStyle: { color: '#3b82f6' } },
        { value: 8400, name: '京东冷链', itemStyle: { color: '#22c55e' } },
        { value: 17600, name: '中通冷链', itemStyle: { color: '#f59e0b' } },
        { value: 6000, name: '其他', itemStyle: { color: '#8b5cf6' } }
      ]
    }]
  })
}

watch(chartType, () => {
  nextTick(() => {
    initTrendChart()
  })
})

onMounted(() => {
  nextTick(() => {
    initTrendChart()
    initPieChart()
  })
  window.addEventListener('resize', () => {
    trendChart?.resize()
    pieChart?.resize()
  })
})
</script>

<style scoped>
.finance-tabs :deep(.el-tabs__item) {
  color: #94a3b8;
  font-size: 15px;
}

.finance-tabs :deep(.el-tabs__item.is-active) {
  color: #60a5fa;
}

.finance-tabs :deep(.el-tabs__active-bar) {
  background-color: #60a5fa;
}

.finance-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: #334155;
}

.mt-16 {
  margin-top: 16px;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-item {
  padding: 12px;
  background: #0f172a;
  border-radius: 6px;
}

.report-name {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
}

.report-meta {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: #64748b;
  margin: 8px 0;
}

.report-actions {
  display: flex;
  gap: 8px;
}

.report-preview {
  background: #fff;
  color: #1e293b;
  padding: 30px;
  border-radius: 4px;
  max-height: 600px;
  overflow-y: auto;
}

.report-header {
  text-align: center;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.report-header h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 10px;
}

.report-header p {
  color: #64748b;
  font-size: 14px;
}

.report-section {
  margin-bottom: 20px;
}

.report-section h3 {
  font-size: 16px;
  color: #1e293b;
  border-left: 4px solid #3b82f6;
  padding-left: 10px;
  margin-bottom: 12px;
}

.report-section p,
.report-section li {
  color: #475569;
  font-size: 14px;
  line-height: 1.8;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.r-stat {
  text-align: center;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 8px;
}

.r-val {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.r-lab {
  font-size: 12px;
  color: #64748b;
}
</style>
