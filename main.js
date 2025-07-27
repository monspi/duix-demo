import './style.css'
import DUIX from 'duix-guiji-light'

// 初始化应用
document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <div class="left-panel">
      <div id="duix-container" class="remote-container">
        <p>准备就绪，点击开始演示...</p>
      </div>
    </div>
    <div class="right-panel">
      <div class="chat-header">
        <h2>🤖 Duix 智能对话</h2>
        <div id="status" class="status-bar">状态: 未初始化</div>
      </div>
      <div class="chat-area">
        <div id="chat-output" class="chat-output">
          <div class="welcome-message">
            欢迎使用 Duix 智能对话系统！<br>
            请先初始化数字人，然后开始对话。
          </div>
        </div>
      </div>
      <div class="control-panel">
        <button id="init-btn" type="button">初始化 Duix</button>
        <button id="start-btn" type="button" disabled>开始会话</button>
        <button id="stop-btn" type="button" disabled>停止会话</button>
        <button id="retry-btn" type="button" style="display: none;">重试初始化</button>
      </div>
    </div>
  </div>
`

// 初始化 duix-guiji-light
let duixInstance = null;
let currentToken = null;

function updateStatus(status) {
  document.querySelector('#status').textContent = status;
}

async function initDuix() {
  try {
    updateStatus('开始初始化...');
    
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
    
    // 获取签名（使用优化的时间戳和有效期）
    const signResponse = await fetch('http://localhost:3000/api/duix/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: 'demo_user',
        conversationId: configData.duixConfig.conversationId,
        sigExp: 1810 // 1810秒有效期
      })
    });
    
    const signData = await signResponse.json();
    
    if (!signData.success) {
      updateStatus('JWT 签名获取失败');
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: red;">JWT 签名获取失败: ${signData.message}</p>`;
      return;
    }
    
    // 保存 token
    currentToken = signData.sign;
    
    console.log('🎯 开始初始化 Duix 实例', {
      sign: signData.sign.substring(0, 50) + '...',
      conversationId: signData.conversationId,
      sigExp: signData.sigExp
    });
    
    // 创建 DUIX 实例
    duixInstance = new DUIX();
    
    // 创建初始化超时 Promise
    const initTimeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('初始化超时 (60秒)'));
      }, 60000);
    });
    
    // 创建初始化成功 Promise
    const initSuccess = new Promise((resolve, reject) => {
      // 监听初始化成功事件（注意官方文档中是 intialSucccess）
      duixInstance.on('intialSucccess', () => {
        console.log('Duix 初始化成功');
        
        // 绑定其他事件监听器
        duixInstance.on('show', () => {
          console.log('数字人已显示');
          updateStatus('数字人已显示，可以开始会话');
        });

        duixInstance.on('bye', () => {
          console.log('会话结束');
          updateStatus('会话已结束');
          document.querySelector('#start-btn').disabled = false;
          document.querySelector('#stop-btn').disabled = true;
          
          // 在聊天区域添加结束信息
          const chatOutput = document.querySelector('#chat-output');
          const endDiv = document.createElement('div');
          endDiv.className = 'chat-message system-message';
          endDiv.innerHTML = `
            <div class="message-content">📞 会话已结束</div>
          `;
          chatOutput.appendChild(endDiv);
          chatOutput.scrollTop = chatOutput.scrollHeight;
        });

        duixInstance.on('asrData', (result) => {
          console.log('语音识别结果:', result);
          const content = result.content || result.text || result;
          
          // 将用户输入添加到聊天区域
          const chatOutput = document.querySelector('#chat-output');
          const userDiv = document.createElement('div');
          userDiv.className = 'chat-message user-message';
          userDiv.innerHTML = `
            <div class="message-label">👤 您说:</div>
            <div class="message-content">${content}</div>
          `;
          chatOutput.appendChild(userDiv);
          chatOutput.scrollTop = chatOutput.scrollHeight;
        });

        duixInstance.on('asrStart', () => {
          console.log('开始语音识别');
          updateStatus('🎤 正在听取语音...');
        });

        duixInstance.on('asrStop', () => {
          console.log('语音识别结束');
          updateStatus('等待语音输入...');
        });

        duixInstance.on('speakStart', (data) => {
          console.log('数字人开始说话:', data);
          updateStatus('数字人正在说话...');
        });

        duixInstance.on('speakEnd', (data) => {
          console.log('数字人说话结束:', data);
          updateStatus('等待用户说话...');
          
          // 提取数字人回答的文本
          if (data && data.text) {
            const chatOutput = document.querySelector('#chat-output');
            const responseDiv = document.createElement('div');
            responseDiv.className = 'chat-message bot-message';
            responseDiv.innerHTML = `
              <div class="message-label">🤖 数字人回答:</div>
              <div class="message-content">${data.text}</div>
            `;
            chatOutput.appendChild(responseDiv);
            chatOutput.scrollTop = chatOutput.scrollHeight;
          }
        });

        duixInstance.on('progress', (progress) => {
          console.log('加载进度:', progress);
          updateStatus(`加载中... ${progress}%`);
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
        containerLable: '.remote-container', // 使用库要求的参数名（注意是Lable不是Label）
        conversationId: signData.conversationId,
        ...configData.duixConfig.defaultOptions
      });
    });
    
    updateStatus('正在初始化... (60秒超时)');
    document.querySelector('#init-btn').disabled = true;
    
    // 使用 Promise.race 实现超时机制
    try {
      await Promise.race([initSuccess, initTimeout]);
      
      // 初始化成功
      updateStatus('初始化成功，可以开始会话');
      document.querySelector('#start-btn').disabled = false;
      document.querySelector('#init-btn').disabled = false;
      document.querySelector('#retry-btn').style.display = 'none';
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: green;">✅ Duix 初始化成功！</p>
         <p>ConversationId: ${signData.conversationId}</p>
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
      updateStatus('启动数字人会话...');
      // 开始会话，启用ASR（自动语音识别）
      const result = await duixInstance.start({
        openAsr: true,
        muted: false // 非静音模式
      });
      console.log('会话启动结果:', result);
      
      if (result && !result.err) {
        updateStatus('会话进行中 - 可以开始说话');
        document.querySelector('#start-btn').disabled = true;
        document.querySelector('#stop-btn').disabled = false;
        
        // 在聊天区域添加开始信息
        const chatOutput = document.querySelector('#chat-output');
        const startDiv = document.createElement('div');
        startDiv.className = 'chat-message system-message';
        startDiv.innerHTML = `
          <div class="message-content">🎤 会话已开始，请开始说话...</div>
        `;
        chatOutput.appendChild(startDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
      }
    } catch (error) {
      console.error('会话启动失败:', error);
      updateStatus('会话启动失败');
      // 如果是自动播放策略问题，提示用户
      if (error.code === 4009) {
        alert('浏览器阻止了自动播放，请重试或检查浏览器设置');
      }
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

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  console.log('应用已加载，准备初始化 Duix');
});
