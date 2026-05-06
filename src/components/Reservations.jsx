import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Calendar, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeUp from './FadeUp';

const Reservations = () => {
  const [formState, setFormState] = useState('idle');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    requests: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('userToken') || ''
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormState('success');
        resetForm();
        if (localStorage.getItem('userToken')) {
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Reservation Server Error:', error);
      alert('Failed to submit reservation. Please try again later.');
      setFormState('idle');
    }
  };

  const resetForm = () => {
    setTimeout(() => {
      setFormState('idle');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        requests: ''
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="reservations" className="py-24 bg-surface transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <FadeUp>
              <h2 className="text-7xl md:text-9xl font-retro text-textMain leading-[0.8] uppercase tracking-tighter">
                READY TO <br />
                <span className="text-primary">JOIN US?</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-xl font-medium text-textMain/60 leading-relaxed">
                Book your table at Rastura and experience a world where vintage charm 
                meets modern excellence. We can't wait to serve you.
              </p>
            </FadeUp>
            
            <FadeUp delay={0.3}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-bg p-6 rounded-[30px] transition-colors duration-500">
                  <div className="bg-primary p-3 rounded-2xl text-white">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="font-retro text-2xl text-textMain uppercase">Available Daily</div>
                    <div className="text-sm font-bold text-textMain/50">12:00 PM - 11:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-bg p-6 rounded-[30px] transition-colors duration-500">
                  <div className="bg-primary p-3 rounded-2xl text-white">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="font-retro text-2xl text-textMain uppercase">Private Events</div>
                    <div className="text-sm font-bold text-textMain/50">Up to 50 Guests</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.4}>
            <div className="bg-bg p-8 md:p-12 rounded-[50px] shadow-2xl border-4 border-surface transition-colors duration-500">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <RetroInput label="NAME" name="name" type="text" value={formData.name} onChange={handleChange} />
                  <RetroInput label="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} />
                  <RetroInput label="PHONE" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <RetroInput label="DATE" name="date" type="date" value={formData.date} onChange={handleChange} />
                  <RetroInput label="TIME" name="time" type="time" value={formData.time} onChange={handleChange} />
                  <div className="flex flex-col gap-2">
                    <label className="font-retro text-sm text-textMain/40 tracking-widest uppercase">GUESTS</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="bg-surface rounded-pill px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none border-2 border-transparent focus:border-primary"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} PERSONS</option>)}
                    </select>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formState !== 'idle'}
                  className="w-full py-6 bg-primary text-white font-retro text-2xl rounded-pill flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70"
                >
                  <AnimatePresence mode="wait">
                    {formState === 'idle' && <motion.span key="i">RESERVE NOW</motion.span>}
                    {formState === 'loading' && <Loader2 className="animate-spin" />}
                    {formState === 'success' && <div className="flex items-center gap-2"><Check /> CONFIRMED!</div>}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
};

const RetroInput = ({ label, name, type, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="font-retro text-sm text-textMain/40 tracking-widest uppercase">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="bg-surface rounded-pill px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
    />
  </div>
);

export default Reservations;
