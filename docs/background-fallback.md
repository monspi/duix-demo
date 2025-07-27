# 背景图片备用功能测试

## 功能概述
当视频流无法成功加载时，系统会自动切换到显示背景图片 `bg.png`。

## 触发条件
背景图片会在以下情况下自动加载：

1. **直播流地址为空**: `defaultStreamUrl` 为空
2. **HLS功能被禁用**: `enableHLS` 设置为 `false`
3. **视频加载错误**: 网络问题或流地址无效
4. **浏览器不支持HLS**: 浏览器不支持视频格式
5. **自动播放被阻止**: 浏览器阻止视频自动播放

## 配置方式

### 1. 基本配置
```json
{
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "/bg.png"
  }
}
```

### 2. 自定义背景图片
```json
{
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "/custom-background.jpg"
  }
}
```

### 3. 使用外部图片
```json
{
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "https://your-cdn.com/background.jpg"
  }
}
```

## 图片要求

### 推荐规格
- **分辨率**: 1920x1080 或更高
- **格式**: PNG, JPG, WebP
- **文件大小**: 建议小于 2MB
- **比例**: 16:9 最佳

### 放置位置
- 将图片文件放在 `public/` 目录下
- 在配置中使用相对路径 `/filename.ext`

## 样式效果
背景图片会应用以下CSS样式：
- `background-size: cover` - 覆盖整个容器
- `background-position: center` - 居中显示
- `background-repeat: no-repeat` - 不重复

## 测试方法

### 测试1: 空流地址
```json
{
  "livestream": {
    "defaultStreamUrl": "",
    "fallbackBackgroundImage": "/bg.png"
  }
}
```
**预期结果**: 立即显示背景图片

### 测试2: 无效流地址
```json
{
  "livestream": {
    "defaultStreamUrl": "https://invalid-url.m3u8",
    "fallbackBackgroundImage": "/bg.png"
  }
}
```
**预期结果**: 几秒后切换到背景图片

### 测试3: 禁用HLS
```json
{
  "livestream": {
    "defaultStreamUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "enableHLS": false,
    "fallbackBackgroundImage": "/bg.png"
  }
}
```
**预期结果**: 立即显示背景图片

## 调试信息
查看浏览器控制台可以看到：
- `"直播流地址为空，加载背景图片"`
- `"HLS功能已禁用，加载背景图片"`
- `"视频加载失败，切换到背景图片"`
- `"加载备用背景图片: /bg.png"`
- `"背景图片加载成功"` 或 `"背景图片加载失败"`

## 故障排除

### 背景图片不显示
1. 检查图片路径是否正确
2. 确认图片文件存在于 `public/` 目录
3. 检查图片文件权限
4. 查看浏览器控制台错误信息

### 图片显示模糊或变形
1. 使用更高分辨率的图片
2. 确保图片比例接近屏幕比例
3. 使用无损格式（PNG）

### 加载速度慢
1. 压缩图片文件大小
2. 使用 WebP 格式
3. 考虑使用 CDN 加速

## 最佳实践

1. **准备多个尺寸**: 为不同设备准备不同分辨率的图片
2. **预加载**: 系统会自动预加载图片确保快速显示
3. **备用方案**: 设置多个备用图片以提高可靠性
4. **性能优化**: 使用适当的图片格式和压缩
