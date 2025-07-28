import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const app = express();

// 读取配置文件
const configPath = path.join(process.cwd(), 'server', 'config', 'config.json');
let config;

try {
  const configData = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configData);
  console.log('✅ 配置文件加载成功');
} catch (error) {
  console.error('❌ 配置文件加载失败:', error.message);
  console.log('💡 请确保 server/config/config.json 文件存在');
  console.log('💡 可以复制 server/config/config.example.json 为 config.json');
  process.exit(1);
}

const PORT = process.env.PORT || config.server.port || 3001;

// 中间件
app.use(cors({
  origin: config.duix.security.allowedOrigins,
  credentials: config.server.cors.credentials
}));
app.use(express.json());

// 工具函数：生成 JWT 签名（严格按照 Duix 官方文档，优化时间戳）
function generateSign(appId, appKey, sigExp = 1810) {
  try {
    // 验证输入参数
    if (!appId || !appKey) {
      throw new Error('appId 和 appKey 不能为空');
    }
    
    console.log('开始生成 JWT Token:', {
      appId: appId,
      appKeyPrefix: appKey.substring(0, 8) + '...',
      sigExp: sigExp
    });
    
    // 计算时间戳，提前10秒以避免时间同步问题
    const currentTime = Math.floor(Date.now() / 1000);
    const adjustedTime = currentTime - 10; // 提前10秒
    
    // 根据官方文档，payload 包含 appId 和自定义时间戳
    const payload = {
      appId: appId,
      iat: adjustedTime // 签发时间提前10秒
    };
    
    // 计算过期时间
    const options = {
      algorithm: 'HS256',
      expiresIn: sigExp, // 过期时间（秒）
      issuer: 'duix-client' // 可选的签发者
    };
    
    // 使用 jsonwebtoken 库生成 JWT
    const token = jwt.sign(payload, appKey, options);
    
    // 验证生成的 token
    const decoded = jwt.verify(token, appKey, { algorithms: ['HS256'] });
    console.log('JWT Token 生成成功 (时间戳已优化):', {
      appId: decoded.appId,
      iat: new Date(decoded.iat * 1000).toISOString(),
      exp: new Date(decoded.exp * 1000).toISOString(),
      adjustedSeconds: -10,
      validitySeconds: sigExp
    });
    
    return token;
  } catch (error) {
    console.error('JWT 签名生成失败:', error);
    throw new Error(`JWT 签名生成失败: ${error.message}`);
  }
}

// 工具函数：验证配置
function validateDuixConfig() {
  const { appId, appKey } = config.duix;
  if (!appId || appId === 'your_app_id_here') {
    return { valid: false, message: 'AppId 未配置或使用默认值' };
  }
  if (!appKey || appKey === 'your_app_key_here') {
    return { valid: false, message: 'AppKey 未配置或使用默认值' };
  }
  return { valid: true };
}

app.get('/api/duix/config', (req, res) => {
  const configValidation = validateDuixConfig();
  
  // 只返回前端需要的非敏感配置信息
  res.json({
    duixConfig: {
      validation: {
        valid: configValidation.valid,
        message: configValidation.valid ? '配置正常' : '需要完善配置'
      }
    }
  });
});


app.post('/api/duix/sign', (req, res) => {
  const configValidation = validateDuixConfig();
  
  if (!configValidation.valid) {
    return res.status(400).json({
      success: false,
      error: 'Duix 配置无效',
      message: configValidation.message,
      hint: '请在 server/config/config.json 中正确配置 appId 和 appKey'
    });
  }

  const { userId, conversationId: reqConversationId, sigExp } = req.body;
  const currentTime = Date.now();
  const useConversationId = reqConversationId || config.duix.conversationId || `conv_${currentTime}`;
  const signatureExpiration = sigExp || 1810; // 默认1810秒有效期
  
  try {
    // 使用官方 JWT 方式生成签名
    const sign = generateSign(
      config.duix.appId,
      config.duix.appKey,
      signatureExpiration
    );
    
    res.json({
      success: true,
      sign,
      conversationId: useConversationId,
      timestamp: currentTime,
      expires: currentTime + (signatureExpiration * 1000), // 转换为毫秒
      sigExp: signatureExpiration
    });
    
    console.log(`🔐 为用户 ${userId || 'anonymous'} 生成 JWT 签名成功 (有效期: ${signatureExpiration}秒)`);
    
  } catch (error) {
    console.error('JWT 签名生成失败:', error);
    res.status(500).json({
      success: false,
      error: 'JWT 签名生成失败',
      message: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动在端口 ${PORT}`);
  console.log(`📡 API地址: http://localhost:${PORT}/api`);
  console.log(`📁 配置文件: ${configPath}`);
  
  const configValidation = validateDuixConfig();
  if (configValidation.valid) {
    console.log(`✅ Duix 配置验证通过`);
  } else {
    console.log(`⚠️  Duix 配置需要完善: ${configValidation.message}`);
    console.log(`💡 请编辑 config.json 文件，设置正确的 appId 和 appKey`);
  }
});
