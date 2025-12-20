import { useState } from 'react';
import api from '../services/api';

function Teacher() {
  const [file, setFile] = useState(null);
  const [expiresAt, setExpiresAt] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await api.uploadPDF(file, expiresAt);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload PDF</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                PDF File
              </label>
              <input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date & Time
              </label>
              <input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {code && (
              <div className="text-sm text-green-700 bg-green-50 p-4 rounded">
                <p className="font-medium mb-1">Session code generated:</p>
                <p className="font-mono text-lg">{code}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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

