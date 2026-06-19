import {
  SERVICE_STATUS,
  SERVICE_STATUS_LABELS,
  PURCHASE_STATUS,
  PURCHASE_STATUS_LABELS,
  RENTAL_STATUS,
  RENTAL_STATUS_LABELS,
  getServiceOrderCount,
  getPurchaseOrderCount,
  getRentalOrderCount,
  getServiceStatusCounts,
  getPurchaseStatusCounts,
  getRentalStatusCounts,
  getServiceOrderList,
  getPurchaseOrderList,
  getRentalOrderList
} from '../server/seedData.js'

function printDivider(title) {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`  ${title}`)
  console.log('='.repeat(50))
}

function printStatusTable(title, statusLabels, statusCounts, orderList) {
  console.log(`\n${title}:`)
  console.log('-'.repeat(40))
  const allStatuses = Object.keys(statusLabels)
  for (const status of allStatuses) {
    const count = statusCounts[status] || 0
    const label = statusLabels[status] || status
    const bar = '█'.repeat(Math.min(count, 20))
    console.log(`  ${label.padEnd(10)} ${String(count).padStart(2)}  ${bar}`)
  }
  console.log(`  ${'合计'.padEnd(10)} ${String(orderList.length).padStart(2)}`)
}

printDivider('C端订单全周期 - 种子数据概览')

const svcCount = getServiceOrderCount()
const purCount = getPurchaseOrderCount()
const rtlCount = getRentalOrderCount()

console.log(`\n订单总数: ${svcCount + purCount + rtlCount}`)
console.log(`  服务订单 (不含已取消): ${svcCount}`)
console.log(`  购买订单:             ${purCount}`)
console.log(`  租赁订单:             ${rtlCount}`)

printStatusTable('服务订单状态分布', SERVICE_STATUS_LABELS, getServiceStatusCounts(), getServiceOrderList())
printStatusTable('购买订单状态分布', PURCHASE_STATUS_LABELS, getPurchaseStatusCounts(), getPurchaseOrderList())
printStatusTable('租赁订单状态分布', RENTAL_STATUS_LABELS, getRentalStatusCounts(), getRentalOrderList())

const rentalList = getRentalOrderList()
const hasReturnApplied = rentalList.some(o => o.status === RENTAL_STATUS.RETURN_APPLIED)
const hasRenewApplied = rentalList.some(o => o.status === RENTAL_STATUS.RENEW_APPLIED)
const hasPending = rentalList.some(o => o.status === RENTAL_STATUS.PENDING)
const hasCancelled = rentalList.some(o => o.status === RENTAL_STATUS.CANCELLED)

console.log('\n特殊状态覆盖检查:')
console.log(`  租赁-待付款(pending):        ${hasPending ? '✅ 已覆盖' : '❌ 未覆盖'}`)
console.log(`  租赁-续租审核中(renew_applied):  ${hasRenewApplied ? '✅ 已覆盖' : '❌ 未覆盖'}`)
console.log(`  租赁-退租审核中(return_applied): ${hasReturnApplied ? '✅ 已覆盖' : '❌ 未覆盖'}`)
console.log(`  租赁-已取消(cancelled):      ${hasCancelled ? '✅ 已覆盖' : '❌ 未覆盖'}`)

console.log('\n最近订单示例:')
const latestOrders = [
  ...getServiceOrderList().slice(0, 2),
  ...getPurchaseOrderList().slice(0, 2),
  ...getRentalOrderList().slice(0, 2)
]
for (const o of latestOrders) {
  const labels = o.type === 'service' ? SERVICE_STATUS_LABELS : (o.type === 'purchase' ? PURCHASE_STATUS_LABELS : RENTAL_STATUS_LABELS)
  const typeLabel = o.type === 'service' ? '服务' : (o.type === 'purchase' ? '购买' : '租赁')
  console.log(`  [${typeLabel}] ${o.orderId}  ${labels[o.status] || o.status}  ¥${o.totalPrice}  ${o.productTitle.slice(0, 20)}`)
}

console.log('')
