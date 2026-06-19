<template>
  <div class="order-detail-page">
    <header class="page-header">
      <div class="header-inner">
        <button class="back-btn" @click="$emit('back')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 class="page-title">订单详情</h1>
        <button class="cs-btn" @click="showCsPanel = true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="cs-btn__dot"></span>
        </button>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ff4d4f" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchDetail">重新加载</button>
    </div>

    <div v-else-if="order" class="detail-content">
      <div class="status-card">
        <div class="status-card__header">
          <div class="status-icon">
            <svg v-if="order.status === 'pending'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <svg v-else-if="order.status === 'cancelled'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg v-else-if="order.status === 'completed'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="status-info">
            <p class="status-text" :class="'status-text--' + order.status">{{ order.statusText }}</p>
            <p class="status-desc">{{ currentStatusDesc }}</p>
          </div>
        </div>
      </div>

      <div class="timeline-section">
        <h3 class="section-title">订单状态</h3>
        <div class="timeline">
          <div
            v-for="(item, index) in order.timeline"
            :key="item.status"
            class="timeline-item"
            :class="{ 'timeline-item--current': item.isCurrent, 'timeline-item--completed': item.isCompleted }"
          >
            <div class="timeline-dot">
              <svg v-if="item.isCompleted && !item.isCurrent" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
              </svg>
              <div v-else class="timeline-dot__inner"></div>
            </div>
            <div v-if="index < order.timeline.length - 1" class="timeline-line" :class="{ 'timeline-line--completed': item.isCompleted }"></div>
            <div class="timeline-content">
              <p class="timeline-label">{{ item.label }}</p>
              <p class="timeline-time">{{ item.time }}</p>
              <p v-if="item.description" class="timeline-desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="product-section">
        <div class="shop-header">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="shop-name">{{ order.shopName }}</span>
        </div>
        <div class="product-card">
          <img class="product-image" :src="order.productImage" :alt="order.productTitle" />
          <div class="product-info">
            <p class="product-title">{{ order.productTitle }}</p>
            <p class="product-spec">{{ order.specText }}</p>
            <p class="product-qty">x{{ order.quantity }}</p>
          </div>
          <div class="product-price">
            <p class="price-text">¥{{ order.totalPrice.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">收货地址</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">收货人</span>
            <span class="info-value">{{ order.receiver.name }} {{ order.receiver.phone }}</span>
          </div>
          <div class="info-row info-row--address">
            <span class="info-label">地址</span>
            <span class="info-value">{{ order.receiver.address }}</span>
          </div>
        </div>
      </div>

      <div v-if="order.type === 'service' && order.serviceInfo" class="info-section">
        <h3 class="section-title">服务信息</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">服务时间</span>
            <span class="info-value">{{ order.serviceInfo.serviceTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">服务人员</span>
            <span class="info-value">{{ order.serviceInfo.servicePerson }} {{ order.serviceInfo.servicePhone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">服务备注</span>
            <span class="info-value">{{ order.serviceInfo.serviceRemark }}</span>
          </div>
        </div>
      </div>

      <div v-if="order.type === 'purchase' && order.logistics && order.logistics.trackingNo" class="info-section">
        <h3 class="section-title">物流信息</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">物流公司</span>
            <span class="info-value">{{ order.logistics.company }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">物流单号</span>
            <div class="tracking-row">
              <span class="info-value">{{ order.logistics.trackingNo }}</span>
              <button class="copy-btn" @click="copyToClipboard(order.logistics.trackingNo)">复制</button>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">预计送达</span>
            <span class="info-value">{{ order.logistics.estimatedTime }}</span>
          </div>
          <div v-if="order.logistics.tracking && order.logistics.tracking.length > 0" class="logistics-tracking">
            <div v-for="(track, index) in order.logistics.tracking" :key="index" class="logistics-track">
              <div class="track-dot" :class="{ 'track-dot--latest': index === 0 }"></div>
              <div class="track-content">
                <p class="track-status">{{ track.status }}</p>
                <p class="track-desc">{{ track.description }}</p>
                <p class="track-time">{{ track.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">支付信息</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">商品金额</span>
            <span class="info-value">¥{{ order.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">运费</span>
            <span class="info-value">¥0.00</span>
          </div>
          <div class="info-row info-row--total">
            <span class="info-label">实付金额</span>
            <span class="info-value info-value--total">¥{{ order.totalPrice.toFixed(2) }}</span>
          </div>
          <div v-if="order.payInfo.payMethod" class="info-row">
            <span class="info-label">支付方式</span>
            <span class="info-value">{{ order.payInfo.payMethod }}</span>
          </div>
          <div v-if="order.payInfo.payTime" class="info-row">
            <span class="info-label">支付时间</span>
            <span class="info-value">{{ order.payInfo.payTime }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">订单信息</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">订单编号</span>
            <div class="tracking-row">
              <span class="info-value">{{ order.orderId }}</span>
              <button class="copy-btn" @click="copyToClipboard(order.orderId)">复制</button>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">下单时间</span>
            <span class="info-value">{{ formatTime(order.createTime) }}</span>
          </div>
          <div v-if="order.payInfo.transactionId" class="info-row">
            <span class="info-label">交易单号</span>
            <span class="info-value">{{ order.payInfo.transactionId }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="order" class="action-bar">
      <template v-if="order.type === 'service'">
        <button
          v-if="order.status === 'pending'"
          class="action-btn action-btn--outline"
          @click="handleCancelOrder"
        >取消订单</button>
        <button
          v-if="order.status === 'pending'"
          class="action-btn action-btn--primary"
          @click="handlePayOrder"
        >立即支付</button>
        <button
          v-if="order.status === 'pending_service'"
          class="action-btn action-btn--outline"
          @click="handleContactService"
        >联系客服</button>
        <button
          v-if="order.status === 'in_progress'"
          class="action-btn action-btn--outline"
          @click="handleContactServicePerson"
        >联系服务人员</button>
        <button
          v-if="order.status === 'to_review'"
          class="action-btn action-btn--primary"
          @click="handleReviewOrder"
        >去评价</button>
        <button
          v-if="order.status === 'completed'"
          class="action-btn action-btn--outline"
          @click="handleRebookOrder"
        >重新下单</button>
        <button
          v-if="order.status === 'cancelled'"
          class="action-btn action-btn--primary"
          @click="handleRebookOrder"
        >重新下单</button>
      </template>
      <template v-else>
        <button
          v-if="order.status === 'pending_shipment'"
          class="action-btn action-btn--outline"
          @click="handleContactService"
        >联系卖家</button>
        <button
          v-if="order.status === 'pending_receipt'"
          class="action-btn action-btn--outline"
          @click="handleViewLogistics"
        >查看物流</button>
        <button
          v-if="order.status === 'pending_receipt'"
          class="action-btn action-btn--primary"
          @click="handleConfirmReceive"
        >确认收货</button>
        <button
          v-if="order.status === 'to_review'"
          class="action-btn action-btn--primary"
          @click="handleReviewOrder"
        >去评价</button>
        <button
          v-if="order.status === 'completed'"
          class="action-btn action-btn--outline"
          @click="handleContactService"
        >联系客服</button>
        <button
          v-if="order.status === 'completed'"
          class="action-btn action-btn--primary"
          @click="handleRebookOrder"
        >再次购买</button>
      </template>
    </div>

    <div v-if="showToast" class="toast">{{ toastMessage }}</div>

    <CsServicePanel
      v-model:visible="showCsPanel"
      :order="order"
      :default-type="order?.status === 'pending' ? 'pre' : 'after'"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getServiceOrderDetail,
  getPurchaseOrderDetail,
  updateOrderStatus
} from '../api'
import CsServicePanel from './CsServicePanel.vue'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  },
  orderType: {
    type: String,
    required: true,
    validator: (v) => ['service', 'purchase'].includes(v)
  }
})

const emit = defineEmits(['back', 'order-updated'])

const loading = ref(false)
const error = ref('')
const order = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const showCsPanel = ref(false)

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

const currentStatusDesc = computed(() => {
  if (!order.value) return ''
  const descMap = {
    pending: '请在30分钟内完成支付',
    pending_service: '服务人员将尽快与您联系',
    in_progress: '服务进行中，请保持电话畅通',
    pending_shipment: '商家正在备货，请耐心等待',
    pending_receipt: '商品已发出，请注意查收',
    to_review: '订单已完成，快去评价吧',
    completed: '感谢您的支持，欢迎再次光临',
    cancelled: '订单已取消'
  }
  return descMap[order.value.status] || ''
})

const formatTime = (isoStr) => {
  const d = new Date(isoStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showToastMessage('复制成功')
  }).catch(() => {
    showToastMessage('复制失败')
  })
}

const fetchDetail = async () => {
  loading.value = true
  error.value = ''
  try {
    let data
    if (props.orderType === 'service') {
      data = await getServiceOrderDetail(props.orderId)
    } else {
      data = await getPurchaseOrderDetail(props.orderId)
    }
    order.value = data
  } catch (e) {
    error.value = e.message || '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handlePayOrder = async () => {
  try {
    const nextStatus = props.orderType === 'service' ? 'pending_service' : 'pending_shipment'
    await updateOrderStatus(props.orderId, nextStatus)
    showToastMessage('支付成功')
    emit('order-updated')
    await fetchDetail()
  } catch (e) {
    showToastMessage(e.message || '支付失败')
  }
}

const handleCancelOrder = async () => {
  try {
    await updateOrderStatus(props.orderId, 'cancelled')
    showToastMessage('订单已取消')
    emit('order-updated')
    await fetchDetail()
  } catch (e) {
    showToastMessage(e.message || '取消失败')
  }
}

const handleConfirmReceive = async () => {
  try {
    await updateOrderStatus(props.orderId, 'to_review')
    showToastMessage('确认收货成功')
    emit('order-updated')
    await fetchDetail()
  } catch (e) {
    showToastMessage(e.message || '操作失败')
  }
}

const handleReviewOrder = async () => {
  try {
    await updateOrderStatus(props.orderId, 'completed')
    showToastMessage('评价成功')
    emit('order-updated')
    await fetchDetail()
  } catch (e) {
    showToastMessage(e.message || '操作失败')
  }
}

const handleRebookOrder = () => {
  showToastMessage('已加入购物车')
}

const handleContactService = () => {
  showCsPanel.value = true
}

const handleContactServicePerson = () => {
  showCsPanel.value = true
}

const handleViewLogistics = () => {
  showToastMessage('查看物流详情')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
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

.cs-btn {
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
  position: relative;
}

.cs-btn:hover {
  background: #f5f5f5;
}

.cs-btn__dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff2442;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  gap: 12px;
}

.loading-state {
  color: #999;
}

.error-state {
  color: #666;
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

.retry-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: #ff2442;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.detail-content {
  padding: 12px;
}

.status-card {
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  border-radius: 12px;
  padding: 20px 16px;
  color: #fff;
  margin-bottom: 12px;
}

.status-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 13px;
  opacity: 0.9;
}

.timeline-section,
.info-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  color: #fff;
  transition: all 0.3s;
}

.timeline-item--completed .timeline-dot {
  background: #52c41a;
}

.timeline-item--current .timeline-dot {
  background: #ff2442;
  box-shadow: 0 0 0 4px rgba(255, 36, 66, 0.2);
}

.timeline-dot__inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

.timeline-line {
  position: absolute;
  left: 9px;
  top: 20px;
  width: 2px;
  height: calc(100% + 4px);
  background: #e0e0e0;
}

.timeline-line--completed {
  background: #52c41a;
}

.timeline-content {
  flex: 1;
  margin-left: 12px;
}

.timeline-label {
  font-size: 14px;
  font-weight: 500;
  color: #999;
  margin-bottom: 2px;
}

.timeline-item--completed .timeline-label,
.timeline-item--current .timeline-label {
  color: #333;
  font-weight: 600;
}

.timeline-time {
  font-size: 12px;
  color: #bbb;
  margin-bottom: 4px;
}

.timeline-item--current .timeline-time,
.timeline-item--completed .timeline-time {
  color: #999;
}

.timeline-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.product-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.shop-name {
  font-size: 14px;
  font-weight: 600;
}

.product-card {
  display: flex;
  gap: 12px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f5f5f5;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.product-qty {
  font-size: 12px;
  color: #999;
}

.product-price {
  flex-shrink: 0;
  text-align: right;
}

.price-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  font-size: 13px;
}

.info-row--address {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 4px;
}

.info-row--total {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 4px;
}

.info-label {
  color: #999;
  flex-shrink: 0;
  margin-right: 16px;
}

.info-value {
  color: #333;
  text-align: right;
  flex: 1;
  word-break: break-all;
}

.info-value--total {
  color: #ff2442;
  font-size: 16px;
  font-weight: 600;
}

.tracking-row {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.copy-btn {
  padding: 2px 8px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  color: #666;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
}

.copy-btn:active {
  background: #f5f5f5;
}

.logistics-tracking {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.logistics-track {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  position: relative;
}

.track-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  flex-shrink: 0;
  margin-top: 6px;
}

.track-dot--latest {
  background: #ff2442;
  box-shadow: 0 0 0 3px rgba(255, 36, 66, 0.2);
}

.track-content {
  flex: 1;
}

.track-status {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.track-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.5;
}

.track-time {
  font-size: 11px;
  color: #bbb;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
}

.action-btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 18px;
  font-size: 14px;
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
</style>
