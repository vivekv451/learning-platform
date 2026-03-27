import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobile, password) => {
    try {
      const res = await axios.post('/api/auth/login', { mobile, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setToken(token);
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setToken(token);
      setUser(user);
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put('/api/auth/profile', data);
      setUser(res.data.user);
      toast.success('Profile updated!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
      return false;
    }
  };

  const upgradePremium = async (schoolId) => {
    try {
      const res = await axios.post('/api/auth/upgrade-premium', { schoolId });
      setUser({ ...user, premium: true });
      toast.success(res.data.msg);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Upgrade failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    upgradePremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};