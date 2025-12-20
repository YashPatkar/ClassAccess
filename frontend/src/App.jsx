// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Teacher from './pages/Teacher'
import Student from './pages/Student'
import PdfViewer from './pages/PdfViewer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <Teacher />
            </ProtectedRoute>
          }
        />

        <Route path="/student" element={<Student />} />
        <Route path="/student/view" element={<PdfViewer />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
