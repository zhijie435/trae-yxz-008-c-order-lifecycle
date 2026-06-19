import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import OrderDetail from '../components/OrderDetail.vue'
import {
  ORDER_TYPE,
  SERVICE_STATUS,
  PURCHASE_STATUS,
  RENTAL_STATUS,
  getDetailActions,
  ACTION_TYPE
} from '../constants/orderConfig'
import * as api from '../api'

vi.mock('../api')

const createMockOrder = (type, status, overrides = {}) => {
  const base = {
    orderId: `ORD${Date.now()}`,
    type,
    status,
    statusText: '测试状态',
    shopName: '测试店铺',
    productTitle: '测试商品',
    productImage: 'https://example.com/img.jpg',
    specText: '规格1',
    quantity: 1,
    totalPrice: 100,
    unitPrice: 100,
    createTime: '2026-01-01T10:00:00Z',
    receiver: { name: '张三', phone: '13800138000', address: '北京市xxx' },
    payInfo: {},
    timeline: [{ status, label: '测试', isCurrent: true, isCompleted: false, time: '2026-01-01 10:00' }],
    ...overrides
  }
  if (type === ORDER_TYPE.RENTAL) {
    base.rentalInfo = {
      monthlyRent: 200,
      leaseMonths: 12,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      paidMonths: 1,
      deposit: 2000,
      totalRent: 2400
    }
  }
  if (type === ORDER_TYPE.PURCHASE || (type === ORDER_TYPE.RENTAL && status !== RENTAL_STATUS.RENTING)) {
    base.logistics = {
      company: '顺丰',
      trackingNo: 'SF123',
      estimatedTime: '2026-01-03',
      tracking: []
    }
  }
  if (type === ORDER_TYPE.SERVICE) {
    base.serviceInfo = {
      serviceTime: '2026-01-02 10:00',
      servicePerson: '李四',
      servicePhone: '13900139000',
      serviceRemark: '测试备注'
    }
  }
  return base
}

const createWrapper = async (orderType, status, overrides = {}) => {
  const order = createMockOrder(orderType, status, overrides)

  if (orderType === ORDER_TYPE.SERVICE) {
    api.getServiceOrderDetail.mockResolvedValue(order)
  } else if (orderType === ORDER_TYPE.RENTAL) {
    api.getRentalOrderDetail.mockResolvedValue(order)
  } else {
    api.getPurchaseOrderDetail.mockResolvedValue(order)
  }

  api.updateOrderStatus.mockResolvedValue({ success: true })
  api.applyRentalRenew.mockResolvedValue({ success: true })
  api.applyRentalReturn.mockResolvedValue({ success: true })
  api.applyReRent.mockResolvedValue({ productTitle: '测试商品' })

  const wrapper = mount(OrderDetail, {
    props: { orderId: order.orderId, orderType }
  })
  await flushPromises()
  return { wrapper, order }
}

