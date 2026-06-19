export const ORDER_TYPE = {
  SERVICE: 'service',
  PURCHASE: 'purchase',
  RENTAL: 'rental'
}

export const ORDER_TYPE_LABEL = {
  [ORDER_TYPE.SERVICE]: '服务订单',
  [ORDER_TYPE.PURCHASE]: '购买订单',
  [ORDER_TYPE.RENTAL]: '租赁订单'
}

export const ORDER_TYPES = [ORDER_TYPE.SERVICE, ORDER_TYPE.PURCHASE, ORDER_TYPE.RENTAL]

export const SERVICE_STATUS = {
  PENDING: 'pending',
  PENDING_SERVICE: 'pending_service',
  IN_PROGRESS: 'in_progress',
  TO_REVIEW: 'to_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const PURCHASE_STATUS = {
  PENDING_SHIPMENT: 'pending_shipment',
  PENDING_RECEIPT: 'pending_receipt',
  TO_REVIEW: 'to_review',
  COMPLETED: 'completed'
}

export const RENTAL_STATUS = {
  PENDING: 'pending',
  PENDING_SHIPMENT: 'pending_shipment',
  PENDING_RECEIPT: 'pending_receipt',
  RENTING: 'renting',
  RENEW_APPLIED: 'renew_applied',
  RETURN_APPLIED: 'return_applied',
  TO_REVIEW: 'to_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const STATUS_LABEL = {
  [SERVICE_STATUS.PENDING]: '待付款',
  [SERVICE_STATUS.PENDING_SERVICE]: '待服务',
  [SERVICE_STATUS.IN_PROGRESS]: '进行中',
  [PURCHASE_STATUS.PENDING_SHIPMENT]: '待发货',
  [PURCHASE_STATUS.PENDING_RECEIPT]: '待收货',
  [RENTAL_STATUS.RENTING]: '租赁中',
  [RENTAL_STATUS.RENEW_APPLIED]: '续租审核中',
  [RENTAL_STATUS.RETURN_APPLIED]: '退租审核中',
  [SERVICE_STATUS.TO_REVIEW]: '待评价',
  [SERVICE_STATUS.COMPLETED]: '已完成',
  [SERVICE_STATUS.CANCELLED]: '已取消'
}

export const STATUS_DESC = {
  [SERVICE_STATUS.PENDING]: '请在30分钟内完成支付',
  [SERVICE_STATUS.PENDING_SERVICE]: '服务人员将尽快与您联系',
  [SERVICE_STATUS.IN_PROGRESS]: '服务进行中，请保持电话畅通',
  [PURCHASE_STATUS.PENDING_SHIPMENT]: '商家正在备货，请耐心等待',
  [PURCHASE_STATUS.PENDING_RECEIPT]: '商品已发出，请注意查收',
  [RENTAL_STATUS.RENTING]: '租赁进行中，享受您的租赁时光',
  [RENTAL_STATUS.RENEW_APPLIED]: '续租申请已提交，等待审核',
  [RENTAL_STATUS.RETURN_APPLIED]: '退租申请已提交，等待审核',
  [SERVICE_STATUS.TO_REVIEW]: '租期已结束，快去评价吧',
  [SERVICE_STATUS.COMPLETED]: '感谢您的支持，欢迎再次租赁',
  [SERVICE_STATUS.CANCELLED]: '订单已取消'
}

export const getStatusLabel = (status) => STATUS_LABEL[status] || `未知(${status})`

export const getStatusDesc = (status) => STATUS_DESC[status] || ''

