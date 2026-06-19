<template>
  <div class="order-page">
    <header class="page-header">
      <div class="header-inner">
        <button class="back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 class="page-title">我的订单</h1>
        <div class="header-placeholder"></div>
      </div>
    </header>

    <OrderTabEntry
      v-model="activeTab"
      :service-count="serviceCount"
      :purchase-count="purchaseCount"
      @tab-change="onTabChange"
    />

    <div class="order-list-wrapper">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-else-if="currentOrders.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <p>暂无{{ activeTab === 'service' ? '服务' : '购买' }}订单</p>
      </div>

      <div v-else class="order-list">
        <div
          v-for="order in currentOrders"
          :key="order.orderId"
          class="order-card"
          @click="onOrderClick(order)"
        >
          <div class="order-card-header">
            <span class="order-shop">{{ order.shopName }}</span>
            <span class="order-status" :class="'order-status--' + order.status">{{ statusText(order.status) }}</span>
          </div>
          <div class="order-card-body">
            <img class="order-thumb" :src="order.productImage" :alt="order.productTitle" />
            <div class="order-info">
              <p class="order-title">{{ order.productTitle }}</p>
              <p class="order-spec">{{ order.specText }}</p>
            </div>
            <div class="order-price-col">
              <p class="order-price">¥{{ order.totalPrice.toFixed(2) }}</p>
              <p class="order-qty">×{{ order.quantity }}</p>
            </div>
          </div>
          <div class="order-card-footer">
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
            <div class="order-actions">
              <button
                v-if="order.status === 'pending'"
                class="action-btn action-btn--primary"
                @click.stop="onPayOrder(order)"
              >立即支付</button>
              <button
                v-if="order.status === 'paid'"
                class="action-btn action-btn--outline"
                @click.stop="onViewDetail(order)"
              >查看详情</button>
              <button
                v-if="order.status === 'paid'"
                class="action-btn action-btn--primary"
                @click.stop="onConfirmReceive(order)"
              >确认收货</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import OrderTabEntry from './components/OrderTabEntry.vue'
import { getOrderSummary, getServiceOrders, getPurchaseOrders } from './api'

const activeTab = ref('service')
const loading = ref(false)
const serviceCount = ref(0)
const purchaseCount = ref(0)
const serviceOrders = ref([])
const purchaseOrders = ref([])

const currentOrders = computed(() => {
  return activeTab.value === 'service' ? serviceOrders.value : purchaseOrders.value
})

const statusText = (status) => {
  const map = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const formatTime = (isoStr) => {
  const d = new Date(isoStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const fetchSummary = async () => {
  try {
    const data = await getOrderSummary()
    serviceCount.value = data.serviceCount
    purchaseCount.value = data.purchaseCount
  } catch (e) {
    console.error('获取订单概要失败:', e)
  }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'service') {
      const data = await getServiceOrders()
      serviceOrders.value = data.list
    } else {
      const data = await getPurchaseOrders()
      purchaseOrders.value = data.list
    }
  } catch (e) {
    console.error('获取订单列表失败:', e)
  } finally {
    loading.value = false
  }
}

const onTabChange = (tab) => {
  fetchOrders()
}

const onOrderClick = (order) => {
  console.log('点击订单:', order.orderId)
}

const onPayOrder = (order) => {
  console.log('支付订单:', order.orderId)
}

const onViewDetail = (order) => {
  console.log('查看详情:', order.orderId)
}

const onConfirmReceive = (order) => {
  console.log('确认收货:', order.orderId)
}

onMounted(async () => {
  await Promise.all([fetchSummary(), fetchOrders()])
})
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 24px;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 101;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f0f0f0;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #f5f5f5;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-placeholder {
  width: 36px;
}

.order-list-wrapper {
  padding: 12px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: #999;
  gap: 12px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff2442;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: #ccc;
  gap: 12px;
}

.empty-state p {
  font-size: 14px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.order-card:active {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.order-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 0;
}

.order-shop {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.order-status {
  font-size: 12px;
  font-weight: 500;
}

.order-status--pending {
  color: #ff8c00;
}

.order-status--paid {
  color: #07c160;
}

.order-status--shipped {
  color: #1989fa;
}

.order-status--completed {
  color: #999;
}

.order-status--cancelled {
  color: #999;
}

.order-card-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}

.order-thumb {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f5f5f5;
}

.order-info {
  flex: 1;
  min-width: 0;
}

.order-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-spec {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.order-price-col {
  flex-shrink: 0;
  text-align: right;
}

.order-price {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.order-qty {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.order-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 12px;
}

.order-time {
  font-size: 12px;
  color: #bbb;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
}

.action-btn:active {
  opacity: 0.7;
}

.action-btn--primary {
  background: #ff2442;
  color: #fff;
}

.action-btn--outline {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}
</style>
