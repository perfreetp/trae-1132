<template>
  <div class="page-container">
    <div class="page-title">
      <el-icon :size="24" color="#60a5fa"><Shop /></el-icon>
      门店反馈
      <span style="font-size:14px;color:#64748b;font-weight:normal;">门店签收 · 承运商评价</span>
    </div>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="6">
        <div class="stat-card">
          <el-icon :size="28" color="#60a5fa"><Shop /></el-icon>
          <div class="stat-value" style="font-size:28px;">4</div>
          <div class="stat-label">合作门店</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #22c55e;">
          <el-icon :size="28" color="#22c55e"><CircleCheck /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#22c55e;">{{ todaySigned }}</div>
          <div class="stat-label">今日签收</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #f59e0b;">
          <el-icon :size="28" color="#f59e0b"><Clock /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#f59e0b;">{{ pendingSign }}</div>
          <div class="stat-label">待签收</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #8b5cf6;">
          <el-icon :size="28" color="#8b5cf6"><Star /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#8b5cf6;">4.7</div>
          <div class="stat-label">平均满意度</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="store-tabs">
      <el-tab-pane label="门店签收" name="sign">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="card-dark">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">门店列表</div>
              <div class="store-list">
                <div v-for="store in storeList" :key="store.id" class="store-card"
                  :class="{ active: selectedStore?.id === store.id }"
                  @click="selectStore(store)">
                  <div class="flex-between">
                    <span class="store-name">{{ store.name }}</span>
                    <el-badge :value="store.pendingCount" :hidden="store.pendingCount === 0">
                      <el-tag size="small" type="success">营业中</el-tag>
                    </el-badge>
                  </div>
                  <div class="store-addr">
                    <el-icon><Location /></el-icon>
                    {{ store.address }}
                  </div>
                  <div class="store-contact">
                    <span><el-icon><User /></el-icon> {{ store.manager }}</span>
                    <span><el-icon><Phone /></el-icon> {{ store.phone }}</span>
                  </div>
                  <div class="store-stats">
                    <span>今日收货：{{ store.todayReceived }}单</span>
                    <span>已签收：{{ store.todaySign }}单</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="card-dark">
              <div class="flex-between mb-16">
                <div style="font-size:16px;font-weight:600;color:#f1f5f9;">
                  {{ selectedStore?.name || '请选择门店' }} - 待签收单
                </div>
                <div class="flex-between" style="gap: 12px;">
                  <el-select v-model="signFilter" size="default" placeholder="状态筛选" style="width: 130px;">
                    <el-option label="全部" value="" />
                    <el-option label="待签收" value="pending" />
                    <el-option label="已签收" value="signed" />
                    <el-option label="有异常" value="exception" />
                  </el-select>
                </div>
              </div>

              <div v-if="selectedStore" class="table-dark">
                <el-table :data="signOrders" stripe style="width: 100%">
                  <el-table-column prop="orderNo" label="配送单号" width="140" />
                  <el-table-column prop="batch" label="批次号" width="160" />
                  <el-table-column prop="product" label="产品名称" min-width="160" />
                  <el-table-column label="数量" width="100">
                    <template #default="{ row }">
                      {{ row.quantity }} {{ row.unit }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="vehicle" label="配送车辆" width="110" />
                  <el-table-column prop="driver" label="司机" width="100" />
                  <el-table-column label="温度" width="90">
                    <template #default="{ row }">
                      <span :style="{ color: row.tempOk ? '#22c55e' : '#f59e0b' }">
                        {{ row.temperature }}℃
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="expectTime" label="预计送达" width="150" />
                  <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag :class="'status-' + row.status" size="small">
                        {{ row.statusText }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                      <el-button v-if="row.status === 'pending'" link type="primary" size="small" @click="signOrder(row)">
                        确认签收
                      </el-button>
                      <el-button v-else link type="primary" size="small" @click="viewSignDetail(row)">
                        查看详情
                      </el-button>
                      <el-button v-if="row.status !== 'signed'" link type="danger" size="small">
                        异常反馈
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-else class="empty-tip" style="margin-top: 80px;">
                <el-icon :size="48" color="#475569"><Shop /></el-icon>
                <p>请从左侧选择一个门店查看待签收单</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="承运商评价" name="rate">
        <div class="card-dark mb-16">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">承运商列表</div>
            <el-button type="primary" @click="showRateDialog = true">
              <el-icon><Star /></el-icon>
              发起评价
            </el-button>
          </div>

          <el-row :gutter="16">
            <el-col v-for="c in carrierList" :key="c.id" :span="8">
              <div class="carrier-card">
                <div class="carrier-header">
                  <div class="carrier-logo">
                    {{ c.name.substring(0, 2) }}
                  </div>
                  <div class="carrier-info">
                    <div class="carrier-name">{{ c.name }}</div>
                    <div class="carrier-contact">
                      <el-icon><User /></el-icon> {{ c.contact }}
                      <el-icon style="margin-left: 12px;"><Phone /></el-icon> {{ c.phone }}
                    </div>
                  </div>
                </div>
                <div class="carrier-stats">
                  <div class="stat-item">
                    <span class="stat-num">{{ c.totalOrders }}</span>
                    <span class="stat-lab">累计订单</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num" style="color: #22c55e;">{{ c.onTimeRate }}%</span>
                    <span class="stat-lab">准时率</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num" style="color: #f59e0b;">{{ c.damageRate }}%</span>
                    <span class="stat-lab">损耗率</span>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num" style="color: #f59e0b; display: flex; align-items: center;">
                      {{ c.rating }}
                      <el-icon style="margin-left: 4px;"><StarFilled /></el-icon>
                    </div>
                    <span class="stat-lab">综合评分</span>
                  </div>
                </div>
                <div class="carrier-actions">
                  <el-button size="small" type="primary" plain @click="viewCarrierDetail(c)">查看详情</el-button>
                  <el-button size="small" type="primary" @click="rateCarrier(c)">评价</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="card-dark">
          <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">近期评价记录</div>
          <div class="table-dark">
            <el-table :data="rateRecords" stripe style="width: 100%">
              <el-table-column prop="id" label="记录编号" width="140" />
              <el-table-column prop="carrier" label="承运商" width="130" />
              <el-table-column prop="batch" label="关联批次" width="160" />
              <el-table-column prop="store" label="评价门店" width="130" />
              <el-table-column label="综合评分" width="120">
                <template #default="{ row }">
                  <el-rate v-model="row.rating" disabled :max="5" />
                </template>
              </el-table-column>
              <el-table-column prop="timeliness" label="时效性" width="100">
                <template #default="{ row }">
                  {{ row.timeliness }}分
                </template>
              </el-table-column>
              <el-table-column prop="service" label="服务态度" width="100">
                <template #default="{ row }">
                  {{ row.service }}分
                </template>
              </el-table-column>
              <el-table-column prop="quality" label="货物质量" width="100">
                <template #default="{ row }">
                  {{ row.quality }}分
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="评价内容" min-width="180" />
              <el-table-column prop="time" label="评价时间" width="160" />
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showSignDialog" title="确认签收" width="550px">
      <div v-if="currentOrder" style="margin-bottom: 20px;">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="配送单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ currentOrder.batch }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ currentOrder.product }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentOrder.quantity }} {{ currentOrder.unit }}</el-descriptions-item>
          <el-descriptions-item label="配送车辆">{{ currentOrder.vehicle }}</el-descriptions-item>
          <el-descriptions-item label="司机">{{ currentOrder.driver }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <el-form :model="signForm" label-width="100px">
        <el-form-item label="实收数量">
          <el-input-number v-model="signForm.receivedQty" :min="0" /> {{ currentOrder?.unit || 'kg' }}
        </el-form-item>
        <el-form-item label="温度检查">
          <el-radio-group v-model="signForm.tempOk">
            <el-radio :value="true">正常</el-radio>
            <el-radio :value="false">异常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="包装检查">
          <el-checkbox v-model="signForm.packageOk">包装完整</el-checkbox>
          <el-checkbox v-model="signForm.noDamage" style="margin-left: 20px;">无破损</el-checkbox>
        </el-form-item>
        <el-form-item label="签收照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
          >
            <el-icon><Camera /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="signForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSignDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSign">确认签收</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showRateDialog" title="承运商评价" width="550px">
      <el-form :model="rateForm" label-width="100px">
        <el-form-item label="承运商">
          <el-select v-model="rateForm.carrier" placeholder="选择承运商" style="width: 100%;">
            <el-option v-for="c in carrierList" :key="c.id" :label="c.name" :value="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联批次">
          <el-select v-model="rateForm.batch" placeholder="选择批次" style="width: 100%;">
            <el-option v-for="b in batchList" :key="b.id" :label="b.id + ' - ' + b.name" :value="b.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价门店">
          <el-select v-model="rateForm.store" placeholder="选择门店" style="width: 100%;">
            <el-option v-for="s in storeList" :key="s.id" :label="s.name" :value="s.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="时效性">
          <el-rate v-model="rateForm.timeliness" :max="5" show-text />
        </el-form-item>
        <el-form-item label="服务态度">
          <el-rate v-model="rateForm.service" :max="5" show-text />
        </el-form-item>
        <el-form-item label="货物质量">
          <el-rate v-model="rateForm.quality" :max="5" show-text />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="rateForm.comment" type="textarea" :rows="3" placeholder="请输入评价内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRate">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { storeList, carrierList, batchList } from '@/data/mockData'

const activeTab = ref('sign')
const signFilter = ref('')
const selectedStore = ref(storeList[0] || null)
const showSignDialog = ref(false)
const showRateDialog = ref(false)
const currentOrder = ref(null)

const todaySigned = computed(() => storeList.reduce((sum, s) => sum + s.todaySign, 0))
const pendingSign = computed(() => storeList.reduce((sum, s) => sum + s.pendingCount, 0))

const signOrders = [
  { orderNo: 'D20240607001', batch: 'B20240607005', product: '浙江舟山带鱼', quantity: 500, unit: 'kg', vehicle: '浙B·33333', driver: '陈师傅', temperature: -15.2, tempOk: true, expectTime: '2024-06-07 16:00:00', status: 'pending', statusText: '待签收' },
  { orderNo: 'D20240607002', batch: 'B20240607001', product: '山东烟台红富士苹果', quantity: 800, unit: 'kg', vehicle: '沪A·12345', driver: '李师傅', temperature: 2.5, tempOk: true, expectTime: '2024-06-07 18:30:00', status: 'transit', statusText: '配送中' },
  { orderNo: 'D20240607003', batch: 'B20240607003', product: '云南昆明鲜花玫瑰', quantity: 200, unit: '束', vehicle: '云A·11111', driver: '张师傅', temperature: 6.5, tempOk: false, expectTime: '2024-06-07 22:00:00', status: 'exception', statusText: '有异常' },
  { orderNo: 'D20240606005', batch: 'B20240606003', product: '海南三亚芒果', quantity: 600, unit: 'kg', vehicle: '粤B·88888', driver: '刘师傅', temperature: 8.0, tempOk: true, expectTime: '2024-06-06 15:00:00', status: 'signed', statusText: '已签收' }
]

const rateRecords = [
  { id: 'R20240607001', carrier: '顺丰冷链', batch: 'B20240606001', store: '上海浦东店', rating: 5, timeliness: 5, service: 5, quality: 4, comment: '配送准时，货物保存良好', time: '2024-06-07 10:30:00' },
  { id: 'R20240607002', carrier: '京东冷链', batch: 'B20240606002', store: '广州天河店', rating: 4, timeliness: 4, service: 5, quality: 4, comment: '整体满意，司机服务态度好', time: '2024-06-07 09:15:00' },
  { id: 'R20240606003', carrier: '中通冷链', batch: 'B20240605001', store: '北京朝阳店', rating: 3, timeliness: 3, service: 4, quality: 3, comment: '配送稍有延误，货物质量尚可', time: '2024-06-06 16:20:00' }
]

const signForm = reactive({
  receivedQty: 0,
  tempOk: true,
  packageOk: true,
  noDamage: true,
  remark: ''
})

const rateForm = reactive({
  carrier: '',
  batch: '',
  store: '',
  timeliness: 4,
  service: 4,
  quality: 4,
  comment: ''
})

const selectStore = (store) => {
  selectedStore.value = store
}

const signOrder = (order) => {
  currentOrder.value = order
  signForm.receivedQty = order.quantity
  showSignDialog.value = true
}

const viewSignDetail = (row) => {
  ElMessage.info(`查看配送单 ${row.orderNo} 详情`)
}

const viewCarrierDetail = (carrier) => {
  ElMessage.info(`查看承运商 ${carrier.name} 详情`)
}

const rateCarrier = (carrier) => {
  rateForm.carrier = carrier.name
  showRateDialog.value = true
}

const confirmSign = () => {
  ElMessage.success('签收成功')
  showSignDialog.value = false
}

const submitRate = () => {
  ElMessage.success('评价已提交')
  showRateDialog.value = false
}
</script>

<style scoped>
.store-tabs :deep(.el-tabs__item) {
  color: #94a3b8;
  font-size: 15px;
}

.store-tabs :deep(.el-tabs__item.is-active) {
  color: #60a5fa;
}

.store-tabs :deep(.el-tabs__active-bar) {
  background-color: #60a5fa;
}

.store-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: #334155;
}

.store-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 550px;
  overflow-y: auto;
}

.store-card {
  padding: 14px;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.store-card:hover,
.store-card.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.store-name {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.store-addr {
  font-size: 12px;
  color: #64748b;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.store-contact {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 10px;
}

.store-contact span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.store-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #60a5fa;
  padding-top: 10px;
  border-top: 1px solid #334155;
}

.carrier-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 16px;
}

.carrier-header {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
}

.carrier-logo {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.carrier-name {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 6px;
}

.carrier-contact {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
}

.carrier-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 14px 0;
  border-top: 1px solid #334155;
  border-bottom: 1px solid #334155;
  margin-bottom: 14px;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-lab {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}

.carrier-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.empty-tip {
  text-align: center;
  color: #64748b;
}

.empty-tip p {
  margin-top: 16px;
  font-size: 14px;
}
</style>
