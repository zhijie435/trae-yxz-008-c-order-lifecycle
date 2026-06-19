export const SERVICE_STATUS = {
  PENDING: 'pending',
  PENDING_SERVICE: 'pending_service',
  IN_PROGRESS: 'in_progress',
  TO_REVIEW: 'to_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const SERVICE_STATUS_LABELS = {
  [SERVICE_STATUS.PENDING]: '待付款',
  [SERVICE_STATUS.PENDING_SERVICE]: '待服务',
  [SERVICE_STATUS.IN_PROGRESS]: '进行中',
  [SERVICE_STATUS.TO_REVIEW]: '待评价',
  [SERVICE_STATUS.COMPLETED]: '已完成',
  [SERVICE_STATUS.CANCELLED]: '已取消'
}

export const SERVICE_STATUS_FLOW = [
  SERVICE_STATUS.PENDING,
  SERVICE_STATUS.PENDING_SERVICE,
  SERVICE_STATUS.IN_PROGRESS,
  SERVICE_STATUS.TO_REVIEW,
  SERVICE_STATUS.COMPLETED
]

export const PURCHASE_STATUS = {
  PENDING_SHIPMENT: 'pending_shipment',
  PENDING_RECEIPT: 'pending_receipt',
  TO_REVIEW: 'to_review',
  COMPLETED: 'completed'
}

export const PURCHASE_STATUS_LABELS = {
  [PURCHASE_STATUS.PENDING_SHIPMENT]: '待发货',
  [PURCHASE_STATUS.PENDING_RECEIPT]: '待收货',
  [PURCHASE_STATUS.TO_REVIEW]: '待评价',
  [PURCHASE_STATUS.COMPLETED]: '已完成'
}

export const PURCHASE_STATUS_FLOW = [
  PURCHASE_STATUS.PENDING_SHIPMENT,
  PURCHASE_STATUS.PENDING_RECEIPT,
  PURCHASE_STATUS.TO_REVIEW,
  PURCHASE_STATUS.COMPLETED
]

