import dayjs from 'dayjs'

export const batchList = [
  {
    id: 'B20240607001',
    name: '山东烟台红富士苹果',
    origin: '山东烟台产地A',
    warehouse: '华东中心仓',
    quantity: 5000,
    unit: 'kg',
    temperature: 2.5,
    humidity: 85,
    shelfLife: 30,
    remainingDays: 25,
    status: 'transit',
    statusText: '运输中',
    createTime: '2024-06-07 08:30:00',
    vehicle: '沪A·12345'
  },
  {
    id: 'B20240607002',
    name: '海南三亚妃子笑荔枝',
    origin: '海南三亚产地B',
    warehouse: '华南中心仓',
    quantity: 3000,
    unit: 'kg',
    temperature: 4.2,
    humidity: 90,
    shelfLife: 15,
    remainingDays: 12,
    status: 'warehouse',
    statusText: '仓储中',
    createTime: '2024-06-06 14:20:00',
    vehicle: '粤B·67890'
  },
  {
    id: 'B20240607003',
    name: '云南昆明鲜花玫瑰',
    origin: '云南昆明产地C',
    warehouse: '西南中心仓',
    quantity: 2000,
    unit: '束',
    temperature: 1.8,
    humidity: 88,
    shelfLife: 7,
    remainingDays: 5,
    status: 'warning',
    statusText: '临期预警',
    createTime: '2024-06-05 10:15:00',
    vehicle: '云A·11111'
  },
  {
    id: 'B20240607004',
    name: '内蒙古草原羊肉',
    origin: '内蒙古锡林郭勒',
    warehouse: '华北中心仓',
    quantity: 8000,
    unit: 'kg',
    temperature: -18.5,
    humidity: 60,
    shelfLife: 180,
    remainingDays: 175,
    status: 'normal',
    statusText: '正常',
    createTime: '2024-06-04 16:45:00',
    vehicle: '蒙A·22222'
  },
  {
    id: 'B20240607005',
    name: '浙江舟山带鱼',
    origin: '浙江舟山渔场',
    warehouse: '华东中心仓',
    quantity: 4500,
    unit: 'kg',
    temperature: -15.2,
    humidity: 65,
    shelfLife: 90,
    remainingDays: 85,
    status: 'store',
    statusText: '门店配送中',
    createTime: '2024-06-03 09:30:00',
    vehicle: '浙B·33333'
  },
  {
    id: 'B20240607006',
    name: '广东湛江生蚝',
    origin: '广东湛江产地D',
    warehouse: '华南中心仓',
    quantity: 2500,
    unit: 'kg',
    temperature: 3.5,
    humidity: 92,
    shelfLife: 10,
    remainingDays: 2,
    status: 'danger',
    statusText: '紧急处理',
    createTime: '2024-06-01 11:00:00',
    vehicle: '粤C·44444'
  }
]

export const vehicleList = [
  {
    id: 'V001',
    plate: '沪A·12345',
    driver: '李师傅',
    phone: '138****1234',
    status: 'transit',
    statusText: '运输中',
    currentLocation: '江苏省苏州市',
    destination: '华东中心仓',
    temperature: 2.5,
    humidity: 85,
    progress: 65,
    eta: '2024-06-07 18:30',
    batch: 'B20240607001',
    cargo: '山东烟台红富士苹果 5000kg'
  },
  {
    id: 'V002',
    plate: '粤B·67890',
    driver: '王师傅',
    phone: '139****5678',
    status: 'loading',
    statusText: '装货中',
    currentLocation: '海南三亚',
    destination: '华南中心仓',
    temperature: 4.2,
    humidity: 90,
    progress: 10,
    eta: '2024-06-08 20:00',
    batch: 'B20240607002',
    cargo: '海南三亚妃子笑荔枝 3000kg'
  },
  {
    id: 'V003',
    plate: '云A·11111',
    driver: '张师傅',
    phone: '137****9012',
    status: 'transit',
    statusText: '运输中',
    currentLocation: '贵州省贵阳市',
    destination: '西南中心仓',
    temperature: 1.8,
    humidity: 88,
    progress: 45,
    eta: '2024-06-07 22:00',
    batch: 'B20240607003',
    cargo: '云南昆明鲜花玫瑰 2000束'
  },
  {
    id: 'V004',
    plate: '蒙A·22222',
    driver: '赵师傅',
    phone: '136****3456',
    status: 'unloading',
    statusText: '卸货中',
    currentLocation: '华北中心仓',
    destination: '华北中心仓',
    temperature: -18.5,
    humidity: 60,
    progress: 100,
    eta: '已到达',
    batch: 'B20240607004',
    cargo: '内蒙古草原羊肉 8000kg'
  },
  {
    id: 'V005',
    plate: '浙B·33333',
    driver: '陈师傅',
    phone: '135****7890',
    status: 'delivery',
    statusText: '门店配送',
    currentLocation: '上海市浦东新区',
    destination: '上海浦东店',
    temperature: -15.2,
    humidity: 65,
    progress: 80,
    eta: '2024-06-07 16:00',
    batch: 'B20240607005',
    cargo: '浙江舟山带鱼 4500kg'
  }
]

