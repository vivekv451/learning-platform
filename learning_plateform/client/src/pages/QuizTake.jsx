import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const QuizTake = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/api/quiz/${quizId}`);
      setQuiz(res.data);
      // Initialize answers
      const initialAnswers = {};
      res.data.questions.forEach((_, index) => {
        initialAnswers[index] = -1;
      });
      setAnswers(initialAnswers);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error('You have already taken this quiz');
        navigate('/quiz');
      } else {
        toast.error('Failed to load quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleSubmit = async () => {
    // Check if all questions answered
    const allAnswered = Object.values(answers).every(a => a !== -1);
    if (!allAnswered) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    
    try {
      const answerArray = Object.values(answers);
      await axios.post('/api/quiz/submit', {
        quizId,
        answers: answerArray
      });
      setSubmitted(true);
      toast.success('Quiz submitted successfully!');
      setTimeout(() => navigate('/quiz'), 2000);
    } catch (err) {
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h2 className="text-2xl font-bold mb-2">Quiz Submitted!</h2>
          <p>Your answers have been recorded. Results will be announced on the 15th.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600">{quiz.description}</p>
        <p className="text-sm text-gray-500 mt-2">Total Questions: {quiz.questions.length}</p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Question {qIndex + 1}: {question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, oIndex) => (
                <label key={oIndex} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={oIndex}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleAnswer(qIndex, oIndex)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizTake;