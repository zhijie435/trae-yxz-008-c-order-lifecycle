<template>
  <div class="cs-panel" :class="{ 'cs-panel--visible': visible }">
    <div class="cs-panel__mask" @click="handleClose"></div>
    <div class="cs-panel__content">
      <div class="cs-header">
        <div class="cs-header__tabs">
          <div
            class="cs-tab"
            :class="{ 'cs-tab--active': consultType === 'pre' }"
            @click="switchType('pre')"
          >
            <span class="cs-tab__label">售前咨询</span>
          </div>
          <div
            class="cs-tab"
            :class="{ 'cs-tab--active': consultType === 'after' }"
            @click="switchType('after')"
          >
            <span class="cs-tab__label">售后咨询</span>
          </div>
        </div>
        <button class="cs-close-btn" @click="handleClose">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div v-if="order && showChatMode === 'faq'" class="order-card">
        <div class="order-card__label">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>咨询订单</span>
        </div>
        <div class="order-card__info">
          <img class="order-card__img" :src="order.productImage" :alt="order.productTitle" />
          <div class="order-card__body">
            <p class="order-card__title">{{ order.productTitle }}</p>
            <p class="order-card__spec">{{ order.specText }}</p>
            <p class="order-card__no">订单号：{{ order.orderId }}</p>
          </div>
        </div>
      </div>

      <div class="cs-tabs-bar">
        <div
          class="cs-tabs-bar__item"
          :class="{ 'cs-tabs-bar__item--active': showChatMode === 'faq' }"
          @click="showChatMode = 'faq'"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>常见问题</span>
        </div>
        <div
          class="cs-tabs-bar__item"
          :class="{ 'cs-tabs-bar__item--active': showChatMode === 'chat' }"
          @click="enterChatMode"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>在线客服</span>
        </div>
      </div>

      <div v-if="showChatMode === 'faq'" class="faq-section">
        <div v-for="category in faqCategories" :key="category" class="faq-category">
          <h4 class="faq-category__title">{{ category }}</h4>
          <div class="faq-list">
            <div
              v-for="item in getFaqsByCategory(category)"
              :key="item.id"
              class="faq-item"
              @click="handleFaqClick(item)"
            >
              <span class="faq-item__q">{{ item.question }}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="chat-section">
        <div class="chat-messages" ref="chatListRef">
          <div
            v-for="(msg, index) in messages"
            :key="msg.id || index"
            class="chat-msg"
            :class="'chat-msg--' + msg.type"
          >
            <div v-if="msg.type === 'system'" class="chat-msg__system">
              <span>{{ msg.content }}</span>
            </div>
            <template v-else>
              <div v-if="msg.type === 'service'" class="chat-msg__avatar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div class="chat-msg__bubble">
                <p>{{ msg.content }}</p>
                <span class="chat-msg__time">{{ formatTime(msg.time) }}</span>
              </div>
              <div v-if="msg.type === 'user'" class="chat-msg__avatar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </template>
          </div>
          <div v-if="isTyping" class="chat-msg chat-msg--service">
            <div class="chat-msg__avatar">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div class="chat-msg__bubble chat-msg__bubble--typing">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>

        <div class="chat-input-bar">
          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action"
              class="quick-btn"
              @click="sendQuickMessage(action)"
            >
              {{ action }}
            </button>
          </div>
          <div class="chat-input-wrapper">
            <input
              v-model="inputMessage"
              type="text"
              class="chat-input"
              placeholder="请输入您的问题..."
              @keyup.enter="handleSend"
            />
            <button class="send-btn" :disabled="!inputMessage.trim()" @click="handleSend">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { getCsFaqs, sendCsMessage } from '../api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  },
  defaultType: {
    type: String,
    default: 'after',
    validator: (v) => ['pre', 'after'].includes(v)
  }
})

const emit = defineEmits(['update:visible', 'close'])

const consultType = ref(props.defaultType)
const showChatMode = ref('faq')
const faqs = ref([])
const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const chatListRef = ref(null)

