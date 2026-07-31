# 系统架构设计文档

## 高跟鞋生物力学测试研发工作台 MVP

---

## 1. 系统架构总览

本系统采用前后端分离的 **三层架构**（表现层 / 业务逻辑层 / 数据持久层），辅以独立的对象存储层用于文件管理。

```
┌─────────────────────────────────────────────────────────────────┐
│                    表现层 (Presentation Layer)                     │
│                                                                   │
│  React 18 + TypeScript + Ant Design 5                            │
│                                                                   │
│  ┌─────────────┬──────────────┬──────────────┬─────────────────┐ │
│  │ 首页工作台   │ Todo任务管理  │ 测试项目管理  │ 鞋样管理        │ │
│  ├─────────────┼──────────────┼──────────────┼─────────────────┤ │
│  │ 受试者管理   │ 测试数据库   │ 文件中心      │                 │ │
│  └─────────────┴──────────────┴──────────────┴─────────────────┘ │
│                                                                   │
│  React Router v6 (前端路由)                                       │
│  Axios (HTTP 客户端)                                              │
│  dayjs / react-beautiful-dnd (辅助库)                             │
└──────────────────────┬────────────────────────────────────────────┘
                       │ RESTful API (JSON)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  业务逻辑层 (Business Logic Layer)                │
│                                                                   │
│  Python 3.11+ / FastAPI                                           │
│                                                                   │
│  ┌─────────────┬──────────────┬──────────────┬─────────────────┐ │
│  │ tasks       │ projects     │ samples      │ participants    │ │
│  ├─────────────┼──────────────┼──────────────┼─────────────────┤ │
│  │ test_data   │ files        │ dashboard    │                 │ │
│  └─────────────┴──────────────┴──────────────┴─────────────────┘ │
│                                                                   │
│  SQLAlchemy 2.0 (ORM)                                             │
│  Alembic (数据库迁移)                                             │
│  Pydantic v2 (数据校验 / Schema)                                  │
│  python-multipart (文件上传)                                       │
└──────────────────────┬────────────────────────────────────────────┘
                       │ SQLAlchemy ORM / File I/O
                       ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│  数据持久层 (Data Layer)      │   │  对象存储层 (Storage Layer)   │
│                              │   │                              │
│  PostgreSQL 15               │   │  storage/                    │
│                              │   │  ├── projects/               │
│  数据库: biomechanics_lab    │   │  │   ├── {project_no}/       │
│                              │   │  │   │   ├── Sample_Image/   │
│  核心表 (8个):               │   │  │   │   ├── Pressure_Data/  │
│  ┌──────────────────────┐    │   │  │   │   ├── Force_Plate/    │
│  │ users                │    │   │  │   │   ├── Motion_Capture/ │
│  │ tasks                │    │   │  │   │   ├── Video/          │
│  │ projects             │    │   │  │   │   └── Report/         │
│  │ shoe_samples         │    │   │  │   └── ...                 │
│  │ sample_transactions  │    │   │  └── temp/                   │
│  │ participants         │    │   │                              │
│  │ biomechanical_data   │    │   └──────────────────────────────┘
│  │ test_files           │    │
│  └──────────────────────┘    │
│                              │
│  + 关联表 (project_sample,   │
│    project_participant)      │
└──────────────────────────────┘
```

---

## 2. 技术栈明细

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | React | 18.x | UI 组件化开发 |
| 前端语言 | TypeScript | 5.x | 类型安全 |
| UI 库 | Ant Design | 5.x | 企业级组件库 |
| 前端路由 | React Router | 6.x | SPA 路由 |
| HTTP 客户端 | Axios | 1.x | API 调用 |
| 日期处理 | dayjs | 1.x | 时间显示/计算 |
| 状态管理 | React Context + useReducer | — | 轻量级状态管理 |
| 后端框架 | FastAPI | 0.110+ | 异步 API 框架 |
| 后端语言 | Python | 3.11+ | 科学计算生态 |
| ORM | SQLAlchemy | 2.0+ | 数据库映射 |
| 数据库迁移 | Alembic | 1.13+ | Schema 版本管理 |
| 数据校验 | Pydantic | 2.x | 请求/响应校验 |
| 数据库 | PostgreSQL | 15+ | 关系型数据库 |
| 数据分析预留 | pandas + numpy | — | 后续分析接口 |

