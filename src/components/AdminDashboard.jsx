import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Clock, Phone, Mail, 
  CheckCircle, XCircle, Trash2, LogOut, 
  ChevronRight, Utensils, LayoutDashboard,
  Loader2, Plus, Image as ImageIcon,
  Tag, DollarSign, BarChart2, TrendingUp, ClipboardList
} from 'lucide-react';
import { menuCategories } from '../data/menuData';

const AdminDashboard = ({ admin, onLogout }) => {
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Menu Form State
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '', category: 'Starters', desc: '', price: '', image: '', isVeg: true
  });

  // Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '', date: '', desc: '', image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchReservations(), fetchMenu(), fetchEvents()]);
    setIsLoading(false);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      if (response.ok) {
        const allMenu = await response.json();
        setMenuItems(allMenu);
      }
    } catch (err) {
      console.error('Menu fetch error:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      if (response.ok) {
        const allEvents = await response.json();
        setEvents(allEvents);
      }
    } catch (err) {
      console.error('Events fetch error:', err);
    }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/reservations`, {
        headers: { 'x-auth-token': token }
      });
      if (response.ok) {
        const serverData = await response.json();
        setReservations(serverData);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchReservations();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      if (response.ok) fetchReservations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...menuForm,
      price: parseFloat(menuForm.price) || 0
    };
    try {
      const response = await fetch(`${API_URL}/api/admin/menu`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(formattedData)
      });
      if (response.ok) {
        setShowMenuForm(false);
        setMenuForm({ name: '', category: 'Starters', desc: '', price: '', image: '', isVeg: true });
        fetchMenu();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error('Add menu item error:', err);
      alert('Failed to add dish. Please check your connection.');
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      if (response.ok) fetchMenu();
    } catch (err) {
      console.error('Delete menu item error:', err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(eventForm)
      });
      if (response.ok) {
        setShowEventForm(false);
        setEventForm({ title: '', date: '', desc: '', image: '' });
        fetchEvents();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error('Add event error:', err);
      alert('Failed to add event. Please check your connection.');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      if (response.ok) fetchEvents();
    } catch (err) {
      console.error('Delete event error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-80 bg-surface border-r border-primary/10 flex flex-col p-8 transition-colors duration-500">
        <div className="flex items-center gap-3 mb-16">
          <div className="bg-primary p-3 rounded-2xl text-white">
            <Utensils size={24} />
          </div>
          <span className="text-3xl font-retro text-textMain tracking-tighter">RASTURA</span>
        </div>

        <nav className="flex-1 space-y-4">
          <SidebarLink 
            icon={<BarChart2 size={20} />} 
            label="ANALYTICS" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="RESERVATIONS" 
            active={activeTab === 'reservations'} 
            onClick={() => setActiveTab('reservations')} 
          />
          <SidebarLink 
            icon={<Utensils size={20} />} 
            label="MENU MANAGER" 
            active={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')} 
          />
          <SidebarLink 
            icon={<Calendar size={20} />} 
            label="EVENTS MANAGER" 
            active={activeTab === 'events'} 
            onClick={() => setActiveTab('events')} 
          />
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 p-6 bg-primary/5 text-primary rounded-3xl font-bold hover:bg-primary hover:text-white transition-all group"
        >
          <LogOut size={20} />
          <span>LOGOUT</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-retro text-textMain uppercase tracking-tighter">
              {activeTab === 'analytics' ? 'Analytics' : activeTab === 'reservations' ? 'Reservations' : activeTab === 'menu' ? 'Menu Manager' : 'Events Manager'}
            </h1>
            <p className="text-textMain/50 font-bold mt-2 uppercase tracking-widest">Welcome back, {admin.username}</p>
          </div>
          
          {activeTab === 'menu' && (
            <button 
              onClick={() => setShowMenuForm(true)}
              className="bg-primary text-white px-8 py-4 rounded-pill font-retro text-xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <Plus size={20} /> ADD DISH
            </button>
          )}

          {activeTab === 'events' && (
            <button 
              onClick={() => setShowEventForm(true)}
              className="bg-primary text-white px-8 py-4 rounded-pill font-retro text-xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <Plus size={20} /> ADD EVENT
            </button>
          )}
        </header>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {activeTab === 'reservations' ? (
              // RESERVATIONS TAB
              reservations.length === 0 ? (
                <div className="bg-surface p-20 rounded-[60px] text-center border-4 border-bg">
                  <p className="text-textMain/40 font-retro text-4xl uppercase">No reservations yet</p>
                </div>
              ) : (
                reservations.map((res) => (
                  <motion.div
                    layout
                    key={res._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface p-8 rounded-[40px] shadow-xl border-4 border-bg hover:border-primary/20 transition-all duration-500 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      {/* Guest Info */}
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                          <Users size={32} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-retro text-textMain uppercase leading-none mb-2">{res.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm font-bold text-textMain/50 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Phone size={14} /> {res.phone}</span>
                            <span className="flex items-center gap-1"><Mail size={14} /> {res.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex flex-wrap gap-4">
                        <DetailPill icon={<Calendar size={16} />} text={res.date} />
                        <DetailPill icon={<Clock size={16} />} text={res.time} />
                        <DetailPill icon={<Users size={16} />} text={`${res.guests} GUESTS`} />
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-4">
                        <span className={`px-6 py-2 rounded-full font-retro text-xl uppercase ${
                          res.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                          res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-bg text-textMain/40'
                        }`}>
                          {res.status}
                        </span>
                        
                        <div className="flex gap-2">
                          <ActionButton 
                            icon={<CheckCircle size={20} />} 
                            color="green" 
                            onClick={() => updateStatus(res._id, 'confirmed')} 
                            title="Confirm"
                          />
                          <ActionButton 
                            icon={<XCircle size={20} />} 
                            color="red" 
                            onClick={() => updateStatus(res._id, 'cancelled')} 
                            title="Cancel"
                          />
                          <div className="w-px h-10 bg-primary/10 mx-2" />
                          <ActionButton 
                            icon={<Trash2 size={20} />} 
                            color="gray" 
                            onClick={() => deleteReservation(res._id)} 
                            title="Delete"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : activeTab === 'menu' ? (
              // MENU MANAGER TAB
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item._id || item.id || idx}
                    className="bg-surface rounded-[40px] overflow-hidden border-4 border-bg group relative transition-all duration-500"
                  >
                    <div className="h-48 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full font-retro text-lg">
                        ${item.price}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-3xl font-retro text-textMain uppercase">{item.name}</h3>
                        <span className="text-xs font-black text-primary uppercase tracking-widest">{item.category}</span>
                      </div>
                      <p className="text-textMain/50 text-sm font-medium line-clamp-2 mb-6">{item.desc}</p>
                      <button 
                        onClick={() => deleteMenuItem(item._id)}
                        className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} /> DELETE DISH
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : activeTab === 'analytics' ? (
              // ANALYTICS TAB
              (() => {
                const total = reservations.length;
                const confirmed = reservations.filter(r => r.status === 'confirmed').length;
                const pending = reservations.filter(r => r.status === 'pending').length;
                const cancelled = reservations.filter(r => r.status === 'cancelled').length;
                const totalGuests = reservations.reduce((acc, r) => acc + (parseInt(r.guests) || 0), 0);

                // Category breakdown
                const catCount = menuItems.reduce((acc, item) => {
                  acc[item.category] = (acc[item.category] || 0) + 1;
                  return acc;
                }, {});
                const catColors = { Starters: '#EF7C5D', Mains: '#f59e0b', Desserts: '#8b5cf6', Drinks: '#10b981' };

                // Donut chart segments
                const donutData = [
                  { label: 'Confirmed', value: confirmed, color: '#16a34a' },
                  { label: 'Pending', value: pending, color: '#f59e0b' },
                  { label: 'Cancelled', value: cancelled, color: '#ef4444' },
                ];
                const donutTotal = donutData.reduce((a, d) => a + d.value, 0) || 1;
                let cumulative = 0;
                const donutSegments = donutData.map(d => {
                  const start = (cumulative / donutTotal) * 360;
                  cumulative += d.value;
                  const end = (cumulative / donutTotal) * 360;
                  return { ...d, start, end };
                });

                const describeArc = (cx, cy, r, startAngle, endAngle) => {
                  const toRad = a => (a - 90) * Math.PI / 180;
                  const x1 = cx + r * Math.cos(toRad(startAngle));
                  const y1 = cy + r * Math.sin(toRad(startAngle));
                  const x2 = cx + r * Math.cos(toRad(endAngle));
                  const y2 = cy + r * Math.sin(toRad(endAngle));
                  const large = endAngle - startAngle > 180 ? 1 : 0;
                  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
                };

                return (
                  <div className="space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Reservations', value: total, icon: <ClipboardList size={28} />, color: 'bg-primary/10 text-primary' },
                        { label: 'Confirmed', value: confirmed, icon: <CheckCircle size={28} />, color: 'bg-green-100 text-green-600' },
                        { label: 'Pending', value: pending, icon: <Clock size={28} />, color: 'bg-yellow-100 text-yellow-600' },
                        { label: 'Total Guests', value: totalGuests, icon: <Users size={28} />, color: 'bg-blue-100 text-blue-600' },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="bg-surface rounded-[35px] p-8 border-4 border-bg shadow-xl"
                        >
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${stat.color}`}>
                            {stat.icon}
                          </div>
                          <div className="text-6xl font-retro text-textMain">{stat.value}</div>
                          <div className="text-textMain/40 font-bold uppercase tracking-widest text-xs mt-2">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Donut Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-surface rounded-[35px] p-10 border-4 border-bg shadow-xl"
                      >
                        <div className="flex items-center gap-3 mb-8">
                          <TrendingUp size={22} className="text-primary" />
                          <h3 className="text-2xl font-retro text-textMain uppercase">Reservation Status</h3>
                        </div>
                        <div className="flex items-center justify-center gap-10">
                          <svg width="180" height="180" viewBox="0 0 100 100">
                            {donutTotal === 0 ? (
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                            ) : donutSegments.map((seg, i) =>
                              seg.value > 0 ? (
                                <path
                                  key={i}
                                  d={describeArc(50, 50, 38, seg.start, seg.end)}
                                  fill={seg.color}
                                  opacity={0.9}
                                />
                              ) : null
                            )}
                            <circle cx="50" cy="50" r="24" fill="var(--color-surface, white)" />
                            <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">{total}</text>
                          </svg>
                          <div className="space-y-4">
                            {donutData.map(d => (
                              <div key={d.label} className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                <span className="font-bold text-textMain/60 text-sm uppercase tracking-widest">{d.label}</span>
                                <span className="font-retro text-textMain text-2xl ml-auto pl-4">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Menu Category Breakdown */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-surface rounded-[35px] p-10 border-4 border-bg shadow-xl"
                      >
                        <div className="flex items-center gap-3 mb-8">
                          <Utensils size={22} className="text-primary" />
                          <h3 className="text-2xl font-retro text-textMain uppercase">Menu Breakdown</h3>
                        </div>
                        <div className="space-y-5">
                          {menuItems.length === 0 ? (
                            <p className="text-textMain/30 font-bold uppercase text-center py-8">No menu items yet</p>
                          ) : Object.entries(catCount).map(([cat, count]) => (
                            <div key={cat}>
                              <div className="flex justify-between mb-2">
                                <span className="font-bold text-textMain/60 uppercase tracking-widest text-sm">{cat}</span>
                                <span className="font-retro text-textMain text-xl">{count} dishes</span>
                              </div>
                              <div className="h-3 bg-bg rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / menuItems.length) * 100}%` }}
                                  transition={{ duration: 0.8, delay: 0.5 }}
                                  className="h-full rounded-full"
                                  style={{ background: catColors[cat] || '#EF7C5D' }}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-bg flex justify-between">
                            <span className="font-bold text-textMain/40 uppercase text-sm">Total Dishes</span>
                            <span className="font-retro text-textMain text-3xl">{menuItems.length}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Recent Reservations */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="bg-surface rounded-[35px] p-10 border-4 border-bg shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <ClipboardList size={22} className="text-primary" />
                          <h3 className="text-2xl font-retro text-textMain uppercase">Recent Reservations</h3>
                        </div>
                        <button onClick={() => setActiveTab('reservations')} className="text-primary font-bold text-sm uppercase tracking-widest hover:underline flex items-center gap-1">
                          View All <ChevronRight size={16} />
                        </button>
                      </div>
                      {reservations.length === 0 ? (
                        <p className="text-textMain/30 font-bold uppercase text-center py-8">No reservations yet</p>
                      ) : (
                        <div className="space-y-4">
                          {reservations.slice(0, 5).map((res, i) => (
                            <motion.div
                              key={res._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.55 + i * 0.05 }}
                              className="flex items-center justify-between p-5 bg-bg rounded-2xl gap-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                                  <Users size={20} />
                                </div>
                                <div>
                                  <div className="font-retro text-textMain text-xl uppercase">{res.name}</div>
                                  <div className="text-textMain/40 text-xs font-bold uppercase tracking-widest">{res.date} · {res.guests} guests</div>
                                </div>
                              </div>
                              <span className={`px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest ${
                                res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>{res.status}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                );
              })()
            ) : (
              // EVENTS MANAGER TAB
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, idx) => (
                  <motion.div
                    key={event._id || event.id || idx}
                    className="bg-surface rounded-[40px] overflow-hidden border-4 border-bg group relative transition-all duration-500"
                  >
                    <div className="h-48 relative">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full font-retro text-lg">
                        {event.date}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-3xl font-retro text-textMain uppercase mb-2">{event.title}</h3>
                      <p className="text-textMain/50 text-sm font-medium line-clamp-2 mb-6">{event.desc}</p>
                      <button 
                        onClick={() => deleteEvent(event._id)}
                        className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} /> DELETE EVENT
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Menu Form Modal */}
      <AnimatePresence>
        {showMenuForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-textMain/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-surface w-full max-w-2xl p-12 rounded-[60px] border-8 border-bg transition-colors duration-500"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-5xl font-retro text-textMain uppercase tracking-tighter">New Dish</h2>
                <button onClick={() => setShowMenuForm(false)} className="text-textMain/30 hover:text-primary transition-colors"><XCircle size={32} /></button>
              </div>

              <form onSubmit={handleAddMenuItem} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="DISH NAME" icon={<Utensils size={18} />} value={menuForm.name} onChange={v => setMenuForm({...menuForm, name: v})} />
                  <div className="space-y-2">
                    <label className="font-retro text-xs text-textMain/40 tracking-widest ml-4">CATEGORY</label>
                    <select 
                      value={menuForm.category} 
                      onChange={e => setMenuForm({...menuForm, category: e.target.value})}
                      className="w-full bg-bg rounded-pill px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary appearance-none"
                    >
                      {menuCategories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="PRICE ($)" icon={<DollarSign size={18} />} type="number" value={menuForm.price} onChange={v => setMenuForm({...menuForm, price: v})} />
                  <FormInput label="IMAGE URL" icon={<ImageIcon size={18} />} value={menuForm.image} onChange={v => setMenuForm({...menuForm, image: v})} />
                </div>

                <div className="space-y-2">
                  <label className="font-retro text-xs text-textMain/40 tracking-widest ml-4">DESCRIPTION</label>
                  <textarea 
                    value={menuForm.desc} 
                    onChange={e => setMenuForm({...menuForm, desc: e.target.value})}
                    className="w-full bg-bg rounded-[30px] px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary min-h-[100px]"
                    placeholder="Describe the flavors..."
                  />
                </div>

                <button className="w-full py-5 bg-primary text-white font-retro text-2xl rounded-pill shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  SAVE DISH TO MENU
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-textMain/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-surface w-full max-w-2xl p-12 rounded-[60px] border-8 border-bg transition-colors duration-500"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-5xl font-retro text-textMain uppercase tracking-tighter">New Event</h2>
                <button onClick={() => setShowEventForm(false)} className="text-textMain/30 hover:text-primary transition-colors"><XCircle size={32} /></button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="EVENT TITLE" icon={<Tag size={18} />} value={eventForm.title} onChange={v => setEventForm({...eventForm, title: v})} />
                  <FormInput label="DATE (E.G. JUNE 15)" icon={<Calendar size={18} />} value={eventForm.date} onChange={v => setEventForm({...eventForm, date: v})} />
                </div>

                <FormInput label="IMAGE URL" icon={<ImageIcon size={18} />} value={eventForm.image} onChange={v => setEventForm({...eventForm, image: v})} />

                <div className="space-y-2">
                  <label className="font-retro text-xs text-textMain/40 tracking-widest ml-4">DESCRIPTION</label>
                  <textarea 
                    value={eventForm.desc} 
                    onChange={e => setEventForm({...eventForm, desc: e.target.value})}
                    className="w-full bg-bg rounded-[30px] px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary min-h-[100px]"
                    placeholder="Tell guests about the event..."
                  />
                </div>

                <button className="w-full py-5 bg-primary text-white font-retro text-2xl rounded-pill shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  PUBLISH EVENT
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormInput = ({ label, icon, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="font-retro text-xs text-textMain/40 tracking-widest ml-4">{label}</label>
    <div className="relative">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-textMain/30">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="w-full bg-bg rounded-pill pl-14 pr-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
      />
    </div>
  </div>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-5 rounded-3xl font-bold transition-all ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textMain/60 hover:bg-primary/5 hover:text-primary'
    }`}
  >
    {icon}
    <span className="tracking-widest text-sm">{label}</span>
    {active && <ChevronRight className="ml-auto" size={16} />}
  </button>
);

const DetailPill = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-bg px-5 py-3 rounded-2xl text-textMain/60 text-xs font-black uppercase tracking-widest transition-colors duration-500">
    {icon}
    {text}
  </div>
);

const ActionButton = ({ icon, color, onClick, title }) => {
  const colors = {
    green: 'hover:bg-green-500 hover:text-white text-green-500 bg-green-50',
    red: 'hover:bg-red-500 hover:text-white text-red-500 bg-red-50',
    gray: 'hover:bg-textMain hover:text-white text-textMain/40 bg-bg'
  };
  return (
    <button 
      onClick={onClick}
      title={title}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${colors[color]}`}
    >
      {icon}
    </button>
  );
};

export default AdminDashboard;
