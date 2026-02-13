import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
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
        <Route path="/docs" element={<Docs />} />

        {/* Teacher (ALL protected) */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route index element={<Navigate to="upload" replace />} />
                <Route path="upload" element={<Teacher />} />
                <Route path="dashboard" element={<TeacherDashboard />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Access (anonymous) */}
        <Route path="/access" element={<Student />} />
        <Route path="/access/view" element={<PdfViewer />} />

        {/* Default */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
