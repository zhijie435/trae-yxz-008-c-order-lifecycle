import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import OrderDetail from '../components/OrderDetail.vue'
import { ORDER_TYPE, RENTAL_STATUS, ACTION_TYPE } from '../constants/orderConfig'
import * as api from '../api'

vi.mock('../api')

const baseRentalOrder = {
  orderId: 'RNT2026010100001',
  type: ORDER_TYPE.RENTAL,
  status: RENTAL_STATUS.RENTING,
  statusText: '租赁中',
  shopName: '测试租赁店铺',
  productTitle: '高端笔记本电脑租赁',
  productImage: 'https://example.com/img.jpg',
  specText: '银色 / 16GB / 512GB',
  quantity: 1,
  unitPrice: 200,
  totalPrice: 200,
  createTime: '2026-01-01T10:00:00Z',
  receiver: {
    name: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道xxx号'
  },
  logistics: {
    company: '顺丰速运',
    trackingNo: 'SF1234567890',
    estimatedTime: '2026-01-03 18:00'
  },
  rentalInfo: {
    monthlyRent: 200,
    leaseMonths: 12,
    startDate: '2026-01-01',
    endDate: '',
    paidMonths: 3,
    deposit: 2000,
    nextPayDate: '2026-04-01',
    totalRent: 2400
  },
  payInfo: {
    payMethod: '支付宝',
    payTime: '2026-01-01 10:00:00',
    transactionId: 'TXN2026010100001'
  },
  timeline: [
    { status: 'pending_shipment', label: '待发货', isCompleted: true, isCurrent: false, time: '2026-01-01 10:00' },
    { status: 'pending_receipt', label: '待收货', isCompleted: true, isCurrent: false, time: '2026-01-02 15:00' },
    { status: 'renting', label: '租赁中', isCompleted: false, isCurrent: true, time: '2026-01-03 18:00' }
  ]
}

const createWrapper = async (props = {}, endDateOffsetDays = 10) => {
  const endDate = new Date(Date.now() + endDateOffsetDays * 24 * 60 * 60 * 1000)
  const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
  const orderData = JSON.parse(JSON.stringify(baseRentalOrder))
  orderData.rentalInfo.endDate = endDateStr
  Object.assign(orderData, props.order || {})

  api.getRentalOrderDetail.mockResolvedValue(orderData)
  api.updateOrderStatus.mockResolvedValue({})

  const wrapper = mount(OrderDetail, {
    props: {
      orderId: orderData.orderId,
      orderType: ORDER_TYPE.RENTAL,
      ...props
    }
  })
  await flushPromises()
  return wrapper
}

describe('OrderDetail 倒计时功能', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('倒计时渲染', () => {
    it('租赁中状态且有endDate时应显示倒计时卡片', async () => {
      const wrapper = await createWrapper({}, 10)
      expect(wrapper.find('.countdown-card').exists()).toBe(true)
      expect(wrapper.find('.countdown-title').text()).toBe('租期倒计时')
    })

    it('非租赁中状态不应显示倒计时卡片', async () => {
      const wrapper = await createWrapper({
        order: { status: RENTAL_STATUS.TO_REVIEW }
      }, 10)
      expect(wrapper.find('.countdown-card').exists()).toBe(false)
    })

    it('租赁中但无endDate不应启动倒计时定时器', async () => {
      const orderData = JSON.parse(JSON.stringify(baseRentalOrder))
      delete orderData.rentalInfo.endDate
      api.getRentalOrderDetail.mockResolvedValue(orderData)

      const wrapper = mount(OrderDetail, {
        props: { orderId: 'test', orderType: ORDER_TYPE.RENTAL }
      })
      await flushPromises()
      expect(wrapper.vm.countdownTimer).toBeNull()
    })

    it('应显示租期结束日期', async () => {
      const wrapper = await createWrapper({}, 10)
      const endDateText = wrapper.find('.countdown-end-date').text()
      expect(endDateText).toContain('租期至')
    })

    it('倒计时应包含天时分秒四个部分', async () => {
      const wrapper = await createWrapper({}, 5)
      const items = wrapper.findAll('.countdown-item')
      expect(items.length).toBe(4)
      const units = wrapper.findAll('.countdown-unit')
      expect(units[0].text()).toBe('天')
      expect(units[1].text()).toBe('时')
      expect(units[2].text()).toBe('分')
      expect(units[3].text()).toBe('秒')
    })
  })

  describe('倒计时计算', () => {
    it('应正确计算10天的倒计时天数', async () => {
      const wrapper = await createWrapper({}, 10)
      const countdown = wrapper.vm.countdown
      expect(countdown.days).toBe('10')
      expect(Number(countdown.hours)).toBeGreaterThanOrEqual(0)
      expect(Number(countdown.hours)).toBeLessThanOrEqual(23)
    })

    it('应正确计算0天剩余时间', async () => {
      const wrapper = await createWrapper({}, 0)
      const countdown = wrapper.vm.countdown
      expect(countdown.days).toBe('00')
      expect(Number(countdown.hours)).toBeLessThanOrEqual(23)
    })

    it('倒计时数字应为两位补零格式', async () => {
      const wrapper = await createWrapper({}, 1)
      const countdown = wrapper.vm.countdown
      expect(countdown.days.length).toBe(2)
      expect(countdown.hours.length).toBe(2)
      expect(countdown.minutes.length).toBe(2)
      expect(countdown.seconds.length).toBe(2)
    })

    it('结束时间已过时倒计时应为00:00:00:00', async () => {
      const wrapper = await createWrapper({}, -1)
      const countdown = wrapper.vm.countdown
      expect(countdown.days).toBe('00')
      expect(countdown.hours).toBe('00')
      expect(countdown.minutes).toBe('00')
      expect(countdown.seconds).toBe('00')
    })
  })

  describe('倒计时更新', () => {
    it('1秒后应更新倒计时', async () => {
      const wrapper = await createWrapper({}, 10)
      const initialSeconds = wrapper.vm.countdown.seconds
      await wrapper.vm.$nextTick()
      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()
      const newSeconds = wrapper.vm.countdown.seconds
      expect(newSeconds).not.toBe(initialSeconds)
    })

    it('组件卸载时应清除定时器', async () => {
      const wrapper = await createWrapper({}, 10)
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      wrapper.unmount()
      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })

  describe('倒计时与状态联动', () => {
    it('订单状态从renting变更为非renting时应停止倒计时', async () => {
      const orderData = JSON.parse(JSON.stringify(baseRentalOrder))
      const endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      orderData.rentalInfo.endDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
      api.getRentalOrderDetail.mockResolvedValueOnce(orderData)

      const wrapper = mount(OrderDetail, {
        props: { orderId: 'test', orderType: ORDER_TYPE.RENTAL }
      })
      await flushPromises()

      expect(wrapper.find('.countdown-card').exists()).toBe(true)

      const updatedOrder = JSON.parse(JSON.stringify(orderData))
      updatedOrder.status = RENTAL_STATUS.TO_REVIEW
      api.getRentalOrderDetail.mockResolvedValueOnce(updatedOrder)
      await wrapper.vm.fetchDetail()
      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.order.status).toBe(RENTAL_STATUS.TO_REVIEW)
      expect(wrapper.find('.countdown-card').exists()).toBe(false)
    })
  })
})
