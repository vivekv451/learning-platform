const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const auth = require('../middleware/auth');

router.get('/verify/:schoolId', schoolController.verifySchoolId);
router.get('/pending/:schoolId', auth, schoolController.getPendingStudents);
router.post('/approve/:studentId', auth, schoolController.approveStudent);
router.post('/create', schoolController.createSchool); // For demo

module.exports = router;