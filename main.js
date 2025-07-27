import './style.css'
import DUIX from 'duix-guiji-light'

// 初始化应用
document.querySelector('#app').innerHTML = `
  <div>
    <h1>Duix Guiji Light Demo</h1>
    <div class="demo-container">
      <div id="duix-container" class="remote-container">
        <p>准备就绪，点击开始演示...</p>
      </div>
      <div class="controls">
        <button id="init-btn" type="button">初始化 Duix</button>
        <button id="start-btn" type="button" disabled>开始会话</button>
        <button id="stop-btn" type="button" disabled>停止会话</button>
        <button id="api-test-btn" type="button">测试后端API</button>
        <button id="config-btn" type="button">检查配置</button>
        <button id="verify-btn" type="button" disabled>验证Token</button>
        <button id="debug-btn" type="button">调试JWT</button>
        <button id="retry-btn" type="button" style="display: none;">重试初始化</button>
      </div>
      <div id="status">状态: 未初始化</div>
    </div>
  </div>
`

// 初始化 duix-guiji-light
let duixInstance = null;
let currentToken = null;

function updateStatus(status) {
  document.querySelector('#status').textContent = `状态: ${status}`;
}

async function initDuix() {
  try {
    updateStatus('获取配置中...');
    
    // 从后端获取配置
    const configResponse = await fetch('http://localhost:3000/api/duix/config');
    const configData = await configResponse.json();
    
    // 检查配置是否有效
    if (!configData.duixConfig.validation.valid) {
      updateStatus('配置无效');
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: orange;">⚠️ ${configData.duixConfig.validation.message}</p>
         <p>请在 config.json 中正确配置 appId 和 appKey</p>`;
      return;
    }
    
    // 获取签名
    const signResponse = await fetch('http://localhost:3000/api/duix/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: 'demo_user',
        conversationId: configData.duixConfig.conversationId,
        sigExp: 1800 // 30分钟有效期
      })
    });
    
    const signData = await signResponse.json();
    
    if (!signData.success) {
      updateStatus('JWT 签名获取失败');
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: red;">JWT 签名获取失败: ${signData.message}</p>`;
      return;
    }
    
    // 保存 token 用于验证
    currentToken = signData.sign;
    
    // 创建 DUIX 实例
    duixInstance = new DUIX();
    
    // 创建初始化超时 Promise
    const initTimeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('初始化超时 (5秒)'));
      }, 5000);
    });
    
    // 创建初始化成功 Promise
    const initSuccess = new Promise((resolve, reject) => {
      // 监听初始化成功事件
      duixInstance.on('initialSuccess', () => {
        console.log('Duix 初始化成功');
        
        // 绑定其他事件监听器
        duixInstance.on('sessionStart', () => {
          console.log('会话开始');
          updateStatus('会话进行中 - 可以开始说话');
          document.querySelector('#start-btn').disabled = true;
          document.querySelector('#stop-btn').disabled = false;
          document.querySelector('#duix-container').innerHTML = 
            '<p style="color: blue;">🎤 会话进行中，请开始说话...</p>';
        });

        duixInstance.on('sessionEnd', () => {
          console.log('会话结束');
          updateStatus('会话已结束');
          document.querySelector('#start-btn').disabled = false;
          document.querySelector('#stop-btn').disabled = true;
          document.querySelector('#duix-container').innerHTML = 
            '<p>会话已结束，可以重新开始。</p>';
        });

        duixInstance.on('asrResult', (result) => {
          console.log('语音识别结果:', result);
          document.querySelector('#duix-container').innerHTML = 
            `<p>🎤 识别到: <strong>${result.text || result}</strong></p>`;
        });
        
        resolve('success');
      });
      
      // 监听初始化失败事件
      duixInstance.on('error', (error) => {
        console.error('Duix 初始化失败:', error);
        reject(new Error(`初始化失败: ${error.message || error}`));
      });
      
      // 开始初始化
      duixInstance.init({
        sign: signData.sign,
        containerLable: '.remote-container',
        conversationId: signData.conversationId,
        ...configData.duixConfig.defaultOptions
      });
    });
    
    updateStatus('正在初始化... (5秒超时)');
    document.querySelector('#init-btn').disabled = true;
    
    // 使用 Promise.race 实现超时机制
    try {
      await Promise.race([initSuccess, initTimeout]);
      
      // 初始化成功
      updateStatus('初始化成功，可以开始会话');
      document.querySelector('#start-btn').disabled = false;
      document.querySelector('#verify-btn').disabled = false;
      document.querySelector('#retry-btn').style.display = 'none';
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: green;">✅ Duix 初始化成功！</p>
         <p>ConversationId: ${signData.conversationId}</p>
         <p>JWT Token 有效期: ${signData.sigExp}秒</p>
         <p>可以开始语音会话了。</p>`;
         
    } catch (timeoutError) {
      // 处理超时或初始化失败
      updateStatus('初始化失败');
      document.querySelector('#init-btn').disabled = false;
      document.querySelector('#retry-btn').style.display = 'inline-block';
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: red;">❌ ${timeoutError.message}</p>
         <p>可能的原因：</p>
         <ul style="text-align: left; color: #ccc;">
           <li>网络连接问题</li>
           <li>Duix 服务不可用</li>
           <li>配置参数错误</li>
           <li>签名验证失败</li>
         </ul>
         <p>请检查控制台错误信息或点击重试按钮。</p>`;
      
      // 清理实例
      if (duixInstance) {
        try {
          duixInstance.destroy?.();
        } catch (e) {
          console.warn('清理 DUIX 实例时出错:', e);
        }
        duixInstance = null;
      }
      currentToken = null;
    }
    
  } catch (error) {
    console.error('Duix 初始化失败:', error);
    updateStatus('初始化失败 - 请检查后端服务');
    document.querySelector('#init-btn').disabled = false;
    document.querySelector('#duix-container').innerHTML = 
      '<p style="color: red;">Duix 初始化失败，请检查控制台和后端服务</p>';
  }
}

