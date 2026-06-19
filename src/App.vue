<template>
  <div class="app">
    <OrderDetail
      v-if="currentPage === 'detail'"
      :order-id="selectedOrderId"
      :order-type="selectedOrderType"
      @back="goBack"
      @order-updated="onOrderUpdated"
    />

    <div v-else class="order-page">
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
      :rental-count="rentalCount"
      @tab-change="onTabChange"
    />

    <StatusFilter
      v-if="activeTab === ORDER_TYPE.SERVICE"
      key="service-filter"
      v-model="activeServiceStatus"
      :tabs="serviceTabs"
      :status-counts="serviceStatusCounts"
      @status-change="onStatusChange"
    />

    <StatusFilter
      v-if="activeTab === ORDER_TYPE.PURCHASE"
      key="purchase-filter"
      v-model="activePurchaseStatus"
      :tabs="purchaseTabs"
      :status-counts="purchaseStatusCounts"
      @status-change="onStatusChange"
    />

    <StatusFilter
      v-if="activeTab === ORDER_TYPE.RENTAL"
      key="rental-filter"
      v-model="activeRentalStatus"
      :tabs="rentalTabs"
      :status-counts="rentalStatusCounts"
      @status-change="onStatusChange"
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
        <p>{{ emptyText }}</p>
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
              <template v-if="order.type === ORDER_TYPE.RENTAL">
                <p class="order-price">¥{{ order.unitPrice?.toFixed(2) || '0.00' }}<span class="price-unit">/天</span></p>
                <p class="price-sub">月付 ¥{{ order.rentalInfo?.monthlyRent?.toFixed(2) || order.totalPrice?.toFixed(2) || '0.00' }}</p>
              </template>
              <template v-else>
                <p class="order-price">¥{{ order.totalPrice.toFixed(2) }}</p>
                <p class="order-qty">×{{ order.quantity }}</p>
              </template>
            </div>
          </div>
          <div class="order-card-footer">
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
            <div class="order-actions">
              <button
                v-for="action in getOrderActions(order)"
                :key="action.type"
                class="action-btn"
                :class="'action-btn--' + action.style"
                @click.stop="handleListAction(action.type, order)"
              >{{ action.label }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div v-if="showToast" class="toast">{{ toastMessage }}</div>

    <button v-if="currentPage === 'list'" class="float-cs-btn" @click="openCsPanel(null)">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="float-cs-btn__label">客服</span>
    </button>

    <CsServicePanel
      v-model:visible="showCsPanel"
      :order="csOrder"
      :default-type="csDefaultType"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import OrderTabEntry from './components/OrderTabEntry.vue'
import StatusFilter from './components/StatusFilter.vue'
import OrderDetail from './components/OrderDetail.vue'
import CsServicePanel from './components/CsServicePanel.vue'
import {
  getOrderSummary,
  getServiceStatusCounts,
  getPurchaseStatusCounts,
  getRentalStatusCounts,
  getServiceOrders,
  getPurchaseOrders,
  getRentalOrders,
  updateOrderStatus,
  applyReRent
} from './api'
import {
  ORDER_TYPE,
  getStatusFilterTabs,
  getStatusLabel,
  getEmptyText,
  getListActions,
  ACTION_TYPE,
  getPayNextStatus,
  getConfirmReceiveNextStatus
} from './constants/orderConfig'

const currentPage = ref('list')
const selectedOrderId = ref('')
const selectedOrderType = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const showCsPanel = ref(false)
const csOrder = ref(null)
const csDefaultType = ref('after')

const activeTab = ref(ORDER_TYPE.SERVICE)
const activeServiceStatus = ref('all')
const activePurchaseStatus = ref('all')
const activeRentalStatus = ref('all')
const loading = ref(false)
const serviceCount = ref(0)
const purchaseCount = ref(0)
const rentalCount = ref(0)
const serviceStatusCounts = ref({})
const purchaseStatusCounts = ref({})
const rentalStatusCounts = ref({})
const serviceOrders = ref([])
const purchaseOrders = ref([])
const rentalOrders = ref([])

const serviceTabs = getStatusFilterTabs(ORDER_TYPE.SERVICE)
const purchaseTabs = getStatusFilterTabs(ORDER_TYPE.PURCHASE)
const rentalTabs = getStatusFilterTabs(ORDER_TYPE.RENTAL)

const currentOrders = computed(() => {
  if (activeTab.value === ORDER_TYPE.SERVICE) return serviceOrders.value
  if (activeTab.value === ORDER_TYPE.PURCHASE) return purchaseOrders.value
  return rentalOrders.value
})

const activeStatus = computed(() => {
  if (activeTab.value === ORDER_TYPE.SERVICE) return activeServiceStatus.value
  if (activeTab.value === ORDER_TYPE.PURCHASE) return activePurchaseStatus.value
  return activeRentalStatus.value
})

const emptyText = computed(() => getEmptyText(activeTab.value, activeStatus.value))

const statusText = (status) => getStatusLabel(status)

const getOrderActions = (order) => getListActions(order.type, order.status)

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
    rentalCount.value = data.rentalCount || 0
  } catch (e) {
    console.error('获取订单概要失败:', e)
  }
}

const fetchServiceStatusCounts = async () => {
  try {
    const data = await getServiceStatusCounts()
    serviceStatusCounts.value = data
  } catch (e) {
    console.error('获取服务状态计数失败:', e)
  }
}

const fetchPurchaseStatusCounts = async () => {
  try {
    const data = await getPurchaseStatusCounts()
    purchaseStatusCounts.value = data
  } catch (e) {
    console.error('获取购买状态计数失败:', e)
  }
}

