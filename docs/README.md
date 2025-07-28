# 📚 Duix Demo 文档索引

## 📋 项目特性

- 🎭 **数字人全屏显示** - 支持绿幕背景自动去除
- 🎬 **m3u8 直播流背景** - 智能背景图片备用机制
- 🗣️ **实时语音对话** - 语音识别和数字人响应
- ⚙️ **精简配置系统** - 前后端配置分离，只保留必需配置项
- 🛡️ **安全性优化** - 配置文件隔离，敏感信息保护

## 目录结构

```
docs/
├── README.md               # 📚 文档索引 (本文件)
├── CHANGELOG.md            # 📝 项目变更记录
├── quick-start.md          # 🚀 快速开始指南
├── frontend-config.md      # 🖥️ 前端配置文档
├── backend-config.md       # 🔧 后端配置文档
├── config-examples.md      # 📋 配置示例
└── background-fallback.md  # 🎨 背景图片功能
```

## 📖 文档说明

### [🚀 快速开始指南](./quick-start.md)
- 简化的配置方案
- 基本使用流程
- 常见场景配置
- 调试技巧

**适合**: 首次使用者、快速上手

### [🖥️ 前端配置文档](./frontend-config.md)
- **精简的前端配置** - 只保留实际使用的6个配置项
- 数字人直播间配置说明
- 直播流和背景配置
- 自动初始化设置

**适合**: 前端开发者、界面定制

### [🔧 后端配置文档](./backend-config.md)
- **精简的后端配置** - 只保留核心的6个配置项
- Duix API 凭证配置
- CORS 和服务器设置
- 安全配置选项

**适合**: 后端开发者、部署运维

### [📋 配置示例](./config-examples.md)
- **v1.1.0 精简配置示例** - 适配新的配置结构
- 前后端配置对比
- 不同环境的配置示例
- 配置项详细说明

**适合**: 所有用户参考

### [🎨 背景图片功能](./background-fallback.md)
- 背景图片备用机制
- 触发条件和测试方法
- 图片要求和优化
- 故障排除指南

**适合**: 需要自定义背景的用户

## 🔗 快速导航

| 我想要... | 推荐文档 |
|-----------|----------|
| 快速上手项目 | [quick-start.md](./quick-start.md) |
| 配置直播流 | [frontend-config.md](./frontend-config.md) |
| 配置 Duix 服务 | [backend-config.md](./backend-config.md) |
| 查看配置示例 | [config-examples.md](./config-examples.md) |
| 设置背景图片 | [background-fallback.md](./background-fallback.md) |
| 部署到生产环境 | [backend-config.md](./backend-config.md) + [quick-start.md](./quick-start.md) |

## 💡 使用建议

1. **新用户**: 从 [quick-start.md](./quick-start.md) 开始
2. **配置问题**: 参考 [config-examples.md](./config-examples.md) 的精简示例
3. **定制需求**: 查看对应的配置文档
4. **升级到 v1.1.0**: 查看 [CHANGELOG.md](./CHANGELOG.md) 了解配置变更

## 🆕 v1.1.0 配置精简

**前端配置** (只需6个配置项):
- `backend.baseUrl` - 后端地址
- `livestream.*` - 直播流配置 (4项)
- `ui.autoInit` - 自动初始化

**后端配置** (只需6个配置项):
- `duix.*` - Duix凭证和会话配置 (3项)
- `duix.security.allowedOrigins` - CORS设置
- `server.*` - 服务器配置 (2项)

## 🔄 文档更新

文档会随着项目功能更新，如果发现内容过时或有疑问，请：
1. 查看项目 [README.md](../README.md)
2. 查看 [CHANGELOG.md](./CHANGELOG.md) 了解最新变更
3. 提交 Issue 反馈
4. 贡献文档改进

---
*最后更新: 2025年7月28日 - v1.1.0 配置精简版*
