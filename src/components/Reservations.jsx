import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Calendar, Users, Clock, Map, X, Leaf, User, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeUp from './FadeUp';

// --- Architectural Floor Plan Helpers ---

const getTableStyle = (type) => {
  switch(type) {
    case 'Small':
      return 'w-24 h-14 rounded-xl bg-white dark:bg-white text-gray-800 border shadow-sm';
    case 'Long':
      return 'w-48 h-14 rounded-xl bg-white dark:bg-white text-gray-800 border shadow-sm';
    default:
      return 'w-24 h-14 rounded-xl bg-white text-gray-800';
  }
};

const Chairs = ({ type, isSelected }) => {
  const chairColor = isSelected ? 'bg-primary' : 'bg-[#4ADE80] opacity-80 group-hover:opacity-100 transition-opacity';
  const chairBase = "w-6 h-3 md:w-8 md:h-4";
  
  if (type === 'Small') {
    return (
      <>
        <div className="absolute -top-3 md:-top-4 left-0 right-0 flex justify-center gap-1 md:gap-2">
          <div className={`${chairBase} ${chairColor} rounded-t-full`} />
          <div className={`${chairBase} ${chairColor} rounded-t-full`} />
        </div>
        <div className="absolute -bottom-3 md:-bottom-4 left-0 right-0 flex justify-center gap-1 md:gap-2">
          <div className={`${chairBase} ${chairColor} rounded-b-full`} />
          <div className={`${chairBase} ${chairColor} rounded-b-full`} />
        </div>
      </>
    );
  }
  if (type === 'Long') {
    return (
      <>
        <div className="absolute -top-3 md:-top-4 left-0 right-0 flex justify-center gap-1 md:gap-2">
          <div className={`${chairBase} ${chairColor} rounded-t-full`} />
          <div className={`${chairBase} ${chairColor} rounded-t-full`} />
          <div className={`${chairBase} ${chairColor} rounded-t-full`} />
          <div className={`${chairBase} ${chairColor} rounded-t-full`} />
        </div>
        <div className="absolute -bottom-3 md:-bottom-4 left-0 right-0 flex justify-center gap-1 md:gap-2">
          <div className={`${chairBase} ${chairColor} rounded-b-full`} />
          <div className={`${chairBase} ${chairColor} rounded-b-full`} />
          <div className={`${chairBase} ${chairColor} rounded-b-full`} />
          <div className={`${chairBase} ${chairColor} rounded-b-full`} />
        </div>
      </>
    );
  }
  return null;
};

const tableRows = [
  // Row 1
  [
    { id: 'T1', seats: 2, type: 'Small' },
    { id: 'T2', seats: 2, type: 'Small' },
    { id: 'T3', seats: 4, type: 'Small' },
    { id: 'T4', seats: 4, type: 'Small' },
  ],
  // Row 2
  [
    { id: 'T5', seats: 8, type: 'Long' },
    { id: 'T6', seats: 8, type: 'Long' },
  ],
  // Row 3
  [
    { id: 'T7', seats: 4, type: 'Small' },
    { id: 'T8', seats: 8, type: 'Long' },
    { id: 'T9', seats: 4, type: 'Small' },
  ]
];

