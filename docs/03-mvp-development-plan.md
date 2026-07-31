# MVP 开发计划

## 高跟鞋生物力学测试研发工作台 MVP

---

## 1. 开发阶段总览

整个 MVP 分为 **6 个阶段**，按照"先基础架构 → 再业务模块 → 最后联调"的顺序推进。

```
Phase 1: 项目脚手架搭建 (1天)
    ↓
Phase 2: 数据库实现 (1天)
    ↓
Phase 3: 后端 API 开发 (3天)
    ↓
Phase 4: 前端页面开发 (4天)
    ↓
Phase 5: 文件管理实现 (1天)
    ↓
Phase 6: 集成测试与上线 (1天)
```

**总预计工期**：约 11 个工作日

---

## 2. Phase 1 — 项目脚手架搭建

**目标**：建立可运行的前后端开发环境

### 任务清单

| # | 任务 | 产出 | 预计工时 |
|---|------|------|----------|
| 1.1 | 初始化前端项目 (Vite + React + TS) | `frontend/` 运行环境 | 2h |
| 1.2 | 安装 Ant Design、React Router、Axios、dayjs | `package.json` 依赖就绪 | 0.5h |
| 1.3 | 配置 Vite 代理（转发 /api 到后端） | `vite.config.ts` | 0.5h |
| 1.4 | 初始化后端项目 (FastAPI + SQLAlchemy) | `backend/` 运行环境 | 1h |
| 1.5 | 安装依赖 (fastapi, uvicorn, sqlalchemy, psycopg2, alembic, python-multipart, pydantic) | `requirements.txt` 依赖就绪 | 0.5h |
| 1.6 | 创建目录结构（models, schemas, services, api, core） | 完整目录树 | 0.5h |
| 1.7 | 创建核心配置模块 (`config.py`) | 数据库连接信息、文件存储路径等 | 0.5h |
| 1.8 | 创建数据库连接模块 (`database.py`) | SQLAlchemy engine + session | 0.5h |
| 1.9 | 创建 FastAPI 主入口 (`main.py`) | 可启动的 API 服务 | 0.5h |
| 1.10 | 初始化前端布局组件（侧边菜单 + 顶栏 + 内容区） | `layouts/MainLayout.tsx` | 1h |

### 检查点
- [ ] `npm run dev` 能启动前端
- [ ] `uvicorn app.main:app --reload` 能启动后端
- [ ] 前端能通过代理访问后端 `/docs`
- [ ] 侧边菜单显示所有导航项

---

## 3. Phase 2 — 数据库实现

**目标**：完成数据库表创建和初始化数据

### 任务清单

| # | 任务 | 产出 | 预计工时 |
|---|------|------|----------|
| 2.1 | 编写所有 SQLAlchemy 模型（10张表） | `models/*.py` | 2h |
| 2.2 | 配置 Alembic 初始化 + 首次迁移 | `alembic/` + migration 文件 | 1h |
| 2.3 | 编写模型关联关系（relationship + back_populates） | 模型间双向关联 | 0.5h |
| 2.4 | 编写枚举定义（任务类型、状态等） | `models/enums.py` 或共用常量 | 0.5h |
| 2.5 | 编写初始化 SQL 脚本 | `database/init.sql` | 0.5h |
| 2.6 | 编写种子数据（示例用户、示例项目、示例样品） | `database/seed.sql` | 0.5h |

### 模型实现优先级

```
第一优先级（必须）：User → Task → Project → ShoeSample
第二优先级（核心）：Participant → BiomechanicalTestData → TestFile
第三优先级（辅助）：SampleTransaction → ProjectSample → ProjectParticipant
```

### 检查点
- [ ] `alembic upgrade head` 执行成功
- [ ] 数据库所有表创建成功
- [ ] 种子数据可正常插入
- [ ] 模型关联关系验证通过（ORM 可级联查询）

---

## 4. Phase 3 — 后端 API 开发

**目标**：为每个模块实现完整的 CRUD API

### 3.1 Pydantic Schemas（所有模块）

| # | Schema | 说明 | 预计工时 |
|---|--------|------|----------|
| 3.1.1 | TaskCreate / TaskUpdate / TaskResponse | 任务请求/响应 | 0.5h |
| 3.1.2 | ProjectCreate / ProjectUpdate / ProjectResponse | 项目请求/响应 | 0.5h |
| 3.1.3 | SampleCreate / SampleUpdate / SampleResponse | 样品请求/响应 | 0.5h |
| 3.1.4 | TransactionCreate / TransactionResponse | 流水请求/响应 | 0.5h |
| 3.1.5 | ParticipantCreate / ParticipantUpdate / ParticipantResponse | 受试者请求/响应 | 0.5h |
| 3.1.6 | TestDataCreate / TestDataUpdate / TestDataResponse | 测试数据请求/响应 | 0.5h |
| 3.1.7 | FileCreate / FileResponse | 文件请求/响应 | 0.5h |

