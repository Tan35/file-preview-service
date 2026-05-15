import { createClient } from '@supabase/supabase-js'

// Supabase configuration - replace with your own credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
})

// Debug: log the key prefix to verify correct key is loaded
console.log('🔑 Supabase Key prefix:', supabaseAnonKey.substring(0, 20) + '...')
console.log('🌐 Supabase URL:', supabaseUrl)

// Validate configuration on import
if (supabaseUrl === 'https://your-project-id.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn(
    '⚠️  Supabase configuration not set. Please create a .env file with:\n' +
    'VITE_SUPABASE_URL=your-project-url\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key'
  )
}

// Supported file types for preview
export const SUPPORTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/pdf', // .pdf
]

// File extension to MIME type mapping
export const FILE_EXTENSIONS: Record<string, string> = {
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.pdf': 'application/pdf',
}

// Maximum file size in bytes (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024

/**
 * Check if a file is supported
 */
export function isSupportedFileType(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ext in FILE_EXTENSIONS
}

/**
 * Generate Microsoft Office Online Viewer preview URL
 */
export function getPreviewUrl(fileUrl: string): string {
  const encodedUrl = encodeURIComponent(fileUrl)
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
}

// (诊断函数已移除 — 根因已定位并修复：使用UUID路径避免非ASCII字符导致S3 Invalid key)