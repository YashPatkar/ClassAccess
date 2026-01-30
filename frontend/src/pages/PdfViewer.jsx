import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { askAI } from "../services/ai";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/* =========================================
   1. GLOBAL STYLES (Dynamic Scrollbar)
   ========================================= */

const GlobalStyles = ({ isDarkMode }) => {
  const scrollbarColor = isDarkMode ? "#5e5e5e" : "#dadce0";
  const hoverColor = isDarkMode ? "#888" : "#bdc1c6";
  const selectionBg = isDarkMode ? "#4285f4" : "#c2e7ff";
  const selectionText = isDarkMode ? "#fff" : "#000";

  return (
    <style>{`
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${scrollbarColor} transparent;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: ${scrollbarColor};
        border-radius: 20px;
        border: 3px solid transparent;
        background-clip: content-box;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: ${hoverColor};
      }
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
      }
      ::selection {
        background: ${selectionBg}; 
        color: ${selectionText};
      }
    `}</style>
  );
};

/* =========================================
   2. ICON SYSTEM
   ========================================= */

const Icons = {
  Menu: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
  ),
  GeminiLogo: ({ className }) => (
     <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M11.5,2C11.5,6.5 8,9.5 3.5,9.5C8,9.5 11.5,13 11.5,17.5C11.5,13 15,9.5 19.5,9.5C15,9.5 11.5,6.5 11.5,2Z" />
     </svg>
  ),
  Close: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
  ),
  SendArrow: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
  ),
  ReturnArrow: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 10 4 15 9 20"></polyline>
        <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
    </svg>
  ),
  Sun: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Moon: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  )
};

/* =========================================
   3. TOOLBAR COMPONENT
   ========================================= */

const Toolbar = ({ pageNum, numPages, scale, setScale, setPage, onToggleAI, isAIActive, isDarkMode, toggleTheme }) => {
    // Theme Colors
    const bg = isDarkMode ? "bg-[#1e1e1e]" : "bg-white";
    const border = isDarkMode ? "border-[#3c4043]" : "border-gray-200";
    const textMain = isDarkMode ? "text-gray-200" : "text-gray-700";
    const textMuted = isDarkMode ? "text-gray-400" : "text-gray-400";
    const controlBg = isDarkMode ? "bg-[#2b2d30]" : "bg-[#f1f3f4]";
    const controlHover = isDarkMode ? "hover:bg-[#3c4043]" : "hover:bg-gray-200";
    const iconColor = isDarkMode ? "text-gray-300" : "text-gray-600";

    return (
        <div className={`h-14 ${bg} flex items-center justify-between px-4 border-b ${border} shadow-sm relative z-30 transition-colors duration-300`}>
             {/* Left: Page Control */}
             <div className={`flex items-center gap-2 ${controlBg} rounded-full px-1 py-1`}>
                 <button className={`${iconColor} ${controlHover} rounded-full w-8 h-8 flex items-center justify-center transition-colors`} onClick={() => setPage(p => Math.max(1, p-1))}>
                    ‹
                 </button>
                 <div className={`px-2 ${textMain} text-sm font-medium font-mono min-w-[30px] text-center`}>
                    {pageNum}
                 </div>
                 <span className={`${textMuted} text-sm mr-1`}>/ {numPages || '--'}</span>
                 <button className={`${iconColor} ${controlHover} rounded-full w-8 h-8 flex items-center justify-center transition-colors`} onClick={() => setPage(p => Math.min(numPages, p+1))}>
                    ›
                 </button>
             </div>

             {/* Center: Zoom Controls */}
             <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className={`flex items-center ${controlBg} rounded-full px-1 border border-transparent shadow-sm`}>
                    <button onClick={() => setScale(s => Math.max(0.5, s-0.1))} className={`w-8 h-8 flex items-center justify-center ${iconColor} ${controlHover} rounded-full text-lg`}>−</button>
                    <span className={`w-12 text-center text-sm font-medium ${textMain}`}>{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(3, s+0.1))} className={`w-8 h-8 flex items-center justify-center ${iconColor} ${controlHover} rounded-full text-lg`}>+</button>
                </div>
             </div>

             {/* Right: Actions */}
             <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${controlHover} ${iconColor} transition-colors`}
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
                </button>

                {/* Ask AI Button */}
                <button 
                    onClick={onToggleAI}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm
                        ${isAIActive 
                            ? 'bg-[#c2e7ff] text-[#001d35]' 
                            : `${bg} border ${border} ${textMain} ${isDarkMode ? 'hover:bg-[#2b2d30]' : 'hover:bg-gray-50'}`
                        }
                    `}
                >
                    <Icons.GeminiLogo className={isAIActive ? "w-5 h-5 text-[#001d35]" : "w-5 h-5 text-[#1a73e8]"} />
                    Ask AI
                </button>
             </div>
        </div>
    );
};