const quickActions = computed(() => {
  if (consultType.value === 'pre') {
    return ['价格优惠', '发货时间', '商品规格']
  }
  if (props.order?.type === 'service') {
    return ['改约时间', '服务质量', '退款申请']
  }
  return ['物流查询', '退换货', '申请售后']
})

const faqCategories = computed(() => {
  const cats = new Set()
  faqs.value.forEach(f => cats.add(f.category))
  return Array.from(cats)
})

const sessionId = computed(() => {
  if (props.order?.orderId) {
    return `cs_${props.order.orderId}`
  }
  return 'cs_default'
})

const orderContext = computed(() => {
  if (!props.order) return null
  return {
    orderId: props.order.orderId,
    productTitle: props.order.productTitle,
    type: props.order.type
  }
})

const getFaqsByCategory = (category) => {
  return faqs.value.filter(f => f.category === category)
}

const formatTime = (isoStr) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatListRef.value) {
    chatListRef.value.scrollTop = chatListRef.value.scrollHeight
  }
}

const fetchFaqs = async () => {
  try {
    const orderType = props.order?.type || 'purchase'
    const data = await getCsFaqs(consultType.value, orderType)
    faqs.value = data
  } catch (e) {
    console.error('获取常见问题失败:', e)
  }
}

const switchType = (type) => {
  if (consultType.value === type) return
  consultType.value = type
  showChatMode.value = 'faq'
  fetchFaqs()
}

const handleFaqClick = (item) => {
  enterChatMode()
  nextTick(() => {
    if (item.answer) {
      messages.value.push({
        id: Date.now() + '_faq_sys',
        type: 'system',
        content: '常见问题解答',
        time: new Date().toISOString()
      })
      messages.value.push({
        id: Date.now() + '_faq_svc',
        type: 'service',
        content: item.answer,
        time: new Date().toISOString()
      })
      scrollToBottom()
    }
  })
}

const enterChatMode = () => {
  showChatMode.value = 'chat'
  if (messages.value.length === 0) {
    messages.value.push({
      id: Date.now() + '_welcome',
      type: 'service',
      content: '您好，我是您的专属客服小助手，请问有什么可以帮您的？',
      time: new Date().toISOString()
    })
  }
  scrollToBottom()
}

const handleSend = async () => {
  const text = inputMessage.value.trim()
  if (!text) return

  const userMsg = {
    id: Date.now() + '_user',
    type: 'user',
    content: text,
    time: new Date().toISOString()
  }
  messages.value.push(userMsg)
  inputMessage.value = ''
  isTyping.value = true
  scrollToBottom()

  const replyContent = getReply(text)

  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: Date.now() + '_svc',
      type: 'service',
      content: replyContent,
      time: new Date().toISOString()
    })
    scrollToBottom()
  }, 1000 + Math.random() * 1000)

  try {
    await sendCsMessage(sessionId.value, text, orderContext.value)
  } catch (e) {
    console.warn('消息发送到服务器失败，使用本地回复:', e)
  }
}

const getReply = (question) => {
  const matched = faqs.value.find(f => question.includes(f.question.slice(0, 4)))
  if (matched) {
    return matched.answer
  }
  const replies = [
    '好的，已收到您的问题，客服小妹正在为您查询~',
    '您好，关于您的问题，建议您先查看订单详情哦~',
    '非常抱歉给您带来不便，我们会尽快为您处理！',
    '感谢您的咨询，请稍等，正在为您转接人工客服...',
    '这个问题小助手帮您记录下来了，稍后会有专人回复您~'
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

const sendQuickMessage = (text) => {
  inputMessage.value = text
  handleSend()
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val) {
    consultType.value = props.defaultType
    showChatMode.value = 'faq'
    fetchFaqs()
  }
})

watch(() => props.defaultType, (val) => {
  consultType.value = val
})
</script>

<style scoped>
.cs-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}

