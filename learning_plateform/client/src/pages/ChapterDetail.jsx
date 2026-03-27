import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import CodeRunner from '../components/CodeRunner';

const ChapterDetail = () => {
  const { courseId, chapterIndex } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPractical, setShowPractical] = useState(false);

  useEffect(() => {
    fetchChapter();
  }, [courseId, chapterIndex]);

  const fetchChapter = async () => {
    try {
      const res = await axios.get(`/api/courses/${courseId}`);
      setCourse(res.data);
      const chapterData = res.data.chapters[chapterIndex];
      if (!chapterData) {
        toast.error('Chapter not found');
        navigate(`/courses/${courseId}`);
        return;
      }
      setChapter(chapterData);
      
      // Check if chapter is completed
      const progressRes = await axios.get(`/api/progress/course/${courseId}`);
      const completedChapters = progressRes.data.completedChapters || [];
      setCompleted(completedChapters.includes(parseInt(chapterIndex)));
    } catch (err) {
      toast.error('Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    if (completed) return;
    try {
      await axios.post('/api/progress/complete', {
        courseId,
        chapterIndex: parseInt(chapterIndex)
      });
      setCompleted(true);
      toast.success('Congratulations! You completed this chapter!');
    } catch (err) {
      toast.error('Failed to mark chapter as complete');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!chapter) {
    return <div className="text-center py-8">Chapter not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Chapter {parseInt(chapterIndex) + 1}: {chapter.title}</h1>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={markComplete}
          disabled={completed}
          className={`px-6 py-2 rounded-lg ${
            completed
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {completed ? 'Completed ✓' : 'Mark as Complete'}
        </button>
        
        <button
          onClick={() => setShowPractical(!showPractical)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          {showPractical ? 'Hide Practical' : 'Try Practical'}
        </button>
      </div>

      {showPractical && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Code Practice</h3>
          <CodeRunner initialCode={chapter.codeExample || '// Write your code here\nconsole.log("Hello, World!");'} />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {parseInt(chapterIndex) > 0 && (
          <button
            onClick={() => navigate(`/courses/${courseId}/chapter/${parseInt(chapterIndex) - 1}`)}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Previous Chapter
          </button>
        )}
        {course && parseInt(chapterIndex) < course.chapters.length - 1 && (
          <button
            onClick={() => navigate(`/courses/${courseId}/chapter/${parseInt(chapterIndex) + 1}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ml-auto"
          >
            Next Chapter
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterDetail;