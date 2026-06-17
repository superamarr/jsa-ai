import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadDocument } from '../api'
import Toast from './Toast'

export default function UploadForm({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })
  const closeToast = () => setToast(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    closeToast()
    setUploading(true)
    setProgress(0)

    try {
      const res = await uploadDocument(file, (e) => {
        const pct = Math.round((e.loaded * 100) / e.total)
        setProgress(pct)
      })

      const msg = res.data.message || `"${file.name}" berhasil diupload!`
      showToast(msg, res.data.success ? 'success' : 'error')
      if (onUploadSuccess) onUploadSuccess(res.data)
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Gagal upload file', 'error')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Lepaskan file di sini...'
            : 'Seret & lepas file JSA di sini, atau klik untuk memilih'}
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF, DOCX, DOC, TXT (max 10MB)</p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Mengupload...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  )
}
