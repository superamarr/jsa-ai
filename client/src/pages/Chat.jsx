import ChatInterface from '../components/ChatInterface'

export default function Chat() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Tanya JSA</h1>
      <p className="text-gray-500 mb-6">
        Tanyakan apapun tentang prosedur keselamatan kerja berdasarkan dokumen JSA.
      </p>
      <ChatInterface />
    </div>
  )
}
