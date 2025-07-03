import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { User } from '../types';

export function AuthModal() {
  const { state, dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  if (!state.authModal || state.authModal === 'cart' || state.authModal === 'profile') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Check admin credentials
      if (formData.email === 'gauravsureel3551@gmail.com' && formData.password === '1234567') {
        const adminUser: User = {
          id: 'admin',
          fullName: 'Admin User',
          email: formData.email,
          isAdmin: true,
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: adminUser });
        dispatch({ type: 'SET_AUTH_MODAL', payload: null });
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        return;
      }

      // Check if user exists in registered users
      const existingUser = state.users.find(user => 
        user.email === formData.email && !user.isAdmin
      );

      if (existingUser) {
        // For demo purposes, we'll assume password is correct
        // In real app, you'd verify the password hash
        dispatch({ type: 'SET_USER', payload: existingUser });
        dispatch({ type: 'SET_AUTH_MODAL', payload: null });
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError('Account not found. Please sign up first.');
      }
    } else {
      // Sign up
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Check if user already exists
      const existingUser = state.users.find(user => user.email === formData.email);
      if (existingUser) {
        setError('Account with this email already exists. Please login.');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        isAdmin: false,
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'REGISTER_USER', payload: newUser });
      
      // After successful signup, show login form
      setIsLogin(true);
      setFormData({ fullName: '', email: formData.email, password: '', confirmPassword: '' });
      setError('Account created successfully! Please login now.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: null })}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin ? 'bg-orange-500 text-white' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin ? 'bg-orange-500 text-white' : 'text-gray-600'
            }`}
          >
            Login
          </button>
        </div>

        {error && (
          <div className={`mb-4 p-3 border rounded-lg ${
            error.includes('successfully') 
              ? 'bg-green-50 border-green-200 text-green-600' 
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong></strong><br />
              <br />
              
            </p>
          </div>
        )}
      </div>
    </div>
  );
}