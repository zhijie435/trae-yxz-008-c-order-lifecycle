<template>
  <div class="status-filter">
    <div class="status-scroll" ref="scrollRef">
      <div
        v-for="item in statusList"
        :key="item.value"
        class="status-tab"
        :class="{ 'status-tab--active': modelValue === item.value }"
        :ref="el => setTabRef(item.value, el)"
        @click="handleClick(item.value)"
      >
        <span class="status-tab__text">{{ item.label }}</span>
        <span v-if="item.count > 0 && modelValue === item.value" class="status-tab__dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const SERVICE_STATUS_LIST = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待付款' },
  { value: 'pending_service', label: '待服务' },
  { value: 'in_progress', label: '进行中' },
  { value: 'to_review', label: '评价' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  },
  statusCounts: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'status-change'])

const scrollRef = ref(null)
const tabRefs = {}

const setTabRef = (value, el) => {
  if (el) tabRefs[value] = el
}

const statusList = ref(
  SERVICE_STATUS_LIST.map(item => ({
    ...item,
    count: 0
  }))
)

const updateCounts = () => {
  statusList.value.forEach(item => {
    if (item.value === 'all') {
      item.count = 0
    } else {
      item.count = props.statusCounts[item.value] || 0
    }
  })
}

const scrollToActive = async () => {
  await nextTick()
  const activeEl = tabRefs[props.modelValue]
  if (activeEl && scrollRef.value) {
    const container = scrollRef.value
    const elRect = activeEl.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scrollLeft = container.scrollLeft
    const offset = elRect.left - containerRect.left + scrollLeft - containerRect.width / 2 + elRect.width / 2
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }
}

const handleClick = (value) => {
  if (props.modelValue === value) return
  emit('update:modelValue', value)
  emit('status-change', value)
}

watch(() => props.statusCounts, updateCounts, { deep: true, immediate: true })

watch(() => props.modelValue, () => {
  scrollToActive()
})

onMounted(() => {
  scrollToActive()
})
</script>

<style scoped>
.status-filter {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 107px;
  z-index: 99;
}

.status-scroll {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 8px;
}

.status-scroll::-webkit-scrollbar {
  display: none;
}

.status-tab {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 44px;
  padding: 0 14px;
  cursor: pointer;
  position: relative;
  color: #666;
  font-size: 13px;
  white-space: nowrap;
  transition: color 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.status-tab--active {
  color: #ff2442;
  font-weight: 600;
}

.status-tab:active {
  opacity: 0.6;
}

.status-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #ff2442;
  border-radius: 1px;
}

.status-tab__text {
  line-height: 1;
}

.status-tab__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff2442;
  flex-shrink: 0;
}
</style>
