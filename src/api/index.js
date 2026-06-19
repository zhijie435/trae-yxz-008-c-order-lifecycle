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

export function getPurchaseStatusCounts() {
  return request('/order/purchase/status-counts')
}

export function getServiceOrders(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request('/order/service' + (query ? '?' + query : ''))
}

export function getPurchaseOrders(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request('/order/purchase' + (query ? '?' + query : ''))
}

export function getServiceOrderDetail(orderId) {
  return request(`/order/service/${orderId}`)
}

export function getPurchaseOrderDetail(orderId) {
  return request(`/order/purchase/${orderId}`)
}

export function updateOrderStatus(orderId, status) {
  return request(`/order/${orderId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status })
  })
}

export function getCsFaqs(type, orderType) {
  const params = {}
  if (type) params.type = type
  if (orderType) params.orderType = orderType
  const query = new URLSearchParams(params).toString()
  return request('/cs/faqs' + (query ? '?' + query : ''))
}

export function getChatHistory(sessionId) {
  return request(`/cs/chat/${sessionId}`)
}

export function sendCsMessage(sessionId, message, orderContext) {
  return request(`/cs/chat/${sessionId}`, {
    method: 'POST',
    body: JSON.stringify({ message, orderContext })
  })
}
