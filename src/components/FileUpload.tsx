import React, { useState, useRef } from 'react'
import {
  supabase,
  isSupportedFileType,
  getPreviewUrl,
  getProxyUrl,
  MAX_FILE_SIZE,
  FILE_EXTENSIONS,
} from '../lib/supabase'

interface FileUploadProps {
  onFileUploaded: (previewUrl: string, fileUrl: string, originalName: string) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `文件大小超过限制。最大允许 ${MAX_FILE_SIZE / 1024 / 1024}MB。`
    }

    // Check file type
    if (!isSupportedFileType(file)) {
      const supportedExtensions = Object.keys(FILE_EXTENSIONS).join(', ')
      return `不支持的文件类型。支持的类型：${supportedExtensions}`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    setError(null)
    setSuccess(null)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 生成安全的上传路径：使用UUID替代原始文件名（避免中文等非ASCII字符导致S3 "Invalid key"）
      const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
      const safeFileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `uploads/${safeFileName}`

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Debug: log upload details
      console.log('📁 Upload path:', filePath)
      console.log('📦 File:', file.name, file.size, file.type)

      // Supabase SDK 上传（使用安全路径 + 原始文件名存入metadata）
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public_office')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: { originalName: file.name }
        })

      console.log('📤 上传结果:', { data: uploadData, error: uploadError })

      clearInterval(progressInterval)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // 使用代理 URL（隐藏 Supabase 域名，自定义域名后自动生效）
      const fileUrl = getProxyUrl(filePath)
      const previewUrl = getPreviewUrl(fileUrl)

      setUploadProgress(100)
      setSuccess('文件上传成功！正在生成预览...')

      // Notify parent component (传递原始文件名)
      onFileUploaded(previewUrl, fileUrl, file.name)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : '文件上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.xlsx,.pptx,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-16 h-16 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          {/* Text */}
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isUploading ? '正在上传...' : '拖拽文件到这里，或点击选择文件'}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              支持的文件类型：.docx, .xlsx, .pptx, .pdf
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              最大文件大小：50MB
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              上传进度
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}