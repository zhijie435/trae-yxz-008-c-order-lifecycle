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
      @tab-change="onTabChange"
    />

    <StatusFilter
      v-if="activeTab === 'service'"
      v-model="activeServiceStatus"
      :tabs="serviceTabs"
      :status-counts="serviceStatusCounts"
      @status-change="onStatusChange"
    />

    <StatusFilter
      v-if="activeTab === 'purchase'"
      v-model="activePurchaseStatus"
      :tabs="purchaseTabs"
      :status-counts="purchaseStatusCounts"
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
              <p class="order-price">¥{{ order.totalPrice.toFixed(2) }}</p>
              <p class="order-qty">×{{ order.quantity }}</p>
            </div>
          </div>
          <div class="order-card-footer">
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
            <div class="order-actions">
              <template v-if="activeTab === 'service'">
                <button
                  v-if="order.status === 'pending'"
                  class="action-btn action-btn--primary"
                  @click.stop="onPayOrder(order)"
                >立即支付</button>
                <button
                  v-if="order.status === 'pending'"
                  class="action-btn action-btn--outline"
                  @click.stop="onCancelOrder(order)"
                >取消订单</button>
                <button
                  v-if="order.status === 'pending_service'"
                  class="action-btn action-btn--outline"
                  @click.stop="onViewDetail(order)"
                >查看详情</button>
                <button
                  v-if="order.status === 'in_progress'"
                  class="action-btn action-btn--outline"
                  @click.stop="onViewDetail(order)"
                >服务进度</button>
                <button
                  v-if="order.status === 'to_review'"
                  class="action-btn action-btn--primary"
                  @click.stop="onReviewOrder(order)"
                >去评价</button>
                <button
                  v-if="order.status === 'completed'"
                  class="action-btn action-btn--outline"
                  @click.stop="onViewDetail(order)"
                >查看详情</button>
                <button
                  v-if="order.status === 'cancelled'"
                  class="action-btn action-btn--outline"
                  @click.stop="onRebookOrder(order)"
                >重新下单</button>
              </template>
              <template v-if="activeTab === 'purchase'">
                <button
                  v-if="order.status === 'pending_shipment'"
                  class="action-btn action-btn--outline"
                  @click.stop="onViewDetail(order)"
                >查看详情</button>
                <button
                  v-if="order.status === 'pending_receipt'"
                  class="action-btn action-btn--primary"
                  @click.stop="onConfirmReceive(order)"
                >确认收货</button>
                <button
                  v-if="order.status === 'pending_receipt'"
                  class="action-btn action-btn--outline"
                  @click.stop="onViewLogistics(order)"
                >查看物流</button>
                <button
                  v-if="order.status === 'to_review'"
                  class="action-btn action-btn--primary"
                  @click.stop="onReviewOrder(order)"
                >去评价</button>
                <button
                  v-if="order.status === 'completed'"
                  class="action-btn action-btn--outline"
                  @click.stop="onViewDetail(order)"
                >查看详情</button>
                <button
                  v-if="order.status === 'completed'"
                  class="action-btn action-btn--outline"
                  @click.stop="onRebookOrder(order)"
                >再次购买</button>
              </template>
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
  getServiceOrders,
  getPurchaseOrders,
  updateOrderStatus
} from './api'

const SERVICE_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待付款' },
  { value: 'pending_service', label: '待服务' },
  { value: 'in_progress', label: '进行中' },
  { value: 'to_review', label: '评价' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

const PURCHASE_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending_shipment', label: '待发货' },
  { value: 'pending_receipt', label: '待收货' },
  { value: 'to_review', label: '待评价' },
  { value: 'completed', label: '已完成' }
]

const STATUS_TEXT = {
  pending: '待付款',
  pending_service: '待服务',
  in_progress: '进行中',
  pending_shipment: '待发货',
  pending_receipt: '待收货',
  to_review: '待评价',
  completed: '已完成',
  cancelled: '已取消'
}