export const STATUS_FILTER_TABS = {
  [ORDER_TYPE.SERVICE]: [
    { value: 'all', label: '全部' },
    { value: SERVICE_STATUS.PENDING, label: '待付款' },
    { value: SERVICE_STATUS.PENDING_SERVICE, label: '待服务' },
    { value: SERVICE_STATUS.IN_PROGRESS, label: '进行中' },
    { value: SERVICE_STATUS.TO_REVIEW, label: '评价' },
    { value: SERVICE_STATUS.COMPLETED, label: '已完成' },
    { value: SERVICE_STATUS.CANCELLED, label: '已取消' }
  ],
  [ORDER_TYPE.PURCHASE]: [
    { value: 'all', label: '全部' },
    { value: PURCHASE_STATUS.PENDING_SHIPMENT, label: '待发货' },
    { value: PURCHASE_STATUS.PENDING_RECEIPT, label: '待收货' },
    { value: PURCHASE_STATUS.TO_REVIEW, label: '待评价' },
    { value: PURCHASE_STATUS.COMPLETED, label: '已完成' }
  ],
  [ORDER_TYPE.RENTAL]: [
    { value: 'all', label: '全部' },
    { value: RENTAL_STATUS.PENDING_SHIPMENT, label: '待发货' },
    { value: RENTAL_STATUS.PENDING_RECEIPT, label: '待收货' },
    { value: RENTAL_STATUS.RENTING, label: '租赁中' },
    { value: RENTAL_STATUS.RENEW_APPLIED, label: '续租中' },
    { value: RENTAL_STATUS.RETURN_APPLIED, label: '退租中' },
    { value: RENTAL_STATUS.TO_REVIEW, label: '待评价' },
    { value: RENTAL_STATUS.COMPLETED, label: '已完成' }
  ]
}

export const getStatusFilterTabs = (orderType) => STATUS_FILTER_TABS[orderType] || []

export const EMPTY_TEXT = {
  [ORDER_TYPE.SERVICE]: {
    all: '暂无服务订单',
    [SERVICE_STATUS.PENDING]: '暂无待付款订单',
    [SERVICE_STATUS.PENDING_SERVICE]: '暂无待服务订单',
    [SERVICE_STATUS.IN_PROGRESS]: '暂无进行中的订单',
    [SERVICE_STATUS.TO_REVIEW]: '暂无待评价订单',
    [SERVICE_STATUS.COMPLETED]: '暂无已完成订单',
    [SERVICE_STATUS.CANCELLED]: '暂无已取消订单'
  },
  [ORDER_TYPE.PURCHASE]: {
    all: '暂无购买订单',
    [PURCHASE_STATUS.PENDING_SHIPMENT]: '暂无待发货订单',
    [PURCHASE_STATUS.PENDING_RECEIPT]: '暂无待收货订单',
    [PURCHASE_STATUS.TO_REVIEW]: '暂无待评价订单',
    [PURCHASE_STATUS.COMPLETED]: '暂无已完成订单'
  },
  [ORDER_TYPE.RENTAL]: {
    all: '暂无租赁订单',
    [RENTAL_STATUS.PENDING_SHIPMENT]: '暂无待发货订单',
    [RENTAL_STATUS.PENDING_RECEIPT]: '暂无待收货订单',
    [RENTAL_STATUS.RENTING]: '暂无租赁中订单',
    [RENTAL_STATUS.RENEW_APPLIED]: '暂无续租审核中订单',
    [RENTAL_STATUS.RETURN_APPLIED]: '暂无退租审核中订单',
    [RENTAL_STATUS.TO_REVIEW]: '暂无待评价订单',
    [RENTAL_STATUS.COMPLETED]: '暂无已完成订单'
  }
}

export const getEmptyText = (orderType, status) => {
  const typeMap = EMPTY_TEXT[orderType] || {}
  return typeMap[status] || typeMap.all || '暂无订单'
}

export const ACTION_TYPE = {
  PAY: 'pay',
  CANCEL: 'cancel',
  VIEW_DETAIL: 'view_detail',
  VIEW_LOGISTICS: 'view_logistics',
  CONFIRM_RECEIVE: 'confirm_receive',
  REVIEW: 'review',
  REBOOK: 'rebook',
  CONTACT_SERVICE: 'contact_service',
  CONTACT_SERVICE_PERSON: 'contact_service_person',
  APPLY_RENEW: 'apply_renew',
  APPLY_RETURN: 'apply_return',
  RE_RENT: 're_rent'
}

export const ACTION_STYLE = {
  PRIMARY: 'primary',
  OUTLINE: 'outline'
}