.cs-panel--visible {
  pointer-events: auto;
}

.cs-panel__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cs-panel--visible .cs-panel__mask {
  opacity: 1;
}

.cs-panel__content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 20px 20px 0 0;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cs-panel--visible .cs-panel__content {
  transform: translateY(0);
}

.cs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0;
  flex-shrink: 0;
}

.cs-header__tabs {
  display: flex;
  gap: 24px;
}

.cs-tab {
  position: relative;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
}

.cs-tab__label {
  font-size: 15px;
  color: #666;
  font-weight: 500;
  transition: color 0.2s;
}

.cs-tab--active .cs-tab__label {
  color: #ff2442;
  font-weight: 600;
}

.cs-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #ff2442;
  border-radius: 2px;
}

.cs-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.cs-close-btn:active {
  background: #eee;
}

.order-card {
  margin: 12px 16px;
  padding: 12px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  border-radius: 10px;
  border: 1px solid #ffe0e0;
  flex-shrink: 0;
}

.order-card__label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff2442;
  margin-bottom: 8px;
  font-weight: 500;
}

.order-card__info {
  display: flex;
  gap: 10px;
}

.order-card__img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #fff;
}

.order-card__body {
  flex: 1;
  min-width: 0;
}

.order-card__title {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

.order-card__spec {
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
}

.order-card__no {
  font-size: 11px;
  color: #bbb;
}

.cs-tabs-bar {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  margin: 0 16px;
}

.cs-tabs-bar__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  user-select: none;
}

.cs-tabs-bar__item--active {
  color: #ff2442;
  font-weight: 500;
}

.cs-tabs-bar__item--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 2px;
  background: #ff2442;
  border-radius: 1px;
}

.faq-section {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 16px 24px;
}

.faq-category {
  margin-bottom: 16px;
}

.faq-category__title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid #ff2442;
}

.faq-list {
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
}

.faq-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item:active {
  background: #f0f0f0;
}

.faq-item__q {
  font-size: 13px;
  color: #333;
  flex: 1;
  padding-right: 8px;
}

.faq-item svg {
  flex-shrink: 0;
  color: #ccc;
}

.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  background: #f8f8f8;
}

.chat-msg {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.chat-msg--user {
  flex-direction: row-reverse;
}

.chat-msg__system {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 12px;
}

.chat-msg__system span {
  font-size: 11px;
  color: #bbb;
  background: #eee;
  padding: 4px 10px;
  border-radius: 10px;
}

.chat-msg__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-msg--service .chat-msg__avatar {
  background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
  color: #fff;
}

.chat-msg--user .chat-msg__avatar {
  background: #f0f0f0;
  color: #999;
}

.chat-msg__bubble {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  position: relative;
  word-break: break-word;
}

.chat-msg--service .chat-msg__bubble {
  border-top-left-radius: 4px;
  background: #fff;
}

.chat-msg--user .chat-msg__bubble {
  border-top-right-radius: 4px;
  background: #ff2442;
  color: #fff;
}

.chat-msg__bubble p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.chat-msg__time {
  display: block;
  font-size: 10px;
  color: #bbb;
  margin-top: 4px;
}

.chat-msg--user .chat-msg__time {
  color: rgba(255, 255, 255, 0.7);
}

.chat-msg__bubble--typing {
  padding: 14px 16px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ccc;
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-input-bar {
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 12px 16px;
  flex-shrink: 0;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 6px 12px;
  border: 1px solid #ffd0d6;
  border-radius: 16px;
  background: #fff5f6;
  color: #ff2442;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-btn:active {
  background: #ffe0e6;
}

.chat-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.chat-input {
  flex: 1;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #eee;
  border-radius: 18px;
  font-size: 14px;
  outline: none;
  background: #f8f8f8;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: #ff2442;
  background: #fff;
}

.send-btn {
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 18px;
  background: #ff2442;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:active:not(:disabled) {
  opacity: 0.8;
}
</style>
