import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Clock, Phone, Mail, 
  CheckCircle, XCircle, Trash2, LogOut, 
  ChevronRight, Utensils, LayoutDashboard,
  Loader2, Plus, Image as ImageIcon,
  Tag, IndianRupee, BarChart2, TrendingUp, ClipboardList,
  QrCode, Download, Edit, Search, Bell, User, Sun, Moon
} from 'lucide-react';
import { menuCategories } from '../data/menuData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AdminDashboard = ({ admin, onLogout }) => {
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({ name: '', category: 'Starters', desc: '', price: '', image: '', isVeg: true });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', date: '', desc: '', image: '' });

  const [isAdminDark, setIsAdminDark] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved === 'true' || false;
  });

  useEffect(() => {
    if (isAdminDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminDarkMode', isAdminDark);

    return () => {
      const webDarkMode = localStorage.getItem('darkMode') === 'true';
      if (webDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  }, [isAdminDark]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchReservations(), fetchMenu(), fetchEvents()]);
    setIsLoading(false);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      if (response.ok) setMenuItems(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      if (response.ok) setEvents(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/reservations`, { headers: { 'x-auth-token': token } });
      if (response.ok) setReservations(await response.json());
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('adminToken') },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchReservations();
    } catch (err) { console.error(err); }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/reservations/${id}`, {
        method: 'DELETE', headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      if (response.ok) fetchReservations();
    } catch (err) { console.error(err); }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const formattedData = { ...menuForm, price: parseFloat(menuForm.price) || 0 };
    try {
      const response = await fetch(`${API_URL}/api/admin/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('adminToken') },
        body: JSON.stringify(formattedData)
      });
      if (response.ok) {
        setShowMenuForm(false);
        setMenuForm({ name: '', category: 'Starters', desc: '', price: '', image: '', isVeg: true });
        fetchMenu();
      }
    } catch (err) { alert('Failed to add dish.'); }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/menu/${id}`, {
        method: 'DELETE', headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      if (response.ok) fetchMenu();
    } catch (err) { console.error(err); }
  };

  const updateMenuPrice = async (id, currentPrice) => {
    const newPriceStr = window.prompt(`Enter new price for this dish (₹):`, currentPrice);
    if (newPriceStr === null) return;
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice) || newPrice < 0) return alert("Invalid price.");
    try {
      const response = await fetch(`${API_URL}/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('adminToken') },
        body: JSON.stringify({ price: newPrice })
      });
      if (response.ok) fetchMenu();
    } catch (err) { console.error(err); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const url = editingEventId ? `${API_URL}/api/admin/events/${editingEventId}` : `${API_URL}/api/admin/events`;
      const response = await fetch(url, {
        method: editingEventId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('adminToken') },
        body: JSON.stringify(eventForm)
      });
      if (response.ok) {
        setShowEventForm(false);
        setEventForm({ title: '', date: '', desc: '', image: '' });
        setEditingEventId(null);
        fetchEvents();
      }
    } catch (err) { alert('Failed to save event.'); }
  };

  const openEditEventForm = (event) => {
    setEventForm({ title: event.title, date: event.date, desc: event.desc, image: event.image });
    setEditingEventId(event._id);
    setShowEventForm(true);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/events/${id}`, {
        method: 'DELETE', headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      if (response.ok) fetchEvents();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans transition-colors duration-500 text-slate-800 dark:text-white overflow-hidden relative z-10">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col p-6 transition-colors duration-500 z-20">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20">
            <Utensils size={20} />
          </div>
          <span className="text-xl font-bold font-sans tracking-tight text-slate-800 dark:text-white">Rastura</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarLink icon={<ClipboardList size={18} />} label="Orders & Booking" active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} />
          <SidebarLink icon={<Utensils size={18} />} label="Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
          <SidebarLink icon={<Calendar size={18} />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <SidebarLink icon={<QrCode size={18} />} label="QR Code" active={activeTab === 'qrcode'} onClick={() => setActiveTab('qrcode')} />
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 p-4 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm mt-auto">
          <LogOut size={18} /> <span>Log Out</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen relative bg-slate-50 dark:bg-slate-900">
        {/* TOP HEADER */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 flex-shrink-0 z-20">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input type="text" placeholder="Search anything..." className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder-slate-400" />
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => setIsAdminDark(!isAdminDark)} className="relative text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
               {isAdminDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button className="relative text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
               <Bell size={20} />
               <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-800"></span>
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-800 dark:text-white">{admin.username}</p>
                 <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Admin</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                 <User size={20} />
               </div>
             </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold font-sans text-slate-800 dark:text-white tracking-tight">
                {activeTab === 'analytics' ? 'Dashboard Overview' : 
                 activeTab === 'reservations' ? 'Orders & Reservations' : 
                 activeTab === 'menu' ? 'Menu Management' : 
                 activeTab === 'events' ? 'Events Management' : 'QR Code Scanner'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hello {admin.username}, welcome back!</p>
            </div>
            
            {activeTab === 'menu' && (
              <button onClick={() => setShowMenuForm(true)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                <Plus size={18} /> Add New Dish
              </button>
            )}
            {activeTab === 'events' && (
              <button onClick={() => { setEditingEventId(null); setEventForm({ title: '', date: '', desc: '', image: '' }); setShowEventForm(true); }} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                <Plus size={18} /> Add Event
              </button>
            )}
          </header>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <div className="pb-10">
              {activeTab === 'analytics' && (
                <AnalyticsTab reservations={reservations} menuItems={menuItems} setActiveTab={setActiveTab} />
              )}
              {activeTab === 'reservations' && (
                <ReservationsTab reservations={reservations} updateStatus={updateStatus} deleteReservation={deleteReservation} />
              )}
              {activeTab === 'menu' && (
                <MenuTab menuItems={menuItems} updateMenuPrice={updateMenuPrice} deleteMenuItem={deleteMenuItem} />
              )}
              {activeTab === 'events' && (
                <EventsTab events={events} openEditEventForm={openEditEventForm} deleteEvent={deleteEvent} />
              )}
              {activeTab === 'qrcode' && <QRCodeTab />}
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {showMenuForm && (
          <Modal onClose={() => setShowMenuForm(false)} title="Add New Dish">
            <form onSubmit={handleAddMenuItem} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <FormInput label="Dish Name" icon={<Utensils size={16} />} value={menuForm.name} onChange={v => setMenuForm({...menuForm, name: v})} />
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Category</label>
                  <select value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 appearance-none">
                    {menuCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <FormInput label="Price (₹)" icon={<IndianRupee size={16} />} type="number" value={menuForm.price} onChange={v => setMenuForm({...menuForm, price: v})} />
                <FormInput label="Image URL" icon={<ImageIcon size={16} />} value={menuForm.image} onChange={v => setMenuForm({...menuForm, image: v})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Description</label>
                <textarea value={menuForm.desc} onChange={e => setMenuForm({...menuForm, desc: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 min-h-[100px]" placeholder="Describe the flavors..." />
              </div>
              <button className="w-full py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all mt-4">Save Dish</button>
            </form>
          </Modal>
        )}
        {showEventForm && (
          <Modal onClose={() => setShowEventForm(false)} title={editingEventId ? 'Edit Event' : 'New Event'}>
            <form onSubmit={handleAddEvent} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <FormInput label="Event Title" icon={<Tag size={16} />} value={eventForm.title} onChange={v => setEventForm({...eventForm, title: v})} />
                <FormInput label="Date" icon={<Calendar size={16} />} value={eventForm.date} onChange={v => setEventForm({...eventForm, date: v})} />
              </div>
              <FormInput label="Image URL" icon={<ImageIcon size={16} />} value={eventForm.image} onChange={v => setEventForm({...eventForm, image: v})} />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Description</label>
                <textarea value={eventForm.desc} onChange={e => setEventForm({...eventForm, desc: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 min-h-[100px]" placeholder="Event details..." />
              </div>
              <button className="w-full py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all mt-4">{editingEventId ? 'Update Event' : 'Publish Event'}</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const AnalyticsTab = ({ reservations, menuItems, setActiveTab }) => {
  const total = reservations.length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const totalGuests = reservations.reduce((acc, r) => acc + (parseInt(r.guests) || 0), 0);

  const revenueData = [
    { name: 'Mon', revenue: 1200 }, { name: 'Tue', revenue: 1500 }, { name: 'Wed', revenue: 1800 },
    { name: 'Thu', revenue: 2100 }, { name: 'Fri', revenue: 3200 }, { name: 'Sat', revenue: 4500 }, { name: 'Sun', revenue: 3800 },
  ];
  const donutData = [
    { name: 'Dine-in', value: confirmed || 1, color: '#EF7C5D' },
    { name: 'Takeaway', value: pending || 1, color: '#f59e0b' },
    { name: 'Online', value: totalGuests || 1, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={total} trend="+1.56%" icon={<ClipboardList size={24} />} color="text-[#EF7C5D]" bg="bg-[#EF7C5D]/10" />
        <StatCard title="Total Customers" value={totalGuests} trend="+0.42%" icon={<Users size={24} />} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Total Revenue" value="₹215,860" trend="+2.36%" icon={<IndianRupee size={24} />} color="text-green-500" bg="bg-green-500/10" />
        <StatCard title="Pending" value={pending} trend="-0.12%" trendDown icon={<Clock size={24} />} color="text-yellow-500" bg="bg-yellow-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold font-sans text-slate-800 dark:text-white text-lg tracking-tight">Total Revenue</h3>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹184,839</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none text-slate-800 dark:text-white"><option>Last 6 Months</option></select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF7C5D" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF7C5D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid rgba(150,150,150, 0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', backgroundColor: '#ffffff', color: '#1e293b'}} itemStyle={{color: '#EF7C5D', fontWeight: 'bold'}} />
                <Area type="monotone" dataKey="revenue" stroke="#EF7C5D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT CHART */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-sans text-slate-800 dark:text-white text-lg tracking-tight">Order Types</h3>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-2 py-1 focus:outline-none text-slate-800 dark:text-white"><option>Today</option></select>
          </div>
          <div className="h-48 relative flex justify-center mt-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid rgba(150,150,150, 0.1)', backgroundColor: '#ffffff', color: '#1e293b'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Total</span>
              <span className="text-slate-800 dark:text-white font-bold text-2xl">{confirmed + pending + totalGuests}</span>
            </div>
          </div>
          <div className="mt-auto space-y-3">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{d.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRENDING MENUS & RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-sans text-slate-800 dark:text-white text-lg tracking-tight">Recent Orders</h3>
            <button onClick={() => setActiveTab('reservations')} className="text-primary text-sm font-bold hover:underline">See All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Guests</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 5).map(res => (
                  <tr key={res._id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <td className="py-4 font-medium text-slate-800 dark:text-white text-sm flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><User size={14}/></div>
                      {res.name}
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 text-sm">{res.date} at {res.time}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 text-sm">{res.guests} Persons</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                        res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>{res.status}</span>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">No recent orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Trending items (mini grid) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-sans text-slate-800 dark:text-white text-lg tracking-tight">Trending Menus</h3>
            <button onClick={() => setActiveTab('menu')} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white"><ChevronRight size={18}/></button>
          </div>
          <div className="space-y-4">
            {menuItems.slice(0, 4).map(item => (
              <div key={item._id} className="flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold font-sans text-slate-800 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{item.category}</p>
                  <p className="text-sm font-bold text-primary">₹{item.price}</p>
                </div>
              </div>
            ))}
            {menuItems.length === 0 && <p className="text-slate-400 dark:text-slate-500 text-sm text-center">No menus available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReservationsTab = ({ reservations, updateStatus, deleteReservation }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">
          <th className="pb-4 font-semibold pl-4">Guest Details</th>
          <th className="pb-4 font-semibold">Date & Time</th>
          <th className="pb-4 font-semibold">Contact</th>
          <th className="pb-4 font-semibold">Status</th>
          <th className="pb-4 font-semibold text-right pr-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map(res => (
          <tr key={res._id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900">
            <td className="py-4 pl-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><User size={16}/></div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white text-sm">{res.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{res.guests} Guests</div>
                </div>
              </div>
            </td>
            <td className="py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{res.date} <span className="text-slate-400 dark:text-slate-500 mx-1">|</span> {res.time}</td>
            <td className="py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{res.phone}</td>
            <td className="py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                res.status === 'confirmed' ? 'bg-green-100 text-green-600' : res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>{res.status}</span>
            </td>
            <td className="py-4 pr-4">
              <div className="flex gap-2 justify-end">
                <button onClick={() => updateStatus(res._id, 'confirmed')} className="w-8 h-8 rounded-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors" title="Confirm"><CheckCircle size={16} /></button>
                <button onClick={() => updateStatus(res._id, 'cancelled')} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors" title="Cancel"><XCircle size={16} /></button>
                <button onClick={() => deleteReservation(res._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors" title="Delete"><Trash2 size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {reservations.length === 0 && <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">No reservations found.</div>}
  </div>
);

const MenuTab = ({ menuItems, updateMenuPrice, deleteMenuItem }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {menuItems.map(item => (
      <div key={item._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
        <div className="h-40 relative overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-900 dark:text-white font-bold px-2.5 py-1 rounded-lg text-sm shadow-sm">₹{item.price}</div>
        </div>
        <div className="p-5">
          <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{item.category}</div>
          <h3 className="font-bold font-sans text-slate-800 dark:text-white text-base line-clamp-1 mb-2">{item.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-8">{item.desc}</p>
          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => updateMenuPrice(item._id, item.price)} className="flex-1 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-primary/5 text-slate-600 dark:text-slate-300 hover:text-primary rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"><Edit size={14}/> Edit Price</button>
            <button onClick={() => deleteMenuItem(item._id)} className="w-10 flex-shrink-0 bg-slate-50 dark:bg-slate-900 hover:bg-red-50 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors"><Trash2 size={14}/></button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EventsTab = ({ events, openEditEventForm, deleteEvent }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {events.map(event => (
      <div key={event._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
        <img src={event.image} alt={event.title} className="w-full sm:w-32 h-40 sm:h-32 rounded-xl object-cover" />
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-1"><Calendar size={12}/> {event.date}</div>
          <h3 className="font-bold font-sans text-slate-800 dark:text-white text-lg line-clamp-1 mb-1">{event.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{event.desc}</p>
          <div className="flex gap-3 mt-auto">
            <button onClick={() => openEditEventForm(event)} className="text-primary text-xs font-bold hover:underline flex items-center gap-1"><Edit size={12}/> Edit</button>
            <button onClick={() => deleteEvent(event._id)} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><Trash2 size={12}/> Delete</button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const QRCodeTab = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 flex flex-col items-center text-center max-w-2xl mx-auto mt-10">
    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6"><QrCode size={32} /></div>
    <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-white mb-2 tracking-tight">Table QR Code</h2>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-sm leading-relaxed">Print this QR code and place it on your restaurant tables. Customers can scan it to instantly view your live digital menu.</p>
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 inline-block">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://rastura-restaurant.netlify.app/%23menu&color=1a1a1a&bgcolor=ffffff" alt="Menu QR" className="w-[200px] h-[200px]" />
    </div>
    <a href="https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=https://rastura-restaurant.netlify.app/%23menu" download="Rastura_Menu_QRCode.png" target="_blank" rel="noreferrer" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
      <Download size={16} /> Download High-Res QR
    </a>
  </div>
);

const StatCard = ({ title, value, trend, icon, color, bg, trendDown }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow duration-300 cursor-default">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>{icon}</div>
    <div className="flex-1">
      <div className="text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold font-sans text-slate-800 dark:text-white tracking-tight">{value}</div>
        <div className={`text-xs font-bold ${trendDown ? 'text-red-500' : 'text-green-500'}`}>{trend}</div>
      </div>
    </div>
  </div>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold transition-all text-sm mb-1 ${active ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'}`}>
    <div className={`${active ? 'opacity-100' : 'opacity-70'}`}>{icon}</div>
    <span>{label}</span>
  </button>
);

const FormInput = ({ label, icon, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl pl-11 pr-4 py-3 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-200 dark:border-slate-700" />
    </div>
  </div>
);

const Modal = ({ children, onClose, title }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
    <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 w-full max-w-2xl p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-white tracking-tight">{title}</h2>
        <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-900 p-2 rounded-full"><XCircle size={24} /></button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

export default AdminDashboard;
