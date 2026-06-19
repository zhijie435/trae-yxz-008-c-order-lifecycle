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

function generateStatusTimeline(order) {
  const isService = order.type === 'service'
  const flow = isService ? SERVICE_STATUS_FLOW : PURCHASE_STATUS_FLOW
  const labels = isService ? SERVICE_STATUS_LABELS : PURCHASE_STATUS_LABELS
  const timeline = []
  const createTime = new Date(order.createTime).getTime()
  const addMinutes = (base, mins) => {
    const d = new Date(base + mins * 60 * 1000)
    return d.toISOString()
  }
  const formatTime = (isoStr) => {
    const d = new Date(isoStr)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  let currentIndex = flow.indexOf(order.status)
  if (currentIndex === -1 && order.status === SERVICE_STATUS.CANCELLED) {
    timeline.push({
      status: SERVICE_STATUS.CANCELLED,
      label: labels[SERVICE_STATUS.CANCELLED] || '已取消',
      time: formatTime(addMinutes(createTime, 30)),
      isCurrent: true,
      isCompleted: true,
      description: '订单已取消'
    })
    return timeline
  }
  flow.forEach((status, index) => {
    const isCompleted = index <= currentIndex
    const isCurrent = index === currentIndex
    let offsetMinutes = 0
    if (status === (isService ? SERVICE_STATUS.PENDING : PURCHASE_STATUS.PENDING_SHIPMENT)) {
      offsetMinutes = 0
    } else if (status === (isService ? SERVICE_STATUS.PENDING_SERVICE : PURCHASE_STATUS.PENDING_RECEIPT)) {
      offsetMinutes = 5
    } else if (status === SERVICE_STATUS.IN_PROGRESS) {
      offsetMinutes = 60
    } else if (status === SERVICE_STATUS.TO_REVIEW) {
      offsetMinutes = isService ? 240 : 120
    } else if (status === SERVICE_STATUS.COMPLETED) {
      offsetMinutes = isService ? 300 : 180
    }
    let description = ''
    if (status === SERVICE_STATUS.PENDING) {
      description = '订单已提交，请尽快完成支付'
    } else if (status === SERVICE_STATUS.PENDING_SERVICE) {
      description = '支付成功，等待服务人员联系您'
    } else if (status === SERVICE_STATUS.IN_PROGRESS) {
      description = '服务人员已出发，正在前往服务地点'
    } else if (status === PURCHASE_STATUS.PENDING_SHIPMENT) {
      description = '商家已收到订单，正在准备发货'
    } else if (status === PURCHASE_STATUS.PENDING_RECEIPT) {
      description = '商品已发出，请注意查收'
    } else if (status === SERVICE_STATUS.TO_REVIEW) {
      description = isService ? '服务已完成，期待您的评价' : '已确认收货，期待您的评价'
    } else if (status === SERVICE_STATUS.COMPLETED) {
      description = '交易已完成，感谢您的支持'
    }
    timeline.push({
      status,
      label: labels[status],
      time: formatTime(addMinutes(createTime, offsetMinutes)),
      isCurrent,
      isCompleted,
      description
    })
  })
  return timeline
}

function buildOrderDetail(order) {
  const isService = order.type === 'service'
  const timeline = generateStatusTimeline(order)
  const detail = {
    ...order,
    statusText: isService ? SERVICE_STATUS_LABELS[order.status] : PURCHASE_STATUS_LABELS[order.status],
    timeline,
    receiver: {
      name: '张三',
      phone: '138****8888',
      address: isService
        ? '北京市朝阳区建国路88号SOHO现代城A座1201室'
        : '北京市海淀区中关村大街1号科技大厦B座2001室'
    },
    payInfo: {
      payMethod: order.status === 'pending' ? '' : '微信支付',
      payTime: order.status === 'pending' ? '' : timeline[1]?.time || '',
      transactionId: order.status === 'pending' ? '' : `TXN${order.orderId}`
    }
  }
  if (!isService) {
    detail.logistics = {
      company: '顺丰速运',
      trackingNo: order.status === 'pending_shipment' ? '' : `SF${Date.now()}`,
      estimatedTime: '2026-06-21 18:00前'
    }
    if (order.status !== 'pending_shipment') {
      detail.logistics.tracking = [
        {
          time: timeline.find(t => t.status === 'pending_receipt')?.time || '',
          status: '运输中',
          description: '快件已到达【北京朝阳集散中心】，正在派送中'
        },
        {
          time: timeline.find(t => t.status === 'pending_shipment')?.time || '',
          status: '已发货',
          description: '商家已发货，快件已揽收'
        }
      ]
    }
  } else {
    detail.serviceInfo = {
      serviceTime: '2026-06-20 14:00-16:00',
      servicePerson: '李师傅',
      servicePhone: '139****9999',
      serviceRemark: '请提前准备好设备'
    }
  }
  return detail
}

export function getServiceOrderDetail(orderId) {
  const order = serviceOrders.find(o => o.orderId === orderId)
  return order ? buildOrderDetail(order) : null
}

export function getPurchaseOrderDetail(orderId) {
  const order = purchaseOrders.find(o => o.orderId === orderId)
  return order ? buildOrderDetail(order) : null
}

export function updateOrderStatus(orderId, newStatus) {
  const allOrders = [...serviceOrders, ...purchaseOrders]
  const order = allOrders.find(o => o.orderId === orderId)
  if (order) {
    order.status = newStatus
    return true
  }
  return false
}

const PRE_SALE_FAQS = [
  {
    id: 'pre1',
    category: '商品咨询',
    question: '商品是正品吗？',
    answer: '您好，我们店铺所有商品均为官方授权正品，支持官方验货，假一赔十，请放心购买。'
  },
  {
    id: 'pre2',
    category: '商品咨询',
    question: '有现货吗？什么时候发货？',
    answer: '您好，页面显示的商品均有现货。付款成功后24小时内安排发货，节假日顺延。'
  },
  {
    id: 'pre3',
    category: '价格优惠',
    question: '现在有什么优惠活动吗？',
    answer: '您好，目前店铺有满减活动：满299减30，满599减80，满999减150。另外新用户首单立减20元~'
  },
  {
    id: 'pre4',
    category: '价格优惠',
    question: '可以使用优惠券吗？',
    answer: '您好，订单结算时可以选择使用优惠券哦。优惠券可在"我的-优惠券"中查看和领取。'
  },
  {
    id: 'pre5',
    category: '配送相关',
    question: '发什么快递？支持货到付款吗？',
    answer: '您好，默认发顺丰快递，偏远地区发EMS。目前暂不支持货到付款，请谅解。'
  },
  {
    id: 'pre6',
    category: '配送相关',
    question: '可以指定配送时间吗？',
    answer: '您好，暂时无法精确指定配送时间。您可以在备注中说明偏好，快递员会尽量配合。'
  }
]

const AFTER_SALE_FAQS = [
  {
    id: 'after1',
    category: '物流查询',
    question: '物流一直不更新怎么办？',
    answer: '您好，物流信息可能会有延迟。如果超过48小时未更新，请联系我们为您催促快递或核实包裹状态。'
  },
  {
    id: 'after2',
    category: '物流查询',
    question: '可以修改收货地址吗？',
    answer: '您好，商品未发货前可以修改地址。如果已经发货，请联系我们尝试拦截或转寄。'
  },
  {
    id: 'after3',
    category: '退换货',
    question: '支持七天无理由退换吗？',
    answer: '您好，本店商品支持七天无理由退换货（特殊商品除外），商品需保持完好不影响二次销售。'
  },
  {
    id: 'after4',
    category: '退换货',
    question: '退换货流程是怎样的？',
    answer: '您好，退换货流程：1. 申请退换货；2. 商家审核通过；3. 寄回商品；4. 商家确认收货；5. 退款/换货发出。'
  },
  {
    id: 'after5',
    category: '退款问题',
    question: '退款多久能到账？',
    answer: '您好，退款审核通过后，原路退回您的支付账户。微信/支付宝1-3个工作日，银行卡3-7个工作日。'
  },
  {
    id: 'after6',
    category: '售后保障',
    question: '保修期是多久？',
    answer: '您好，商品按国家规定执行三包政策，整机保修1年，主要部件保修2-3年（视商品类型而定）。'
  },
  {
    id: 'after7',
    category: '售后服务',
    question: '如何申请售后？',
    answer: '您好，您可以在订单详情页点击"申请售后"按钮，选择售后类型（退货/换货/维修）并上传凭证即可。'
  }
]

const SERVICE_FAQS = [
  {
    id: 'svc1',
    category: '服务预约',
    question: '可以改约服务时间吗？',
    answer: '您好，服务开始前24小时可以免费改约一次。请在订单详情页点击"改约"按钮或联系客服协助。'
  },
  {
    id: 'svc2',
    category: '服务预约',
    question: '服务人员多久能上门？',
    answer: '您好，一般情况下服务人员会在预约时间前后15分钟内到达。如有特殊情况会提前电话联系您。'
  },
  {
    id: 'svc3',
    category: '服务质量',
    question: '服务不满意怎么办？',
    answer: '您好，如果对服务不满意，可以申请退款或免费重做。请在服务完成后24小时内联系我们反馈。'
  },
  {
    id: 'svc4',
    category: '服务质量',
    question: '服务有保修期吗？',
    answer: '您好，我们的服务均有质保期。维修服务质保90天，安装/清洗服务质保30天。质保期内有问题免费上门。'
  },
  {
    id: 'svc5',
    category: '退款问题',
    question: '怎么取消服务并退款？',
    answer: '您好，服务未开始前可全额退款；服务已开始但未完成的，按实际进度结算后退还余款。'
  },
  {
    id: 'svc6',
    category: '费用问题',
    question: '会有额外收费吗？',
    answer: '您好，页面显示价格即为服务费用。如需额外材料或增值服务，服务人员会提前告知并征得您的同意。'
  }
]

const chatMessages = {}

function getFaqsByType(type, orderType) {
  if (orderType === 'service') {
    return type === 'pre' ? PRE_SALE_FAQS.slice(0, 3) : SERVICE_FAQS
  }
  return type === 'pre' ? PRE_SALE_FAQS : AFTER_SALE_FAQS
}

function getAutoReply(question, orderType) {
  const allFaqs = [...PRE_SALE_FAQS, ...AFTER_SALE_FAQS, ...SERVICE_FAQS]
  const matched = allFaqs.find(f => question.includes(f.question.slice(0, 4)))
  if (matched) {
    return matched.answer
  }
  const replies = [
    '好的，已收到您的问题，客服小妹正在为您查询~',
    '您好，关于您的问题，建议您先查看订单详情哦~',
    '非常抱歉给您带来不便，我们会尽快为您处理！',
    '感谢您的咨询，请稍等，正在为您转接人工客服...',
    '这个问题小助手帮您记录下来了，稍后会有专人回复您~'
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

export function getCsFaqs(consultType, orderType) {
  return getFaqsByType(consultType, orderType)
}

export function getChatHistory(sessionId) {
  return chatMessages[sessionId] || []
}

export function sendMessage(sessionId, message, orderContext) {
  const now = new Date().toISOString()
  if (!chatMessages[sessionId]) {
    chatMessages[sessionId] = []
    if (orderContext) {
      chatMessages[sessionId].push({
        id: Date.now() + '_sys',
        type: 'system',
        content: `订单信息：${orderContext.productTitle} (订单号：${orderContext.orderId})`,
        time: now
      })
    }
    chatMessages[sessionId].push({
      id: Date.now() + '_welcome',
      type: 'service',
      content: '您好，很高兴为您服务！请问有什么可以帮您的？',
      time: now
    })
  }
  chatMessages[sessionId].push({
    id: Date.now() + '_user',
    type: 'user',
    content: message,
    time: now
  })
  const replyTime = new Date(Date.now() + 1000).toISOString()
  const reply = getAutoReply(message, orderContext?.type || 'purchase')
  setTimeout(() => {
    chatMessages[sessionId].push({
      id: Date.now() + '_svc',
      type: 'service',
      content: reply,
      time: replyTime
    })
  }, 500)
  return {
    userMessage: chatMessages[sessionId][chatMessages[sessionId].length - 1],
    autoReply: reply
  }
}
