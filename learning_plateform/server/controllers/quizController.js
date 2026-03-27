const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Notification = require('../models/Notification');

// Get available quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer');
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get quiz with questions (for taking)
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    
    // Check if user already submitted
    const existingResult = await QuizResult.findOne({
      userId: req.user.id,
      quizId: quiz._id
    });
    
    if (existingResult) {
      return res.status(400).json({ msg: 'You have already taken this quiz' });
    }
    
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers array of indices
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    
    // Check if already submitted
    const existingResult = await QuizResult.findOne({
      userId: req.user.id,
      quizId
    });
    
    if (existingResult) {
      return res.status(400).json({ msg: 'You have already taken this quiz' });
    }
    
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    const result = new QuizResult({
      userId: req.user.id,
      quizId,
      score,
      total: quiz.questions.length
    });
    
    await result.save();
    
    // Create notification
    const notification = new Notification({
      userId: req.user.id,
      message: `You scored ${score}/${quiz.questions.length} on "${quiz.title}". Results will be announced on 15th.`
    });
    await notification.save();
    
    res.json({ msg: 'Quiz submitted successfully', score, total: quiz.questions.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get quiz results for user
exports.getUserResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user.id })
      .populate('quizId', 'title month resultsAnnounced');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all results (for admin, to announce)
exports.getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate('userId', 'name mobile')
      .populate('quizId', 'title');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Announce results (admin only)
exports.announceResults = async (req, res) => {
  try {
    const { quizId } = req.body;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    
    quiz.resultsAnnounced = true;
    await quiz.save();
    
    // Notify all participants
    const results = await QuizResult.find({ quizId });
    for (const result of results) {
      const notification = new Notification({
        userId: result.userId,
        message: `Results for "${quiz.title}" are now announced! You scored ${result.score}/${result.total}.`
      });
      await notification.save();
    }
    
    res.json({ msg: 'Results announced successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};