# 高跟鞋人体生物力学实验管理与分析平台

生物力学测试研发工作台：管理测试项目、鞋样、受试者、设备、指标库，支持基础统计分析和报告生成。

## 正式网址

部署完成后将在此处更新正式 HTTPS 地址。

## 使用的平台

| 项目 | 当前方案 |
|------|----------|
| 托管平台 | GitHub Pages（免费） |
| 构建工具 | Vite 8 + React 19 |
| 数据存储 | 浏览器 localStorage（单设备） |
| CI/CD | GitHub Actions 自动部署 |

## 部署架构

纯静态网站。前端构建产物部署到 GitHub Pages / Cloudflare Pages / Vercel Hobby 等任意静态托管平台。无后端服务器、无数据库服务、无自动计费。

## 免费方案限制

- GitHub Pages：免费，公共仓库，100GB/月带宽，站点大小上限 1GB。
- localStorage：单浏览器单设备存储，约 5-10MB 上限；清浏览器数据会丢失，请定期导出备份。
- 无账号系统：所有数据仅存本地浏览器。
- 无多设备同步：换设备需手动导出/导入备份。

## 数据保存位置

所有数据保存在浏览器 localStorage（键名前缀 `biolab_v1_`），刷新或重启浏览器后仍然存在。

## 数据备份与恢复

访问页面中的「数据备份」模块：

1. 点击「导出全部数据」下载 JSON 备份文件。
2. 需要恢复时点击「导入备份」选择 JSON 文件。
3. 导入后刷新页面。

## 本地运行

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173

## 构建

```bash
cd frontend
npm run build
```

产物在 `frontend/dist/`。

## 如何更新网站

1. 修改 `frontend/src/` 中的代码。
2. 本地验证：`npm run dev`
3. 提交并推送：
   ```bash
   git add .
   git commit -m "更新说明"
   git push origin main
   ```
4. GitHub Actions 自动构建并部署，约 1-2 分钟后正式网址更新。

## 如何重新部署

- 推送代码自动触发部署。
- 也可以到 GitHub 仓库的 Actions 页面手动运行 `Deploy to GitHub Pages`。

## 如何更换部署平台

项目是纯静态 React 应用，构建产物 `frontend/dist/` 可直接上传到任何静态托管平台：

- **Cloudflare Pages**：构建命令 `cd frontend && npm run build`，输出目录 `frontend/dist`。
- **Vercel Hobby**：框架 Vite，构建命令 `cd frontend && npm run build`，输出目录 `frontend/dist`。
- **Netlify**：同上。

## 哪些功能无法保证免费

- 如果未来接入 OpenAI API 或 AI 分析，API 调用本身会产生费用，需单独确认。
- 本版本未接入任何付费 API。
- 如果未来需要多设备云同步，需要免费额度的云数据库（如 Cloudflare D1/KV），其免费额度可能变化。

## 免费套餐变化后的迁移方法

- GitHub Pages 免费额度变化时：将 `frontend/dist/` 部署到 Cloudflare Pages 或 Vercel Hobby（同样免费）。
- localStorage 容量不足时：先导出备份，改用 IndexedDB 存储（本项目代码预留了 `backupStore` 接口）。

## 本地开发说明

本项目保留了原 FastAPI 后端代码在 `backend/` 目录中，用于本地完整功能开发。部署到公网的版本不依赖后端，所有页面通过浏览器 localStorage 工作。
