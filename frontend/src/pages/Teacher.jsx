import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPDF } from '../services/api';

function Teacher() {
  const [file, setFile] = useState(null);
  const [expiresAt, setExpiresAt] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCode('');

    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (!expiresAt) {
      setError('Please select an expiry date and time');
      return;
    }

    setLoading(true);

    try {
      const response = await uploadPDF(file, expiresAt);
      setCode(response.code);
      setFile(null);
      setExpiresAt('');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Failed to copy code. Please try manually.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="theme-page">
      <div className="theme-container max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <h1 className="theme-title text-xl sm:text-2xl font-semibold text-[var(--ink)]">Upload PDF</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/teacher/dashboard')}
              className="theme-button-ghost px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="theme-button-ghost px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="theme-card p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="file" className="block text-xs sm:text-sm theme-label mb-2">
                PDF File
              </label>
              <input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full theme-input text-xs sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="expiresAt" className="block text-xs sm:text-sm theme-label mb-2">
                Expiry Date & Time
              </label>
              <input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
                className="w-full theme-input text-xs sm:text-base"
              />
            </div>

            {error && (
              <div className="text-xs sm:text-sm theme-alert-error">
                <span aria-hidden="true">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {code && (
              <div className="text-xs sm:text-sm theme-alert-success">
                <p className="font-medium mb-3">Session code generated:</p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3">
                  <p className="font-mono text-base sm:text-lg break-all">{code}</p>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="theme-button-ghost px-3 sm:px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    {copied ? '✓ Copied' : 'Copy code'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full theme-button-primary disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Teacher;

