# Duix Demo

一个展示 `duix-guiji-light` npm 包功能的前后端 HTML5 项目。

## 项目概述

这个项目包含：
- **前端**：基于 Vite 的现代 HTML5 应用
- **后端**：Node.js Express 服务器
- **核心功能**：集成 duix-guiji-light 包进行演示

### ✨ 主要特性
- 🎭 数字人全屏显示
- 🎬 支持 m3u8 直播流背景
- 🖼️ 智能背景图片备用机制  
- 🗣️ 实时语音识别和对话
- 🎨 绿幕背景自动去除
- ⚙️ 灵活的前后端配置
- 📱 响应式界面设计

## 快速开始

### 前提条件
- Node.js 16.x 或更高版本
- npm 或 yarn
- Duix 账号和应用凭证（appId, appKey）

## 快速开始

### 前提条件
- Node.js 16.x 或更高版本
- npm 或 yarn
- Duix 账号和应用凭证（appId, appKey）

### 1. 配置后端服务
1. 复制后端配置模板
   ```bash
   copy server\config\config.example.json server\config\config.json
   ```
2. 编辑 `server\config\config.json` 文件
3. 将 `your_app_id_here` 替换为你的 Duix AppId
4. 将 `your_app_key_here` 替换为你的 Duix AppKey

### 2. 配置前端应用
1. 复制前端配置模板
   ```bash
   copy frontend.config.example.json frontend.config.json
   ```
2. 根据需要编辑 `frontend.config.json` 文件：
   - 修改后端地址（如果后端不在默认端口）
   - 配置直播流地址（可选）
   - 设置背景图片路径

### 3. 配置说明
- **后端配置**: 详见 [后端配置文档](./docs/backend-config.md)
- **前端配置**: 详见 [前端配置文档](./docs/frontend-config.md)

⚠️ **安全提醒**: 
- 后端配置文件位于 `server/config/` 目录下，前端无法访问
- 前端配置文件已加入 `.gitignore`，不会提交到版本控制

### 安装依赖
```bash
npm install
```

### 开发模式（同时启动前后端）
```bash
npm start
```

这会同时启动：
- 前端开发服务器：http://localhost:5173
- 后端 API 服务器：http://localhost:3000

### 单独启动服务

**仅启动前端：**
```bash
npm run dev
```

**仅启动后端：**
```bash
npm run server
```

**构建生产版本：**
```bash
npm run build
```

## 故障排除

如果遇到问题：
1. 确保 Node.js 版本 >= 16
2. 删除 `node_modules` 并重新 `npm install`
3. 检查端口 3000 和 5173 是否被占用
4. 查看控制台错误信息

## 📚 文档

- [快速开始指南](./docs/quick-start.md) - 简化的配置方案和使用指南
- [前端配置文档](./docs/frontend-config.md) - 数字人直播间前端配置说明
- [后端配置文档](./docs/backend-config.md) - Duix 后端服务配置说明
- [配置示例](./docs/config-examples.md) - 各种场景的配置示例
- [背景图片功能](./docs/background-fallback.md) - 背景图片备用功能说明

## 贡献

欢迎提交 Issue 和 Pull Request！
