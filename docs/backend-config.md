# 后端配置说明

## config.json 配置文件说明

### 核心配置项

#### duix.appId
- **描述**: Duix 应用 ID
- **类型**: 字符串
- **必需**: 是
- **获取方式**: 在 Duix 控制台中创建应用后获得
- **示例**: `"your_app_id_here"`

#### duix.appKey
- **描述**: Duix 应用密钥
- **类型**: 字符串
- **必需**: 是
- **安全性**: 请妥善保管，不要泄露
- **获取方式**: 在 Duix 控制台中创建应用后获得
- **示例**: `"your_app_key_here"`

#### duix.conversationId
- **描述**: 对话会话 ID
- **类型**: 字符串
- **必需**: 否（如果为空会自动生成）
- **用途**: 用于标识特定的对话会话
- **示例**: `"your_conversation_id_here"`

#### duix.security.allowedOrigins
- **描述**: CORS 允许的来源地址列表
- **类型**: 字符串数组
- **必需**: 是
- **用途**: 控制哪些域名可以访问后端 API
- **示例**: `["http://localhost:5173", "https://localhost:5173"]`

#### server.port
- **描述**: HTTP 服务器监听端口
- **类型**: 整数
- **默认值**: 3000
- **示例**: `3000`

#### server.cors.credentials
- **描述**: 是否允许携带认证信息的跨域请求
- **类型**: 布尔值
- **推荐值**: true
- **示例**: `true`

### 完整配置示例

```json
{
  "duix": {
    "appId": "实际的应用ID",
    "appKey": "实际的应用密钥",
    "conversationId": "my_conversation_001",
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

### 配置步骤

1. **获取 Duix 账号**
   - 访问 [Duix 官网](https://duix.com)
   - 注册并登录

2. **创建应用**
   - 在控制台中创建新应用
   - 获取 `appId` 和 `appKey`

3. **创建配置文件**
   - 复制 `server\config\config.example.json` 为 `server\config\config.json`
   - 编辑 `server\config\config.json` 文件
   - 将 `your_app_id_here` 替换为实际的 `appId`
   - 将 `your_app_key_here` 替换为实际的 `appKey`

4. **重启服务**
   - 保存配置文件后重启后端服务
   - 配置会自动生效

### 安全注意事项

- ⚠️ **配置文件现在位于 `server/config/` 目录，前端完全无法访问**
- ⚠️ **Vite 配置已设置严格的文件访问限制**
- ⚠️ **前端无法通过任何方式获取配置文件内容**
- ⚠️ **API 接口已过滤所有敏感配置数据**
- ⚠️ **移除了配置更新 API，防止恶意修改**
- ⚠️ **在生产环境中建议使用环境变量存储敏感信息**
- ⚠️ **定期轮换 `appKey`**

### 故障排除

**配置无效错误**
- 检查 `appId` 和 `appKey` 是否正确
- 确保没有多余的空格或特殊字符
- 验证配置文件的 JSON 格式是否正确

**签名验证失败**
- 检查系统时间是否正确
- 确认 `appKey` 与控制台中的一致
- 查看控制台错误日志

**API 调用失败**
- 检查网络连接
- 验证 API 地址是否正确
- 确认账号状态是否正常
