import express from 'express'
import cors from 'cors'
import {
  getServiceOrderCount,
  getPurchaseOrderCount,
  getServiceStatusCounts,
  getPurchaseStatusCounts,
  getServiceOrderList,
  getPurchaseOrderList,
  getServiceOrderDetail,
  getPurchaseOrderDetail,
  updateOrderStatus,
  SERVICE_STATUS_LABELS,
  PURCHASE_STATUS_LABELS
} from './seedData.js'

const app = express()
const PORT = 3001

const VALID_SERVICE_STATUSES = Object.keys(SERVICE_STATUS_LABELS)
const VALID_PURCHASE_STATUSES = Object.keys(PURCHASE_STATUS_LABELS)

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
      purchaseCount: getPurchaseOrderCount()
    }
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

app.post('/api/order/:orderId/status', (req, res) => {
  const { orderId } = req.params
  const { status } = req.body
  if (!status) {
    return res.status(400).json({
      code: 1,
      message: '缺少状态参数'
    })
  }
  const success = updateOrderStatus(orderId, status)
  if (!success) {
    return res.status(404).json({
      code: 1,
      message: '订单不存在'
    })
  }
  res.json({
    code: 0,
    message: 'success'
  })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`订单服务已启动: http://localhost:${PORT}`)
  })
}

export default app