const serviceOrders = [
  {
    orderId: 'SVC20240601001',
    type: 'service',
    shopName: '极客维修官方店',
    productTitle: 'MacBook Pro 屏幕维修服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MacBook%20laptop%20screen%20repair%20service%20toolkit%20on%20workbench%2C%20minimal%20product%20photo&image_size=square',
    specText: '14英寸 / 2023款',
    quantity: 1,
    unitPrice: 1999,
    totalPrice: 1999,
    status: SERVICE_STATUS.PENDING,
    createTime: '2026-06-19T10:30:00.000Z'
  },
  {
    orderId: 'SVC20240601002',
    type: 'service',
    shopName: '极客维修官方店',
    productTitle: 'iPad Air 屏幕贴膜服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPad%20screen%20protector%20film%20application%20on%20clean%20white%20surface%2C%20minimal%20product%20photo&image_size=square',
    specText: '11英寸 / 钢化膜',
    quantity: 1,
    unitPrice: 49,
    totalPrice: 49,
    status: SERVICE_STATUS.PENDING,
    createTime: '2026-06-19T09:15:00.000Z'
  },
  {
    orderId: 'SVC20240602001',
    type: 'service',
    shopName: '到家安装服务',
    productTitle: '空调上门安装服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=air%20conditioner%20wall%20unit%20installation%20by%20technician%2C%20minimal%20product%20photo&image_size=square',
    specText: '挂机 / 1.5匹',
    quantity: 1,
    unitPrice: 199,
    totalPrice: 199,
    status: SERVICE_STATUS.PENDING_SERVICE,
    createTime: '2026-06-18T14:20:00.000Z'
  },
  {
    orderId: 'SVC20240602002',
    type: 'service',
    shopName: '到家安装服务',
    productTitle: '洗衣机安装调试服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=washing%20machine%20installation%20in%20modern%20laundry%20room%2C%20minimal%20product%20photo&image_size=square',
    specText: '滚筒 / 含水管连接',
    quantity: 1,
    unitPrice: 129,
    totalPrice: 129,
    status: SERVICE_STATUS.PENDING_SERVICE,
    createTime: '2026-06-18T11:00:00.000Z'
  },
  {
    orderId: 'SVC20240603001',
    type: 'service',
    shopName: '金牌清洗中心',
    productTitle: '全屋深度保洁服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20home%20deep%20cleaning%20service%20supplies%20on%20counter%2C%20minimal%20product%20photo&image_size=square',
    specText: '三室两厅 / 4小时',
    quantity: 1,
    unitPrice: 399,
    totalPrice: 399,
    status: SERVICE_STATUS.IN_PROGRESS,
    createTime: '2026-06-17T09:00:00.000Z'
  },
  {
    orderId: 'SVC20240603002',
    type: 'service',
    shopName: '极客维修官方店',
    productTitle: 'iPhone 数据恢复服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%20data%20recovery%20cable%20connected%20to%20laptop%2C%20minimal%20product%20photo&image_size=square',
    specText: 'iPhone 15 Pro / 逻辑板级恢复',
    quantity: 1,
    unitPrice: 899,
    totalPrice: 899,
    status: SERVICE_STATUS.IN_PROGRESS,
    createTime: '2026-06-16T16:30:00.000Z'
  },
  {
    orderId: 'SVC20240604001',
    type: 'service',
    shopName: '搬家无忧',
    productTitle: '同城搬家服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=moving%20boxes%20in%20delivery%20truck%20urban%20setting%2C%20minimal%20product%20photo&image_size=square',
    specText: '中型厢式货车 / 2名师傅',
    quantity: 1,
    unitPrice: 588,
    totalPrice: 588,
    status: SERVICE_STATUS.TO_REVIEW,
    createTime: '2026-06-14T08:00:00.000Z'
  },
  {
    orderId: 'SVC20240604002',
    type: 'service',
    shopName: '到家安装服务',
    productTitle: '智能家居全屋安装服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20home%20devices%20on%20white%20wall%2C%20minimal%20product%20photo&image_size=square',
    specText: '3室2厅 / 含调试',
    quantity: 1,
    unitPrice: 799,
    totalPrice: 799,
    status: SERVICE_STATUS.TO_REVIEW,
    createTime: '2026-06-13T10:20:00.000Z'
  },
  {
    orderId: 'SVC20240605001',
    type: 'service',
    shopName: '金牌清洗中心',
    productTitle: '油烟机深度清洗服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kitchen%20range%20hood%20deep%20cleaning%20spray%2C%20minimal%20product%20photo&image_size=square',
    specText: '侧吸式 / 含拆洗',
    quantity: 1,
    unitPrice: 259,
    totalPrice: 259,
    status: SERVICE_STATUS.COMPLETED,
    createTime: '2026-06-10T14:00:00.000Z'
  },
  {
    orderId: 'SVC20240605002',
    type: 'service',
    shopName: '极客维修官方店',
    productTitle: 'iPhone 电池更换服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%20battery%20replacement%20toolkit%20on%20mat%2C%20minimal%20product%20photo&image_size=square',
    specText: 'iPhone 15 Pro / 原装电池',
    quantity: 1,
    unitPrice: 529,
    totalPrice: 529,
    status: SERVICE_STATUS.COMPLETED,
    createTime: '2026-06-09T11:45:00.000Z'
  },
  {
    orderId: 'SVC20240606001',
    type: 'service',
    shopName: '到家安装服务',
    productTitle: '热水器上门安装服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20heater%20installation%20bathroom%2C%20minimal%20product%20photo&image_size=square',
    specText: '电热水器 / 60L',
    quantity: 1,
    unitPrice: 169,
    totalPrice: 169,
    status: SERVICE_STATUS.CANCELLED,
    createTime: '2026-06-12T16:45:00.000Z'
  },
  {
    orderId: 'SVC20240606002',
    type: 'service',
    shopName: '金牌清洗中心',
    productTitle: '地毯深度清洗服务',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=carpet%20deep%20cleaning%20machine%20on%20rug%2C%20minimal%20product%20photo&image_size=square',
    specText: '大面积 / 含烘干',
    quantity: 1,
    unitPrice: 349,
    totalPrice: 349,
    status: SERVICE_STATUS.CANCELLED,
    createTime: '2026-06-11T13:30:00.000Z'
  }
]

