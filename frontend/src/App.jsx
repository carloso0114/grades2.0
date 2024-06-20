import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Login from './pages/Login';
import StudentView from './pages/StudentView';
import TeacherView from './pages/TeacherView';
import AdminView from './pages/AdminView';
import Navbar from './components/navBar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<ProtectedRoute element={StudentView} allowedRoles={['student']} />} />
        <Route path="/teacher" element={<ProtectedRoute element={TeacherView} allowedRoles={['teacher']} />} />
        <Route path="/admin" element={<ProtectedRoute element={AdminView} allowedRoles={['admin']} />} />
      </Routes>
    </Router>
  );
}

export default App;