const LIST_ACTION_CONFIG = {
  [ORDER_TYPE.SERVICE]: {
    [SERVICE_STATUS.PENDING]: [
      { type: ACTION_TYPE.CANCEL, label: '取消订单', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.PAY, label: '立即支付', style: ACTION_STYLE.PRIMARY }
    ],
    [SERVICE_STATUS.PENDING_SERVICE]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE }
    ],
    [SERVICE_STATUS.IN_PROGRESS]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '服务进度', style: ACTION_STYLE.OUTLINE }
    ],
    [SERVICE_STATUS.TO_REVIEW]: [
      { type: ACTION_TYPE.REVIEW, label: '去评价', style: ACTION_STYLE.PRIMARY }
    ],
    [SERVICE_STATUS.COMPLETED]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE }
    ],
    [SERVICE_STATUS.CANCELLED]: [
      { type: ACTION_TYPE.REBOOK, label: '重新下单', style: ACTION_STYLE.OUTLINE }
    ]
  },
  [ORDER_TYPE.PURCHASE]: {
    [PURCHASE_STATUS.PENDING_SHIPMENT]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE }
    ],
    [PURCHASE_STATUS.PENDING_RECEIPT]: [
      { type: ACTION_TYPE.VIEW_LOGISTICS, label: '查看物流', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.CONFIRM_RECEIVE, label: '确认收货', style: ACTION_STYLE.PRIMARY }
    ],
    [PURCHASE_STATUS.TO_REVIEW]: [
      { type: ACTION_TYPE.REVIEW, label: '去评价', style: ACTION_STYLE.PRIMARY }
    ],
    [PURCHASE_STATUS.COMPLETED]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.REBOOK, label: '再次购买', style: ACTION_STYLE.OUTLINE }
    ]
  },
  [ORDER_TYPE.RENTAL]: {
    [RENTAL_STATUS.PENDING]: [
      { type: ACTION_TYPE.CANCEL, label: '取消订单', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.PAY, label: '立即支付', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.PENDING_SHIPMENT]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE }
    ],
    [RENTAL_STATUS.PENDING_RECEIPT]: [
      { type: ACTION_TYPE.VIEW_LOGISTICS, label: '查看物流', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.CONFIRM_RECEIVE, label: '确认收货', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.RENTING]: [
      { type: ACTION_TYPE.APPLY_RETURN, label: '申请退租', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.APPLY_RENEW, label: '申请续租', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.RENEW_APPLIED]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE }
    ],
    [RENTAL_STATUS.RETURN_APPLIED]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE }
    ],
    [RENTAL_STATUS.TO_REVIEW]: [
      { type: ACTION_TYPE.REVIEW, label: '去评价', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.COMPLETED]: [
      { type: ACTION_TYPE.VIEW_DETAIL, label: '查看详情', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.RE_RENT, label: '再次租赁', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.CANCELLED]: [
      { type: ACTION_TYPE.RE_RENT, label: '再次租赁', style: ACTION_STYLE.PRIMARY }
    ]
  }
}

const DETAIL_ACTION_CONFIG = {
  [ORDER_TYPE.SERVICE]: {
    [SERVICE_STATUS.PENDING]: [
      { type: ACTION_TYPE.CANCEL, label: '取消订单', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.PAY, label: '立即支付', style: ACTION_STYLE.PRIMARY }
    ],
    [SERVICE_STATUS.PENDING_SERVICE]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系客服', style: ACTION_STYLE.OUTLINE }
    ],
    [SERVICE_STATUS.IN_PROGRESS]: [
      { type: ACTION_TYPE.CONTACT_SERVICE_PERSON, label: '联系服务人员', style: ACTION_STYLE.OUTLINE }
    ],
    [SERVICE_STATUS.TO_REVIEW]: [
      { type: ACTION_TYPE.REVIEW, label: '去评价', style: ACTION_STYLE.PRIMARY }
    ],
    [SERVICE_STATUS.COMPLETED]: [
      { type: ACTION_TYPE.REBOOK, label: '重新下单', style: ACTION_STYLE.OUTLINE }
    ],
    [SERVICE_STATUS.CANCELLED]: [
      { type: ACTION_TYPE.REBOOK, label: '重新下单', style: ACTION_STYLE.PRIMARY }
    ]
  },
  [ORDER_TYPE.PURCHASE]: {
    [PURCHASE_STATUS.PENDING_SHIPMENT]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系卖家', style: ACTION_STYLE.OUTLINE }
    ],
    [PURCHASE_STATUS.PENDING_RECEIPT]: [
      { type: ACTION_TYPE.VIEW_LOGISTICS, label: '查看物流', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.CONFIRM_RECEIVE, label: '确认收货', style: ACTION_STYLE.PRIMARY }
    ],
    [PURCHASE_STATUS.TO_REVIEW]: [
      { type: ACTION_TYPE.REVIEW, label: '去评价', style: ACTION_STYLE.PRIMARY }
    ],
    [PURCHASE_STATUS.COMPLETED]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系客服', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.REBOOK, label: '再次购买', style: ACTION_STYLE.PRIMARY }
    ]
  },
  [ORDER_TYPE.RENTAL]: {
    [RENTAL_STATUS.PENDING]: [
      { type: ACTION_TYPE.CANCEL, label: '取消订单', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.PAY, label: '立即支付', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.PENDING_SHIPMENT]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系商家', style: ACTION_STYLE.OUTLINE }
    ],
    [RENTAL_STATUS.PENDING_RECEIPT]: [
      { type: ACTION_TYPE.VIEW_LOGISTICS, label: '查看物流', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.CONFIRM_RECEIVE, label: '确认收货', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.RENTING]: [
      { type: ACTION_TYPE.APPLY_RETURN, label: '申请退租', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.APPLY_RENEW, label: '申请续租', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.RENEW_APPLIED]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系客服', style: ACTION_STYLE.OUTLINE }
    ],
    [RENTAL_STATUS.RETURN_APPLIED]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系客服', style: ACTION_STYLE.OUTLINE }
    ],
    [RENTAL_STATUS.TO_REVIEW]: [
      { type: ACTION_TYPE.REVIEW, label: '去评价', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.COMPLETED]: [
      { type: ACTION_TYPE.CONTACT_SERVICE, label: '联系客服', style: ACTION_STYLE.OUTLINE },
      { type: ACTION_TYPE.RE_RENT, label: '再次租赁', style: ACTION_STYLE.PRIMARY }
    ],
    [RENTAL_STATUS.CANCELLED]: [
      { type: ACTION_TYPE.RE_RENT, label: '再次租赁', style: ACTION_STYLE.PRIMARY }
    ]
  }
}

