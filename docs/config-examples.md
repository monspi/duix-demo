# 配置示例

本文档提供了前端和后端配置的完整示例。

## 后端配置示例

后端配置文件位于 `server/config/config.json`，包含 Duix API 凭证和服务器设置。

### 基础后端配置
```json
{
  "duix": {
    "appId": "your_app_id_here",
    "appKey": "your_app_key_here",
    "conversationId": "your_conversation_id_here",
    "security": {
      "allowedOrigins": [
        "http://localhost:5173",
        "https://localhost:5173",
        "http://localhost:3000",
        "https://localhost:3443"
      ]
    }
  },
  "server": {
    "port": 3000,
    "cors": {
      "enabled": true,
      "credentials": true
    }
  }
}
```

### 生产环境后端配置
```json
{
  "duix": {
    "appId": "prod_app_id_12345",
    "appKey": "prod_app_key_abcdef...",
    "conversationId": "prod_conversation_id",
    "security": {
      "allowedOrigins": [
        "https://yourdomain.com",
        "https://www.yourdomain.com"
      ]
    }
  },
  "server": {
    "port": 3000,
    "cors": {
      "enabled": true,
      "credentials": true
    }
  }
}
```

### 开发环境后端配置
```json
{
  "duix": {
    "appId": "dev_app_id_test",
    "appKey": "dev_app_key_test...",
    "conversationId": "dev_conversation_id",
    "security": {
      "allowedOrigins": [
        "http://localhost:5173",
        "http://localhost:3000"
      ]
    }
  },
  "server": {
    "port": 3000,
    "cors": {
      "enabled": true,
      "credentials": true
    }
  }
}
```

## 前端配置示例

## 示例1：不加载背景视频的配置
```json
{
  "backend": {
    "baseUrl": "http://localhost:3000"
  },
  "livestream": {
    "defaultStreamUrl": "",
    "autoPlay": false,
    "enableHLS": false,
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "autoInit": true
  }
}
```

## 示例2：使用自定义直播流的配置
```json
{
  "backend": {
    "baseUrl": "http://your-server:3000"
  },
  "livestream": {
    "defaultStreamUrl": "https://your-cdn.com/live/stream.m3u8",
    "autoPlay": true,
    "enableHLS": true,
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "autoInit": true
  }
}
```

## 示例3：手动初始化模式
```json
{
  "backend": {
    "baseUrl": "http://localhost:3000"
  },
  "livestream": {
    "defaultStreamUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "autoPlay": true,
    "enableHLS": true,
    "fallbackBackgroundImage": "/bg.png"
  },
  "ui": {
    "autoInit": false
  }
}
```

## 配置项详细说明

### 后端配置说明

#### duix.appId
- Duix 平台分配的应用ID
- **必填项**，用于 Duix API 认证
- **敏感信息**，切勿泄露
- 从 Duix 开发者控制台获取

#### duix.appKey
- Duix 平台分配的应用密钥
- **必填项**，用于生成 JWT token
- **敏感信息**，切勿泄露
- 从 Duix 开发者控制台获取

#### duix.conversationId
- 对话会话ID
- 用于标识特定的对话会话

#### duix.security.allowedOrigins
- CORS 允许的来源地址列表
- 包含前端应用的所有可能访问地址
- 生产环境应设置为实际的域名

#### server.port
- HTTP 服务器监听端口
- 默认: `3000`
- 确保端口未被其他服务占用

#### server.cors.enabled
- 是否启用 CORS 支持
- 建议设置为 `true`

#### server.cors.credentials
- 是否允许携带认证信息的跨域请求
- 建议设置为 `true`

### 前端配置说明

### backend.baseUrl
- 后端API服务器的基础URL
- 用于获取配置信息和JWT签名
- 默认: `http://localhost:3000`

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

### ui.autoInit
- 页面加载时是否自动初始化
- `true`: 自动初始化数字人和直播流
- `false`: 等待手动触发初始化

## 使用方法

### 后端配置设置
1. 复制配置模板：
   ```bash
   copy server\config\config.example.json server\config\config.json
   ```
2. 编辑 `server/config/config.json` 文件
3. 将 `your_app_id_here` 替换为您的 Duix AppId
4. 将 `your_app_key_here` 替换为您的 Duix AppKey
5. 根据部署环境调整其他配置项

### 前端配置设置
1. 复制配置模板：
   ```bash
   copy frontend.config.example.json frontend.config.json
   ```
2. 编辑 `frontend.config.json` 文件
3. 根据您的需求修改配置项
4. 确保后端地址配置正确

### 配置验证
- 启动后端服务：`npm run server`
- 启动前端服务：`npm run dev`
- 查看浏览器控制台确认配置加载状态
- 检查网络请求确认前后端通信正常

### 安全注意事项
- 后端配置文件包含敏感信息，已在 `.gitignore` 中排除
- 前端配置文件也已排除，避免暴露后端地址等信息
- 生产环境建议使用环境变量管理敏感配置
