import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import ChapterDetail from './pages/ChapterDetail';
import Profile from './pages/Profile';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/chapter/:chapterIndex" element={<ChapterDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:quizId" element={<QuizTake />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;