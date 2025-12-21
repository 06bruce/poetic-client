import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function SignIn({ onSuccess, onToggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    const result = await signin(email, password);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl glass mb-8">
      <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 flex items-center gap-2 text-red-200">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <FiMail size={18} className="text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent outline-none"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <FiLock size={18} className="text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="flex-1 bg-transparent outline-none"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
