// src/pages/Student.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api';

function Student() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.accessPDF(code)

      // store signed URL temporarily
      sessionStorage.setItem('pdf_url', res.url)

      sessionStorage.setItem('pdf_code', code)
      
      navigate('/student/view')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-xl font-semibold mb-4">View PDF</h1>

        <label className="block text-sm mb-1">Session Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        {error && (
          <div className="text-red-600 text-sm mb-3">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          View PDF
        </button>
      </form>
    </div>
  )
}

export default Student
