const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.get('/', auth, progressController.getUserProgress);
router.get('/course/:courseId', auth, progressController.getCourseProgress);
router.post('/complete', auth, progressController.completeChapter);

module.exports = router;