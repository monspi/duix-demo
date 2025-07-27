# 数字人直播间配置说明

## 概述
这是一个全屏数字人直播间应用，支持：
- 数字人全屏显示
- 绿幕背景去除
- m3u8 直播流背景
- 右上角透明对话框
- 自动初始化
- 语音对话功能

## 配置您的直播流

### 1. 修改直播流地址
在 `main.js` 文件中找到 `initBackgroundStream()` 函数，修改以下代码：

```javascript
// 默认的测试直播流（您可以替换为实际的 m3u8 地址）
const defaultStreamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; // 测试流
```

将 `defaultStreamUrl` 替换为您的实际 m3u8 直播流地址，例如：
```javascript
const defaultStreamUrl = 'https://your-domain.com/live/stream.m3u8';
```

### 2. 支持的直播流格式
- **HLS (m3u8)**: 主要支持格式
- **原生 HTML5 视频**: 对于支持的浏览器
- **HLS.js**: 对于不原生支持 HLS 的浏览器

### 3. 常见的直播流测试地址
```javascript
// Apple 官方测试流
'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8'

// Mux 测试流
'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

// 您的自定义流
'https://your-cdn.com/live/your-stream.m3u8'
```

## 绿幕去除效果

应用使用 CSS 滤镜和混合模式来去除绿幕背景：

### 当前方案
```css
/* 绿幕去除效果 */
.duix-fullscreen canvas,
.duix-fullscreen video {
  filter: 
    contrast(1.2)
    saturate(1.1)
    brightness(1.1);
  
  mix-blend-mode: multiply;
  backdrop-filter: 
    hue-rotate(180deg) 
    saturate(2) 
    contrast(1.5);
}
```

### 高级绿幕去除
如果需要更精确的绿幕去除，可以考虑：
1. 使用 WebGL 着色器
2. 集成专业的绿幕去除库
3. 后端视频处理

## 界面自定义

### 修改对话框位置
在 `style.css` 中修改 `.chat-overlay` 样式：
```css
.chat-overlay {
  position: absolute;
  top: 20px;    /* 距离顶部距离 */
  right: 20px;  /* 距离右侧距离 */
  /* 或者改为左上角 */
  /* left: 20px; */
}
```

### 修改对话框透明度
调整背景透明度：
```css
.chat-overlay {
  background: rgba(0, 0, 0, 0.7); /* 第四个参数控制透明度 */
}
```

### 修改按钮样式
在 `style.css` 中修改 `.control-buttons button` 样式。

## 功能特性

### 自动初始化
应用会在页面加载时自动：
1. 初始化背景直播流
2. 初始化 Duix 数字人
3. 准备语音对话

### 语音对话
- **开始对话**: 启用语音识别和数字人响应
- **结束对话**: 停止语音会话

### 实时显示
- 语音识别结果实时显示
- 数字人回复实时显示
- 状态信息实时更新

## 故障排除

### 直播流无法播放
1. 检查 m3u8 地址是否有效
2. 确认浏览器支持 HLS
3. 检查网络连接
4. 查看浏览器控制台错误

### 绿幕效果不佳
1. 调整 CSS 滤镜参数
2. 确保数字人背景为标准绿幕色
3. 考虑使用更高级的绿幕去除方案

### 数字人无法初始化
1. 检查 Duix 配置参数
2. 确认后端服务运行正常
3. 检查网络连接和 HTTPS 配置

## 部署注意事项

### HTTPS 要求
- Duix 数字人需要 HTTPS 环境
- 直播流建议使用 HTTPS
- 确保 SSL 证书有效

### 性能优化
- 使用 CDN 加速直播流
- 优化 CSS 动画性能
- 考虑视频压缩和分辨率

### 浏览器兼容性
- Chrome/Edge: 完全支持
- Firefox: 需要 HLS.js
- Safari: 原生 HLS 支持
- 移动端: 测试触摸交互

## 联系支持

如果遇到问题，请：
1. 检查浏览器控制台错误
2. 确认配置参数正确
3. 测试网络连接
4. 查看服务端日志