export const getListActions = (orderType, status) => {
  const typeConfig = LIST_ACTION_CONFIG[orderType] || {}
  return typeConfig[status] || []
}

export const getDetailActions = (orderType, status) => {
  const typeConfig = DETAIL_ACTION_CONFIG[orderType] || {}
  return typeConfig[status] || []
}

export const STATUS_FLOW = {
  [ORDER_TYPE.SERVICE]: [
    SERVICE_STATUS.PENDING,
    SERVICE_STATUS.PENDING_SERVICE,
    SERVICE_STATUS.IN_PROGRESS,
    SERVICE_STATUS.TO_REVIEW,
    SERVICE_STATUS.COMPLETED
  ],
  [ORDER_TYPE.PURCHASE]: [
    PURCHASE_STATUS.PENDING_SHIPMENT,
    PURCHASE_STATUS.PENDING_RECEIPT,
    PURCHASE_STATUS.TO_REVIEW,
    PURCHASE_STATUS.COMPLETED
  ],
  [ORDER_TYPE.RENTAL]: [
    RENTAL_STATUS.PENDING_SHIPMENT,
    RENTAL_STATUS.PENDING_RECEIPT,
    RENTAL_STATUS.RENTING,
    RENTAL_STATUS.TO_REVIEW,
    RENTAL_STATUS.COMPLETED
  ]
}

export const getStatusFlow = (orderType) => STATUS_FLOW[orderType] || []

export const PAY_NEXT_STATUS = {
  [ORDER_TYPE.SERVICE]: SERVICE_STATUS.PENDING_SERVICE,
  [ORDER_TYPE.PURCHASE]: PURCHASE_STATUS.PENDING_SHIPMENT,
  [ORDER_TYPE.RENTAL]: RENTAL_STATUS.PENDING_SHIPMENT
}

export const CONFIRM_RECEIVE_NEXT_STATUS = {
  [ORDER_TYPE.PURCHASE]: PURCHASE_STATUS.TO_REVIEW,
  [ORDER_TYPE.RENTAL]: RENTAL_STATUS.RENTING
}

export const getPayNextStatus = (orderType) => PAY_NEXT_STATUS[orderType] || PURCHASE_STATUS.PENDING_SHIPMENT

export const getConfirmReceiveNextStatus = (orderType) =>
  CONFIRM_RECEIVE_NEXT_STATUS[orderType] || PURCHASE_STATUS.TO_REVIEW

export const isValidOrderType = (type) => ORDER_TYPES.includes(type)