---

## 3. 模块划分与职责

### 3.1 首页工作台 (Dashboard)

- **今日任务**：按截止日期筛选今天的未完成任务，显示任务名称、优先级、预计耗时
- **当前测试项目**：显示状态不为"完成"或"归档"的项目卡片列表（最近5个）
- **近期实验**：最近7天的测试数据上传记录
- **最近上传文件**：最近10条文件上传记录

### 3.2 Todo任务管理 (Task)

- **今日任务视图**：筛选截止日期为今天的任务
- **周计划视图**：按周分组展示任务
- **完整任务列表**：支持按类型、优先级、状态筛选
- **任务 CRUD**：创建 / 编辑 / 删除 / 状态流转
- **状态流转**：未开始→ 进行中 → 完成 / 延期

### 3.3 测试项目管理 (Project)

- **项目列表**：表格展示 + 高级筛选（品牌、状态、负责人）
- **项目详情**：展示项目基本信息 + 关联的样品、受试者、测试数据、文件
- **项目 CRUD**：创建 / 编辑 / 删除
- **状态流转**：待准备 → 样品确认 → 测试进行 → 数据处理中 → 报告整理 → 完成 → 归档

### 3.4 鞋样管理 (Sample)

- **样品列表**：表格展示 + 筛选（品牌、类型、状态）
- **样品详情**：基本信息 + 交易流水 + 关联测试
- **样品 CRUD**：入库 / 编辑 / 出库
- **库存流水**：每笔出入库操作自动记录
- **查询**：某双鞋做了哪些测试、时间、结果

### 3.5 受试者管理 (Participant)

- **受试者列表**：表格展示 + 筛选（性别、年龄段）
- **受试者 CRUD**：创建 / 编辑 / 删除
- **参与项目**：查看受试者参与的所有测试项目
- **隐私保护**：不存储姓名、身份证号等个人身份信息

### 3.6 测试数据库管理 (Test Data)

- **数据列表**：按项目、样品、受试者、测试类型筛选
- **数据录入**：支持三种测试类型（足底压力 / 三维力台 / 动态捕捉）
- **数据详情**：展示专业测试参数
- **预留接口**：后续通过 pandas 读取原始数据文件进行分析

### 3.7 文件中心 (File Center)

- **文件列表**：按项目、类型、日期筛选
- **文件上传**：支持多文件上传，自动存入对应项目目录
- **文件预览**：图片类直接预览，视频类提供播放链接
- **目录结构**：按 `storage/{project_no}/{type}/` 组织

---

## 4. 数据流设计

### 4.1 核心业务流

```
User 创建 Task
  │
  ▼
Task 关联到 Project（可选）
  │
  ▼
Project 录入 Shoe Sample（样品）
  ├── Sample 有库存状态和交易流水
  │
  ├── Project 关联 Participant（受试者）
  │
  ├── Project + Sample + Participant → 生成 Test Data
  │     └── Test Data 包含三种测试类型的参数
  │
  └── Project 产生 Test File（归档）
        └── 文件存储在 storage/{project_no}/ 目录下
```

### 4.2 API 数据流

```
Browser                          FastAPI                        PostgreSQL
  │                                │                               │
  │── GET /api/tasks/today ────────│── SELECT ... WHERE date=today │
  │◄── JSON [{...}] ──────────────│◄── rows ──────────────────────│
  │                                │                               │
  │── POST /api/projects ─────────│── INSERT INTO project ────────│
  │── JSON {project data} ────────│── RETURNING id ───────────────│
  │◄── JSON {id, ...} ───────────│◄── result ────────────────────│
  │                                │                               │
  │── POST /api/files/upload ─────│── save file to storage/ ──────│
  │── multipart/form-data ────────│── INSERT INTO test_file ──────│
  │◄── JSON {file_id, path} ─────│◄── result ────────────────────│
  │                                │                               │
```

