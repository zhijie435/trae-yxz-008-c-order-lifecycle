import http from 'node:http'

const BASE_URL = 'localhost'
const PORT = 3001

let passed = 0
let failed = 0

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: BASE_URL,
        port: PORT,
        path: '/api' + path,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) })
          } catch {
            resolve({ status: res.statusCode, data })
          }
        })
      }
    )
    req.on('error', reject)
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    req.end()
  })
}

function check(name, condition, detail = '') {
  if (condition) {
    passed++
    console.log(`  ✅ ${name}` + (detail ? ` - ${detail}` : ''))
  } else {
    failed++
    console.error(`  ❌ ${name}` + (detail ? ` - ${detail}` : ''))
  }
}

async function runTests() {
  console.log('\n========================================')
  console.log('   C端订单全周期 - API 冒烟测试')
  console.log('========================================\n')

  console.log('1. 健康检查')
  try {
    const { status, data } = await request('/health')
    check('HTTP 200', status === 200, `status=${status}`)
    check('code=0', data.code === 0)
    check('有 message 字段', typeof data.message === 'string')
  } catch (e) {
    check('服务启动失败', false, e.message)
    console.error('\n请先启动后端服务: npm run dev:server\n')
    process.exit(1)
  }

  console.log('\n2. 订单汇总接口')
  try {
    const { status, data } = await request('/order/summary')
    check('HTTP 200', status === 200)
    check('code=0', data.code === 0)
    check('服务订单数量存在', typeof data.data.serviceCount === 'number')
    check('购买订单数量存在', typeof data.data.purchaseCount === 'number')
    check('租赁订单数量存在', typeof data.data.rentalCount === 'number')
  } catch (e) {
    check('请求失败', false, e.message)
  }

  console.log('\n3. 订单列表接口')
  const types = [
    { key: 'service', name: '服务订单', expectedStatus: 200 },
    { key: 'purchase', name: '购买订单', expectedStatus: 200 },
    { key: 'rental', name: '租赁订单', expectedStatus: 200 }
  ]
  for (const t of types) {
    try {
      const { status, data } = await request(`/order/${t.key}`)
      check(`${t.name}列表 HTTP 200`, status === 200, `status=${status}`)
      check(`${t.name}列表 code=0`, data.code === 0)
      check(`${t.name}列表有数据`, Array.isArray(data.data.list) && data.data.list.length > 0)
    } catch (e) {
      check(`${t.name}列表请求失败`, false, e.message)
    }
  }

  console.log('\n4. 状态计数接口')
  for (const t of types) {
    try {
      const { status, data } = await request(`/order/${t.key}/status-counts`)
      check(`${t.name}状态计数 HTTP 200`, status === 200)
      check(`${t.name}状态计数 code=0`, data.code === 0)
      check(`${t.name}状态计数为对象`, typeof data.data === 'object')
    } catch (e) {
      check(`${t.name}状态计数请求失败`, false, e.message)
    }
  }

  console.log('\n5. 订单详情接口')
  try {
    const { data: listData } = await request('/order/service')
    const firstOrder = listData.data.list[0]
    if (firstOrder) {
      const { status, data } = await request(`/order/service/${firstOrder.orderId}`)
      check('服务订单详情 HTTP 200', status === 200)
      check('服务订单详情 code=0', data.code === 0)
      check('订单号匹配', data.data.orderId === firstOrder.orderId)
      check('状态文案存在', typeof data.data.statusText === 'string')
    } else {
      check('服务订单详情（无数据）', true, '跳过')
    }
  } catch (e) {
    check('服务订单详情请求失败', false, e.message)
  }

  try {
    const { data: listData } = await request('/order/purchase')
    const firstOrder = listData.data.list[0]
    if (firstOrder) {
      const { status, data } = await request(`/order/purchase/${firstOrder.orderId}`)
      check('购买订单详情 HTTP 200', status === 200)
      check('购买订单详情 code=0', data.code === 0)
      check('物流信息存在', typeof data.data.logistics === 'object')
    } else {
      check('购买订单详情（无数据）', true, '跳过')
    }
  } catch (e) {
    check('购买订单详情请求失败', false, e.message)
  }

  try {
    const { data: listData } = await request('/order/rental')
    const firstOrder = listData.data.list[0]
    if (firstOrder) {
      const { status, data } = await request(`/order/rental/${firstOrder.orderId}`)
      check('租赁订单详情 HTTP 200', status === 200)
      check('租赁订单详情 code=0', data.code === 0)
      check('租赁信息存在', typeof data.data.rentalInfo === 'object')
      check('时间线存在', Array.isArray(data.data.timeline))
    } else {
      check('租赁订单详情（无数据）', true, '跳过')
    }
  } catch (e) {
    check('租赁订单详情请求失败', false, e.message)
  }

  console.log('\n6. 状态迁移合法性校验')
  try {
    const { status, data } = await request('/order/validate-transition', {
      method: 'POST',
      body: {
        orderType: 'service',
        currentStatus: 'pending',
        newStatus: 'pending_service'
      }
    })
    check('合法迁移 HTTP 200', status === 200)
    check('合法迁移 valid=true', data.data.valid === true)
  } catch (e) {
    check('合法迁移校验请求失败', false, e.message)
  }

  try {
    const { status, data } = await request('/order/validate-transition', {
      method: 'POST',
      body: {
        orderType: 'service',
        currentStatus: 'completed',
        newStatus: 'pending'
      }
    })
    check('非法迁移 HTTP 200', status === 200)
    check('非法迁移 valid=false', data.data.valid === false)
    check('非法迁移有原因', typeof data.data.reason === 'string')
  } catch (e) {
    check('非法迁移校验请求失败', false, e.message)
  }

  console.log('\n7. 客服接口')
  try {
    const { status, data } = await request('/cs/faqs')
    check('客服 FAQ HTTP 200', status === 200)
    check('客服 FAQ code=0', data.code === 0)
    check('客服 FAQ 有数据', Array.isArray(data.data) && data.data.length > 0)
  } catch (e) {
    check('客服 FAQ 请求失败', false, e.message)
  }

  console.log('\n========================================')
  console.log(`   测试结果: 通过 ${passed} / 失败 ${failed}`)
  console.log('========================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((e) => {
  console.error('\n测试执行异常:', e)
  process.exit(1)
})