const Reservations = () => {
  const [formState, setFormState] = useState('idle');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    table: null,
    requests: ''
  });
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');

    if (!formData.table) {
      alert('Please select a table from the floor plan.');
      setFormState('idle');
      return;
    }

    try {
      const payload = {
        ...formData,
        guests: formData.table.seats.toString()
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('userToken') || ''
        },
        body: JSON.stringify(payload)
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
        table: null,
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
                  <RetroInput label="NAME" name="name" type="text" value={formData.name} onChange={handleChange} icon={User} />
                  <RetroInput label="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} />
                  <RetroInput label="PHONE" name="phone" type="tel" value={formData.phone} onChange={handleChange} icon={Phone} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <RetroInput label="DATE" name="date" type="date" value={formData.date} onChange={handleChange} />
                  <RetroInput label="TIME" name="time" type="time" value={formData.time} onChange={handleChange} />
                  <div className="flex flex-col gap-2">
                    <label className="font-retro text-sm text-textMain/40 tracking-widest uppercase">YOUR TABLE</label>
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className={`bg-surface rounded-pill px-4 md:px-5 py-4 font-bold transition-all border-2 flex items-center justify-between gap-2 group whitespace-nowrap overflow-hidden ${formData.table ? 'border-primary text-primary' : 'border-transparent text-textMain hover:border-primary/30'}`}
                    >
                      <span className="truncate text-sm md:text-base tracking-wide">{formData.table ? `Table ${formData.table.id.replace('T', '')} (${formData.table.seats})` : 'SELECT TABLE'}</span>
                      <Map size={18} className="group-hover:text-primary transition-colors flex-shrink-0" />
                    </button>
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

      {/* Interactive Table Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-textMain/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-bg w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-textMain/10 flex flex-col"
            >
              <div className="p-6 border-b border-textMain/10 flex justify-between items-center bg-surface">
                <div>
                  <h3 className="font-retro text-3xl uppercase tracking-tighter text-textMain">CHOOSE YOUR TABLE</h3>
                  <p className="text-sm font-bold text-textMain/50">Click a table on the floor plan to select it.</p>
                </div>
                <button onClick={() => setShowMap(false)} className="p-3 hover:bg-textMain/5 rounded-full transition-colors text-textMain">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 bg-surface/50 relative h-[450px] md:h-[500px] w-full">
                {/* Floor Plan Container */}
                <div 
                  className="w-full h-full border-4 border-textMain/10 rounded-[40px] bg-bg relative overflow-hidden shadow-inner"
                  style={{
                    backgroundImage: 'radial-gradient(var(--color-textMain) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0'
                  }}
                >
                  {/* Decorative Plants */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-[#2D4A3E]/20 rounded-full flex items-center justify-center border border-[#2D4A3E]/30"><Leaf className="text-[#2D4A3E]/40" /></div>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-[#2D4A3E]/20 rounded-full flex items-center justify-center border border-[#2D4A3E]/30"><Leaf className="text-[#2D4A3E]/40" /></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#2D4A3E]/20 rounded-full flex items-center justify-center border border-[#2D4A3E]/30"><Leaf className="text-[#2D4A3E]/40" /></div>

                  <div className="absolute top-0 left-0 right-0 h-8 bg-textMain/5 border-b border-textMain/10 flex items-center justify-center font-retro text-textMain/40 tracking-widest text-sm z-0">ENTRANCE</div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-textMain/5 border-t border-textMain/10 flex items-center justify-center font-retro text-textMain/40 tracking-widest text-sm z-0">KITCHEN</div>

                  {/* Flex Container for Rows */}
                  <div className="absolute inset-0 pt-16 pb-16 px-4 md:px-12 flex flex-col justify-between z-10 pointer-events-none">
                    
                    {tableRows.map((row, rowIndex) => (
                      <div 
                        key={rowIndex} 
                        className={`flex items-center w-full ${rowIndex === 1 ? 'justify-evenly px-4 md:px-16' : 'justify-between'}`}
                      >
                        {row.map(table => {
                          const isSelected = formData.table?.id === table.id;
                          return (
                            <button
                              key={table.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, table });
                                setTimeout(() => setShowMap(false), 500);
                              }}
                              className={`relative flex flex-col items-center justify-center transition-all duration-300 group hover:scale-110 pointer-events-auto ${getTableStyle(table.type)} ${isSelected ? 'scale-110 shadow-lg ring-4 ring-primary z-20' : ''}`}
                            >
                              <Chairs type={table.type} isSelected={isSelected} />
                              
                              <span className="font-sans font-bold text-sm md:text-base leading-none z-10 text-gray-800">Table {table.id.replace('T', '')}</span>
                              <span className="text-[9px] md:text-[10px] font-bold opacity-60 uppercase tracking-widest flex items-center gap-1 mt-0.5 z-10 text-gray-500">
                                <Users size={10} /> {table.seats}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

const RetroInput = ({ label, name, type, value, onChange, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <label className="font-retro text-sm text-textMain/40 tracking-widest uppercase">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-textMain/40">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`w-full bg-surface rounded-pill ${Icon ? 'pl-12 pr-6' : 'px-6'} py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary`}
      />
    </div>
  </div>
);

export default Reservations;
