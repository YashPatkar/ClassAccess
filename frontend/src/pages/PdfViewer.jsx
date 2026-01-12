import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

// Essential styles for sharp text and AI interactivity
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Set worker from CDN for reliability
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PdfViewer() {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfUrl, setPdfUrl] = useState("");
  const [code, setCode] = useState("");

  // AI State
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    const url = sessionStorage.getItem("pdf_url");
    const storedCode = sessionStorage.getItem("pdf_code");
    if (!url || !storedCode) {
      navigate("/student");
      return;
    }
    setPdfUrl(url);
    setCode(storedCode);
  }, [navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleAISummary = async () => {
    setShowAI(true);
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/summary/${code}`);
      const data = await res.json();
      setAiData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b sticky top-0 z-10">
        <button onClick={() => setPageNumber(p => Math.max(p - 1, 1))}>Prev</button>
        <span className="text-sm">Page {pageNumber} / {numPages || '--'}</span>
        <button onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}>Next</button>
        
        <div className="flex gap-2 ml-4">
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}>−</button>
          <span className="text-xs self-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(s + 0.2, 3.0))}>+</button>
        </div>

        <button className="ml-auto px-3 py-1 bg-black text-white rounded text-sm" onClick={handleAISummary}>
          AI Summary
        </button>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-auto flex justify-center p-4">
        <Document 
          file={pdfUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p>Loading PDF...</p>}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true} 
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* AI Panel (Simplified) */}
      {showAI && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white border-l shadow-2xl z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">AI Summary</h2>
            <button onClick={() => setShowAI(false)}>✕</button>
          </div>
          {aiLoading ? <p>Thinking...</p> : (
            aiData && <div className="text-sm space-y-4">
              <p>{aiData.summary}</p>
              <ul className="list-disc pl-4">{aiData.key_points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PdfViewer;