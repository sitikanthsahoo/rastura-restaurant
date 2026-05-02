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

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || false;
  });

  const [admin, setAdmin] = useState(null);

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

  return (
    <BrowserRouter>
      <div className="bg-bg text-textMain min-h-screen transition-colors duration-500">
        <CustomCursor />
        
        <Routes>
          {/* Main Website Route */}
          <Route path="/" element={
            <>
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main>
                <Hero />
                <About />
                <Menu />
                <Events />
                <Gallery />
                <Testimonials />
                <Reservations />
              </main>
              <Footer />
            </>
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
