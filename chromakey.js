/**
 * 高级绿幕去除工具
 * 使用 Canvas 和 WebGL 实现精确的绿幕背景去除
 */

class ChromaKeyRemover {
  constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    // 绿幕颜色阈值设置
    this.chromaKey = {
      r: 0,    // 绿色的红色分量
      g: 255,  // 绿色的绿色分量  
      b: 0,    // 绿色的蓝色分量
      threshold: 100, // 颜色容差
      smoothing: 0.1  // 边缘平滑
    };
    
    this.isProcessing = false;
  }
  
  /**
   * 开始绿幕去除处理
   */
  start() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.processFrame();
  }
  
  /**
   * 停止绿幕去除处理
   */
  stop() {
    this.isProcessing = false;
  }
  
  /**
   * 处理单帧视频
   */
  processFrame() {
    if (!this.isProcessing) return;
    
    // 确保canvas尺寸与视频匹配
    if (this.canvas.width !== this.video.videoWidth) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
    }
    
    // 绘制原始视频帧到canvas
    this.ctx.drawImage(this.video, 0, 0);
    
    // 获取像素数据
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    // 处理每个像素
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // 计算与绿幕颜色的距离
      const distance = Math.sqrt(
        Math.pow(r - this.chromaKey.r, 2) +
        Math.pow(g - this.chromaKey.g, 2) +
        Math.pow(b - this.chromaKey.b, 2)
      );
      
      // 如果像素接近绿幕颜色，设置为透明
      if (distance < this.chromaKey.threshold) {
        // 计算透明度
        const alpha = Math.max(0, (distance / this.chromaKey.threshold));
        data[i + 3] = alpha * 255; // 设置alpha通道
      }
    }
    
    // 将处理后的数据写回canvas
    this.ctx.putImageData(imageData, 0, 0);
    
    // 请求下一帧
    requestAnimationFrame(() => this.processFrame());
  }
  
  /**
   * 调整绿幕参数
   */
  setChromaKey(options) {
    this.chromaKey = { ...this.chromaKey, ...options };
  }
  
  /**
   * 获取处理后的canvas作为视频源
   */
  getCanvas() {
    return this.canvas;
  }
}

// 导出供主应用使用
window.ChromaKeyRemover = ChromaKeyRemover;
