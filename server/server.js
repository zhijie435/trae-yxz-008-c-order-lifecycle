import express from 'express'
import cors from 'cors'
import {
  getServiceOrderCount,
  getPurchaseOrderCount,
  getRentalOrderCount,
  getServiceStatusCounts,
  getPurchaseStatusCounts,
  getRentalStatusCounts,
  getServiceOrderList,
  getPurchaseOrderList,
  getRentalOrderList,
  getServiceOrderDetail,
  getPurchaseOrderDetail,
  getRentalOrderDetail,
  updateOrderStatus,
  validateStatusTransition,
  applyRenew,
  applyReturn,
  reRent,
  getCsFaqs,
  getChatHistory,
  sendMessage,
  SERVICE_STATUS_LABELS,
  PURCHASE_STATUS_LABELS,
  RENTAL_STATUS_LABELS
} from './seedData.js'

const app = express()
const PORT = 3001

const VALID_SERVICE_STATUSES = Object.keys(SERVICE_STATUS_LABELS)
const VALID_PURCHASE_STATUSES = Object.keys(PURCHASE_STATUS_LABELS)
const VALID_RENTAL_STATUSES = Object.keys(RENTAL_STATUS_LABELS)

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: '服务运行正常' })
})

app.get('/api/order/summary', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: {
      serviceCount: getServiceOrderCount(),
      purchaseCount: getPurchaseOrderCount(),
      rentalCount: getRentalOrderCount()
    }
  })
})

app.get('/api/order/rental/status-counts', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: getRentalStatusCounts()
  })
})

app.get('/api/order/service/status-counts', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: getServiceStatusCounts()
  })
})

app.get('/api/order/purchase/status-counts', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: getPurchaseStatusCounts()
  })
})

app.get('/api/order/service', (req, res) => {
  const { status } = req.query
  if (status && status !== 'all' && !VALID_SERVICE_STATUSES.includes(status)) {
    return res.status(400).json({
      code: 1,
      message: `无效的状态值: ${status}，有效值为: all, ${VALID_SERVICE_STATUSES.join(', ')}`
    })
  }
  const list = getServiceOrderList(status || 'all')
  res.json({
    code: 0,
    message: 'success',
    data: { list }
  })
})

app.get('/api/order/purchase', (req, res) => {
  const { status } = req.query
  if (status && status !== 'all' && !VALID_PURCHASE_STATUSES.includes(status)) {
    return res.status(400).json({
      code: 1,
      message: `无效的状态值: ${status}，有效值为: all, ${VALID_PURCHASE_STATUSES.join(', ')}`
    })
  }
  const list = getPurchaseOrderList(status || 'all')
  res.json({
    code: 0,
    message: 'success',
    data: { list }
  })
})

app.get('/api/order/rental', (req, res) => {
  const { status } = req.query
  if (status && status !== 'all' && !VALID_RENTAL_STATUSES.includes(status)) {
    return res.status(400).json({
      code: 1,
      message: `无效的状态值: ${status}，有效值为: all, ${VALID_RENTAL_STATUSES.join(', ')}`
    })
  }
  const list = getRentalOrderList(status || 'all')
  res.json({
    code: 0,
    message: 'success',
    data: { list }
  })
})

app.get('/api/order/service/:orderId', (req, res) => {
  const { orderId } = req.params
  const detail = getServiceOrderDetail(orderId)
  if (!detail) {
    return res.status(404).json({
      code: 1,
      message: '订单不存在'
    })
  }
  res.json({
    code: 0,
    message: 'success',
    data: detail
  })
})

app.get('/api/order/purchase/:orderId', (req, res) => {
  const { orderId } = req.params
  const detail = getPurchaseOrderDetail(orderId)
  if (!detail) {
    return res.status(404).json({
      code: 1,
      message: '订单不存在'
    })
  }
  res.json({
    code: 0,
    message: 'success',
    data: detail
  })
})

app.get('/api/order/rental/:orderId', (req, res) => {
  const { orderId } = req.params
  const detail = getRentalOrderDetail(orderId)
  if (!detail) {
    return res.status(404).json({
      code: 1,
      message: '订单不存在'
    })
  }
  res.json({
    code: 0,
    message: 'success',
    data: detail
  })
})

app.post('/api/order/:orderId/status', (req, res) => {
  const { orderId } = req.params
  const { status } = req.body
  if (!status) {
    return res.status(400).json({
      code: 1,
      message: '缺少状态参数'
    })
  }
  const result = updateOrderStatus(orderId, status)
  if (!result.success) {
    const statusCode = result.reason.includes('订单不存在') ? 404 : 400
    return res.status(statusCode).json({
      code: 1,
      message: result.reason
    })
  }
  res.json({
    code: 0,
    message: result.reason
  })
})

app.post('/api/order/validate-transition', (req, res) => {
  const { orderType, currentStatus, newStatus } = req.body
  if (!orderType || !currentStatus || !newStatus) {
    return res.status(400).json({
      code: 1,
      message: '缺少必要参数: orderType, currentStatus, newStatus'
    })
  }
  const result = validateStatusTransition(orderType, currentStatus, newStatus)
  res.json({
    code: 0,
    message: 'success',
    data: result
  })
})

app.post('/api/order/rental/:orderId/renew', (req, res) => {
  const { orderId } = req.params
  const { extendMonths = 1 } = req.body
  const success = applyRenew(orderId, extendMonths)
  if (!success) {
    return res.status(400).json({
      code: 1,
      message: '续租申请失败，订单状态不支持续租'
    })
  }
  res.json({
    code: 0,
    message: '续租申请已提交'
  })
})

app.post('/api/order/rental/:orderId/return', (req, res) => {
  const { orderId } = req.params
  const success = applyReturn(orderId)
  if (!success) {
    return res.status(400).json({
      code: 1,
      message: '退租申请失败，订单状态不支持退租'
    })
  }
  res.json({
    code: 0,
    message: '退租申请已提交'
  })
})

app.post('/api/order/rental/:orderId/re-rent', (req, res) => {
  const { orderId } = req.params
  const data = reRent(orderId)
  if (!data) {
    return res.status(404).json({
      code: 1,
      message: '订单不存在'
    })
  }
  res.json({
    code: 0,
    message: 'success',
    data
  })
})

app.get('/api/cs/faqs', (req, res) => {
  const { type = 'after', orderType = 'purchase' } = req.query
  const faqs = getCsFaqs(type, orderType)
  res.json({
    code: 0,
    message: 'success',
    data: faqs
  })
})

app.get('/api/cs/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const history = getChatHistory(sessionId)
  res.json({
    code: 0,
    message: 'success',
    data: { list: history }
  })
})

app.post('/api/cs/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const { message, orderContext } = req.body
  if (!message || message.trim() === '') {
    return res.status(400).json({
      code: 1,
      message: '消息内容不能为空'
    })
  }
  const result = sendMessage(sessionId, message, orderContext)
  res.json({
    code: 0,
    message: 'success',
    data: result
  })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`订单服务已启动: http://localhost:${PORT}`)
  })
}

export default app