const fetchRentalStatusCounts = async () => {
  try {
    const data = await getRentalStatusCounts()
    rentalStatusCounts.value = data
  } catch (e) {
    console.error('获取租赁状态计数失败:', e)
  }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    if (activeTab.value === ORDER_TYPE.SERVICE) {
      const params = {}
      if (activeServiceStatus.value !== 'all') {
        params.status = activeServiceStatus.value
      }
      const data = await getServiceOrders(params)
      serviceOrders.value = data.list
    } else if (activeTab.value === ORDER_TYPE.PURCHASE) {
      const params = {}
      if (activePurchaseStatus.value !== 'all') {
        params.status = activePurchaseStatus.value
      }
      const data = await getPurchaseOrders(params)
      purchaseOrders.value = data.list
    } else {
      const params = {}
      if (activeRentalStatus.value !== 'all') {
        params.status = activeRentalStatus.value
      }
      const data = await getRentalOrders(params)
      rentalOrders.value = data.list
    }
  } catch (e) {
    console.error('获取订单列表失败:', e)
  } finally {
    loading.value = false
  }
}

const onTabChange = () => {
  if (activeTab.value === ORDER_TYPE.SERVICE) {
    activeServiceStatus.value = 'all'
    fetchServiceStatusCounts()
  } else if (activeTab.value === ORDER_TYPE.PURCHASE) {
    activePurchaseStatus.value = 'all'
    fetchPurchaseStatusCounts()
  } else {
    activeRentalStatus.value = 'all'
    fetchRentalStatusCounts()
  }
  fetchOrders()
}

const onStatusChange = () => {
  fetchOrders()
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const goToDetail = (order) => {
  selectedOrderId.value = order.orderId
  selectedOrderType.value = order.type
  currentPage.value = 'detail'
}

const goBack = () => {
  currentPage.value = 'list'
}

const onOrderUpdated = async () => {
  await Promise.all([
    fetchSummary(),
    fetchServiceStatusCounts(),
    fetchPurchaseStatusCounts(),
    fetchRentalStatusCounts(),
    fetchOrders()
  ])
}

const onOrderClick = (order) => {
  goToDetail(order)
}

const handlePayOrder = async (order) => {
  try {
    const nextStatus = getPayNextStatus(order.type)
    await updateOrderStatus(order.orderId, nextStatus)
    showToastMessage('支付成功')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '支付失败')
  }
}

const handleCancelOrder = async (order) => {
  try {
    await updateOrderStatus(order.orderId, 'cancelled')
    showToastMessage('订单已取消')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '取消失败')
  }
}

const handleReviewOrder = async (order) => {
  try {
    await updateOrderStatus(order.orderId, 'completed')
    showToastMessage('评价成功')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '操作失败')
  }
}

const handleRebookOrder = async (order) => {
  if (order.type === ORDER_TYPE.RENTAL) {
    try {
      const data = await applyReRent(order.orderId)
      showToastMessage(`已为您添加「${data?.productTitle || '商品'}」到租赁购物车`)
    } catch (e) {
      showToastMessage('操作成功，已加入租赁购物车')
    }
  } else {
    showToastMessage('已加入购物车')
  }
}

const handleConfirmReceive = async (order) => {
  try {
    const nextStatus = getConfirmReceiveNextStatus(order.type)
    await updateOrderStatus(order.orderId, nextStatus)
    showToastMessage('确认收货成功')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '操作失败')
  }
}

const handleListAction = async (actionType, order) => {
  switch (actionType) {
    case ACTION_TYPE.PAY:
      await handlePayOrder(order)
      break
    case ACTION_TYPE.CANCEL:
      await handleCancelOrder(order)
      break
    case ACTION_TYPE.VIEW_DETAIL:
    case ACTION_TYPE.VIEW_LOGISTICS:
    case ACTION_TYPE.APPLY_RENEW:
    case ACTION_TYPE.APPLY_RETURN:
      goToDetail(order)
      break
    case ACTION_TYPE.CONFIRM_RECEIVE:
      await handleConfirmReceive(order)
      break
    case ACTION_TYPE.REVIEW:
      await handleReviewOrder(order)
      break
    case ACTION_TYPE.REBOOK:
    case ACTION_TYPE.RE_RENT:
      await handleRebookOrder(order)
      break
  }
}

const openCsPanel = (order) => {
  csOrder.value = order
  if (order) {
    csDefaultType.value = order.status === 'pending' ? 'pre' : 'after'
  } else {
    csDefaultType.value = activeTab.value === ORDER_TYPE.SERVICE ? 'after' : 'after'
  }
  showCsPanel.value = true
}

onMounted(async () => {
  await Promise.all([
    fetchSummary(),
    fetchServiceStatusCounts(),
    fetchPurchaseStatusCounts(),
    fetchRentalStatusCounts(),
    fetchOrders()
  ])
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

.order-status--pending_service {
  color: #1890ff;
}

.order-status--in_progress {
  color: #722ed1;
}

.order-status--pending_shipment {
  color: #1890ff;
}

.order-status--pending_receipt {
  color: #fa8c16;
}

.order-status--to_review {
  color: #faad14;
}

.order-status--completed {
  color: #52c41a;
}

.order-status--cancelled {
  color: #999;
}

.order-status--pending_delivery {
  color: #1890ff;
}

.order-status--in_rent {
  color: #722ed1;
}

.order-status--pending_return {
  color: #fa8c16;
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

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  animation: toast-in 0.2s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.float-cs-btn {
  position: fixed;
  right: 16px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 4px 16px rgba(255, 36, 66, 0.4);
  z-index: 99;
  transition: transform 0.2s, box-shadow 0.2s;
}

.float-cs-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(255, 36, 66, 0.3);
}

.float-cs-btn__label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
}

.price-unit {
  font-size: 11px;
  color: #999;
  font-weight: 400;
  margin-left: 2px;
}

.price-sub {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style>
