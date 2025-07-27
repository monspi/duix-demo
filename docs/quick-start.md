# 快速配置指南

## 🎯 简化的配置方案

根据用户需求，已移除复杂的备用流机制，现在的逻辑更加简洁：

**视频流为空或加载失败 → 直接显示背景图片**

## ⚙️ 配置文件

### 文件位置
- 前端配置：`frontend.config.json`
- 后端配置：`server/config/config.json`

### 基础配置
```json
{
  "backend": {
    "baseUrl": "http://localhost:3000"
  },
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "autoInit": true
  }
}
```

## 🎬 使用场景

### 场景1：纯背景图片模式（推荐）
```json
{
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "/bg.png"
  }
}
```
**效果**: 启动即显示背景图片，适合大多数使用场景

### 场景2：使用直播流
```json
{
  "livestream": {
    "defaultStreamUrl": "https://your-stream.m3u8",
    "fallbackBackgroundImage": "/bg.png"
  }
}
```
**效果**: 优先加载直播流，失败时显示背景图片

### 场景3：自定义后端
```json
{
  "backend": {
    "baseUrl": "http://your-server:3000"
  },
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "/custom-bg.jpg"
  }
}
```

## 🔄 工作流程

1. **页面加载** → 读取 `frontend.config.json`
2. **检查流地址** → 如果为空，跳到步骤5
3. **尝试加载视频** → HLS 流处理
4. **如果失败** → 触发错误处理
5. **显示背景图片** → 应用 cover 样式

## 🎨 背景图片要求

- **位置**: 放在 `public/` 目录
- **格式**: PNG, JPG, WebP
- **分辨率**: 1920×1080 推荐
- **大小**: < 2MB 推荐

## 🐛 调试技巧

### 查看控制台日志
- `"直播流地址为空，加载背景图片"` ✅ 正常
- `"视频加载失败，切换到背景图片"` ✅ 正常备用
- `"背景图片加载成功"` ✅ 图片OK
- `"背景图片加载失败"` ❌ 检查图片路径

### 常见问题
1. **背景不显示** → 检查 `public/bg.png` 是否存在
2. **配置不生效** → 刷新页面重新加载配置
3. **视频不切换** → 检查 `defaultStreamUrl` 是否为空字符串

## 🚀 部署建议

1. **开发环境**: 使用默认配置（空流地址 + bg.png）
2. **生产环境**: 根据需要配置实际流地址
3. **备份**: 始终准备好备用背景图片

---
*配置修改后请刷新页面以使新配置生效*
