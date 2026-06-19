const serviceOrders = [
  {
    orderId: 'SVC20240601001',
    type: 'service',
    shopName: '极客维修官方店',
    productTitle: ' MacBook Pro 屏幕维修服务',
    productImage: 'https://via.placeholder.com/150/ff6b6b/fff?text=Screen+Repair',
    specText: '14英寸 / 2023款',
    quantity: 1,
    unitPrice: 1999,
    totalPrice: 1999,
    status: 'pending',
    createTime: '2026-06-18T10:30:00.000Z'
  },
  {
    orderId: 'SVC20240602001',
    type: 'service',
    shopName: '到家安装服务',
    productTitle: '空调上门安装服务',
    productImage: 'https://via.placeholder.com/150/4ecdc4/fff?text=Install',
    specText: '挂机 / 1.5匹',
    quantity: 1,
    unitPrice: 199,
    totalPrice: 199,
    status: 'paid',
    createTime: '2026-06-17T14:20:00.000Z'
  },
  {
    orderId: 'SVC20240603001',
    type: 'service',
    shopName: '金牌清洗中心',
    productTitle: '全屋深度保洁服务',
    productImage: 'https://via.placeholder.com/150/45b7d1/fff?text=Cleaning',
    specText: '三室两厅 / 4小时',
    quantity: 1,
    unitPrice: 399,
    totalPrice: 399,
    status: 'completed',
    createTime: '2026-06-15T09:00:00.000Z'
  },
  {
    orderId: 'SVC20240604001',
    type: 'service',
    shopName: '搬家无忧',
    productTitle: '同城搬家服务',
    productImage: 'https://via.placeholder.com/150/96ceb4/fff?text=Moving',
    specText: '中型厢式货车 / 2名师傅',
    quantity: 1,
    unitPrice: 588,
    totalPrice: 588,
    status: 'shipped',
    createTime: '2026-06-16T08:00:00.000Z'
  },
  {
    orderId: 'SVC20240605001',
    type: 'service',
    shopName: '极客维修官方店',
    productTitle: 'iPhone 电池更换服务',
    productImage: 'https://via.placeholder.com/150/a29bfe/fff?text=Battery',
    specText: 'iPhone 15 Pro / 原装电池',
    quantity: 1,
    unitPrice: 529,
    totalPrice: 529,
    status: 'cancelled',
    createTime: '2026-06-14T16:45:00.000Z'
  }
]

const purchaseOrders = [
  {
    orderId: 'PUR20240601001',
    type: 'purchase',
    shopName: 'Apple 授权专营店',
    productTitle: 'MacBook Pro 14英寸 M3芯片',
    productImage: 'https://via.placeholder.com/150/6c5ce7/fff?text=MacBook',
    specText: '深空黑 / 16GB+512GB',
    quantity: 1,
    unitPrice: 12999,
    totalPrice: 12999,
    status: 'paid',
    createTime: '2026-06-18T15:10:00.000Z'
  },
  {
    orderId: 'PUR20240602001',
    type: 'purchase',
    shopName: '数码旗舰店',
    productTitle: 'AirPods Pro 第二代',
    productImage: 'https://via.placeholder.com/150/00b894/fff?text=AirPods',
    specText: 'USB-C充电盒',
    quantity: 2,
    unitPrice: 1799,
    totalPrice: 3598,
    status: 'shipped',
    createTime: '2026-06-17T11:20:00.000Z'
  },
  {
    orderId: 'PUR20240603001',
    type: 'purchase',
    shopName: '家居生活馆',
    productTitle: '戴森 V15 无线吸尘器',
    productImage: 'https://via.placeholder.com/150/fd79a8/fff?text=Dyson',
    specText: '金色 / 整机过滤',
    quantity: 1,
    unitPrice: 4490,
    totalPrice: 4490,
    status: 'pending',
    createTime: '2026-06-19T08:30:00.000Z'
  },
  {
    orderId: 'PUR20240604001',
    type: 'purchase',
    shopName: '运动户外专营',
    productTitle: 'Nike Air Max 270 运动鞋',
    productImage: 'https://via.placeholder.com/150/e17055/fff?text=Nike',
    specText: '黑白色 / 42码',
    quantity: 1,
    unitPrice: 1099,
    totalPrice: 1099,
    status: 'completed',
    createTime: '2026-06-10T20:00:00.000Z'
  }
]

export function getServiceOrderCount() {
  return serviceOrders.filter(o => o.status !== 'cancelled').length
}

export function getPurchaseOrderCount() {
  return purchaseOrders.filter(o => o.status !== 'cancelled').length
}

export function getServiceOrderList() {
  return serviceOrders
}

export function getPurchaseOrderList() {
  return purchaseOrders
}
