import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PdfViewer() {
  const canvasRef = useRef(null);

  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.2);

  const [code, setCode] = useState(null);

  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiData, setAiData] = useState(null);

  const navigate = useNavigate();

  // Load PDF + code
  useEffect(() => {
    const url = sessionStorage.getItem("pdf_url");
    const storedCode = sessionStorage.getItem("pdf_code");

    if (!url || !storedCode) {
      navigate("/student");
      return;
    }

    setCode(storedCode);

    pdfjsLib.getDocument(url).promise.then((loadedPdf) => {
      setPdf(loadedPdf);
    });
  }, [navigate]);

  // Render page
  useEffect(() => {
    if (!pdf) return;

    pdf.getPage(pageNum).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({
        canvasContext: context,
        viewport,
      });
    });
  }, [pdf, pageNum, scale]);

  // Fetch AI summary
  const handleAISummary = async () => {
    setShowAI(true);
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/ai/summary/${code}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch AI summary");
      }

      setAiData(data);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (!pdf) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b">
        <button onClick={() => setPageNum((p) => Math.max(p - 1, 1))}>
          Prev
        </button>

        <span className="text-sm">
          Page {pageNum} / {pdf.numPages}
        </span>

        <button
          onClick={() =>
            setPageNum((p) => Math.min(p + 1, pdf.numPages))
          }
        >
          Next
        </button>

        <button onClick={() => setScale((s) => s - 0.1)}>−</button>
        <button onClick={() => setScale((s) => s + 0.1)}>+</button>

        <button
          className="ml-auto px-3 py-1 border rounded"
          onClick={handleAISummary}
        >
          AI Summary
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-4">
        <canvas ref={canvasRef} />
      </div>

      {/* AI Side Panel */}
      {showAI && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white border-l shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-lg">AI Summary</h2>
            <button
              onClick={() => setShowAI(false)}
              className="text-gray-500"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiLoading && (
              <p className="text-sm text-gray-500">
                Generating summary…
              </p>
            )}

            {aiError && (
              <p className="text-sm text-red-600">{aiError}</p>
            )}

            {aiData && (
              <>
                <div>
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p className="text-sm text-gray-700">
                    {aiData.summary}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Key Points</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {aiData.key_points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfViewer;