const purchaseOrders = [
  {
    orderId: 'PUR20240601001',
    type: 'purchase',
    shopName: 'Apple 授权专营店',
    productTitle: 'MacBook Pro 14英寸 M3芯片',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MacBook%20Pro%20laptop%20on%20white%20desk%2C%20minimal%20product%20photo&image_size=square',
    specText: '深空黑 / 16GB+512GB',
    quantity: 1,
    unitPrice: 12999,
    totalPrice: 12999,
    status: PURCHASE_STATUS.PENDING_SHIPMENT,
    createTime: '2026-06-19T15:10:00.000Z'
  },
  {
    orderId: 'PUR20240601002',
    type: 'purchase',
    shopName: '数码旗舰店',
    productTitle: 'Sony WH-1000XM5 降噪耳机',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sony%20WH-1000XM5%20headphones%20black%20on%20white%2C%20minimal%20product%20photo&image_size=square',
    specText: '午夜黑 / 头戴式',
    quantity: 1,
    unitPrice: 2299,
    totalPrice: 2299,
    status: PURCHASE_STATUS.PENDING_SHIPMENT,
    createTime: '2026-06-19T10:30:00.000Z'
  },
  {
    orderId: 'PUR20240602001',
    type: 'purchase',
    shopName: '数码旗舰店',
    productTitle: 'AirPods Pro 第二代',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AirPods%20Pro%20earbuds%20white%20case%2C%20minimal%20product%20photo&image_size=square',
    specText: 'USB-C充电盒',
    quantity: 2,
    unitPrice: 1799,
    totalPrice: 3598,
    status: PURCHASE_STATUS.PENDING_RECEIPT,
    createTime: '2026-06-17T11:20:00.000Z'
  },
  {
    orderId: 'PUR20240602002',
    type: 'purchase',
    shopName: '家居生活馆',
    productTitle: '戴森 V15 无线吸尘器',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dyson%20V15%20vacuum%20cleaner%20purple%2C%20minimal%20product%20photo&image_size=square',
    specText: '金色 / 整机过滤',
    quantity: 1,
    unitPrice: 4490,
    totalPrice: 4490,
    status: PURCHASE_STATUS.PENDING_RECEIPT,
    createTime: '2026-06-16T08:30:00.000Z'
  },
  {
    orderId: 'PUR20240603001',
    type: 'purchase',
    shopName: '运动户外专营',
    productTitle: 'Nike Air Max 270 运动鞋',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nike%20Air%20Max%20270%20sneakers%20black%20white%2C%20minimal%20product%20photo&image_size=square',
    specText: '黑白色 / 42码',
    quantity: 1,
    unitPrice: 1099,
    totalPrice: 1099,
    status: PURCHASE_STATUS.TO_REVIEW,
    createTime: '2026-06-14T20:00:00.000Z'
  },
  {
    orderId: 'PUR20240603002',
    type: 'purchase',
    shopName: 'Apple 授权专营店',
    productTitle: 'iPad Air 11英寸 M2芯片',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPad%20Air%20M2%20on%20white%20surface%2C%20minimal%20product%20photo&image_size=square',
    specText: '星光色 / 256GB WiFi',
    quantity: 1,
    unitPrice: 5999,
    totalPrice: 5999,
    status: PURCHASE_STATUS.TO_REVIEW,
    createTime: '2026-06-13T16:45:00.000Z'
  },
  {
    orderId: 'PUR20240604001',
    type: 'purchase',
    shopName: '家居生活馆',
    productTitle: '飞利浦电动牙刷 HX9352',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Philips%20electric%20toothbrush%20HX9352%20white%2C%20minimal%20product%20photo&image_size=square',
    specText: '钻石亮白版 / 含2刷头',
    quantity: 1,
    unitPrice: 699,
    totalPrice: 699,
    status: PURCHASE_STATUS.COMPLETED,
    createTime: '2026-06-10T12:00:00.000Z'
  },
  {
    orderId: 'PUR20240604002',
    type: 'purchase',
    shopName: '运动户外专营',
    productTitle: 'Lululemon Define 夹克',
    productImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lululemon%20Define%20jacket%20black%2C%20minimal%20product%20photo&image_size=square',
    specText: '黑色 / M码',
    quantity: 1,
    unitPrice: 1150,
    totalPrice: 1150,
    status: PURCHASE_STATUS.COMPLETED,
    createTime: '2026-06-08T09:30:00.000Z'
  }
]

export function getServiceOrderCount() {
  return serviceOrders.filter(o => o.status !== SERVICE_STATUS.CANCELLED).length
}

export function getPurchaseOrderCount() {
  return purchaseOrders.length
}

export function getServiceStatusCounts() {
  const counts = {}
  Object.values(SERVICE_STATUS).forEach(s => { counts[s] = 0 })
  serviceOrders.forEach(o => {
    if (counts[o.status] !== undefined) {
      counts[o.status]++
    }
  })
  return counts
}

export function getPurchaseStatusCounts() {
  const counts = {}
  Object.values(PURCHASE_STATUS).forEach(s => { counts[s] = 0 })
  purchaseOrders.forEach(o => {
    if (counts[o.status] !== undefined) {
      counts[o.status]++
    }
  })
  return counts
}

export function getServiceOrderList(status) {
  if (!status || status === 'all') return serviceOrders
  return serviceOrders.filter(o => o.status === status)
}

export function getPurchaseOrderList(status) {
  if (!status || status === 'all') return purchaseOrders
  return purchaseOrders.filter(o => o.status === status)
}