### 3.2 API 路由清单

#### 3.2.1 Tasks API (`/api/tasks`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/tasks/today` | 今日任务 | 筛选 due_time 为今天 |
| GET | `/api/tasks/week` | 周计划 | 筛选本周任务，按天分组 |
| GET | `/api/tasks` | 任务列表 | 分页 + 按类型/优先级/状态筛选 |
| GET | `/api/tasks/:id` | 任务详情 | 单条任务 |
| POST | `/api/tasks` | 创建任务 | — |
| PUT | `/api/tasks/:id` | 更新任务 | — |
| DELETE | `/api/tasks/:id` | 删除任务 | — |
| PATCH | `/api/tasks/:id/status` | 修改状态 | 状态流转 |

#### 3.2.2 Projects API (`/api/projects`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/projects` | 项目列表 | 分页 + 按品牌/状态/负责人筛选 |
| GET | `/api/projects/current` | 当前项目 | 状态非"完成/归档"的最近5个 |
| GET | `/api/projects/:id` | 项目详情 | 含关联样品、受试者、文件 |
| POST | `/api/projects` | 创建项目 | — |
| PUT | `/api/projects/:id` | 更新项目 | — |
| DELETE | `/api/projects/:id` | 删除项目 | 级联删除关联数据 |
| PATCH | `/api/projects/:id/status` | 修改状态 | 状态流转 |
| POST | `/api/projects/:id/samples` | 关联样品 | 添加样品到项目 |
| DELETE | `/api/projects/:id/samples/:sampleId` | 移除样品 | 从项目移除样品 |
| POST | `/api/projects/:id/participants` | 关联受试者 | 添加受试者到项目 |
| DELETE | `/api/projects/:id/participants/:participantId` | 移除受试者 | 从项目移除受试者 |

#### 3.2.3 Samples API (`/api/samples`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/samples` | 样品列表 | 分页 + 按品牌/类型/状态筛选 |
| GET | `/api/samples/:id` | 样品详情 | 含交易流水 + 关联测试 |
| GET | `/api/samples/:id/transactions` | 样品流水 | 交易记录列表 |
| POST | `/api/samples` | 创建样品（入库） | 自动创建入库流水 |
| PUT | `/api/samples/:id` | 更新样品 | — |
| DELETE | `/api/samples/:id` | 删除样品 | — |
| POST | `/api/samples/:id/transactions` | 新增流水 | 领用/测试/归还/报废 |
| GET | `/api/samples/:id/test-data` | 关联测试数据 | 该样品参与的所有测试 |

#### 3.2.4 Participants API (`/api/participants`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/participants` | 受试者列表 | 分页 + 筛选 |
| GET | `/api/participants/:id` | 受试者详情 | 含参与项目 |
| POST | `/api/participants` | 创建受试者 | — |
| PUT | `/api/participants/:id` | 更新受试者 | — |
| DELETE | `/api/participants/:id` | 删除受试者 | — |

#### 3.2.5 Test Data API (`/api/test-data`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/test-data` | 数据列表 | 分页 + 按项目/样品/受试者/类型筛选 |
| GET | `/api/test-data/recent` | 近期数据 | 最近7天 |
| GET | `/api/test-data/:id` | 数据详情 | — |
| POST | `/api/test-data` | 创建数据 | — |
| PUT | `/api/test-data/:id` | 更新数据 | — |
| DELETE | `/api/test-data/:id` | 删除数据 | — |

#### 3.2.6 Files API (`/api/files`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/files` | 文件列表 | 分页 + 按项目/类型筛选 |
| GET | `/api/files/recent` | 最近上传 | 最近10条 |
| POST | `/api/files/upload` | 上传文件 | multipart/form-data |
| GET | `/api/files/:id` | 文件详情 | — |
| GET | `/api/files/:id/download` | 下载文件 | 返回文件流 |
| DELETE | `/api/files/:id` | 删除文件 | 同时删除存储文件 |

