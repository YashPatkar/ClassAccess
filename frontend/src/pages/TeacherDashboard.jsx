import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeacherPDFs, deleteTeacherPDF } from '../services/api';

function TeacherDashboard() {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getTeacherPDFs()
        .then(setPdfs)
        .catch(() => setError('Failed to load PDFs'))
        .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this PDF from storage?')) return;

        try {
        await deleteTeacherPDF(id);
        setPdfs((prev) => prev.filter((p) => p.id !== id));
        } catch {
        alert('Delete failed');
        }
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    };


  if (loading) {
    return (
      <div className="theme-page">
        <div className="theme-container text-[var(--ink-muted)]">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-page">
        <div className="theme-container theme-alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="theme-page">
      <div className="theme-container">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="theme-title text-xl sm:text-2xl font-semibold">
            Teacher Dashboard
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/teacher/upload')}
              className="theme-button-ghost px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Uploads
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

        {pdfs.length === 0 ? (
          <p className="text-[var(--ink-muted)]">
            No PDFs uploaded yet.
          </p>
        ) : (
          <div className="theme-table overflow-x-auto -mx-[1.5rem] sm:mx-auto px-[1.5rem] sm:px-0">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-[var(--surface-2)] border-b sticky top-0 z-10">
                <tr>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold">File</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold">Code</th>
                  <th className="hidden sm:table-cell px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold">Expiry</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold">Status</th>
                  <th className="hidden md:table-cell px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold">Created</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {pdfs.map((pdf) => (
                  <tr
                    key={pdf.id}
                    className="border-b hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <td className="px-3 sm:px-5 py-3 sm:py-4 text-[var(--ink)]">
                      <div className="max-w-[120px] sm:max-w-[340px] truncate text-xs sm:text-base" title={pdf.original_file_name}>
                        {pdf.original_file_name}
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 sm:py-4">
                      <span className="inline-flex items-center rounded-full bg-[#eef3ff] px-2 sm:px-3 py-1 font-mono text-[12px] sm:text-[15px] tracking-wide text-[#1b3b9a]">
                        {pdf.code}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-5 py-3 sm:py-4 text-[var(--ink-muted)] text-xs sm:text-base">
                      <div className="max-w-[140px] truncate">
                        {new Date(pdf.expires_at).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 sm:py-4">
                      {pdf.is_expired ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 sm:px-3 py-1 text-[11px] sm:text-sm text-red-600 font-medium">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 sm:px-3 py-1 text-[11px] sm:text-sm text-emerald-700 font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-5 py-3 sm:py-4 text-[var(--ink-muted)] text-xs sm:text-base">
                      <div className="max-w-[140px] truncate">
                        {new Date(pdf.created_at).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 sm:py-4">
                      <button
                        onClick={() => handleDelete(pdf.id)}
                        className="text-red-600 hover:text-red-800 hover:underline text-xs sm:text-base font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
