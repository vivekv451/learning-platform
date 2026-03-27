import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    class: '',
    city: '',
    schoolId: ''
  });
  const [schoolName, setSchoolName] = useState('');
  const [skipSchool, setSkipSchool] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifySchoolId = async () => {
    if (!formData.schoolId) return;
    try {
      const res = await axios.get(`/api/school/verify/${formData.schoolId}`);
      if (res.data.valid) {
        setSchoolName(res.data.name);
        toast.success(`School: ${res.data.name}`);
      } else {
        setSchoolName('');
        toast.error('Invalid School ID');
      }
    } catch (err) {
      setSchoolName('');
      toast.error('Error verifying school ID');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (skipSchool) {
      data.schoolId = '';
    }
    const success = await register(data);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="tel"
                name="mobile"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="class"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Class (e.g., 10th)"
                value={formData.class}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="city"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            
            {!skipSchool && (
              <div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="schoolId"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="School ID (optional)"
                    value={formData.schoolId}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={verifySchoolId}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Verify
                  </button>
                </div>
                {schoolName && (
                  <p className="mt-1 text-sm text-green-600">School: {schoolName}</p>
                )}
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="skipSchool"
                checked={skipSchool}
                onChange={(e) => setSkipSchool(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="skipSchool" className="ml-2 block text-sm text-gray-900">
                Skip school ID for now
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;