export const warehouseList = [
  {
    id: 'W001',
    name: '华东中心仓',
    location: '上海市青浦区',
    totalArea: 20000,
    usedArea: 15000,
    temperatureZones: ['冷藏(0-4℃)', '冷冻(-18℃)', '恒温(15-20℃)'],
    status: 'normal'
  },
  {
    id: 'W002',
    name: '华南中心仓',
    location: '广东省广州市',
    totalArea: 18000,
    usedArea: 12000,
    temperatureZones: ['冷藏(0-4℃)', '冷冻(-18℃)', '恒温(15-20℃)'],
    status: 'normal'
  },
  {
    id: 'W003',
    name: '华北中心仓',
    location: '北京市大兴区',
    totalArea: 22000,
    usedArea: 18000,
    temperatureZones: ['冷藏(0-4℃)', '冷冻(-18℃)', '恒温(15-20℃)'],
    status: 'normal'
  },
  {
    id: 'W004',
    name: '西南中心仓',
    location: '重庆市渝北区',
    totalArea: 15000,
    usedArea: 10000,
    temperatureZones: ['冷藏(0-4℃)', '冷冻(-18℃)', '恒温(15-20℃)'],
    status: 'normal'
  }
]

export const locationList = [
  { name: '山东烟台产地A', type: 'origin', x: 280, y: 120 },
  { name: '海南三亚产地B', type: 'origin', x: 260, y: 380 },
  { name: '云南昆明产地C', type: 'origin', x: 120, y: 300 },
  { name: '内蒙古锡林郭勒', type: 'origin', x: 350, y: 80 },
  { name: '浙江舟山渔场', type: 'origin', x: 330, y: 180 },
  { name: '广东湛江产地D', type: 'origin', x: 220, y: 360 },
  { name: '华东中心仓', type: 'warehouse', x: 320, y: 160 },
  { name: '华南中心仓', type: 'warehouse', x: 250, y: 340 },
  { name: '华北中心仓', type: 'warehouse', x: 340, y: 110 },
  { name: '西南中心仓', type: 'warehouse', x: 150, y: 280 },
  { name: '上海浦东店', type: 'store', x: 340, y: 170 },
  { name: '广州天河店', type: 'store', x: 260, y: 350 },
  { name: '北京朝阳店', type: 'store', x: 350, y: 120 },
  { name: '重庆渝中店', type: 'store', x: 160, y: 290 }
]

export const exceptionList = [
  {
    id: 'E001',
    type: 'temperature',
    typeText: '温度异常',
    batch: 'B20240607003',
    product: '云南昆明鲜花玫瑰',
    location: '贵州省贵阳市',
    vehicle: '云A·11111',
    value: 6.5,
    threshold: '≤5℃',
    level: 'warning',
    levelText: '警告',
    time: '2024-06-07 10:30:00',
    status: 'handling',
    statusText: '处理中',
    handler: '张值班',
    description: '运输途中制冷设备短暂停机，温度回升至6.5℃'
  },
  {
    id: 'E002',
    type: 'shelfLife',
    typeText: '临期预警',
    batch: 'B20240607006',
    product: '广东湛江生蚝',
    location: '华南中心仓',
    vehicle: '-',
    value: 2,
    threshold: '≥3天',
    level: 'danger',
    levelText: '紧急',
    time: '2024-06-07 09:15:00',
    status: 'pending',
    statusText: '待处理',
    handler: '',
    description: '剩余保质期2天，需紧急配送或促销处理'
  },
  {
    id: 'E003',
    type: 'damage',
    typeText: '损耗异常',
    batch: 'B20240607002',
    product: '海南三亚妃子笑荔枝',
    location: '华南中心仓',
    vehicle: '粤B·67890',
    value: 150,
    threshold: '≤100kg',
    level: 'warning',
    levelText: '警告',
    time: '2024-06-07 08:45:00',
    status: 'resolved',
    statusText: '已解决',
    handler: '李值班',
    description: '装卸过程中部分荔枝挤压受损，约150kg'
  },
  {
    id: 'E004',
    type: 'delay',
    typeText: '配送延误',
    batch: 'B20240607001',
    product: '山东烟台红富士苹果',
    location: '江苏省苏州市',
    vehicle: '沪A·12345',
    value: 120,
    threshold: '≤60分钟',
    level: 'info',
    levelText: '提示',
    time: '2024-06-07 11:00:00',
    status: 'handling',
    statusText: '处理中',
    handler: '张值班',
    description: '高速路段拥堵，预计延误2小时'
  }
]

