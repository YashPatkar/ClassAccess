import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

function PdfViewer() {
  const [pdfUrl, setPdfUrl] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const url = sessionStorage.getItem('pdf_url')
    if (!url) {
      navigate('/student')
      return
    }
    setPdfUrl(url)
  }, [navigate])

  // Disable download & print
  const layoutPlugin = defaultLayoutPlugin({
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: () => {},
      },
    },
    sidebarTabs: () => [],
  })

  if (!pdfUrl) return null

  return (
    <div className="h-screen w-screen bg-gray-100">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[layoutPlugin]}
        />
      </Worker>
    </div>
  )
}

export default PdfViewer