#### 3.2.7 Dashboard API (`/api/dashboard`)

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/dashboard` | 工作台数据聚合 | 今日任务 + 当前项目 + 近期实验 + 最近文件 |

### 3.3 Services 层

每个模块的 API 路由委托给对应的 Service 层处理业务逻辑：

```
api/tasks.py          →  task_service.py
api/projects.py       →  project_service.py
api/samples.py        →  sample_service.py (含 transaction 逻辑)
api/participants.py   →  participant_service.py
api/test_data.py      →  test_data_service.py
api/files.py          →  file_service.py (含文件存储操作)
```

### 检查点
- [ ] 所有 API 端点可通过 FastAPI Swagger UI 调试
- [ ] CRUD 操作正常（增删改查）
- [ ] 分页参数正常工作
- [ ] 筛选条件有效
- [ ] 文件上传/下载正常

---

## 5. Phase 4 — 前端页面开发

**目标**：完成所有页面的 UI 和交互逻辑

### 4.1 通用基础设施

| # | 任务 | 文件 | 预计工时 |
|---|------|------|----------|
| 4.1.1 | API 客户端封装（Axios 实例 + 拦截器） | `api/client.ts` | 0.5h |
| 4.1.2 | 各模块 API 函数 | `api/tasks.ts`, `api/projects.ts` 等 | 1h |
| 4.1.3 | TypeScript 类型定义 | `types/*.ts` | 1h |
| 4.1.4 | 通用组件：PageHeader、ConfirmModal | `components/` | 0.5h |
| 4.1.5 | 路由配置 | `App.tsx` | 0.5h |
| 4.1.6 | 布局组件完善（菜单高亮、面包屑） | `layouts/MainLayout.tsx` | 0.5h |

### 4.2 页面开发清单

#### Dashboard（首页工作台）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.1 | 今日任务卡片 | 展示今日任务列表（带优先级标识） | 1h |
| 4.2.2 | 当前项目卡片 | 最近5个活动项目卡片 | 0.5h |
| 4.2.3 | 近期实验表格 | 最近7天测试数据列表 | 0.5h |
| 4.2.4 | 最近上传文件表格 | 最近10条文件记录 | 0.5h |

#### Tasks（Todo任务管理）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.5 | 任务列表页（表格） | 分页、筛选、排序 | 1.5h |
| 4.2.6 | 创建/编辑任务弹窗 | 表单 + 校验 | 1h |
| 4.2.7 | 任务状态标签 | 带颜色的状态显示 | 0.5h |
| 4.2.8 | 今日任务视图 Tab | — | 0.5h |
| 4.2.9 | 周计划视图 Tab | 按周显示的 Gantt 风格视图 | 1h |

#### Projects（测试项目管理）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.10 | 项目列表页（表格） | 分页、高级筛选 | 1.5h |
| 4.2.11 | 创建/编辑项目表单 | 含设备/事件/环境的多选 | 1h |
| 4.2.12 | 项目详情页 | 基本信息 + 关联数据 Tab 页 | 2h |
| 4.2.13 | 关联样品/受试者子页面 | 在详情内展示和操作关联 | 1h |
| 4.2.14 | 状态流转按钮 | 根据当前状态显示可操作按钮 | 0.5h |

#### Samples（鞋样管理）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.15 | 样品列表页（表格） | 分页、筛选 | 1.5h |
| 4.2.16 | 创建/编辑样品表单 | — | 1h |
| 4.2.17 | 样品详情页 | 基本信息 + 流水 + 关联测试 | 2h |
| 4.2.18 | 库存流水表格 | 交易时间线展示 | 1h |
| 4.2.19 | 操作按钮（入库/领用/归还/报废） | 状态感知操作 | 0.5h |

#### Participants（受试者管理）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.20 | 受试者列表页（表格） | 分页、筛选 | 1h |
| 4.2.21 | 创建/编辑受试者表单 | — | 0.5h |
| 4.2.22 | 受试者详情页 | 基本信息 + 参与项目列表 | 1h |

#### Test Data（测试数据库）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.23 | 测试数据列表页（表格） | 分页 + 多条件筛选 | 1.5h |
| 4.2.24 | 创建测试数据表单 | 根据测试类型显示不同字段 | 2h |
| 4.2.25 | 测试数据详情页 | 展示所有测试参数 | 1.5h |
| 4.2.26 | 测试类型 Tab 切换 | 足底压力 / 力台 / 动捕 | 1h |

#### Files（文件中心）

| # | 组件 | 说明 | 预计工时 |
|---|------|------|----------|
| 4.2.27 | 文件列表页（表格） | 分页 + 筛选 | 1h |
| 4.2.28 | 文件上传弹窗 | 支持多文件 + 拖拽上传 | 1.5h |
| 4.2.29 | 文件预览（图片/视频） | 内嵌预览 | 1h |
| 4.2.30 | 文件下载按钮 | — | 0.5h |

### 检查点
- [ ] 所有页面可正常渲染
- [ ] 菜单导航正常
- [ ] CRUD 操作正常
- [ ] 表单校验有效
- [ ] 分页组件工作正常
- [ ] 状态切换交互正常

---

## 6. Phase 5 — 文件管理实现

**目标**：完成文件上传、存储、预览的全链路

### 任务清单

| # | 任务 | 说明 | 预计工时 |
|---|------|------|----------|
| 5.1 | 后端文件上传接口 | 接收 file、按项目目录存储、写入 DB | 1h |
| 5.2 | 后端文件下载/预览接口 | 返回文件流或静态文件链接 | 0.5h |
| 5.3 | 后端文件删除接口 | 删除 DB 记录 + 删除存储文件 | 0.5h |
| 5.4 | 前端文件上传组件 | Ant Design Upload + 拖拽支持 | 1h |
| 5.5 | 前端文件预览组件 | 图片预览、视频播放 | 1h |
| 5.6 | 存储目录结构创建 | 项目目录自动创建 | 0.5h |

### 存储路径生成逻辑

```python
def generate_storage_path(project_no: str, file_type: str, file_name: str) -> str:
    type_map = {
        "图片": "Sample_Image",
        "视频": "Video",
        "压力图": "Pressure_Data",
        "运动捕捉视频": "Motion_Capture_Data",
        "Excel": "Pressure_Data",
        "CSV": "Pressure_Data",
        "MAT文件": "Force_Plate_Data",
        "PPT": "Report",
        "PDF": "Report",
    }
    sub_dir = type_map.get(file_type, "Other")
    return f"{project_no}/{sub_dir}/{file_name}"
```

### 检查点
- [ ] 文件可上传并正确存储到对应目录
- [ ] 文件记录写入 test_files 表
- [ ] 图片/视频可在线预览
- [ ] 文件可下载
- [ ] 删除文件时同步清理存储

---

## 7. Phase 6 — 集成测试与上线

**目标**：全面测试后投入内部使用

### 任务清单

| # | 任务 | 说明 | 预计工时 |
|---|------|------|----------|
| 6.1 | API 集成测试 | 使用 FastAPI TestClient 测试所有接口 | 2h |
| 6.2 | 前后端联调 | 测试完整业务流程 | 2h |
| 6.3 | 边界情况测试 | 空列表、大文件、异常输入 | 1h |
| 6.4 | 数据完整性验证 | 级联删除、外键约束 | 0.5h |
| 6.5 | 前端响应式测试 | 不同分辨率 | 0.5h |
| 6.6 | 编写 README | 项目说明 + 启动方式 | 1h |
| 6.7 | Docker Compose 配置 | PostgreSQL + Backend + Frontend | 1h |

### 核心测试用例

#### 业务流测试
1. 创建用户 → 创建任务 → 关联项目
2. 创建项目 → 录入样品 → 关联受试者
3. 项目 → 样品领用 (transaction) → 执行测试
4. 测试录入数据（三种类型） → 上传相关文件
5. 测试完成后 → 归档文件 → 项目归档

#### 数据完整性测试
1. 删除项目 → 关联测试数据级联删除
2. 删除样品 → 关联流水级联删除，测试数据置空
3. 样品状态变更 → 自动触发对应的交易流水
4. 文件删除 → 存储路径文件同时删除

---

## 8. 项目里程碑

| 里程碑 | 时间 | 交付物 | 验收标准 |
|--------|------|--------|----------|
| M1 架构就绪 | Day 1 | 架构文档 + 数据库设计 | 架构评审通过 |
| M2 脚手架就绪 | Day 2 | 可运行前后端项目 | `npm run dev` + `uvicorn` 可启动 |
| M3 数据库就绪 | Day 3 | 所有表创建 + 种子数据 | `alembic upgrade head` 成功 |
| M4 后端完成 | Day 5 | 全部 API 可调用 | Swagger UI 测试通过 |
| M5 前端完成 | Day 9 | 全部页面可操作 | UI 走查通过 |
| M6 MVP 上线 | Day 11 | 完整可用系统 | 端到端业务流程跑通 |

---

## 9. 风险与应对

| 风险 | 影响 | 概率 | 应对方案 |
|------|------|------|----------|
| PostgreSQL 未安装 | 阻碍数据库开发 | 中 | 使用 SQLite 作为 MVP 替代，后期迁移 |
| 前端/后端版本兼容问题 | 阻碍开发 | 低 | 锁定版本号（package.json + requirements.txt）|
| 文件上传大小限制 | 大文件上传失败 | 中 | 配置 FastAPI max_file_size |
| 测试数据录入复杂 | 输入效率低 | 中 | 在 JSONB 字段基础上提供模板表单 |
| 业务需求变更 | 返工 | 中 | 架构预留扩展点，避免硬编码 |
