'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '@/lib/hooks/reduxHooks';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, user, login, logout, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Auto-redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
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

  // Guest Login with proper auth context
  const handleGuestLogin = () => {
    const guestData = {
      username: 'Guest',
      email: 'guest@shoporbil.demo',
      isGuest: true,
      guestId: `guest_${Date.now()}`
    };
    localStorage.setItem('user', JSON.stringify(guestData));
    router.push('/home');
  };

  // Demo login helper
  const handleDemoLogin = () => {
    setUsername('mor_2314');
    setPassword('83r5^_');
  };

  // If already logged in - show welcome screen
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-green-200 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-green-100 rounded-full animate-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
            <p className="text-slate-600">
              Logged in as <span className="font-bold text-green-600">{user.username}</span>
            </p>
          </div>

          {/* User Status Badge */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <p className="text-sm font-semibold text-green-700">
              {user.isGuest === true ? '👤 Guest Mode' : '✓ Authenticated User'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/home')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Continue to Shop
            </button>
            <button
              onClick={logout}
              className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Loading message */}
          <p className="text-center text-slate-500 text-sm">
            Redirecting in a moment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600 text-lg">Sign in to your account to continue shopping</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 space-y-6">
          {/* Error Message */}
          {(localError || error) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 font-medium text-sm">{localError || error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all hover:border-slate-400"
                  required
                  disabled={loading}
                  aria-label="Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all hover:border-slate-400"
                  required
                  disabled={loading}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg"
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-medium">Or continue as</span>
            </div>
          </div>

          {/* Guest Login Button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            👤 Continue as Guest
          </button>
        </div>

        {/* Demo Credentials Section */}
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Demo Account
            </h3>
            <p className="text-sm text-slate-600">Use these credentials to test the app:</p>
            
            {/* Credentials Display */}
            <div className="space-y-2 bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600">Username:</span>
                <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                  mor_2314
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600">Password:</span>
                <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                  83r5^_
                </code>
              </div>
            </div>

            {/* Quick Demo Button */}
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📋 Use Demo Credentials
            </button>

            <p className="text-xs text-slate-500 text-center">
              Or use any other FakeStore API credentials
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-xs mt-6 space-y-1">
          <p>Credentials provided by FakeStore API</p>
          <p>Guest mode available for browsing</p>
        </div>
      </div>
    </div>
  );
}
