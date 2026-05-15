# MEMORY.md - 长期记忆

## 技术发现

### Supabase API 键兼容性问题
- **问题**：使用新的 `sb_publishable_` 格式 API 键调用 Supabase Storage API 时，会出现 "Invalid key" 错误。
- **解决方案**：切换到 legacy anon 键（JWT 格式，以 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.` 开头）。
- **影响范围**：Supabase Storage API 的上传和访问功能。
- **发现日期**：2026-05-16
- **验证状态**：已验证，使用 legacy anon 键可以成功上传文件并生成公开链接。

### 项目技术栈
- **前端框架**：Vite + React + TypeScript + Tailwind CSS
- **后端服务**：Supabase Storage（文件存储）+ Microsoft Office Online Viewer（文档预览）
- **部署平台**：Vercel（前端）+ Supabase（后端）
- **免费层限制**：Supabase 1GB 存储、50MB 文件大小限制；Vercel 100GB 带宽

## 用户偏好

### 开发环境
- **操作系统**：Windows
- **Shell**：bash
- **开发工具**：WorkBuddy IDE
- **浏览器**：Edge（默认）

### 项目信息
- **项目名称**：File Preview Service（文件预览服务）
- **项目路径**：C:\Users\14869\WorkBuddy\2026-05-16-task-14
- **Supabase 项目**：xmbasqtqwvvmtcqmpghv
- **Bucket 名称**：public_office（PUBLIC）