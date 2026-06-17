import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDocuments } from '../api'

export default function Home() {
  const [docCount, setDocCount] = useState(0)

  useEffect(() => {
    getDocuments()
      .then((res) => setDocCount(res.data.documents.length))
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistem RAG <span className="text-primary-600">JSA Kideco</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Upload dokumen Job Safety Analysis (JSA) dan tanyakan apapun tentang prosedur
          keselamatan kerja dengan bantuan AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <Link
            to="/upload"
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload JSA</h3>
            <p className="text-sm text-gray-500">Upload dokumen PDF, DOCX, atau TXT</p>
          </Link>

          <Link
            to="/chat"
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tanya JSA</h3>
            <p className="text-sm text-gray-500">Tanyakan prosedur keselamatan kerja</p>
          </Link>
        </div>

        <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{docCount} dokumen JSA tersimpan</span>
        </div>
      </div>
    </div>
  )
}
