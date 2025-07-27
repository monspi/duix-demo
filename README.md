# Duix Demo

一个展示 `duix-guiji-light` npm 包功能的前后端 HTML5 项目。

## 项目概述

这个项目包含：
- **前端**：基于 Vite 的现代 HTML5 应用
- **后端**：Node.js Express 服务器
- **核心功能**：集成 duix-guiji-light 包进行演示

## 快速开始

### 前提条件
- Node.js 16.x 或更高版本
- npm 或 yarn
- Duix 账号和应用凭证（appId, appKey）

### 配置 Duix 凭证
1. 复制配置模板
   ```bash
   copy server\config\config.example.json server\config\config.json
   ```
2. 编辑 `server\config\config.json` 文件
3. 将 `your_app_id_here` 替换为你的 Duix AppId
4. 将 `your_app_key_here` 替换为你的 Duix AppKey
5. 详细配置说明请参考 [CONFIG.md](./CONFIG.md)

⚠️ **安全提醒**: 配置文件现在位于 `server/config/` 目录下，前端无法访问

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

## 项目结构

```
duix-demo/
├── public/                 # 前端公共资源目录
│   └── vite.svg           # 图标文件
├── index.html             # 主 HTML 文件
├── main.js                # 前端主入口
├── style.css              # 样式文件
├── vite.config.js         # Vite 配置（包含安全限制）⭐
├── CONFIG.md              # 配置说明文档
├── .gitignore             # Git 忽略文件 ⭐
├── server/                # 后端目录（前端无法访问）🔒
│   ├── app.js             # 后端服务器
│   └── config/            # 配置文件目录（高安全性）🔒
│       ├── config.example.json # 配置模板
│       └── config.json    # 实际配置（不提交到Git）⚠️
├── package.json           # 项目配置
└── README.md             # 项目说明
```

## API 接口

### 测试接口
- `GET /api/test` - 测试后端服务状态
- `GET /api/duix/config` - 获取 Duix 配置
- `POST /api/duix/action` - 执行 Duix 动作

## 功能特性

- ✅ 现代 ES6+ JavaScript
- ✅ Vite 快速开发体验
- ✅ Express.js 后端 API
- ✅ CORS 跨域支持
- ✅ **Duix Guiji Light 完整集成**
  - 语音识别 (ASR)
  - 智能对话会话
  - 事件监听机制
  - 动态签名获取
- ✅ 开发/生产环境配置
- ✅ **安全配置管理**
  - 配置文件位于 `server/config/` 目录，前端无法访问 🔒
  - Vite 配置严格限制文件访问 🔒
  - Git 忽略敏感文件
  - 配置文件模板机制
  - API 接口安全过滤

## Duix 使用说明

### 主要功能
1. **初始化 Duix** - 从后端获取配置和签名
2. **开始会话** - 启动语音识别和智能对话
3. **停止会话** - 结束当前对话会话
4. **实时状态** - 显示当前操作状态

### API 接口
- `GET /api/duix/config` - 获取非敏感的 Duix 配置信息 🔒
- `POST /api/duix/sign` - 获取 JWT 访问签名（官方标准）🔒
- `POST /api/duix/verify-token` - 验证 JWT Token 有效性 🔒
- `GET /api/config/status` - 检查配置状态（无敏感信息） 🔒
- `GET /api/test` - 测试后端服务状态
- `POST /api/duix/action` - 执行 Duix 动作

🔒 = 不暴露敏感配置信息

### 事件监听
- `initialSuccess` - 初始化成功
- `sessionStart` - 会话开始
- `sessionEnd` - 会话结束
- `asrResult` - 语音识别结果
- `error` - 错误处理

### JWT Token 管理
- 使用官方标准的 JWT (JSON Web Token) 签名机制
- 默认有效期 30 分钟（1800 秒）
- 支持 Token 验证和过期检测
- 符合 Duix 官方 API 规范

## 开发说明

1. 前端使用 Vite 作为构建工具，支持热重载
2. 后端提供 RESTful API 接口
3. 项目使用 ES modules (type: "module")
4. 支持并发开发模式

## 故障排除

如果遇到问题：
1. 确保 Node.js 版本 >= 16
2. 删除 `node_modules` 并重新 `npm install`
3. 检查端口 3000 和 5173 是否被占用
4. 查看控制台错误信息

## 贡献

欢迎提交 Issue 和 Pull Request！
