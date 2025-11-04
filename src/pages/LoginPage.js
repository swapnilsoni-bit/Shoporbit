import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login, logout, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!username.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    // Call API login
    const success = await login(username, password);
    if (!success) {
      setLocalError(error || 'Login failed');
    }
  };

  const handleGuestLogin = () => {
    const guestData = { username: 'Guest', email: 'guest@fakestoreapi.com', isGuest: true };
    localStorage.setItem('user', JSON.stringify(guestData));
    navigate('/');
  };

  // If already logged in - show welcome screen
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-green-200">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome Back!</h1>
          <p className="text-slate-600 text-center mb-6">
            Logged in as <span className="font-semibold text-green-600">{user.username}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Continue to Shop
            </button>
            <button
              onClick={logout}
              className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your account to continue shopping</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {(localError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 font-medium text-sm">{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-70 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue as</span>
            </div>
          </div>

          {/* Guest Button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
            disabled={loading}
          >
            Continue as Guest
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600 text-sm mt-6 space-y-2">
          <p>
            Demo credentials from FakeStore API:
          </p>
          <p className="font-semibold text-slate-900 bg-slate-100 p-3 rounded-lg">
            Username: mor_2314<br/>
            Password: 83r5^_
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Or use any other FakeStore API credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
