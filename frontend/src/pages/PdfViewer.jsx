import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { askAI } from "../services/ai";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/* -----------------------------
   Utils
----------------------------- */

function scrollToBottom(ref) {
  ref.current?.scrollIntoView({ behavior: "smooth" });
}

function parseFormattedText(text) {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, idx) => {
    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("•")) {
      return (
        <li key={idx} className="ml-5 list-disc">
          {renderBoldText(line.replace(/^[-•]\s*/, ""))}
        </li>
      );
    }

    // Normal paragraph
    return (
      <p key={idx} className="mb-2">
        {renderBoldText(line)}
      </p>
    );
  });
}

function renderBoldText(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* -----------------------------
   Chat Message
----------------------------- */

function ChatMessage({ role, content }) {
  const isAI = role === "ai";

  return (
    <div className={`max-w-[85%] ${isAI ? "mr-auto" : "ml-auto"}`}>
      <div className="text-xs text-gray-500 mb-1">
        {isAI ? "Good Teacher" : "You"}
      </div>

      <div
        className={`px-4 py-3 rounded-lg leading-relaxed ${
          isAI ? "bg-gray-100 text-gray-900" : "bg-black text-white"
        }`}
      >
        {isAI ? (
          <div className="space-y-1">{parseFormattedText(content)}</div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

/* -----------------------------
   AI Chat Panel
----------------------------- */

function AIChatPanel({
  messages,
  input,
  loading,
  error,
  onInputChange,
  onSend,
  onClose,
  bottomRef,
}) {
  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white border-l shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold">Good Teacher</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.length === 0 && (
          <p className="text-gray-400">Ask anything about the PDF</p>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="text-gray-400 italic">Good Teacher is thinking…</div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <input
          value={input}
          disabled={loading}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask a question…"
          className="flex-1 border rounded px-3 py-2 text-sm outline-none disabled:bg-gray-100"
        />
        <button
          disabled={loading}
          onClick={onSend}
          className="px-3 py-2 bg-black text-white rounded text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* -----------------------------
   Main Component
----------------------------- */

function PdfViewer() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // PDF state
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfUrl, setPdfUrl] = useState("");
  const [code, setCode] = useState("");

  // AI state
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Load session */
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

  /* Auto-scroll */
  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const question = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const data = await askAI(code, question);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            data.answer || "This information is not present in the document.",
        },
      ]);
    } catch (err) {
      setError(err.message || "Good Teacher is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b sticky top-0 z-10">
        <button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}>
          Prev
        </button>

        <span className="text-sm">
          Page {pageNumber} / {numPages || "--"}
        </span>

        <button
          onClick={() => setPageNumber((p) => Math.min(p + 1, numPages || p))}
        >
          Next
        </button>

        <div className="flex gap-2 ml-4">
          <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}>
            −
          </button>
          <span className="text-xs self-center">
            {Math.round(scale * 100)}%
          </span>
          <button onClick={() => setScale((s) => Math.min(s + 0.2, 3.0))}>
            +
          </button>
        </div>

        <button
          className="ml-auto px-3 py-1 bg-black text-white rounded text-sm"
          onClick={() => setShowAI(true)}
        >
          Ask AI
        </button>
      </div>

      {/* PDF */}
      <div
        className={`overflow-auto flex justify-center p-4 ${
          showAI ? "w-[calc(100%-24rem)]" : "w-full"
        }`}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>

      {showAI && (
        <AIChatPanel
          messages={messages}
          input={input}
          loading={loading}
          error={error}
          onInputChange={setInput}
          onSend={handleSend}
          onClose={() => setShowAI(false)}
          bottomRef={messagesEndRef}
        />
      )}
    </div>
  );
}

export default PdfViewer;
