import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Invalid credentials or unauthorized access.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-serif font-bold text-center mb-6 text-gray-900">Admin Login</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@twinkle.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Demo Login: admin@twinkle.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;