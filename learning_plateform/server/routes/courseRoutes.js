const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.get('/', auth, courseController.getCourses);
router.get('/:id', auth, courseController.getCourseById);
router.post('/', courseController.createCourse); // Admin only, for demo

module.exports = router;