describe('OrderDetail 详情操作', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('操作按钮渲染', () => {
    describe('服务订单', () => {
      it('待付款状态应显示取消订单和立即支付按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.PENDING)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('取消订单')
        expect(labels).toContain('立即支付')
      })

      it('待服务状态应显示联系客服按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.PENDING_SERVICE)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions.length).toBe(1)
        expect(actions[0].text()).toBe('联系客服')
      })

      it('进行中状态应显示联系服务人员按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.IN_PROGRESS)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions.length).toBe(1)
        expect(actions[0].text()).toBe('联系服务人员')
      })

      it('待评价状态应显示去评价按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.TO_REVIEW)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions.length).toBe(1)
        expect(actions[0].text()).toBe('去评价')
      })

      it('已完成状态应显示重新下单按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.COMPLETED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('重新下单')
      })

      it('已取消状态应显示重新下单按钮(primary)', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.CANCELLED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions.length).toBe(1)
        expect(actions[0].text()).toBe('重新下单')
        expect(actions[0].classes()).toContain('action-btn--primary')
      })
    })

    describe('购买订单', () => {
      it('待发货状态应显示联系卖家按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.PENDING_SHIPMENT)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('联系卖家')
      })

      it('待收货状态应显示查看物流和确认收货按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.PENDING_RECEIPT)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('查看物流')
        expect(labels).toContain('确认收货')
      })

      it('待评价状态应显示去评价按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.TO_REVIEW)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('去评价')
      })

      it('已完成状态应显示联系客服和再次购买按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.COMPLETED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('联系客服')
        expect(labels).toContain('再次购买')
      })
    })

    describe('租赁订单', () => {
      it('待付款状态应显示取消订单和立即支付按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.PENDING)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('取消订单')
        expect(labels).toContain('立即支付')
      })

      it('待发货状态应显示联系商家按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.PENDING_SHIPMENT)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('联系商家')
      })

      it('待收货状态应显示查看物流和确认收货按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.PENDING_RECEIPT)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('查看物流')
        expect(labels).toContain('确认收货')
      })

      it('租赁中状态应显示申请退租和申请续租按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.RENTING)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('申请退租')
        expect(labels).toContain('申请续租')
      })

      it('续租审核中状态应显示联系客服按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.RENEW_APPLIED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('联系客服')
      })

      it('退租审核中状态应显示联系客服按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.RETURN_APPLIED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('联系客服')
      })

      it('待评价状态应显示去评价按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.TO_REVIEW)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('去评价')
      })

      it('已完成状态应显示联系客服和再次租赁按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.COMPLETED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        const labels = actions.map(a => a.text())
        expect(labels).toContain('联系客服')
        expect(labels).toContain('再次租赁')
      })

      it('已取消状态应显示再次租赁按钮', async () => {
        const { wrapper } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.CANCELLED)
        const actions = wrapper.findAll('.action-bar .action-btn')
        expect(actions[0].text()).toBe('再次租赁')
      })
    })
  })

  describe('操作按钮功能', () => {
    it('点击立即支付应调用updateOrderStatus并触发order-updated', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.PENDING)
      const payBtn = wrapper.findAll('.action-btn').find(b => b.text() === '立即支付')
      await payBtn.trigger('click')
      await flushPromises()

      expect(api.updateOrderStatus).toHaveBeenCalledWith(order.orderId, SERVICE_STATUS.PENDING_SERVICE)
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击取消订单应调用updateOrderStatus设置cancelled', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.SERVICE, SERVICE_STATUS.PENDING)
      const cancelBtn = wrapper.findAll('.action-btn').find(b => b.text() === '取消订单')
      await cancelBtn.trigger('click')
      await flushPromises()

      expect(api.updateOrderStatus).toHaveBeenCalledWith(order.orderId, 'cancelled')
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击确认收货(购买订单)应跳转至待评价', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.PENDING_RECEIPT)
      const confirmBtn = wrapper.findAll('.action-btn').find(b => b.text() === '确认收货')
      await confirmBtn.trigger('click')
      await flushPromises()

      expect(api.updateOrderStatus).toHaveBeenCalledWith(order.orderId, PURCHASE_STATUS.TO_REVIEW)
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击确认收货(租赁订单)应跳转至租赁中', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.PENDING_RECEIPT)
      const confirmBtn = wrapper.findAll('.action-btn').find(b => b.text() === '确认收货')
      await confirmBtn.trigger('click')
      await flushPromises()

      expect(api.updateOrderStatus).toHaveBeenCalledWith(order.orderId, RENTAL_STATUS.RENTING)
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击去评价应设置状态为completed', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.TO_REVIEW)
      const reviewBtn = wrapper.findAll('.action-btn').find(b => b.text() === '去评价')
      await reviewBtn.trigger('click')
      await flushPromises()

      expect(api.updateOrderStatus).toHaveBeenCalledWith(order.orderId, 'completed')
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击申请续租应调用applyRentalRenew', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.RENTING)
      const renewBtn = wrapper.findAll('.action-btn').find(b => b.text() === '申请续租')
      await renewBtn.trigger('click')
      await flushPromises()

      expect(api.applyRentalRenew).toHaveBeenCalledWith(order.orderId, 1)
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击申请退租应调用applyRentalReturn', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.RENTING)
      const returnBtn = wrapper.findAll('.action-btn').find(b => b.text() === '申请退租')
      await returnBtn.trigger('click')
      await flushPromises()

      expect(api.applyRentalReturn).toHaveBeenCalledWith(order.orderId)
      expect(wrapper.emitted('order-updated')).toBeTruthy()
    })

    it('点击再次租赁应调用applyReRent', async () => {
      const { wrapper, order } = await createWrapper(ORDER_TYPE.RENTAL, RENTAL_STATUS.COMPLETED)
      const reRentBtn = wrapper.findAll('.action-btn').find(b => b.text() === '再次租赁')
      await reRentBtn.trigger('click')
      await flushPromises()

      expect(api.applyReRent).toHaveBeenCalledWith(order.orderId)
    })

    it('点击返回按钮应触发back事件', async () => {
      const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.COMPLETED)
      const backBtn = wrapper.find('.back-btn')
      await backBtn.trigger('click')
      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('按钮样式', () => {
    it('主要操作按钮应为primary样式', async () => {
      const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.PENDING_RECEIPT)
      const confirmBtn = wrapper.findAll('.action-btn').find(b => b.text() === '确认收货')
      expect(confirmBtn.classes()).toContain('action-btn--primary')
    })

    it('次要操作按钮应为outline样式', async () => {
      const { wrapper } = await createWrapper(ORDER_TYPE.PURCHASE, PURCHASE_STATUS.PENDING_RECEIPT)
      const logisticsBtn = wrapper.findAll('.action-btn').find(b => b.text() === '查看物流')
      expect(logisticsBtn.classes()).toContain('action-btn--outline')
    })
  })
})
