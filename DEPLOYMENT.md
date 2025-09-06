# 部署到 Vercel

这是一个纯前端的文件传输助手应用，可以轻松部署到 Vercel。

## 部署步骤

### 1. 准备代码
确保所有代码都已提交到 Git 仓库。

### 2. 连接到 Vercel
- 访问 [Vercel](https://vercel.com) 并登录
- 点击 "New Project"
- 连接到你的 Git 仓库

### 3. 配置部署设置
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. 环境变量
无需特殊环境变量配置。

### 5. 部署
点击 "Deploy" 开始部署过程。

## 功能说明

### 当前功能
- ✅ 基于Cloudflare R2的对象存储，实现文件持久化
- ✅ 支持多设备文件共享和同步
- ✅ 支持文件上传和文件夹上传
- ✅ 文件列表展示和管理
- ✅ 文件下载功能
- ✅ 图片预览功能
- ✅ 二维码分享功能
- ✅ 响应式设计，支持移动端

### 注意事项
- **文件大小限制**: Cloudflare R2有其自身的文件大小限制。
- **网络依赖**: 文件上传和下载依赖于网络连接。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **文件处理**: React Dropzone
- **二维码**: qrcode.react
- **图标**: Lucide React
- **云存储**: Cloudflare R2 (通过 `@aws-sdk/client-s3`)
