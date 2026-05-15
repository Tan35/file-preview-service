import { useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { FilePreview } from './components/FilePreview'

function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleFileUploaded = (url: string, fileUrl: string, originalName: string) => {
    setPreviewUrl(url)
    setFileUrl(fileUrl)
    setFileName(originalName || '预览文件')
  }

  const handleNewUpload = () => {
    setPreviewUrl(null)
    setFileUrl(null)
    setFileName('')
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  文件预览服务
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  上传 Office 文档，立即在线预览
                </p>
              </div>
            </div>

            {previewUrl && (
              <button
                onClick={handleNewUpload}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                上传新文件
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!previewUrl ? (
          /* Upload View */
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-full max-w-2xl">
              <FileUpload onFileUploaded={handleFileUploaded} />
            </div>
          </div>
        ) : (
          /* Preview View — 撑满剩余空间 */
          <div className="flex-1 flex flex-col overflow-hidden">
            <FilePreview
              previewUrl={previewUrl}
              fileUrl={fileUrl || ''}
              fileName={fileName}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            使用 Microsoft Office Online Viewer 预览文档 • 支持 .docx, .xlsx, .pptx, .pdf
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App