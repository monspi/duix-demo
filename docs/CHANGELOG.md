# 📝 项目变更记录

## v1.1.0 - 配置系统精简 (2025年7月28日)

### 🔧 配置系统优化
- **精简前端配置**: 移除未使用的配置项
  - 删除 `backend.httpsUrl` (未使用)
  - 删除 `ui.hideLoadingAfterInit` (未使用) 
  - 删除 `ui.chatPosition` (未使用)
- **精简后端配置**: 移除冗余配置项
  - 删除 `duix.environment` (未使用)
  - 删除 `duix.apiBaseUrl` (未使用)
  - 删除 `duix.config.*` 整个对象 (未使用)
  - 删除 `duix.security.signatureExpiration` (代码中使用固定值)
  - 删除 `duix.security.enableConfigAPI` (未使用)
  - 删除 `duix.security.logSensitiveInfo` (未使用)
  - 删除 `server.https.*` 整个对象 (未使用)
  - 删除 `logging.*` 整个对象 (未使用)

### 📄 文档更新
- 更新 `config-examples.md` 配置示例
- 简化 `backend-config.md` 后端配置说明
- 简化 `frontend-config.md` 前端配置说明
- 移除过时的配置项说明

### ✅ 保留的核心配置
**前端配置 (frontend.config.json)**:
- `backend.baseUrl` - 后端API地址
- `livestream.defaultStreamUrl` - 直播流地址
- `livestream.autoPlay` - 自动播放
- `livestream.enableHLS` - HLS功能
- `livestream.fallbackBackgroundImage` - 背景图片
- `ui.autoInit` - 自动初始化

**后端配置 (server/config/config.json)**:
- `duix.appId` - Duix应用ID
- `duix.appKey` - Duix应用密钥
- `duix.conversationId` - 对话会话ID
- `duix.security.allowedOrigins` - CORS设置
- `server.port` - 服务器端口
- `server.cors.credentials` - CORS认证

### 🎯 优化效果
- 配置文件体积减少 ~60%
- 降低用户配置复杂度
- 提高维护效率
- 减少配置错误可能性

---

## v1.0.0 - 文档重构 (2025年7月27日)
- 整理项目文档结构
- 使用更清晰的文件命名
- 集中管理所有文档文件
- 改善文档可读性和导航

## 文件变更

### 📁 新建目录
- `docs/` - 集中存放所有文档

### 📄 文件重命名和移动

| 原文件名 | 新位置 | 新文件名 | 内容说明 |
|---------|-------|---------|----------|
| `QUICK_SETUP.md` | `docs/` | `quick-start.md` | 快速开始指南 |
| `CONFIG.md` | `docs/` | `backend-config.md` | 后端配置文档 |
| `LIVESTREAM_CONFIG.md` | `docs/` | `frontend-config.md` | 前端配置文档 |
| `CONFIG_EXAMPLES.md` | `docs/` | `config-examples.md` | 配置示例 |
| `BACKGROUND_FALLBACK.md` | `docs/` | `background-fallback.md` | 背景图片功能 |

### 📝 新增文档
- `docs/README.md` - 文档索引和导航

### 🔗 引用更新
- 主 `README.md` 中的文档链接已更新
- 添加了文档索引部分
- 增加了项目特性说明

## 文档结构

```
duix-demo/
├── README.md                    # 主说明文档
├── docs/                        # 文档目录
│   ├── README.md               # 文档索引
│   ├── quick-start.md          # 快速开始
│   ├── frontend-config.md      # 前端配置
│   ├── backend-config.md       # 后端配置
│   ├── config-examples.md      # 配置示例
│   └── background-fallback.md  # 背景功能
└── ...
```

## 优势

### ✅ 改进前
- 文档散落在根目录
- 文件名不够直观
- 缺乏统一的导航
- 难以快速找到所需文档

### ✅ 改进后
- 文档集中在 `docs/` 目录
- 使用语义化的文件名
- 提供完整的文档索引
- 清晰的分类和导航

## 用户体验提升

1. **新用户**: 可以从主 README.md 直接访问所需文档
2. **开发者**: 通过 `docs/README.md` 快速找到技术文档
3. **配置人员**: 明确的前后端配置文档分离
4. **维护者**: 统一的文档结构便于管理

## 后续维护建议

1. 保持文档索引的更新
2. 新增文档时遵循命名规范
3. 定期检查文档间的交叉引用
4. 根据用户反馈继续优化结构

---
*重构完成日期: 2025年7月27日*
*重构执行者: GitHub Copilot*
