import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`/api/courses/${courseId}`),
        axios.get(`/api/progress/course/${courseId}`)
      ]);
      setCourse(courseRes.data);
      setProgress(progressRes.data.completedChapters || []);
    } catch (err) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const isChapterCompleted = (index) => {
    return progress.includes(index);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center py-8">Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        {!user.premium && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              You're viewing free chapters (first 5). Upgrade to premium to access all chapters!
            </p>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Chapters</h2>
      <div className="space-y-4">
        {course.chapters.map((chapter, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">Chapter {index + 1}: {chapter.title}</h3>
              {isChapterCompleted(index) && (
                <span className="text-green-600 text-sm">✓ Completed</span>
              )}
            </div>
            <Link
              to={`/courses/${courseId}/chapter/${index}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {isChapterCompleted(index) ? 'Review' : 'Start'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;