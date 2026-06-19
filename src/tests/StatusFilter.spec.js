import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusFilter from '../components/StatusFilter.vue'
import { getStatusFilterTabs, ORDER_TYPE } from '../constants/orderConfig'

const createWrapper = (props = {}) => {
  const defaultProps = {
    modelValue: 'all',
    tabs: getStatusFilterTabs(ORDER_TYPE.SERVICE),
    statusCounts: { pending: 2, pending_service: 1, in_progress: 3, to_review: 0, completed: 5, cancelled: 1 },
    ...props
  }
  return mount(StatusFilter, {
    props: defaultProps
  })
}

describe('StatusFilter 订单状态筛选', () => {
  describe('渲染', () => {
    it('应正确渲染所有状态tab', () => {
      const wrapper = createWrapper()
      const tabs = wrapper.findAll('.status-tab')
      const serviceTabs = getStatusFilterTabs(ORDER_TYPE.SERVICE)
      expect(tabs.length).toBe(serviceTabs.length)
      serviceTabs.forEach((tab, index) => {
        expect(tabs[index].text()).toContain(tab.label)
      })
    })

    it('应正确标记激活状态的tab', () => {
      const wrapper = createWrapper({ modelValue: 'pending' })
      const activeTab = wrapper.find('.status-tab--active')
      expect(activeTab.exists()).toBe(true)
      expect(activeTab.text()).toContain('待付款')
    })

    it('默认激活all tab', () => {
      const wrapper = createWrapper()
      const activeTab = wrapper.find('.status-tab--active')
      expect(activeTab.text()).toContain('全部')
    })

    it('激活tab且count>0时应显示小红点', () => {
      const wrapper = createWrapper({ modelValue: 'pending' })
      const activeTab = wrapper.find('.status-tab--active')
      const dot = activeTab.find('.status-tab__dot')
      expect(dot.exists()).toBe(true)
    })

    it('激活tab但count=0时不应显示小红点', () => {
      const wrapper = createWrapper({ modelValue: 'to_review' })
      const activeTab = wrapper.find('.status-tab--active')
      const dot = activeTab.find('.status-tab__dot')
      expect(dot.exists()).toBe(false)
    })

    it('未激活tab不应显示小红点', () => {
      const wrapper = createWrapper({ modelValue: 'all' })
      const pendingTab = wrapper.findAll('.status-tab')[1]
      const dot = pendingTab.find('.status-tab__dot')
      expect(dot.exists()).toBe(false)
    })
  })

  describe('交互', () => {
    it('点击不同tab时应触发update:modelValue事件', async () => {
      const wrapper = createWrapper()
      const pendingTab = wrapper.findAll('.status-tab')[1]
      await pendingTab.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('pending')
    })

    it('点击不同tab时应触发status-change事件', async () => {
      const wrapper = createWrapper()
      const inProgressTab = wrapper.findAll('.status-tab')[3]
      await inProgressTab.trigger('click')
      expect(wrapper.emitted('status-change')).toBeTruthy()
      expect(wrapper.emitted('status-change')[0][0]).toBe('in_progress')
    })

    it('点击已激活的tab不应触发事件', async () => {
      const wrapper = createWrapper({ modelValue: 'pending' })
      const activeTab = wrapper.find('.status-tab--active')
      await activeTab.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.emitted('status-change')).toBeFalsy()
    })
  })

  describe('props', () => {
    it('应正确合并tabs和statusCounts', () => {
      const statusCounts = { pending: 10, completed: 5 }
      const wrapper = createWrapper({ statusCounts })
      const computedTabs = wrapper.vm.tabsWithCounts
      expect(computedTabs.find(t => t.value === 'all').count).toBe(0)
      expect(computedTabs.find(t => t.value === 'pending').count).toBe(10)
      expect(computedTabs.find(t => t.value === 'completed').count).toBe(5)
      expect(computedTabs.find(t => t.value === 'to_review').count).toBe(0)
    })

    it('处理空tabs', () => {
      const wrapper = mount(StatusFilter, {
        props: { modelValue: 'all', tabs: [], statusCounts: {} }
      })
      expect(wrapper.findAll('.status-tab').length).toBe(0)
    })

    it('modelValue更新时应更新激活状态', async () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.status-tab--active').text()).toContain('全部')
      await wrapper.setProps({ modelValue: 'completed' })
      expect(wrapper.find('.status-tab--active').text()).toContain('已完成')
    })
  })

  describe('购买订单状态筛选', () => {
    it('应渲染购买订单类型的tabs', () => {
      const wrapper = createWrapper({
        tabs: getStatusFilterTabs(ORDER_TYPE.PURCHASE),
        statusCounts: { pending_shipment: 2, pending_receipt: 3, to_review: 1, completed: 10 }
      })
      const tabs = wrapper.findAll('.status-tab')
      expect(tabs.length).toBe(5)
      expect(tabs[0].text()).toContain('全部')
      expect(tabs[1].text()).toContain('待发货')
      expect(tabs[2].text()).toContain('待收货')
      expect(tabs[3].text()).toContain('待评价')
      expect(tabs[4].text()).toContain('已完成')
    })
  })

  describe('租赁订单状态筛选', () => {
    it('应渲染租赁订单类型的tabs', () => {
      const wrapper = createWrapper({
        tabs: getStatusFilterTabs(ORDER_TYPE.RENTAL),
        statusCounts: {
          pending_shipment: 1,
          pending_receipt: 2,
          renting: 5,
          renew_applied: 0,
          return_applied: 1,
          to_review: 3,
          completed: 20
        }
      })
      const tabs = wrapper.findAll('.status-tab')
      expect(tabs.length).toBe(8)
      const labels = tabs.map(t => t.text())
      expect(labels.some(l => l.includes('租赁中'))).toBe(true)
      expect(labels.some(l => l.includes('续租中'))).toBe(true)
      expect(labels.some(l => l.includes('退租中'))).toBe(true)
    })
  })
})
