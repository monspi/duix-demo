import './style.css'
import DUIX from 'duix-guiji-light'

// 全局配置变量
let appConfig = null;

// 加载前端配置文件
async function loadConfig() {
  try {
    const response = await fetch('/frontend.config.json');
    appConfig = await response.json();
    console.log('前端配置加载成功:', appConfig);
    return appConfig;
  } catch (error) {
    console.error('加载前端配置失败:', error);
    // 使用默认配置
    appConfig = {
      backend: {
        baseUrl: "http://localhost:3000",
        httpsUrl: "https://localhost:3443"
      },
      livestream: {
        defaultStreamUrl: "",
        fallbackStreamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        autoPlay: true,
        enableHLS: true
      },
      ui: {
        hideLoadingAfterInit: true,
        chatPosition: "top-right",
        autoInit: true
      }
    };
    return appConfig;
  }
}

// 初始化应用
document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <!-- 背景直播流 -->
    <video id="background-stream" class="background-video" autoplay muted loop>
      <source src="" type="application/x-mpegURL">
      您的浏览器不支持视频播放
    </video>
    
    <!-- 数字人全屏容器 -->
    <div id="duix-container" class="duix-fullscreen">
      <p>正在初始化数字人...</p>
    </div>
    
    <!-- 绿幕去除canvas (隐藏，用于处理) -->
    <canvas id="chroma-canvas" style="display: none;"></canvas>
    
    <!-- 右上角透明对话框 -->
    <div class="chat-overlay">
      <div class="chat-content">
        <div id="status" class="status-display">正在初始化...</div>
        <div id="chat-output" class="chat-messages">
          <div class="system-message">系统已就绪</div>
        </div>
        <div class="control-buttons">
          <button id="start-btn" type="button" disabled>开始对话</button>
          <button id="stop-btn" type="button" disabled>结束对话</button>
        </div>
      </div>
    </div>
  </div>
`

// 初始化 duix-guiji-light
let duixInstance = null;
let currentToken = null;
let chromaKeyRemover = null;

function updateStatus(status) {
  document.querySelector('#status').textContent = status;
}

// 隐藏数字人加载提示
function hideLoadingMessage() {
  const loadingElement = document.querySelector('#duix-container p');
  if (loadingElement && appConfig?.ui?.hideLoadingAfterInit) {
    loadingElement.style.display = 'none';
    console.log('数字人加载提示已隐藏');
  }
}

// 初始化绿幕去除功能
function initChromaKey() {
  // 等待数字人容器中的视频或canvas元素出现
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'VIDEO' || node.tagName === 'CANVAS') {
          console.log('检测到数字人视频元素，启用绿幕去除');
          
          // 如果是视频元素，设置绿幕去除
          if (node.tagName === 'VIDEO') {
            const canvas = document.querySelector('#chroma-canvas');
            chromaKeyRemover = new window.ChromaKeyRemover(node, canvas);
            
            // 配置绿幕参数
            chromaKeyRemover.setChromaKey({
              r: 0,
              g: 255, 
              b: 0,
              threshold: 120, // 增加容差以更好地去除绿色
              smoothing: 0.2
            });
            
            // 开始绿幕去除处理
            chromaKeyRemover.start();
            
            // 将原视频隐藏，显示处理后的canvas
            node.style.display = 'none';
            canvas.style.display = 'block';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.objectFit = 'cover';
            
            // 将canvas移动到数字人容器中
            document.querySelector('#duix-container').appendChild(canvas);
          }
        }
      });
    });
  });
  
  // 观察数字人容器的变化
  observer.observe(document.querySelector('#duix-container'), {
    childList: true,
    subtree: true
  });
}

async function initDuix() {
  try {
    updateStatus('开始初始化...');
    
    if (!appConfig) {
      throw new Error('前端配置未加载');
    }
    
    // 使用配置文件中的后端地址
    const backendUrl = appConfig.backend.baseUrl;
    console.log('使用后端地址:', backendUrl);
    
    // 从后端获取配置
    const configResponse = await fetch(`${backendUrl}/api/duix/config`);
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
    const signResponse = await fetch(`${backendUrl}/api/duix/sign`, {
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
          updateStatus('数字人已就绪');
          document.querySelector('#start-btn').disabled = false;
          
          // 隐藏数字人加载提示
          hideLoadingMessage();
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
          endDiv.innerHTML = `📞 会话已结束`;
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
          userDiv.innerHTML = `👤 ${content}`;
          chatOutput.appendChild(userDiv);
          chatOutput.scrollTop = chatOutput.scrollHeight;
        });

        duixInstance.on('asrStart', () => {
          console.log('开始语音识别');
          updateStatus('🎤 听取中...');
        });

        duixInstance.on('asrStop', () => {
          console.log('语音识别结束');
          updateStatus('等待输入...');
        });

        duixInstance.on('speakStart', (data) => {
          console.log('数字人开始说话:', data);
          updateStatus('🤖 回复中...');
        });

        duixInstance.on('speakEnd', (data) => {
          console.log('数字人说话结束:', data);
          updateStatus('对话中...');
          
          // 提取数字人回答的文本
          if (data && data.text) {
            const chatOutput = document.querySelector('#chat-output');
            const responseDiv = document.createElement('div');
            responseDiv.className = 'chat-message assistant-message';
            responseDiv.innerHTML = `🤖 ${data.text}`;
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
        containerLable: '.duix-fullscreen', // 使用全屏容器
        conversationId: signData.conversationId,
        ...configData.duixConfig.defaultOptions
      });
    });
    
    updateStatus('初始化中...');
    document.querySelector('#start-btn').disabled = true;
    
    // 使用 Promise.race 实现超时机制
    try {
      await Promise.race([initSuccess, initTimeout]);
      
      // 初始化成功
      updateStatus('初始化成功');
      document.querySelector('#start-btn').disabled = false;
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: #00ff88;">数字人已就绪</p>`;
         
    } catch (timeoutError) {
      // 处理超时或初始化失败
      updateStatus('初始化失败');
      document.querySelector('#duix-container').innerHTML = 
        `<p style="color: #ff6b6b;">初始化失败: ${timeoutError.message}</p>`;
      
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
    updateStatus('初始化失败');
    document.querySelector('#duix-container').innerHTML = 
      '<p style="color: #ff6b6b;">初始化失败，请检查网络</p>';
  }
}

