const BASE_URL = '/api'

async function request(url, options = {}) {
  const res = await fetch(BASE_URL + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const json = await res.json()
  if (json.code !== 0) {
    throw new Error(json.message || '请求失败')
  }
  return json.data
}

export function getOrderSummary() {
  return request('/order/summary')
}

export function getServiceStatusCounts() {
  return request('/order/service/status-counts')
}

export function getServiceOrders(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request('/order/service' + (query ? '?' + query : ''))
}

export function getPurchaseOrders(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request('/order/purchase' + (query ? '?' + query : ''))
}
