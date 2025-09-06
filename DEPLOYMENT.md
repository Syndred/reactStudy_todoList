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
**重要**: 需要在 Vercel 中配置以下环境变量才能使 Cloudflare R2 功能正常工作：

在 Vercel 项目设置中添加以下环境变量：
- `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID` = `abf9a87a1055214a87809da4e41c64fb`
- `NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID` = `74ac5eb370dc4a63f36d492b3cf6e81d`
- `NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY` = `4533a38061be908ccccbd3be3f13a16b78b42eb286400a2f7d432541f391277c`
- `NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME` = `syndred`
- `NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT` = `https://abf9a87a1055214a87809da4e41c64fb.r2.cloudflarestorage.com`
- `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL` = `https://pub-abf9a87a1055214a87809da4e41c64fb.r2.dev/syndred`

**配置步骤**:
1. 在 Vercel 项目页面，点击 "Settings" 选项卡
2. 点击左侧菜单的 "Environment Variables"
3. 逐一添加上述环境变量
4. 重新部署项目以使环境变量生效

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