/* =========================================
   4. GEMINI SIDEBAR COMPONENTS
   ========================================= */

const ChatMessage = ({ role, content, isDarkMode }) => {
    const isAi = role === 'ai';
    // Theme logic for messages
    const aiText = isDarkMode ? "text-gray-200" : "text-gray-800";
    const userBg = isDarkMode ? "bg-[#2b2d30]" : "bg-[#f1f3f4]";
    const userText = isDarkMode ? "text-white" : "text-gray-900";

    return (
        <div className={`mb-6 ${isAi ? '' : 'flex justify-end'}`}>
            <div className={`flex gap-3 max-w-[90%] ${isAi ? '' : 'flex-row-reverse'}`}>
                {isAi && (
                    <div className="w-6 h-6 min-w-[24px] mt-1">
                        <Icons.GeminiLogo className="w-5 h-5 text-[#1a73e8]" />
                    </div>
                )}
                <div className={`text-sm leading-relaxed ${isAi ? aiText : `${userBg} ${userText} px-4 py-3 rounded-2xl rounded-tr-sm`}`}>
                     {content}
                </div>
            </div>
        </div>
    );
};

const GeminiInput = ({ value, onChange, onSend, loading, isDarkMode }) => {
    const bg = isDarkMode ? "bg-[#1e1e1e]" : "bg-white";
    const border = isDarkMode ? "border-[#3c4043]" : "border-gray-100";
    const inputBg = isDarkMode ? "bg-[#2b2d30]" : "bg-[#f1f3f4]";
    const text = isDarkMode ? "text-gray-200" : "text-gray-800";
    const placeholder = isDarkMode ? "placeholder-gray-400" : "placeholder-gray-500";
    const focusBorder = isDarkMode ? "focus-within:border-gray-500" : "focus-within:border-gray-300 focus-within:shadow-md";

    return (
        <div className={`p-4 ${bg} border-t ${border}`}>
            <div className={`relative ${inputBg} rounded-2xl border border-transparent ${isDarkMode ? '' : 'focus-within:bg-white'} ${focusBorder} transition-all`}>
                <input 
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSend()}
                    placeholder="Ask Good Teacher..."
                    className={`w-full bg-transparent ${text} pl-4 pr-12 py-4 text-sm outline-none ${placeholder}`}
                    disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                     <button 
                        onClick={onSend}
                        disabled={!value.trim() && !loading}
                        className={`p-2 rounded-full flex items-center justify-center transition-all ${
                            value.trim() 
                            ? 'bg-[#0b57d0] text-white shadow-md' 
                            : isDarkMode ? 'bg-[#3c4043] text-gray-500' : 'bg-gray-200 text-gray-400'
                        }`}
                     >
                         <Icons.SendArrow className="w-5 h-5" />
                     </button>
                </div>
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-3">
                Good Teacher can make mistakes. Don't trust blindly.
            </p>
        </div>
    );
};

const SuggestionItem = ({ label, onClick, isDarkMode }) => {
    const hoverBg = isDarkMode ? "hover:bg-[#2b2d30]" : "hover:bg-[#f0f4f9]";
    const iconColor = isDarkMode ? "text-gray-500 group-hover:text-white" : "text-gray-400 group-hover:text-[#0b57d0]";
    const textColor = isDarkMode ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-gray-900";
    const border = isDarkMode ? "border-transparent" : "border-transparent hover:border-gray-200";

    return (
        <div 
            onClick={onClick}
            className={`flex items-start gap-3 p-3 ${hoverBg} rounded-xl cursor-pointer transition-colors group border ${border}`}
        >
            <div className={`mt-0.5 ${iconColor} transition-colors`}>
                <Icons.ReturnArrow className="w-4 h-4" />
            </div>
            <span className={`text-sm ${textColor} font-medium`}>{label}</span>
        </div>
    );
};

const EmptyState = ({ onSuggestionClick, isDarkMode }) => {
    const gradientClass = isDarkMode 
        ? "bg-gradient-to-r from-[#4285F4] to-[#9B72CB]" 
        : "bg-gradient-to-r from-[#1967d2] via-[#7b1fa2] to-[#d93025]";

    return (
        <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="mb-12">
                <h2 className={`text-3xl font-normal text-center ${gradientClass} bg-clip-text text-transparent pb-1`}>
                    Ask about your files
                </h2>
            </div>
            <div className="absolute bottom-4 w-full px-4 flex flex-col gap-1">
                <SuggestionItem isDarkMode={isDarkMode} label="List the main points for this file" onClick={() => onSuggestionClick("List the main points for this file")} />
                <SuggestionItem isDarkMode={isDarkMode} label="Ask any topic about this file" onClick={() => onSuggestionClick("What is this file about?")} />
            </div>
        </div>
    );
};

