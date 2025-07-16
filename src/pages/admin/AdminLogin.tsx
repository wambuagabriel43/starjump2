import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, Lock, User, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-royal-blue via-blue-600 to-blue-700">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-royal-blue via-blue-600 to-blue-700">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-16 bg-star-yellow/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-18 bg-fun-pink/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-royal-blue rounded-full p-4 shadow-lg">
                <Star className="h-12 w-12 text-star-yellow" fill="currentColor" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-royal-blue mb-2">Admin Login</h2>
            <p className="text-gray-600">Access Star Jump Content Management</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="flex items-center text-royal-blue font-semibold">
                <User className="h-5 w-5 mr-2" />
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center text-royal-blue font-semibold">
                <Lock className="h-5 w-5 mr-2" />
                Password
                  Email
              <div className="relative">
                <input
                  type="email"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
                  placeholder="admin@starjump.co.ke"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-royal-blue transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform shadow-lg ${
                isLoading
                  ? 'opacity-75 cursor-not-allowed'
                  : 'hover:from-blue-600 hover:to-royal-blue hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-royal-blue mb-2 text-sm">Demo Credentials:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Email: <span className="font-mono bg-white px-2 py-1 rounded">admin@starjump.co.ke</span></div>
              <div>Password: <span className="font-mono bg-white px-2 py-1 rounded">starjump2024</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;