// 初始化 HLS 直播流
function initBackgroundStream() {
  if (!appConfig) {
    console.error('配置文件未加载，无法初始化直播流');
    return;
  }

  const video = document.querySelector('#background-stream');
  const streamConfig = appConfig.livestream;
  
  // 获取直播流地址，优先使用配置的defaultStreamUrl
  let streamUrl = streamConfig.defaultStreamUrl;
  
  // 如果defaultStreamUrl为空，则不加载视频
  if (!streamUrl || streamUrl.trim() === '') {
    console.log('默认直播流地址为空，不加载背景视频');
    video.style.display = 'none';
    return;
  }

  console.log('正在加载直播流:', streamUrl);
  // 检查是否启用HLS
  if (!streamConfig.enableHLS) {
    console.log('HLS功能已禁用');
    video.style.display = 'none';
    return;
  }
  
  // 检查是否支持 HLS
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
    video.load();
    if (streamConfig.autoPlay) {
      video.play().catch(e => {
        console.log('视频自动播放被阻止:', e);
      });
    }
  } else if (window.Hls && window.Hls.isSupported()) {
    // 使用 hls.js 库处理 HLS 流
    const hls = new window.Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      if (streamConfig.autoPlay) {
        video.play().catch(e => {
          console.log('视频自动播放被阻止:', e);
        });
      }
    });
    hls.on(window.Hls.Events.ERROR, (event, data) => {
      console.log('HLS 错误:', data);
      // 如果加载失败，隐藏视频
      video.style.display = 'none';
    });
  } else {
    console.error('浏览器不支持 HLS 播放');
    video.style.display = 'none';
  }
}

// 绑定事件
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
        updateStatus('对话进行中');
        document.querySelector('#start-btn').disabled = true;
        document.querySelector('#stop-btn').disabled = false;
        
        // 在聊天区域添加开始信息
        const chatOutput = document.querySelector('#chat-output');
        const startDiv = document.createElement('div');
        startDiv.className = 'chat-message system-message';
        startDiv.innerHTML = `🎤 对话开始，请说话...`;
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

// 页面加载时自动初始化
window.addEventListener('DOMContentLoaded', async () => {
  console.log('应用已加载，开始自动初始化');
  
  try {
    // 首先加载前端配置文件
    await loadConfig();
    
    // 检查是否启用自动初始化
    if (!appConfig.ui.autoInit) {
      console.log('自动初始化已禁用');
      updateStatus('等待手动初始化');
      return;
    }
    
    // 初始化背景直播流
    initBackgroundStream();
    
    // 初始化绿幕去除功能
    initChromaKey();
    
    // 自动初始化 Duix
    await initDuix();
    
  } catch (error) {
    console.error('应用初始化失败:', error);
    updateStatus('初始化失败');
  }
});
