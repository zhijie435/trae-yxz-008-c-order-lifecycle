<template>
  <div class="order-tab-entry">
    <div class="tab-wrapper">
      <div
        class="tab-item"
        :class="{ 'tab-item--active': modelValue === 'service' }"
        @click="handleTabClick('service')"
      >
        <div class="tab-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <span class="tab-label">服务订单</span>
        <span v-if="serviceCount > 0" class="tab-badge">{{ serviceCount > 99 ? '99+' : serviceCount }}</span>
      </div>
      <div
        class="tab-item"
        :class="{ 'tab-item--active': modelValue === 'purchase' }"
        @click="handleTabClick('purchase')"
      >
        <div class="tab-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <span class="tab-label">购买订单</span>
        <span v-if="purchaseCount > 0" class="tab-badge">{{ purchaseCount > 99 ? '99+' : purchaseCount }}</span>
      </div>
    </div>
    <div class="tab-indicator">
      <div
        class="indicator-slider"
        :class="{ 'indicator-slider--right': modelValue === 'purchase' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'service',
    validator: (v) => ['service', 'purchase'].includes(v)
  },
  serviceCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'tab-change'])

const handleTabClick = (tab) => {
  if (props.modelValue === tab) return
  emit('update:modelValue', tab)
  emit('tab-change', tab)
}
</script>

<style scoped>
.order-tab-entry {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tab-wrapper {
  display: flex;
  height: 56px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  position: relative;
  transition: color 0.25s ease;
  color: #999;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.tab-item--active {
  color: #333;
}

.tab-item:active {
  opacity: 0.7;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.tab-item--active .tab-icon {
  transform: scale(1.05);
}

.tab-label {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.tab-item--active .tab-label {
  font-weight: 600;
}

.tab-badge {
  position: absolute;
  top: 8px;
  right: calc(50% - 48px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ff2442;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  animation: badge-pop 0.3s ease;
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.tab-indicator {
  height: 3px;
  padding: 0 16px;
  display: flex;
}

.indicator-slider {
  width: 50%;
  height: 100%;
  background: #ff2442;
  border-radius: 1.5px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-slider--right {
  transform: translateX(100%);
}
</style>
