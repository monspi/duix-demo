# 前端配置示例

## 示例1：不加载背景视频的配置
```json
{
  "backend": {
    "baseUrl": "http://localhost:3000",
    "httpsUrl": "https://localhost:3443"
  },
  "livestream": {
    "defaultStreamUrl": "",
    "autoPlay": false,
    "enableHLS": false,
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "hideLoadingAfterInit": true,
    "chatPosition": "top-right",
    "autoInit": true
  }
}
```

## 示例2：使用自定义直播流的配置
```json
{
  "backend": {
    "baseUrl": "http://your-server:3000",
    "httpsUrl": "https://your-server:3443"
  },
  "livestream": {
    "defaultStreamUrl": "https://your-cdn.com/live/stream.m3u8",
    "autoPlay": true,
    "enableHLS": true,
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "hideLoadingAfterInit": true,
    "chatPosition": "top-right",
    "autoInit": true
  }
}
```

## 示例3：手动初始化模式
```json
{
  "backend": {
    "baseUrl": "http://localhost:3000",
    "httpsUrl": "https://localhost:3443"
  },
  "livestream": {
    "defaultStreamUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "autoPlay": true,
    "enableHLS": true,
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "hideLoadingAfterInit": false,
    "chatPosition": "top-right",
    "autoInit": false
  }
}
```

## 配置项详细说明

### backend.baseUrl
- 后端API服务器的基础URL
- 用于获取配置信息和JWT签名
- 默认: `http://localhost:3000`

### backend.httpsUrl  
- 后端HTTPS服务器的URL
- 用于需要HTTPS的功能
- 默认: `https://localhost:3443`

### livestream.defaultStreamUrl
- 主要的m3u8直播流地址
- **重要**: 设置为空字符串 `""` 时，会直接加载背景图片
- 支持HTTPS和HTTP协议

### livestream.autoPlay
- 是否自动播放背景视频
- `true`: 自动播放
- `false`: 需要用户交互后播放

### livestream.enableHLS
- 是否启用HLS直播流支持
- `true`: 启用HLS.js库支持
- `false`: 禁用HLS功能

### livestream.fallbackBackgroundImage
- 当视频流加载失败时显示的背景图片
- 支持相对路径（如：`"/bg.png"`）和绝对URL
- 图片会以cover模式填充整个背景
- 如果不设置或设置为空，则不显示背景图片

### ui.hideLoadingAfterInit
- 数字人初始化成功后是否隐藏加载提示
- `true`: 自动隐藏"正在初始化数字人..."提示
- `false`: 保持提示显示

### ui.chatPosition
- 对话框在屏幕上的位置
- 目前支持: `"top-right"`
- 未来可扩展: `"top-left"`, `"bottom-right"`, `"bottom-left"`

### ui.autoInit
- 页面加载时是否自动初始化
- `true`: 自动初始化数字人和直播流
- `false`: 等待手动触发初始化

## 使用方法

1. 将上述示例配置保存为项目根目录的 `config.json` 文件
2. 根据您的需求修改配置项
3. 刷新页面，新配置会自动生效
4. 查看浏览器控制台确认配置加载状态
