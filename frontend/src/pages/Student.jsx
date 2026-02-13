// src/pages/Student.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { accessPDF } from '../services/api';

function Student() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await accessPDF(code)

      // store signed URL temporarily
      sessionStorage.setItem('pdf_url', res.url)

      sessionStorage.setItem('pdf_code', code)
      
      navigate('/access/view')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="theme-page flex items-center justify-center py-8 sm:py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md px-4 sm:px-6 md:px-8 theme-card p-4 sm:p-6 md:p-8"
      >
        <h1 className="theme-title text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">View PDF</h1>

        <label className="block text-xs sm:text-sm theme-label mb-2">Session Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter 6-digit code"
          className="w-full theme-input mb-4 text-sm sm:text-base"
          required
        />

        {error && (
          <div className="text-xs sm:text-sm theme-alert-error mb-4">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full theme-button-primary text-sm sm:text-base py-2 sm:py-3"
        >
          View PDF
        </button>

        <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-4 text-center">
          Don't have a code? <a href="/" className="text-[var(--accent)] hover:underline font-medium">Go back home</a>
        </p>
      </form>
    </div>
  )
}

export default Student
