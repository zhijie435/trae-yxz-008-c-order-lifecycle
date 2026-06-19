# C端订单全周期模块 - 部署文档

## 一、项目概述

本项目是一个 C 端订单全周期管理系统，涵盖三种订单类型：服务订单、购买订单、租赁订单。项目采用前后端分离架构：

- **前端**：Vue 3 + Vite，运行端口 3000
- **后端**：Node.js + Express，运行端口 3001
- **测试**：Vitest + @vue/test-utils

## 二、环境要求

| 依赖 | 版本要求 |
|------|----------|
| Node.js | >= 16.0.0 |
| npm | >= 7.0.0 |

## 三、目录结构

```
008-C端订单全周期/
├── src/                          # 前端源码
│   ├── api/                      # API 接口封装
│   ├── components/               # Vue 组件
│   ├── constants/                # 常量配置（订单状态、动作等）
│   ├── tests/                    # 单元测试
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── server/                       # 后端服务
│   ├── seedData.js               # 种子数据与业务逻辑
│   ├── server.js                 # Express 服务入口
│   └── package.json
├── DEPLOYMENT.md                 # 本文档
├── package.json
├── vite.config.js
└── index.html
```

## 四、安装与启动

### 4.1 一键安装所有依赖

```bash
npm run install:all
```

### 4.2 分步安装

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..
```

### 4.3 启动开发环境

#### 方式一：同时启动前后端

```bash
npm run dev:all
```

#### 方式二：分别启动

```bash
# 启动后端服务（端口 3001）
npm run dev:server

# 启动前端服务（端口 3000，另开一个终端）
npm run dev
```

启动成功后访问：http://localhost:3000

## 五、订单模块说明

### 5.1 订单类型

| 类型 | 标识 | 说明 |
|------|------|------|
| 服务订单 | service | 上门服务类订单，如维修、安装、清洗等 |
| 购买订单 | purchase | 实物商品购买订单 |
| 租赁订单 | rental | 商品租赁订单，含续租、退租流程 |

### 5.2 订单状态流转

#### 服务订单状态流转

```
待付款(pending) → 待服务(pending_service) → 进行中(in_progress) → 待评价(to_review) → 已完成(completed)
                                                                  ↘
                                                                    已取消(cancelled)
```

#### 购买订单状态流转

```
待发货(pending_shipment) → 待收货(pending_receipt) → 待评价(to_review) → 已完成(completed)
```

#### 租赁订单状态流转

```
待付款(pending) → 待发货(pending_shipment) → 待收货(pending_receipt) → 租赁中(renting) → 待评价(to_review) → 已完成(completed)
                                                                           ↙        ↘
                                                               续租审核中(renew_applied)  退租审核中(return_applied)
```

### 5.3 种子数据

后端内置 Mock 种子数据，覆盖所有订单类型和状态，位于 [server/seedData.js](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/008-C端订单全周期/server/seedData.js)：

- 服务订单：12 条（覆盖 pending / pending_service / in_progress / to_review / completed / cancelled）
- 购买订单：8 条（覆盖 pending_shipment / pending_receipt / to_review / completed）
- 租赁订单：9 条（覆盖 pending_shipment / pending_receipt / renting / to_review / completed / renew_applied / return_applied）

重置种子数据：重启后端服务即可恢复初始数据。

## 六、API 接口列表

### 6.1 健康检查

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/health | 服务健康检查 |

### 6.2 订单汇总

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/order/summary | 获取各类型订单数量汇总 |
| GET | /api/order/service/status-counts | 服务订单各状态数量 |
| GET | /api/order/purchase/status-counts | 购买订单各状态数量 |
| GET | /api/order/rental/status-counts | 租赁订单各状态数量 |

### 6.3 订单列表

| 方法 | 路径 | 参数 | 说明 |
|------|------|------|------|
| GET | /api/order/service | status: all/pending/... | 服务订单列表 |
| GET | /api/order/purchase | status: all/pending_shipment/... | 购买订单列表 |
| GET | /api/order/rental | status: all/renting/... | 租赁订单列表 |

### 6.4 订单详情

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/order/service/:orderId | 服务订单详情 |
| GET | /api/order/purchase/:orderId | 购买订单详情 |
| GET | /api/order/rental/:orderId | 租赁订单详情 |

### 6.5 订单状态变更

| 方法 | 路径 | Body | 说明 |
|------|------|------|------|
| POST | /api/order/:orderId/status | { status: string } | 更新订单状态（含合法性校验） |

### 6.6 租赁订单特有操作

| 方法 | 路径 | Body | 说明 |
|------|------|------|------|
| POST | /api/order/rental/:orderId/renew | { extendMonths: number } | 申请续租 |
| POST | /api/order/rental/:orderId/return | - | 申请退租 |
| POST | /api/order/rental/:orderId/re-rent | - | 再次租赁 |

### 6.7 客服相关

| 方法 | 路径 | 参数 | 说明 |
|------|------|------|------|
| GET | /api/cs/faqs | type, orderType | 获取常见问题 |
| GET | /api/cs/chat/:sessionId | - | 获取聊天历史 |
| POST | /api/cs/chat/:sessionId | { message, orderContext } | 发送消息 |

## 七、状态迁移规则

状态迁移逻辑位于 [server/seedData.js](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/008-C端订单全周期/server/seedData.js) 中的 `validateStatusTransition` 函数。

### 7.1 合法的状态迁移路径

| 订单类型 | 当前状态 | 允许迁移到 |
|----------|----------|------------|
| 服务订单 | pending | pending_service, cancelled |
| 服务订单 | pending_service | in_progress, cancelled |
| 服务订单 | in_progress | to_review |
| 服务订单 | to_review | completed |
| 服务订单 | completed | -（终态） |
| 服务订单 | cancelled | -（终态） |
| 购买订单 | pending_shipment | pending_receipt |
| 购买订单 | pending_receipt | to_review |
| 购买订单 | to_review | completed |
| 购买订单 | completed | -（终态） |
| 租赁订单 | pending | pending_shipment, cancelled |
| 租赁订单 | pending_shipment | pending_receipt |
| 租赁订单 | pending_receipt | renting |
| 租赁订单 | renting | renew_applied, return_applied, to_review |
| 租赁订单 | renew_applied | renting, to_review |
| 租赁订单 | return_applied | renting, to_review |
| 租赁订单 | to_review | completed |
| 租赁订单 | completed | -（终态） |
| 租赁订单 | cancelled | -（终态） |

非法状态迁移会返回 400 错误。

## 八、测试与验收

### 8.1 单元测试

```bash
# 运行所有单元测试（一次性）
npm test