const SERVICE_EMPTY_TEXT = {
  all: '暂无服务订单',
  pending: '暂无待付款订单',
  pending_service: '暂无待服务订单',
  in_progress: '暂无进行中的订单',
  to_review: '暂无待评价订单',
  completed: '暂无已完成订单',
  cancelled: '暂无已取消订单'
}

const PURCHASE_EMPTY_TEXT = {
  all: '暂无购买订单',
  pending_shipment: '暂无待发货订单',
  pending_receipt: '暂无待收货订单',
  to_review: '暂无待评价订单',
  completed: '暂无已完成订单'
}

const currentPage = ref('list')
const selectedOrderId = ref('')
const selectedOrderType = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const showCsPanel = ref(false)
const csOrder = ref(null)
const csDefaultType = ref('after')

const activeTab = ref('service')
const activeServiceStatus = ref('all')
const activePurchaseStatus = ref('all')
const loading = ref(false)
const serviceCount = ref(0)
const purchaseCount = ref(0)
const serviceStatusCounts = ref({})
const purchaseStatusCounts = ref({})
const serviceOrders = ref([])
const purchaseOrders = ref([])

const serviceTabs = SERVICE_TABS
const purchaseTabs = PURCHASE_TABS

const currentOrders = computed(() => {
  return activeTab.value === 'service' ? serviceOrders.value : purchaseOrders.value
})

const emptyText = computed(() => {
  if (activeTab.value === 'purchase') {
    return PURCHASE_EMPTY_TEXT[activePurchaseStatus.value] || '暂无购买订单'
  }
  return SERVICE_EMPTY_TEXT[activeServiceStatus.value] || '暂无服务订单'
})

const statusText = (status) => {
  return STATUS_TEXT[status] || `未知(${status})`
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

const fetchOrders = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'service') {
      const params = {}
      if (activeServiceStatus.value !== 'all') {
        params.status = activeServiceStatus.value
      }
      const data = await getServiceOrders(params)
      serviceOrders.value = data.list
    } else {
      const params = {}
      if (activePurchaseStatus.value !== 'all') {
        params.status = activePurchaseStatus.value
      }
      const data = await getPurchaseOrders(params)
      purchaseOrders.value = data.list
    }
  } catch (e) {
    console.error('获取订单列表失败:', e)
  } finally {
    loading.value = false
  }
}

const onTabChange = () => {
  if (activeTab.value === 'service') {
    activeServiceStatus.value = 'all'
    fetchServiceStatusCounts()
  } else {
    activePurchaseStatus.value = 'all'
    fetchPurchaseStatusCounts()
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
    fetchOrders()
  ])
}

const onOrderClick = (order) => {
  goToDetail(order)
}

const onPayOrder = async (order) => {
  try {
    const nextStatus = order.type === 'service' ? 'pending_service' : 'pending_shipment'
    await updateOrderStatus(order.orderId, nextStatus)
    showToastMessage('支付成功')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '支付失败')
  }
}

const onCancelOrder = async (order) => {
  try {
    await updateOrderStatus(order.orderId, 'cancelled')
    showToastMessage('订单已取消')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '取消失败')
  }
}

const onViewDetail = (order) => {
  goToDetail(order)
}

const onReviewOrder = async (order) => {
  try {
    await updateOrderStatus(order.orderId, 'completed')
    showToastMessage('评价成功')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '操作失败')
  }
}

const onRebookOrder = (order) => {
  showToastMessage('已加入购物车')
}

const onConfirmReceive = async (order) => {
  try {
    await updateOrderStatus(order.orderId, 'to_review')
    showToastMessage('确认收货成功')
    await onOrderUpdated()
  } catch (e) {
    showToastMessage(e.message || '操作失败')
  }
}

const onViewLogistics = (order) => {
  goToDetail(order)
}

const openCsPanel = (order) => {
  csOrder.value = order
  if (order) {
    csDefaultType.value = order.status === 'pending' ? 'pre' : 'after'
  } else {
    csDefaultType.value = activeTab.value === 'service' ? 'after' : 'after'
  }
  showCsPanel.value = true
}

onMounted(async () => {
  await Promise.all([
    fetchSummary(),
    fetchServiceStatusCounts(),
    fetchPurchaseStatusCounts(),
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
</style>
