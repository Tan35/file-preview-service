# 修复完成：Supabase Storage 上传 "Invalid key" 根因

## 问题根因

浏览器 `fetch` 会自动 URL-encode 非 ASCII 字符。当上传路径包含中文文件名（如 `uploads/123-测试文档.docx`），浏览器将其编码为 `uploads/123-%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3.docx`，引入了 `%` 字符。S3 对象键规则禁止 `%` 字符，导致 400 "Invalid key" 错误。

## 修复方案

上传路径改用 `crypto.randomUUID() + 扩展名`（纯 ASCII），原始文件名存入 Supabase metadata。

| 修改前 | 修改后 |
|--------|--------|
| `uploads/123-测试文档.docx` | `uploads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.docx` |
| URL编码后含 `%` → S3拒绝 | 纯ASCII → S3接受 |

## 修改文件

- `src/components/FileUpload.tsx`：移除诊断调用，使用 UUID 路径
- `src/lib/supabase.ts`：移除 `diagnoseSupabase()` 函数（~120行）

## 验证

- TypeScript 编译：无新增错误
- 开发服务器：正常启动 `http://localhost:5174/`
