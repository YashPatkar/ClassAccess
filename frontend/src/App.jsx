import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Teacher from "./pages/Teacher";
import TeacherDashboard from "./pages/TeacherDashboard";
import Student from "./pages/Student";
import PdfViewer from "./pages/PdfViewer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Teacher (ALL protected) */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="" element={<Teacher />} />
                <Route path="dashboard" element={<TeacherDashboard />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Student (anonymous) */}
        <Route path="/student" element={<Student />} />
        <Route path="/student/view" element={<PdfViewer />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