# 监听模式运行测试
npm run test:watch
```

测试文件位于 [src/tests/](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/008-C端订单全周期/src/tests) 目录：
- `Countdown.spec.js`：倒计时功能测试
- `CsServicePanel.spec.js`：客服面板测试
- `OrderDetailActions.spec.js`：订单详情操作测试
- `StatusFilter.spec.js`：状态筛选测试

### 8.2 冒烟测试 / 验收命令

```bash
# 运行后端 API 冒烟测试（验证接口可用性）
npm run test:smoke

# 完整验收流程（安装依赖 + 单元测试 + 冒烟测试）
npm run test:acceptance
```

验收检查清单：
1. ✅ 所有依赖安装成功
2. ✅ 后端服务启动正常（端口 3001）
3. ✅ 前端服务启动正常（端口 3000）
4. ✅ 所有单元测试通过
5. ✅ 健康检查接口返回正常
6. ✅ 三种订单类型列表接口正常
7. ✅ 订单状态迁移合法性校验生效
8. ✅ 租赁订单续租/退租功能正常

### 8.3 手动验证 API

```bash
# 健康检查
curl http://localhost:3001/api/health

# 订单汇总
curl http://localhost:3001/api/order/summary

# 服务订单列表（全部）
curl http://localhost:3001/api/order/service

# 购买订单列表（待发货）
curl "http://localhost:3001/api/order/purchase?status=pending_shipment"

# 租赁订单详情
curl http://localhost:3001/api/order/rental/RTL20240601001

# 更新订单状态（合法迁移）
curl -X POST http://localhost:3001/api/order/SVC20240601001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "pending_service"}'

# 更新订单状态（非法迁移，应返回 400）
curl -X POST http://localhost:3001/api/order/SVC20240605001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "pending"}'
```

## 九、构建与部署

### 9.1 前端构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 9.2 预览构建结果

```bash
npm run preview
```

### 9.3 生产环境部署

```bash
# 1. 构建前端
npm run build

# 2. 启动后端服务（可使用 pm2 等进程管理）
cd server
NODE_ENV=production node server.js
```

Nginx 反向代理示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 十、常见问题

**Q: 前后端端口可以修改吗？**
A: 前端端口在 `vite.config.js` 中修改，后端端口在 `server/server.js` 顶部修改，注意同步修改代理配置。

**Q: 种子数据如何持久化？**
A: 当前 Mock 数据存储于内存中，重启服务会重置。如需持久化，可接入数据库（SQLite / MongoDB 等）。

**Q: 如何新增订单状态？**
A: 需要同步修改三处：`src/constants/orderConfig.js`（前端常量）、`server/seedData.js`（后端常量和流转规则）、以及对应的前端组件展示逻辑。
