import { useEffect, useState } from 'react';
import api from '../services/api';

function TeacherDashboard() {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getTeacherPDFs()
        .then(setPdfs)
        .catch(() => setError('Failed to load PDFs'))
        .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this PDF from storage?')) return;

        try {
        await api.deleteTeacherPDF(id);
        setPdfs((prev) => prev.filter((p) => p.id !== id));
        } catch {
        alert('Delete failed');
        }
    };


  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Teacher Dashboard
      </h1>

      {pdfs.length === 0 ? (
        <p className="text-gray-600">
          No PDFs uploaded yet.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">File</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf) => (
                <tr
                  key={pdf.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {pdf.original_file_name}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {pdf.code}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(pdf.expires_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {pdf.is_expired ? (
                      <span className="text-red-600">
                        Expired
                      </span>
                    ) : (
                      <span className="text-green-600">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(pdf.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(pdf.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
