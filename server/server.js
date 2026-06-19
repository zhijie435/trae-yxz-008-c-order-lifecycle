import express from 'express'
import cors from 'cors'
import {
  getServiceOrderCount,
  getPurchaseOrderCount,
  getServiceOrderList,
  getPurchaseOrderList
} from './seedData.js'

const app = express()
const PORT = 3001

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

app.get('/api/order/service', (req, res) => {
  const list = getServiceOrderList()
  res.json({
    code: 0,
    message: 'success',
    data: { list }
  })
})

app.get('/api/order/purchase', (req, res) => {
  const list = getPurchaseOrderList()
  res.json({
    code: 0,
    message: 'success',
    data: { list }
  })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`订单服务已启动: http://localhost:${PORT}`)
  })
}

export default app
