import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CodeRunner = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await axios.post('/api/code/run', {
        language,
        code,
        input
      });
      setOutput(res.data.output || res.data.error || 'No output');
    } catch (err) {
      setOutput('Error executing code. Please try again.');
      toast.error('Code execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        <button
          onClick={runCode}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 bg-gray-800 text-white font-mono p-4 rounded mb-4"
        placeholder="Write your code here..."
      />
      
      <div className="mb-4">
        <label className="text-white block mb-2">Input (stdin):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 bg-gray-800 text-white font-mono p-2 rounded"
          placeholder="Enter input for your program..."
        />
      </div>
      
      <div>
        <label className="text-white block mb-2">Output:</label>
        <pre className="bg-gray-800 text-white font-mono p-4 rounded overflow-x-auto min-h-32">
          {output || 'Run your code to see output'}
        </pre>
      </div>
    </div>
  );
};

export default CodeRunner;