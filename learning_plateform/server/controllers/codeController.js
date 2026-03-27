const axios = require('axios');

// Execute code using Piston API
exports.runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;
    
    // Language mapping for Piston
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };
    
    const pistonLanguage = languageMap[language] || 'javascript';
    
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: pistonLanguage,
      version: '*',
      files: [{
        content: code
      }],
      stdin: input || ''
    });
    
    res.json({
      output: response.data.run.output,
      error: response.data.run.stderr
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Code execution failed' });
  }
};