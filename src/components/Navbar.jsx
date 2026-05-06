import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Soup, Sun, Moon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { name: 'HOME', href: '#home' },
  { name: 'ABOUT', href: '#about' },
  { name: 'MENU', href: '#menu' },
  { name: 'CONTACT', href: '#reservations' },
];

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4">
      {/* EXACT MATCH: Soft peach background, consistent with reference */}
      <div className="w-full max-w-7xl flex justify-between items-center bg-[#F4CDC3] backdrop-blur-md rounded-full px-8 py-3 shadow-xl transition-all duration-500">
        
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="text-[#EF7C5D]">
            <Soup size={32} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-retro text-[#1A1A1A] tracking-tighter">
            RASTURA
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-[#1A1A1A] hover:text-[#EF7C5D] transition-colors tracking-widest font-sans"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-black/5 text-[#1A1A1A] hover:text-[#EF7C5D] transition-all"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-full bg-black/5 text-[#1A1A1A] hover:text-[#EF7C5D] transition-all"
            aria-label="Profile"
          >
            <User size={20} />
          </button>

          {/* EXACT MATCH: CTA Button with white ring */}
          <div className="hidden md:block">
            <motion.a
              href="#reservations"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-full"
            >
              {/* The White Ring from reference */}
              <span className="absolute inset-0 w-full h-full bg-white rounded-full"></span>
              {/* The Main Button */}
              <span className="relative flex items-center gap-2 px-8 py-3 bg-[#EF7C5D] text-white rounded-full font-sans text-xs font-black tracking-widest transition-all">
                BOOK A RESERVATION <ArrowRight size={18} strokeWidth={3} />
              </span>
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[#EF7C5D]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-[#F4CDC3] p-8 rounded-[40px] md:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold text-[#1A1A1A] hover:text-[#EF7C5D] transition-colors text-center font-sans tracking-widest"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#reservations"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-4 bg-[#EF7C5D] text-white rounded-full font-sans font-black text-sm tracking-widest uppercase"
              >
                BOOK A RESERVATION <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
