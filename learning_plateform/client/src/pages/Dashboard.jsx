import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, upgradePremium } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [schoolId, setSchoolId] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/progress')
      ]);
      setCourses(coursesRes.data);
      const progressMap = {};
      progressRes.data.forEach(p => {
        progressMap[p.courseId] = p.completedChapters.length;
      });
      setProgress(progressMap);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!schoolId) {
      toast.error('Please enter your School ID');
      return;
    }
    const success = await upgradePremium(schoolId);
    if (success) {
      setShowPremiumModal(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Public view when user is NOT logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to LearnHub</h1>
          <p className="text-xl mb-6">Your journey to mastering programming starts here</p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Why Learn with Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Free Chapters</h3>
            <p className="text-gray-600">Access first 5 chapters of every course for free.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Code Runner</h3>
            <p className="text-gray-600">Practice coding directly in your browser.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Quizzes & Prizes</h3>
            <p className="text-gray-600">Participate in monthly quizzes and win prizes.</p>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user dashboard (your existing code)
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || 'Student'}!</h1>
        <p className="text-lg">Continue your learning journey</p>
        {!user.premium && (
          <button
            onClick={() => setShowPremiumModal(true)}
            className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
          >
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* Courses Grid */}
      <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {progress[course._id] || 0} / {course.chapters.length} chapters completed
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{
                      width: `${((progress[course._id] || 0) / course.chapters.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Upgrade to Premium</h3>
            <p className="text-gray-600 mb-4">
              Enter your School ID to get premium access. Fee: ₹999/year
            </p>
            <input
              type="text"
              placeholder="School ID"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleUpgrade}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Pay & Upgrade
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;