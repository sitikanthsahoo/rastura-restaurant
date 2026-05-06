import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, LogOut, ArrowLeft, Loader2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = ({ user, onLogout }) => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { 'x-auth-token': token }
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations);
      }
    } catch (err) {
      console.error('Fetch user data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-500 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="text-textMain/50 hover:text-primary transition-colors flex items-center gap-2 font-bold mb-6"
            >
              <ArrowLeft size={20} /> BACK TO HOME
            </button>
            <h1 className="text-6xl font-retro text-textMain uppercase tracking-tighter">My Account</h1>
            <p className="text-textMain/50 font-bold mt-2 uppercase tracking-widest text-lg">
              Hello, {user?.name || 'Guest'}
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-8 py-4 bg-surface border-4 border-bg shadow-xl text-primary rounded-pill font-bold hover:bg-primary hover:text-white transition-all group w-fit"
          >
            <LogOut size={20} />
            <span>LOGOUT</span>
          </button>
        </header>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <History className="text-primary" size={32} />
                <h2 className="text-4xl font-retro text-textMain uppercase">Order History</h2>
              </div>

              {reservations.length === 0 ? (
                <div className="bg-surface p-20 rounded-[60px] text-center border-4 border-bg shadow-xl">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <Calendar size={40} />
                  </div>
                  <h3 className="text-3xl font-retro text-textMain uppercase mb-4">No Reservations Yet</h3>
                  <p className="text-textMain/50 font-medium mb-8">You haven't booked any tables with us yet.</p>
                  <button 
                    onClick={() => navigate('/#reservations')}
                    className="bg-primary text-white px-8 py-4 rounded-pill font-retro text-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    BOOK A TABLE
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {reservations.map((res, i) => (
                    <motion.div
                      key={res._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-surface p-8 rounded-[40px] shadow-xl border-4 border-bg hover:border-primary/20 transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest ${
                          res.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                          res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {res.status}
                        </span>
                        <span className="text-textMain/40 font-bold text-xs tracking-widest uppercase">
                          {new Date(res.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-bg rounded-2xl flex items-center justify-center text-primary">
                            <Calendar size={20} />
                          </div>
                          <div className="font-retro text-textMain text-xl">{res.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-bg rounded-2xl flex items-center justify-center text-primary">
                            <Clock size={20} />
                          </div>
                          <div className="font-retro text-textMain text-xl">{res.time}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-bg rounded-2xl flex items-center justify-center text-primary">
                            <Users size={20} />
                          </div>
                          <div className="font-retro text-textMain text-xl">{res.guests} GUESTS</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
