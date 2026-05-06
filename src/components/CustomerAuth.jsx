import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerAuth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('userToken', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-textMain/50 hover:text-primary transition-colors flex items-center gap-2 font-bold"
      >
        <ArrowLeft size={20} /> BACK TO HOME
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface w-full max-w-md p-10 rounded-[40px] border-8 border-bg shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-retro text-textMain uppercase tracking-tighter mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-textMain/50 font-bold tracking-widest text-sm uppercase">
            {isLogin ? 'Log in to view reservations' : 'Sign up for faster bookings'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-center font-bold mb-6 text-sm uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-textMain/30" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-bg rounded-pill pl-14 pr-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-textMain/30" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-bg rounded-pill pl-14 pr-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-textMain/30" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-bg rounded-pill pl-14 pr-16 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-textMain/30 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-5 rounded-pill font-retro text-2xl tracking-widest uppercase hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? 'LOGIN' : 'SIGN UP')}
          </button>
        </form>

        <p className="text-center mt-8 font-bold text-textMain/50">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default CustomerAuth;