const GeminiSidebar = ({ 
    messages, input, setInput, handleSend, loading, onClose, messagesEndRef, isDarkMode 
}) => {
    // Theme classes
    const bg = isDarkMode ? "bg-[#1e1e1e]" : "bg-white";
    const border = isDarkMode ? "border-[#3c4043]" : "border-gray-200";
    const headerText = isDarkMode ? "text-gray-200" : "text-gray-800";
    const closeHover = isDarkMode ? "hover:bg-[#3c4043] text-gray-300" : "hover:bg-gray-100 text-gray-600";

    return (
        <div className={`w-[400px] ${bg} flex flex-col border-l ${border} h-full shadow-xl relative z-20 transition-colors duration-300`}>
            {/* Sidebar Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2">
                    <span className={`${headerText} text-lg font-medium`}>Good Teacher</span>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={onClose} className={`p-2 rounded-full transition-colors ${closeHover}`}>
                        <Icons.Close className="w-5 h-5" />
                     </button>
                </div>
            </div>

            {/* Chat Content */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col relative ${bg}`}>
                {messages.length === 0 ? (
                    <EmptyState isDarkMode={isDarkMode} onSuggestionClick={(text) => {
                        setInput(text);
                    }}/>
                ) : (
                    <div className="p-5 pt-4 flex-1">
                        {messages.map((msg, idx) => (
                            <ChatMessage key={idx} role={msg.role} content={msg.content} isDarkMode={isDarkMode} />
                        ))}
                        {loading && (
                            <div className="flex gap-3 mb-6 animate-pulse px-2">
                                <div className="w-6 h-6 mt-1"><Icons.GeminiLogo className="w-5 h-5 text-[#1a73e8]" /></div>
                                <div className={`h-4 w-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mt-2`}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <GeminiInput 
                value={input} 
                onChange={setInput} 
                onSend={handleSend} 
                loading={loading}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

/* =========================================
   5. MAIN PDF VIEWER LOGIC & LAYOUT
   ========================================= */

function PdfViewer() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // PDF State
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfUrl, setPdfUrl] = useState("");
  const [code, setCode] = useState("");
  
  // AI State
  const [showAI, setShowAI] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Session Data
  useEffect(() => {
    const url = sessionStorage.getItem("pdf_url");
    const storedCode = sessionStorage.getItem("pdf_code");
    if (url && storedCode) {
        setPdfUrl(url);
        setCode(storedCode);
    }
  }, [navigate]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const data = await askAI(code, userMsg).catch(() => ({ answer: "I can help analyze this document." }));
      setMessages(prev => [...prev, { role: "ai", content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  // Main Backgrounds
  const mainBg = isDarkMode ? "bg-[#1f1f1f]" : "bg-[#f8fafe]";
  const pdfAreaBg = isDarkMode ? "bg-[#282a2d]" : "bg-[#eef2f5]";
  const textMain = isDarkMode ? "text-gray-200" : "text-gray-900";

  return (
    <div className={`h-screen w-screen flex flex-col ${mainBg} ${textMain} overflow-hidden font-sans transition-colors duration-300`}>
        <GlobalStyles isDarkMode={isDarkMode} />
        
        {/* Toolbar */}
        <Toolbar 
            pageNum={pageNumber} 
            numPages={numPages} 
            scale={scale} 
            setScale={setScale}
            setPage={setPageNumber}
            onToggleAI={() => setShowAI(!showAI)}
            isAIActive={showAI}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Main Split Content */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Left: PDF Canvas Area */}
            <div className={`flex-1 ${pdfAreaBg} relative overflow-auto custom-scrollbar flex justify-center py-8 transition-colors duration-300`}>
                {pdfUrl ? (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={<div className="text-gray-500 mt-10 font-medium">Loading PDF...</div>}
                        error={<div className="text-red-500 mt-10">Failed to load PDF.</div>}
                        className="shadow-lg"
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            renderTextLayer={true} 
                            renderAnnotationLayer={true}
                            className="shadow-md bg-white" 
                        />
                    </Document>
                ) : (
                    <div className="text-gray-400 mt-20 flex flex-col items-center">
                        <p className="font-medium">No PDF Loaded</p>
                        <small>Check sessionStorage</small>
                    </div>
                )}
            </div>

            {/* Right: Gemini Sidebar */}
            {showAI && (
                <GeminiSidebar 
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    loading={loading}
                    onClose={() => setShowAI(false)}
                    messagesEndRef={messagesEndRef}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    </div>
  );
}

export default PdfViewer;