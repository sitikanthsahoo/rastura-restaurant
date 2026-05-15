import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Users, LogOut, ArrowLeft, Loader2,
  History, User, Phone, MapPin, Plus, Trash2, Edit3,
  Check, X, Home, Building, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const getToken = () => localStorage.getItem('userToken') || '';

const CustomerDashboard = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState(initialUser);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, { headers: { 'x-auth-token': getToken() } });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setReservations(data.reservations);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'history', label: 'Bookings', icon: History },
  ];

  return (
    <div className="min-h-screen bg-bg transition-colors duration-500">
      {/* Header */}
      <div className="bg-surface border-b border-textMain/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-textMain/50 hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft size={18} /> BACK TO HOME
        </button>
        <div className="font-retro text-2xl text-textMain">MY ACCOUNT</div>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* User Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl p-6 mb-8 flex items-center gap-5 border border-textMain/10 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
            {(user?.name || 'G')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-textMain">{user?.name || 'Guest'}</h1>
            <p className="text-textMain/50 text-sm font-medium">{user?.email}</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-4 text-sm font-bold text-textMain/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-textMain">{reservations.length}</div>
              <div>Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-textMain">{user?.addresses?.length || 0}</div>
              <div>Addresses</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Nav */}
        <div className="flex gap-2 mb-8 bg-surface p-1.5 rounded-2xl border border-textMain/10 shadow-sm w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === t.id ? 'bg-primary text-white shadow-md' : 'text-textMain/50 hover:text-textMain'}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileTab key="profile" user={user} setUser={setUser} />}
            {activeTab === 'addresses' && <AddressesTab key="addresses" user={user} setUser={setUser} />}
            {activeTab === 'history' && <HistoryTab key="history" reservations={reservations} navigate={navigate} />}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

/* =========== PROFILE TAB =========== */
const ProfileTab = ({ user, setUser }) => {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': getToken() },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setSaved(true);
        setIsEditing(false);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="bg-surface rounded-3xl border border-textMain/10 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-textMain flex items-center gap-2"><User size={20} className="text-primary" /> Personal Details</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
              <Edit3 size={15} /> Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Full Name" icon={<User size={16} />} value={form.name}
            editable={isEditing} onChange={v => setForm({ ...form, name: v })} />
          <ProfileField label="Phone Number" icon={<Phone size={16} />} value={form.phone || '—'}
            editable={isEditing} onChange={v => setForm({ ...form, phone: v })} />
          <ProfileField label="Email Address" icon={<User size={16} />} value={user?.email} editable={false} />
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-8">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => { setIsEditing(false); setForm({ name: user?.name || '', phone: user?.phone || '' }); }}
              className="flex items-center gap-2 text-textMain/50 px-6 py-3 rounded-xl font-bold text-sm hover:bg-textMain/5 transition-all">
              <X size={16} /> Cancel
            </button>
          </div>
        )}

        {saved && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-4 py-2 rounded-xl w-fit">
            <Check size={16} /> Profile updated successfully!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ProfileField = ({ label, icon, value, editable, onChange }) => (
  <div>
    <label className="text-xs font-bold text-textMain/40 uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMain/30">{icon}</div>
      {editable ? (
        <input value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-bg border-2 border-primary/30 focus:border-primary rounded-xl pl-10 pr-4 py-3 text-textMain font-medium focus:outline-none transition-all text-sm" />
      ) : (
        <div className="w-full bg-bg rounded-xl pl-10 pr-4 py-3 text-textMain font-medium text-sm border-2 border-transparent">{value || '—'}</div>
      )}
    </div>
  </div>
);

/* =========== ADDRESSES TAB =========== */
const AddressesTab = ({ user, setUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', line1: '', city: '', pincode: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = async () => {
    if (!form.line1 || !form.city || !form.pincode) return alert('Please fill all fields.');
    const token = getToken();
    if (!token) return alert('You must be logged in to save an address. Please log in and try again.');
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/users/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      console.log('Address save response:', res.status, data);
      if (res.ok && data.success) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        setForm({ label: 'Home', line1: '', city: '', pincode: '' });
        setShowForm(false);
      } else {
        alert(`Failed to save: ${data.message || 'Unknown error (status ' + res.status + ')'}`);
      }
    } catch (err) {
      console.error('Address save error:', err);
      alert('Network error: ' + err.message);
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/users/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': getToken() }
      });
      const data = await res.json();
      if (data.success) setUser(prev => ({ ...prev, addresses: data.addresses }));
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  const addresses = user?.addresses || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {/* Address Cards */}
      {addresses.map(addr => (
        <motion.div key={addr._id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-surface rounded-2xl border border-textMain/10 p-5 flex items-center gap-4 shadow-sm">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.label === 'Home' ? 'bg-blue-100 text-blue-500' : 'bg-purple-100 text-purple-500'}`}>
            {addr.label === 'Home' ? <Home size={20} /> : <Building size={20} />}
          </div>
          <div className="flex-1">
            <div className="font-bold text-textMain text-sm mb-0.5">{addr.label}</div>
            <div className="text-textMain/60 text-sm">{addr.line1}, {addr.city} — {addr.pincode}</div>
          </div>
          <button onClick={() => handleDelete(addr._id)} disabled={deletingId === addr._id}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            {deletingId === addr._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </motion.div>
      ))}

      {addresses.length === 0 && !showForm && (
        <div className="bg-surface rounded-3xl p-12 text-center border border-textMain/10">
          <MapPin className="mx-auto text-primary mb-4" size={32} />
          <p className="text-textMain/50 font-bold">No saved addresses yet.</p>
        </div>
      )}

      {/* Add Address Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-surface rounded-2xl border border-primary/20 p-6 shadow-sm">
            <h3 className="font-bold text-textMain mb-5 flex items-center gap-2"><Plus size={18} className="text-primary" /> New Address</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-textMain/40 uppercase tracking-wider mb-1 block">Label</label>
                <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                  className="w-full bg-bg border border-textMain/10 rounded-xl px-4 py-2.5 text-textMain font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-textMain/40 uppercase tracking-wider mb-1 block">Pincode</label>
                <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="e.g. 400001"
                  className="w-full bg-bg border border-textMain/10 rounded-xl px-4 py-2.5 text-textMain font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-5">
              <div>
                <label className="text-xs font-bold text-textMain/40 uppercase tracking-wider mb-1 block">Street / Flat / Area</label>
                <input value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} placeholder="e.g. 42B, MG Road, Andheri West"
                  className="w-full bg-bg border border-textMain/10 rounded-xl px-4 py-2.5 text-textMain font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-textMain/40 uppercase tracking-wider mb-1 block">City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Mumbai"
                  className="w-full bg-bg border border-textMain/10 rounded-xl px-4 py-2.5 text-textMain font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAdd} disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-60">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save Address
              </button>
              <button onClick={() => setShowForm(false)} className="text-textMain/50 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-textMain/5 transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="w-full py-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-bold text-sm flex items-center justify-center gap-2 hover:border-primary/60 hover:bg-primary/5 transition-all">
          <Plus size={18} /> Add New Address
        </button>
      )}
    </motion.div>
  );
};

/* =========== HISTORY TAB =========== */
const HistoryTab = ({ reservations, navigate }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    {reservations.length === 0 ? (
      <div className="bg-surface p-16 rounded-3xl text-center border border-textMain/10">
        <Calendar className="mx-auto text-primary mb-4" size={32} />
        <h3 className="text-xl font-bold text-textMain mb-2">No Reservations Yet</h3>
        <p className="text-textMain/50 font-medium mb-6 text-sm">You haven't booked any tables with us yet.</p>
        <button onClick={() => navigate('/#reservations')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
          Book a Table
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reservations.map((res, i) => (
          <motion.div key={res._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-surface rounded-2xl border border-textMain/10 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>{res.status}</span>
              <span className="text-textMain/30 font-bold text-xs">{new Date(res.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-bg rounded-xl flex items-center justify-center text-primary"><Calendar size={14} /></div>
                <span className="font-bold text-textMain">{res.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-bg rounded-xl flex items-center justify-center text-primary"><Clock size={14} /></div>
                <span className="font-bold text-textMain">{res.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-bg rounded-xl flex items-center justify-center text-primary"><Users size={14} /></div>
                <span className="font-bold text-textMain">{res.guests} Guests</span>
              </div>
              {res.table && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-bg rounded-xl flex items-center justify-center text-primary"><MapPin size={14} /></div>
                  <span className="font-bold text-textMain">Table {res.table.id?.replace('T', '')} ({res.table.seats} seats)</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

export default CustomerDashboard;
