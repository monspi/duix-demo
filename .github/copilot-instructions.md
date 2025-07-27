<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Duix Demo 项目说明

这是一个使用 duix-guiji-light npm 包的前后端演示项目。

## 项目结构
- 前端：基于 Vite 的 HTML5 应用，集成 duix-guiji-light
- 后端：Node.js Express 服务器，提供 API 支持

## 开发注意事项
- 前端使用现代 ES6+ 语法
- 后端使用 Express.js 框架
- 确保 duix-guiji-light 包的正确使用和配置
- API 路由都以 `/api` 开头
- 支持 CORS 跨域请求

## 依赖包说明
- `duix-guiji-light`: 核心功能包
- `vite`: 前端构建工具
- `express`: 后端服务框架
- `concurrently`: 同时运行前后端服务
