const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const auth = require('../middleware/auth');

router.post('/run', auth, codeController.runCode);

module.exports = router;