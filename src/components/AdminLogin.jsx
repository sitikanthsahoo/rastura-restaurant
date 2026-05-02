import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');


    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.admin);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection failed. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface p-12 rounded-[60px] shadow-2xl border-4 border-bg transition-colors duration-500"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-3xl mb-6">
            <Lock size={40} />
          </div>
          <h1 className="text-5xl font-retro text-textMain uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-textMain/50 font-bold mt-2">RASTURA MANAGEMENT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-retro text-sm text-textMain/40 tracking-widest uppercase ml-4">Username</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-textMain/30" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-bg rounded-pill pl-14 pr-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-retro text-sm text-textMain/40 tracking-widest uppercase ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-textMain/30" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-bg rounded-pill pl-14 pr-14 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-textMain/30 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary text-sm font-bold text-center bg-primary/5 py-3 rounded-2xl"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-5 bg-primary text-white font-retro text-2xl rounded-pill flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'LOGIN TO DASHBOARD'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
