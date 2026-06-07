<template>
  <div class="page-container">
    <div class="page-title">
      <el-icon :size="24" color="#60a5fa"><Warning /></el-icon>
      异常处置
      <span style="font-size:14px;color:#64748b;font-weight:normal;">异常处理 · 召回追踪 · 值班备注</span>
    </div>

    <el-row :gutter="16" class="mb-20">
      <el-col :span="6">
        <div class="stat-card" style="border-color: #ef4444;">
          <el-icon :size="28" color="#ef4444"><CircleClose /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#ef4444;">{{ pendingCount }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #f59e0b;">
          <el-icon :size="28" color="#f59e0b"><Loading /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#f59e0b;">{{ handlingCount }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #22c55e;">
          <el-icon :size="28" color="#22c55e"><CircleCheck /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#22c55e;">{{ resolvedCount }}</div>
          <div class="stat-label">已解决</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="border-color: #8b5cf6;">
          <el-icon :size="28" color="#8b5cf6"><TrendCharts /></el-icon>
          <div class="stat-value" style="font-size:28px;color:#8b5cf6;">12.5%</div>
          <div class="stat-label">异常率(较昨日)</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="exception-tabs">
      <el-tab-pane label="异常列表" name="list">
        <div class="card-dark">
          <div class="flex-between mb-16">
            <div style="font-size:16px;font-weight:600;color:#f1f5f9;">异常事件</div>
            <div class="flex-between" style="gap: 12px;">
              <el-select v-model="levelFilter" placeholder="级别筛选" size="default" style="width: 130px;">
                <el-option label="全部" value="" />
                <el-option label="紧急" value="danger" />
                <el-option label="警告" value="warning" />
                <el-option label="提示" value="info" />
              </el-select>
              <el-select v-model="typeFilter" placeholder="类型筛选" size="default" style="width: 130px;">
                <el-option label="全部" value="" />
                <el-option label="温度异常" value="temperature" />
                <el-option label="临期预警" value="shelfLife" />
                <el-option label="损耗异常" value="damage" />
                <el-option label="配送延误" value="delay" />
              </el-select>
              <el-button type="danger" @click="showReportDialog = true">
                <el-icon><Plus /></el-icon>
                上报异常
              </el-button>
            </div>
          </div>

          <div class="exception-list">
            <div v-for="ex in filteredExceptions" :key="ex.id" class="exception-card"
              :class="'level-' + ex.level">
              <div class="ex-header">
                <div class="ex-title">
                  <el-tag :class="'status-' + ex.level" size="small" style="margin-right: 10px;">
                    {{ ex.levelText }}
                  </el-tag>
                  <span class="ex-type">{{ ex.typeText }}</span>
                </div>
                <div class="ex-time">{{ ex.time }}</div>
              </div>
              <div class="ex-content">
                <div class="ex-info-row">
                  <span class="ex-label">批次号：</span>
                  <span class="ex-value">{{ ex.batch }}</span>
                  <span class="ex-label" style="margin-left: 20px;">产品：</span>
                  <span class="ex-value">{{ ex.product }}</span>
                </div>
                <div class="ex-info-row">
                  <span class="ex-label">位置：</span>
                  <span class="ex-value">{{ ex.location }}</span>
                  <span class="ex-label" style="margin-left: 20px;">车辆：</span>
                  <span class="ex-value">{{ ex.vehicle }}</span>
                </div>
                <div class="ex-info-row">
                  <span class="ex-label">异常值：</span>
                  <span class="ex-value danger">{{ ex.value }}</span>
                  <span class="ex-label" style="margin-left: 20px;">阈值：</span>
                  <span class="ex-value">{{ ex.threshold }}</span>
                </div>
                <p class="ex-desc">{{ ex.description }}</p>
              </div>
              <div class="ex-footer">
                <div class="ex-handler">
                  <el-icon><User /></el-icon>
                  {{ ex.handler || '暂未分配' }}
                </div>
                <div class="ex-actions">
                  <el-tag :class="'status-' + ex.status" size="small">{{ ex.statusText }}</el-tag>
                  <el-button size="small" type="primary" link @click="handleException(ex)">
                    {{ ex.status === 'pending' ? '立即处理' : '查看详情' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="召回追踪" name="recall">
        <el-row :gutter="16">
          <el-col :span="10">
            <div class="card-dark">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">召回批次</div>
              <div class="recall-list">
                <div v-for="r in recallList" :key="r.id" class="recall-item"
                  :class="{ active: selectedRecall?.id === r.id }"
                  @click="selectRecall(r)">
                  <div class="flex-between">
                    <span class="recall-batch">{{ r.batch }}</span>
                    <el-tag type="danger" size="small">召回中</el-tag>
                  </div>
                  <div class="recall-product">{{ r.product }}</div>
                  <div class="recall-reason">原因：{{ r.reason }}</div>
                  <div class="recall-progress">
                    <span>召回进度</span>
                    <el-progress :percentage="r.progress" :stroke-width="6" color="#ef4444" />
                    <span>{{ r.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="card-dark" v-if="selectedRecall">
              <div class="flex-between mb-16">
                <div style="font-size:16px;font-weight:600;color:#f1f5f9;">
                  召回追踪 - {{ selectedRecall.batch }}
                </div>
                <el-button size="small" type="danger">
                  <el-icon><Picture /></el-icon>
                  异常照片
                </el-button>
              </div>
              <div class="recall-detail">
                <el-descriptions :column="2" border size="small">
                  <el-descriptions-item label="产品名称">{{ selectedRecall.product }}</el-descriptions-item>
                  <el-descriptions-item label="召回数量">{{ selectedRecall.quantity }}kg</el-descriptions-item>
                  <el-descriptions-item label="召回原因">{{ selectedRecall.reason }}</el-descriptions-item>
                  <el-descriptions-item label="发起时间">{{ selectedRecall.startTime }}</el-descriptions-item>
                  <el-descriptions-item label="已召回">{{ selectedRecall.returned }}kg</el-descriptions-item>
                  <el-descriptions-item label="涉及门店">{{ selectedRecall.stores }}家</el-descriptions-item>
                </el-descriptions>

                <div style="margin-top: 20px;">
                  <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:#f1f5f9;">流转追踪</div>
                  <el-steps :active="selectedRecall.step" finish-status="success" direction="vertical">
                    <el-step title="发起召回" description="2024-06-06 14:30  张值班">
                      <template #extra>
                        <p style="color: #94a3b8; font-size: 12px;">检测到批次温度异常，启动召回流程</p>
                      </template>
                    </el-step>
                    <el-step title="通知门店" description="2024-06-06 15:00  系统通知">
                      <template #extra>
                        <p style="color: #94a3b8; font-size: 12px;">已通知全部8家涉事门店</p>
                      </template>
                    </el-step>
                    <el-step title="产品撤回" description="进行中">
                      <template #extra>
                        <p style="color: #94a3b8; font-size: 12px;">已完成5家门店产品撤回，剩余3家</p>
                      </template>
                    </el-step>
                    <el-step title="销毁处理" description="待完成" />
                    <el-step title="结案归档" description="待完成" />
                  </el-steps>
                </div>
              </div>
            </div>
            <div v-else class="empty-tip" style="margin-top: 100px;">
              <el-icon :size="48" color="#475569"><Warning /></el-icon>
              <p>请从左侧选择一个召回批次查看详情</p>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="值班备注" name="notes">
        <el-row :gutter="16">
          <el-col :span="16">
            <div class="card-dark">
              <div class="flex-between mb-16">
                <div style="font-size:16px;font-weight:600;color:#f1f5f9;">值班记录</div>
                <el-button type="primary" @click="showNoteDialog = true">
                  <el-icon><EditPen /></el-icon>
                  添加备注
                </el-button>
              </div>
              <div class="timeline">
                <div v-for="note in dutyNotes" :key="note.id" class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="note-type" :class="'type-' + note.type">
                        {{ note.type === 'handover' ? '交接班' : note.type === 'handle' ? '事件处理' : '协调沟通' }}
                      </span>
                      <span class="note-author">{{ note.author }}</span>
                      <span class="note-time">{{ note.time }}</span>
                    </div>
                    <p class="note-text">{{ note.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-dark mb-16">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">值班信息</div>
              <div class="duty-panel">
                <div class="duty-item">
                  <span class="duty-label">当前班次</span>
                  <el-tag type="primary">白班 (08:00-20:00)</el-tag>
                </div>
                <div class="duty-item">
                  <span class="duty-label">值班人员</span>
                  <span class="duty-value">张值班</span>
                </div>
                <div class="duty-item">
                  <span class="duty-label">接班时间</span>
                  <span class="duty-value">2024-06-07 08:00:00</span>
                </div>
                <div class="duty-item">
                  <span class="duty-label">下班时间</span>
                  <span class="duty-value">2024-06-07 20:00:00</span>
                </div>
                <div class="duty-item">
                  <span class="duty-label">当班时长</span>
                  <span class="duty-value highlight">已工作 4小时25分</span>
                </div>
              </div>
            </div>

            <div class="card-dark">
              <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:16px;">待办事项</div>
              <div class="todo-list">
                <div v-for="(todo, idx) in todoList" :key="idx" class="todo-item">
                  <el-checkbox v-model="todo.done" />
                  <span :class="{ done: todo.done }">{{ todo.text }}</span>
                  <el-tag v-if="todo.urgent" type="danger" size="small">紧急</el-tag>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showReportDialog" title="异常上报" width="550px">
      <el-form :model="reportForm" label-width="100px">
        <el-form-item label="异常类型">
          <el-select v-model="reportForm.type" placeholder="选择异常类型" style="width: 100%;">
            <el-option label="温度异常" value="temperature" />
            <el-option label="湿度异常" value="humidity" />
            <el-option label="损耗异常" value="damage" />
            <el-option label="设备故障" value="equipment" />
            <el-option label="配送延误" value="delay" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-radio-group v-model="reportForm.level">
            <el-radio value="info">提示</el-radio>
            <el-radio value="warning">警告</el-radio>
            <el-radio value="danger">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联批次">
          <el-select v-model="reportForm.batch" placeholder="选择批次" style="width: 100%;">
            <el-option v-for="b in batchList" :key="b.id" :label="b.id + ' - ' + b.name" :value="b.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生位置">
          <el-input v-model="reportForm.location" placeholder="请输入发生位置" />
        </el-form-item>
        <el-form-item label="现场照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
          >
            <el-icon><Camera /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="异常描述">
          <el-input v-model="reportForm.description" type="textarea" :rows="3" placeholder="请详细描述异常情况" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReportDialog = false">取消</el-button>
        <el-button type="danger" @click="submitReport">提交上报</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showNoteDialog" title="添加值班备注" width="500px">
      <el-form :model="noteForm" label-width="100px">
        <el-form-item label="备注类型">
          <el-select v-model="noteForm.type" style="width: 100%;">
            <el-option label="交接班" value="handover" />
            <el-option label="事件处理" value="handle" />
            <el-option label="协调沟通" value="coordination" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注内容">
          <el-input v-model="noteForm.content" type="textarea" :rows="4" placeholder="请输入备注内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="submitNote">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showHandleDialog" title="处理异常" width="600px">
      <div v-if="currentException" style="margin-bottom: 20px;">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="异常类型">{{ currentException.typeText }}</el-descriptions-item>
          <el-descriptions-item label="级别">{{ currentException.levelText }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ currentException.batch }}</el-descriptions-item>
          <el-descriptions-item label="产品">{{ currentException.product }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理方案">
          <el-radio-group v-model="handleForm.solution">
            <el-radio value="adjust">调整温度/设备</el-radio>
            <el-radio value="transfer">紧急转运</el-radio>
            <el-radio value="recall">启动召回</el-radio>
            <el-radio value="other">其他处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理人">
          <el-input v-model="handleForm.handler" placeholder="请输入处理人姓名" />
        </el-form-item>
        <el-form-item label="处理措施">
          <el-input v-model="handleForm.measures" type="textarea" :rows="3" placeholder="请详细描述处理措施" />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio-group v-model="handleForm.result">
            <el-radio value="resolved">已解决</el-radio>
            <el-radio value="continue">继续跟进</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showHandleDialog = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确认提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { exceptionList, batchList, dutyNotes, createException } from '@/data/mockData'
import dayjs from 'dayjs'

const activeTab = ref('list')
const levelFilter = ref('')
const typeFilter = ref('')
const showReportDialog = ref(false)
const showNoteDialog = ref(false)
const showHandleDialog = ref(false)
const selectedRecall = ref(null)
const currentException = ref(null)

const recallList = ref([
  { id: 'R001', batch: 'B20240607003', product: '云南昆明鲜花玫瑰', reason: '运输温度异常', quantity: 500, returned: 320, progress: 64, stores: 8, startTime: '2024-06-06 14:30:00', step: 2 },
  { id: 'R002', batch: 'B20240607006', product: '广东湛江生蚝', reason: '临期紧急处理', quantity: 800, returned: 680, progress: 85, stores: 5, startTime: '2024-06-07 09:15:00', step: 3 }
])

const todoList = ref([
  { text: '处理B20240607006批次生蚝临期问题', done: false, urgent: true },
  { text: '跟进云A·11111车辆温度异常情况', done: true, urgent: true },
  { text: '核对今日运输费用账单', done: false, urgent: false },
  { text: '生成今日运营日报', done: false, urgent: false },
  { text: '与承运商沟通配送延误问题', done: true, urgent: false }
])

const reportForm = reactive({
  type: '',
  level: 'warning',
  batch: '',
  location: '',
  description: ''
})

const noteForm = reactive({
  type: 'handle',
  content: ''
})

const handleForm = reactive({
  solution: 'adjust',
  handler: '张值班',
  measures: '',
  result: 'resolved'
})

const pendingCount = computed(() => exceptionList.filter(e => e.status === 'pending').length)
const handlingCount = computed(() => exceptionList.filter(e => e.status === 'handling').length)
const resolvedCount = computed(() => exceptionList.filter(e => e.status === 'resolved').length)

const filteredExceptions = computed(() => {
  return exceptionList.filter(e => {
    if (levelFilter.value && e.level !== levelFilter.value) return false
    if (typeFilter.value && e.type !== typeFilter.value) return false
    return true
  })
})

const selectRecall = (r) => {
  selectedRecall.value = r
}

const handleException = (ex) => {
  currentException.value = ex
  showHandleDialog.value = true
}

const submitReport = () => {
  if (!reportForm.type || !reportForm.batch || !reportForm.location) {
    ElMessage.warning('请填写完整信息')
    return
  }
  const newEx = createException(reportForm)
  ElMessage.success(`异常 ${newEx.id} 已上报，相关人员已收到通知`)
  showReportDialog.value = false
  reportForm.type = ''
  reportForm.level = 'warning'
  reportForm.batch = ''
  reportForm.location = ''
  reportForm.description = ''
}

const submitNote = () => {
  if (!noteForm.content) {
    ElMessage.warning('请输入备注内容')
    return
  }
  const newNote = {
    id: 'N' + Date.now(),
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    author: '张值班',
    content: noteForm.content,
    type: noteForm.type
  }
  dutyNotes.unshift(newNote)
  ElMessage.success('备注已添加')
  showNoteDialog.value = false
  noteForm.content = ''
}

const submitHandle = () => {
  if (!currentException.value) return
  
  currentException.value.handler = handleForm.handler
  currentException.value.status = handleForm.result === 'resolved' ? 'resolved' : 'handling'
  currentException.value.statusText = handleForm.result === 'resolved' ? '已解决' : '处理中'
  
  if (handleForm.measures) {
    const note = {
      id: 'N' + Date.now(),
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      author: handleForm.handler,
      content: `处理异常 ${currentException.value.id}：${handleForm.measures}`,
      type: 'handle'
    }
    dutyNotes.unshift(note)
  }
  
  ElMessage.success('处理记录已提交')
  showHandleDialog.value = false
}
</script>

<style scoped>
.exception-tabs :deep(.el-tabs__item) {
  color: #94a3b8;
  font-size: 15px;
}

.exception-tabs :deep(.el-tabs__item.is-active) {
  color: #60a5fa;
}

.exception-tabs :deep(.el-tabs__active-bar) {
  background-color: #60a5fa;
}

.exception-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: #334155;
}

.exception-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exception-card {
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
}

.exception-card:hover {
  border-color: #475569;
}

.exception-card.level-danger {
  border-left: 4px solid #ef4444;
}

.exception-card.level-warning {
  border-left: 4px solid #f59e0b;
}

.exception-card.level-info {
  border-left: 4px solid #3b82f6;
}

.ex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ex-title {
  display: flex;
  align-items: center;
}

.ex-type {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.ex-time {
  font-size: 12px;
  color: #64748b;
}

.ex-info-row {
  margin-bottom: 6px;
  font-size: 13px;
}

.ex-label {
  color: #64748b;
}

.ex-value {
  color: #e2e8f0;
}

.ex-value.danger {
  color: #f87171;
  font-weight: 600;
}

.ex-desc {
  margin-top: 10px;
  padding: 10px;
  background: #0f172a;
  border-radius: 6px;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
}

.ex-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #334155;
}

.ex-handler {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}

.ex-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recall-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.recall-item {
  padding: 14px;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.recall-item:hover,
.recall-item.active {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.recall-batch {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}

.recall-product {
  font-size: 13px;
  color: #94a3b8;
  margin: 8px 0;
}

.recall-reason {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

.recall-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.recall-detail {
  color: #e2e8f0;
}

.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid #0f172a;
  box-shadow: 0 0 0 2px #3b82f6;
}

.timeline-content {
  background: #0f172a;
  padding: 14px;
  border-radius: 8px;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.note-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #1e3a5f;
  color: #60a5fa;
}

.note-type.type-handle {
  background: #065f46;
  color: #6ee7b7;
}

.note-type.type-coordination {
  background: #78350f;
  color: #fcd34d;
}

.note-author {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
}

.note-time {
  font-size: 12px;
  color: #64748b;
  margin-left: auto;
}

.note-text {
  font-size: 14px;
  color: #e2e8f0;
  line-height: 1.6;
  margin: 0;
}

.duty-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.duty-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.duty-label {
  font-size: 13px;
  color: #64748b;
}

.duty-value {
  font-size: 13px;
  color: #e2e8f0;
}

.duty-value.highlight {
  color: #60a5fa;
  font-weight: 600;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #0f172a;
  border-radius: 6px;
  font-size: 13px;
}

.todo-item span {
  flex: 1;
  color: #e2e8f0;
}

.todo-item .done {
  text-decoration: line-through;
  color: #64748b;
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
