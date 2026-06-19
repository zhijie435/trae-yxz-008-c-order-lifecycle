import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CsServicePanel from '../components/CsServicePanel.vue'
import { ORDER_TYPE } from '../constants/orderConfig'
import * as api from '../api'

vi.mock('../api')

const mockOrder = {
  orderId: 'ORD2026010100001',
  type: ORDER_TYPE.PURCHASE,
  status: 'pending_receipt',
  productTitle: '高端智能手机',
  productImage: 'https://example.com/phone.jpg',
  specText: '黑色 / 256GB',
  shopName: '官方旗舰店'
}

const mockFaqs = [
  { id: 1, category: '订单问题', question: '如何取消订单？', answer: '您可以在订单详情页点击取消订单按钮' },
  { id: 2, category: '订单问题', question: '如何修改收货地址？', answer: '发货前可联系客服修改地址' },
  { id: 3, category: '物流问题', question: '物流信息不更新怎么办？', answer: '物流信息通常24小时内更新，请耐心等待' },
  { id: 4, category: '退款问题', question: '退款多久到账？', answer: '退款一般3-7个工作日到账' }
]

const createWrapper = async (props = {}) => {
  api.getCsFaqs.mockResolvedValue(mockFaqs)
  api.sendCsMessage.mockResolvedValue({ success: true })

  const initialVisible = props.visible !== undefined ? props.visible : true
  const otherProps = { ...props }
  delete otherProps.visible

  const wrapper = mount(CsServicePanel, {
    props: {
      visible: false,
      order: null,
      defaultType: 'after',
      ...otherProps
    }
  })

  if (initialVisible) {
    await wrapper.setProps({ visible: true })
    await flushPromises()
  }
  return wrapper
}

