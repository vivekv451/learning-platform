const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.get('/', auth, quizController.getQuizzes);
router.get('/:id', auth, quizController.getQuizById);
router.post('/submit', auth, quizController.submitQuiz);
router.get('/results/my', auth, quizController.getUserResults);
router.get('/results/all', auth, quizController.getAllResults);
router.post('/announce', auth, quizController.announceResults); // Admin only

module.exports = router;