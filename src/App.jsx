import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Reservations from './components/Reservations';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Cart from './components/Cart';
import CustomerAuth from './components/CustomerAuth';
import CustomerDashboard from './components/CustomerDashboard';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || false;
  });

  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${API_URL}/api/users/me`, { headers: { 'x-auth-token': token } })
        .then(res => res.json())
        .then(data => { if (data.user) setUser(data.user); })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLogin = (adminData) => setAdmin(adminData);
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  // Cart handlers
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => (i._id || i.id) === (item._id || item.id));
      if (existing) {
        return prev.map(i =>
          (i._id || i.id) === (item._id || item.id) ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => (i._id || i.id) !== itemId));
  };

  const minusFromCart = (itemId) => {
    setCart(prev =>
      prev.map(i => (i._id || i.id) === itemId ? { ...i, qty: i.qty - 1 } : i)
         .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <div className="bg-bg text-textMain min-h-screen transition-colors duration-500">
        <CustomCursor />

        <Routes>
          {/* Main Website Route */}
          <Route path="/" element={
            <>
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} cart={cart} />
              <main>
                <Hero />
                <About />
                <Menu onAddToCart={addToCart} cart={cart} />
                <Events />
                <Gallery />
                <Testimonials />
                <Reservations cart={cart} onClearCart={clearCart} />
              </main>
              <Footer />
              <Cart
                cart={cart}
                onAdd={addToCart}
                onMinus={minusFromCart}
                onRemove={removeFromCart}
                onClose={clearCart}
              />
            </>
          } />

          {/* Customer Profile Route */}
          <Route path="/profile" element={
            user ? (
              <CustomerDashboard user={user} onLogout={handleUserLogout} />
            ) : (
              <CustomerAuth onLogin={(u) => setUser(u)} />
            )
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            admin ? (
              <AdminDashboard admin={admin} onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