// 绑定事件
document.querySelector('#init-btn').addEventListener('click', async () => {
  // 隐藏重试按钮
  document.querySelector('#retry-btn').style.display = 'none';
  await initDuix();
});

document.querySelector('#retry-btn').addEventListener('click', async () => {
  console.log('用户点击重试按钮');
  // 隐藏重试按钮
  document.querySelector('#retry-btn').style.display = 'none';
  await initDuix();
});

document.querySelector('#start-btn').addEventListener('click', async () => {
  if (duixInstance) {
    try {
      // 开始会话，启用ASR（自动语音识别）
      const result = await duixInstance.start({
        openAsr: true
      });
      console.log('会话启动结果:', result);
    } catch (error) {
      console.error('会话启动失败:', error);
      updateStatus('会话启动失败');
    }
  }
});

document.querySelector('#stop-btn').addEventListener('click', async () => {
  if (duixInstance) {
    try {
      await duixInstance.stop();
      console.log('会话已停止');
    } catch (error) {
      console.error('停止会话失败:', error);
    }
  }
});

document.querySelector('#api-test-btn').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test');
    const data = await response.json();
    console.log('后端API响应:', data);
    alert(`后端响应: ${data.message}`);
  } catch (error) {
    console.error('API调用失败:', error);
    alert('无法连接到后端服务，请确保后端服务已启动');
  }
});

document.querySelector('#config-btn').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/config/status');
    const data = await response.json();
    console.log('配置状态:', data);
    
    const configInfo = `
配置文件状态: ${data.configFile.exists ? '✅ 存在' : '❌ 不存在'}
Duix 配置: ${data.duix.configured ? '✅ 正常' : '⚠️ 需要配置'}
AppId: ${data.duix.hasAppId ? '✅ 已设置' : '❌ 未设置'}
AppKey: ${data.duix.hasAppKey ? '✅ 已设置' : '❌ 未设置'}
环境: ${data.duix.environment}
服务端口: ${data.server.port}
服务状态: ${data.server.status}

${data.duix.message}
    `.trim();
    
    alert(configInfo);
    
    if (!data.duix.configured) {
      updateStatus('配置需要完善');
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: orange;">⚠️ ${data.duix.message}</p>
         <p>请编辑 server/config/config.json 文件，设置正确的 appId 和 appKey</p>`;
    }
    
  } catch (error) {
    console.error('配置检查失败:', error);
    alert('配置检查失败，请确保后端服务已启动');
  }
});

document.querySelector('#verify-btn').addEventListener('click', async () => {
  if (!currentToken) {
    alert('没有可验证的 Token，请先初始化 Duix');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/duix/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: currentToken })
    });
    
    const data = await response.json();
    
    if (data.success) {
      const tokenInfo = `
✅ JWT Token 验证成功

AppId: ${data.payload.appId}
签发时间: ${data.payload.issuedAt}
过期时间: ${data.payload.expiresAt}
是否过期: ${data.payload.isExpired ? '是' : '否'}
      `.trim();
      
      alert(tokenInfo);
      
      if (data.payload.isExpired) {
        updateStatus('Token 已过期，需要重新获取');
        document.querySelector('#duix-container').innerHTML = 
          '<p style="color: orange;">⚠️ JWT Token 已过期，请重新初始化</p>';
      }
    } else {
      alert(`❌ Token 验证失败: ${data.message}`);
    }
    
  } catch (error) {
    console.error('Token 验证失败:', error);
    alert('Token 验证失败，请确保后端服务已启动');
  }
});

document.querySelector('#debug-btn').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/duix/debug-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('JWT 调试信息:', data);
      
      const debugInfo = `
🔍 JWT Token 调试信息

Header:
  算法: ${data.header.alg}
  类型: ${data.header.typ}

Payload:
  AppId: ${data.payload.appId}
  签发时间: ${new Date(data.payload.iat * 1000).toISOString()}
  过期时间: ${new Date(data.payload.exp * 1000).toISOString()}

配置:
  AppId: ${data.config.appId}
  算法: ${data.config.algorithm}
  密钥长度: ${data.config.keyLength} 字符

Token (前50字符): ${data.token.substring(0, 50)}...
      `.trim();
      
      alert(debugInfo);
      
      // 在控制台输出完整信息
      console.log('完整 JWT Token:', data.token);
      
    } else {
      alert(`❌ JWT 调试失败: ${data.message}`);
    }
    
  } catch (error) {
    console.error('JWT 调试失败:', error);
    alert('JWT 调试失败，请确保后端服务已启动');
  }
});

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  console.log('应用已加载，准备初始化 Duix');
});