export const storeList = [
  {
    id: 'S001',
    name: '上海浦东店',
    address: '上海市浦东新区张江高科技园区',
    manager: '王经理',
    phone: '138****1111',
    todayReceived: 8,
    todaySign: 7,
    pendingCount: 1
  },
  {
    id: 'S002',
    name: '广州天河店',
    address: '广州市天河区珠江新城',
    manager: '李经理',
    phone: '139****2222',
    todayReceived: 6,
    todaySign: 6,
    pendingCount: 0
  },
  {
    id: 'S003',
    name: '北京朝阳店',
    address: '北京市朝阳区国贸商圈',
    manager: '张经理',
    phone: '137****3333',
    todayReceived: 10,
    todaySign: 8,
    pendingCount: 2
  },
  {
    id: 'S004',
    name: '重庆渝中店',
    address: '重庆市渝中区解放碑',
    manager: '赵经理',
    phone: '136****4444',
    todayReceived: 5,
    todaySign: 5,
    pendingCount: 0
  }
]

export const carrierList = [
  {
    id: 'C001',
    name: '顺丰冷链',
    contact: '王总',
    phone: '138****8888',
    totalOrders: 156,
    onTimeRate: 96.5,
    damageRate: 0.8,
    rating: 4.8,
    status: 'cooperating'
  },
  {
    id: 'C002',
    name: '京东冷链',
    contact: '李总',
    phone: '139****9999',
    totalOrders: 142,
    onTimeRate: 95.2,
    damageRate: 1.2,
    rating: 4.6,
    status: 'cooperating'
  },
  {
    id: 'C003',
    name: '中通冷链',
    contact: '张总',
    phone: '137****7777',
    totalOrders: 89,
    onTimeRate: 92.8,
    damageRate: 2.1,
    rating: 4.2,
    status: 'cooperating'
  }
]

export const expenseList = [
  {
    id: 'F001',
    date: '2024-06-07',
    carrier: '顺丰冷链',
    batch: 'B20240607001',
    route: '山东烟台 → 上海',
    distance: 850,
    weight: 5000,
    unitPrice: 2.5,
    amount: 12500,
    status: 'pending',
    statusText: '待核对'
  },
  {
    id: 'F002',
    date: '2024-06-07',
    carrier: '京东冷链',
    batch: 'B20240607002',
    route: '海南三亚 → 广州',
    distance: 620,
    weight: 3000,
    unitPrice: 2.8,
    amount: 8400,
    status: 'pending',
    statusText: '待核对'
  },
  {
    id: 'F003',
    date: '2024-06-06',
    carrier: '顺丰冷链',
    batch: 'B20240606001',
    route: '云南昆明 → 重庆',
    distance: 720,
    weight: 2000,
    unitPrice: 3.0,
    amount: 6000,
    status: 'confirmed',
    statusText: '已确认'
  },
  {
    id: 'F004',
    date: '2024-06-06',
    carrier: '中通冷链',
    batch: 'B20240606002',
    route: '内蒙古 → 北京',
    distance: 580,
    weight: 8000,
    unitPrice: 2.2,
    amount: 17600,
    status: 'confirmed',
    statusText: '已确认'
  }
]

export const generateTempData = () => {
  const data = []
  const now = dayjs()
  for (let i = 23; i >= 0; i--) {
    const time = now.subtract(i, 'hour').format('HH:00')
    const temp = 2 + Math.random() * 2 - 1
    data.push({ time, temp: Number(temp.toFixed(1)) })
  }
  return data
}

export const generateHumidityData = () => {
  const data = []
  const now = dayjs()
  for (let i = 23; i >= 0; i--) {
    const time = now.subtract(i, 'hour').format('HH:00')
    const humidity = 80 + Math.random() * 15
    data.push({ time, humidity: Number(humidity.toFixed(0)) })
  }
  return data
}

export const dutyNotes = [
  {
    id: 'N001',
    time: '2024-06-07 08:00:00',
    author: '张值班',
    content: '今日早班交接，系统运行正常，在途车辆5台，异常2项待处理',
    type: 'handover'
  },
  {
    id: 'N002',
    time: '2024-06-07 09:30:00',
    author: '张值班',
    content: '处理B20240607003批次温度异常，已联系司机检查制冷设备，温度已恢复正常',
    type: 'handle'
  },
  {
    id: 'N003',
    time: '2024-06-07 10:15:00',
    author: '张值班',
    content: 'B20240607006批次生蚝临期，已协调门店紧急配送，预计今日下午完成',
    type: 'coordination'
  }
]
