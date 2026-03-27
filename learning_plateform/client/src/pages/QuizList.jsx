import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, resultsRes] = await Promise.all([
        axios.get('/api/quiz'),
        axios.get('/api/quiz/results/my')
      ]);
      setQuizzes(quizzesRes.data);
      setResults(resultsRes.data);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const hasTakenQuiz = (quizId) => {
    return results.some(r => r.quizId._id === quizId);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Quiz & Earn</h1>
        <p className="text-lg">Take quizzes and win prizes! Results announced on 15th of every month.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {quiz.questions?.length || 0} questions
                </div>
                {hasTakenQuiz(quiz._id) ? (
                  <span className="text-green-600 font-semibold">✓ Completed</span>
                ) : (
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Take Quiz
                  </Link>
                )}
              </div>
              {quiz.resultsAnnounced && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">Results are now announced! Check your dashboard.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Previous Results</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map(result => (
                  <tr key={result._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{result.quizId.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.score}/{result.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(result.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;