---

## 5. 项目目录结构

```
heel-biomechanics-lab/
├── frontend/                     # React 前端
│   ├── public/
│   ├── src/
│   │   ├── api/                  # API 接口封装 (Axios)
│   │   ├── components/           # 通用组件
│   │   ├── pages/                # 页面组件
│   │   │   ├── Dashboard/        # 首页工作台
│   │   │   ├── Tasks/            # Todo任务
│   │   │   ├── Projects/         # 测试项目
│   │   │   ├── Samples/          # 鞋样管理
│   │   │   ├── Participants/     # 受试者管理
│   │   │   ├── TestData/         # 测试数据库
│   │   │   └── Files/            # 文件中心
│   │   ├── layouts/              # 布局组件
│   │   ├── hooks/                # 自定义 Hooks
│   │   ├── types/                # TypeScript 类型定义
│   │   ├── utils/                # 工具函数
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                      # Python FastAPI 后端
│   ├── app/
│   │   ├── api/                  # 路由层 (controllers)
│   │   │   ├── __init__.py
│   │   │   ├── tasks.py
│   │   │   ├── projects.py
│   │   │   ├── samples.py
│   │   │   ├── participants.py
│   │   │   ├── test_data.py
│   │   │   └── files.py
│   │   ├── models/               # SQLAlchemy 模型
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── project.py
│   │   │   ├── shoe_sample.py
│   │   │   ├── sample_transaction.py
│   │   │   ├── participant.py
│   │   │   ├── biomechanical_data.py
│   │   │   └── test_file.py
│   │   ├── schemas/              # Pydantic 数据校验
│   │   │   ├── __init__.py
│   │   │   ├── task.py
│   │   │   ├── project.py
│   │   │   ├── sample.py
│   │   │   ├── participant.py
│   │   │   ├── test_data.py
│   │   │   └── file.py
│   │   ├── services/             # 业务逻辑层
│   │   │   ├── __init__.py
│   │   │   ├── task_service.py
│   │   │   ├── project_service.py
│   │   │   ├── sample_service.py
│   │   │   ├── participant_service.py
│   │   │   ├── test_data_service.py
│   │   │   └── file_service.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py         # 配置
│   │   │   ├── database.py       # 数据库连接
│   │   │   └── dependencies.py   # 依赖注入
│   │   └── main.py               # FastAPI 入口
│   ├── alembic/                  # 数据库迁移
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/                     # 数据库相关
│   ├── init.sql                  # 初始化 DDL
│   └── seed.sql                  # 测试种子数据
│
├── storage/                      # 文件存储根目录
│   └── .gitkeep
│
├── docs/                         # 文档
│   ├── 01-system-architecture.md
│   ├── 02-database-design.md
│   └── 03-mvp-development-plan.md
│
└── README.md
```

---

## 6. 架构决策记录

### ADR-1: 不使用状态管理库
- **决策**：使用 React Context + useReducer，不使用 Redux / Zustand
- **理由**：MVP 阶段数据流简单，无需引入额外依赖；后期可无缝迁移

### ADR-2: 文件存储选型
- **决策**：初始使用本地文件系统，目录按项目编号组织
- **理由**：MVP 阶段无高并发需求；目录结构已为后续迁移到对象存储（MinIO / S3）做好准备

### ADR-3: 不引入消息队列
- **决策**：所有操作同步完成
- **理由**：MVP 阶段无异步任务；文件上传直接同步写入存储

### ADR-4: 数据库字段命名
- **决策**：使用 `snake_case`（Python 生态规范）
- **理由**：SQLAlchemy 原生支持 snake_case，前后端转换由 API 层处理

### ADR-5: 预留分析接口
- **决策**：不开发分析功能，但在 biomechanical_data 表中预留 JSON 字段存储原始处理参数
- **理由**：保证数据库结构可扩展，未来通过 pandas 读取数据进行分析