describe('CsServicePanel 联系客服入口', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('显示与隐藏', () => {
    it('visible为true时应显示客服面板', async () => {
      const wrapper = await createWrapper({ visible: true })
      expect(wrapper.find('.cs-panel--visible').exists()).toBe(true)
    })

    it('visible为false时应隐藏客服面板', async () => {
      const wrapper = await createWrapper({ visible: false })
      expect(wrapper.find('.cs-panel--visible').exists()).toBe(false)
    })

    it('点击关闭按钮应触发update:visible和close事件', async () => {
      const wrapper = await createWrapper({ visible: true })
      const closeBtn = wrapper.find('.cs-close-btn')
      await closeBtn.trigger('click')
      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:visible')[0][0]).toBe(false)
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('点击遮罩层应关闭面板', async () => {
      const wrapper = await createWrapper({ visible: true })
      const mask = wrapper.find('.cs-panel__mask')
      await mask.trigger('click')
      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:visible')[0][0]).toBe(false)
    })
  })

  describe('售前售后类型切换', () => {
    it('默认应显示defaultType指定的类型', async () => {
      const wrapper = await createWrapper({ visible: true, defaultType: 'pre' })
      const activeTab = wrapper.find('.cs-tab--active')
      expect(activeTab.text()).toContain('售前咨询')
    })

    it('点击售前咨询tab应切换类型', async () => {
      const wrapper = await createWrapper({ visible: true, defaultType: 'after' })
      const tabs = wrapper.findAll('.cs-tab')
      await tabs[0].trigger('click')
      expect(tabs[0].classes()).toContain('cs-tab--active')
      expect(tabs[1].classes()).not.toContain('cs-tab--active')
    })

    it('点击售后咨询tab应切换类型', async () => {
      const wrapper = await createWrapper({ visible: true, defaultType: 'pre' })
      const tabs = wrapper.findAll('.cs-tab')
      await tabs[1].trigger('click')
      expect(tabs[1].classes()).toContain('cs-tab--active')
    })

    it('切换类型时应重新获取FAQ', async () => {
      const wrapper = await createWrapper({ visible: true, defaultType: 'after' })
      const tabs = wrapper.findAll('.cs-tab')
      api.getCsFaqs.mockClear()
      await tabs[0].trigger('click')
      expect(api.getCsFaqs).toHaveBeenCalledWith('pre', 'purchase')
    })

    it('点击相同类型tab不应触发切换', async () => {
      const wrapper = await createWrapper({ visible: true, defaultType: 'after' })
      const tabs = wrapper.findAll('.cs-tab')
      api.getCsFaqs.mockClear()
      await tabs[1].trigger('click')
      expect(api.getCsFaqs).not.toHaveBeenCalled()
    })
  })

  describe('订单信息展示', () => {
    it('传入order时应显示订单信息卡片', async () => {
      const wrapper = await createWrapper({ visible: true, order: mockOrder })
      const orderCard = wrapper.find('.order-card')
      expect(orderCard.exists()).toBe(true)
      expect(orderCard.text()).toContain(mockOrder.productTitle)
      expect(orderCard.text()).toContain(mockOrder.orderId)
      expect(orderCard.text()).toContain(mockOrder.specText)
    })

    it('未传入order时不应显示订单信息卡片', async () => {
      const wrapper = await createWrapper({ visible: true, order: null })
      expect(wrapper.find('.order-card').exists()).toBe(false)
    })
  })

  describe('FAQ常见问题', () => {
    it('应正确渲染FAQ分类', async () => {
      const wrapper = await createWrapper({ visible: true })
      const categories = wrapper.findAll('.faq-category')
      expect(categories.length).toBe(3)
      const titles = categories.map(c => c.find('.faq-category__title').text())
      expect(titles).toContain('订单问题')
      expect(titles).toContain('物流问题')
      expect(titles).toContain('退款问题')
    })

    it('应正确渲染每个分类下的FAQ条目', async () => {
      const wrapper = await createWrapper({ visible: true })
      const faqItems = wrapper.findAll('.faq-item')
      expect(faqItems.length).toBe(mockFaqs.length)
    })

    it('点击FAQ应切换到聊天模式并显示答案', async () => {
      const wrapper = await createWrapper({ visible: true })
      const faqItem = wrapper.find('.faq-item')
      await faqItem.trigger('click')
      await flushPromises()
      expect(wrapper.vm.showChatMode).toBe('chat')
      const messages = wrapper.vm.messages
      expect(messages.length).toBeGreaterThan(0)
    })
  })

  describe('聊天模式', () => {
    it('切换到在线客服应显示欢迎消息', async () => {
      const wrapper = await createWrapper({ visible: true })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      await flushPromises()
      expect(wrapper.find('.chat-section').exists()).toBe(true)
      expect(wrapper.vm.messages.length).toBe(1)
      expect(wrapper.vm.messages[0].content).toContain('您好，我是您的专属客服')
    })

    it('应正确渲染快捷操作按钮(售后-购买)', async () => {
      const wrapper = await createWrapper({ visible: true, order: mockOrder, defaultType: 'after' })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      const quickBtns = wrapper.findAll('.quick-btn')
      expect(quickBtns.length).toBe(3)
      const labels = quickBtns.map(b => b.text())
      expect(labels).toContain('物流查询')
      expect(labels).toContain('退换货')
      expect(labels).toContain('申请售后')
    })

    it('应正确渲染快捷操作按钮(售前)', async () => {
      const wrapper = await createWrapper({ visible: true, order: null, defaultType: 'pre' })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      const quickBtns = wrapper.findAll('.quick-btn')
      const labels = quickBtns.map(b => b.text())
      expect(labels).toContain('价格优惠')
      expect(labels).toContain('发货时间')
      expect(labels).toContain('商品规格')
    })

    it('应正确渲染快捷操作按钮(售后-服务)', async () => {
      const serviceOrder = { ...mockOrder, type: ORDER_TYPE.SERVICE }
      const wrapper = await createWrapper({ visible: true, order: serviceOrder, defaultType: 'after' })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      const quickBtns = wrapper.findAll('.quick-btn')
      const labels = quickBtns.map(b => b.text())
      expect(labels).toContain('改约时间')
      expect(labels).toContain('服务质量')
      expect(labels).toContain('退款申请')
    })

    it('发送消息应添加到消息列表并调用API', async () => {
      const wrapper = await createWrapper({ visible: true, order: mockOrder })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      await wrapper.find('.chat-input').setValue('我的订单什么时候发货？')
      await wrapper.find('.send-btn').trigger('click')
      await flushPromises()
      const userMsgs = wrapper.vm.messages.filter(m => m.type === 'user')
      expect(userMsgs.length).toBe(1)
      expect(userMsgs[0].content).toBe('我的订单什么时候发货？')
      expect(api.sendCsMessage).toHaveBeenCalled()
    })

    it('空消息不应发送', async () => {
      const wrapper = await createWrapper({ visible: true })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      await wrapper.find('.chat-input').setValue('   ')
      await wrapper.find('.send-btn').trigger('click')
      expect(api.sendCsMessage).not.toHaveBeenCalled()
    })

    it('发送按钮在空消息时应禁用', async () => {
      const wrapper = await createWrapper({ visible: true })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      expect(wrapper.find('.send-btn').attributes('disabled')).toBeDefined()
    })

    it('点击快捷操作应发送对应消息', async () => {
      const wrapper = await createWrapper({ visible: true, order: mockOrder, defaultType: 'after' })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      const quickBtn = wrapper.find('.quick-btn')
      const quickText = quickBtn.text()
      await quickBtn.trigger('click')
      await flushPromises()
      const userMessages = wrapper.vm.messages.filter(m => m.type === 'user')
      expect(userMessages.length).toBe(1)
      expect(userMessages[0].content).toBe(quickText)
    })

    it('按Enter键应发送消息', async () => {
      const wrapper = await createWrapper({ visible: true })
      const chatTab = wrapper.findAll('.cs-tabs-bar__item')[1]
      await chatTab.trigger('click')
      const input = wrapper.find('.chat-input')
      await input.setValue('测试问题')
      await input.trigger('keyup.enter')
      await flushPromises()
      expect(api.sendCsMessage).toHaveBeenCalled()
    })
  })

  describe('sessionId 计算', () => {
    it('有order时sessionId应包含orderId', async () => {
      const wrapper = await createWrapper({ visible: true, order: mockOrder })
      expect(wrapper.vm.sessionId).toBe(`cs_${mockOrder.orderId}`)
    })

    it('无order时sessionId应为默认值', async () => {
      const wrapper = await createWrapper({ visible: true, order: null })
      expect(wrapper.vm.sessionId).toBe('cs_default')
    })
  })

  describe('打开面板时应获取FAQ', () => {
    it('visible变为true时应调用getCsFaqs', async () => {
      const wrapper = await createWrapper({ visible: false })
      api.getCsFaqs.mockClear()
      await wrapper.setProps({ visible: true })
      await flushPromises()
      expect(api.getCsFaqs).toHaveBeenCalled()
    })
  })
})
