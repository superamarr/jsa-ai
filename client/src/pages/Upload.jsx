import { useState } from 'react'
import UploadForm from '../components/UploadForm'
import DocumentList from '../components/DocumentList'

export default function Upload() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Dokumen JSA</h1>
      <p className="text-gray-500 mb-6">
        Upload file JSA (PDF, DOCX, DOC, TXT) untuk diproses oleh sistem RAG.
      </p>

      <UploadForm onUploadSuccess={handleUploadSuccess} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Daftar Dokumen</h2>
        <DocumentList refreshKey={refreshKey} />
      </div>
    </div>
  )
}
