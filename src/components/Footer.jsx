import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, MapPin, Phone, UtensilsCrossed, MessageCircle } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = '919876543210'; // Indian number format for WhatsApp
  const whatsappMsg = encodeURIComponent('Hi RASTURA! I would like to book a table. Please confirm availability.');

  return (
    <footer id="contact" className="bg-surface pt-24 pb-0 rounded-t-[80px] shadow-[0_-20px_50px_rgba(239,124,93,0.05)] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-3 rounded-2xl text-white">
                <UtensilsCrossed size={24} />
              </div>
              <span className="text-4xl font-retro text-textMain tracking-tighter transition-colors duration-500">
                RASTURA
              </span>
            </div>
            <p className="text-textMain/60 font-medium leading-relaxed transition-colors duration-500">
              Authentic Indian fine dining — where royal recipes meet modern elegance. 
              Your table is waiting.
            </p>

            {/* WhatsApp Book Button */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-retro text-lg px-6 py-3 rounded-pill transition-all shadow-lg hover:scale-105 w-fit"
            >
              <MessageCircle size={20} />
              BOOK ON WHATSAPP
            </a>

            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  className="bg-bg p-4 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-2xl font-retro text-textMain mb-8 uppercase transition-colors duration-500">Navigation</h3>
            <ul className="space-y-4">
              {['Home', 'About', 'Menu', 'Events', 'Reservations'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-textMain/60 font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-retro text-textMain mb-8 uppercase transition-colors duration-500">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-bg p-3 rounded-xl text-primary transition-colors duration-500 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="text-textMain/60 font-bold transition-colors duration-500">
                  42, MG Road, Indiranagar,<br />Bengaluru, Karnataka 560038
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-bg p-3 rounded-xl text-primary transition-colors duration-500 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <a href="tel:+919876543210" className="text-textMain/60 font-bold hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-bg p-3 rounded-xl text-primary transition-colors duration-500 flex-shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="text-textMain/60 font-bold">Mon – Sun</div>
                  <div className="text-textMain/40 font-bold text-sm">12:00 PM – 11:30 PM</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-retro text-textMain mb-8 uppercase transition-colors duration-500">Stay Updated</h3>
            <p className="text-textMain/50 font-bold text-sm mb-6 leading-relaxed">Get notified about upcoming events, new dishes & exclusive offers.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full bg-bg rounded-pill px-6 py-5 text-textMain font-bold focus:outline-none border-2 border-transparent focus:border-primary transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-pill font-retro text-xl hover:scale-105 transition-transform">
                GO
              </button>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mb-12">
          <h3 className="text-2xl font-retro text-textMain mb-6 uppercase">Find Us</h3>
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-bg h-72 md:h-96">
            <iframe
              title="RASTURA Restaurant Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.978697791906!2d77.6408!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17c3b5e6b5b5%3A0x1234567890abcdef!2sMG%20Road%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1714650000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-bg flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-500">
          <p className="text-textMain/40 font-bold text-xs tracking-widest uppercase transition-colors duration-500">
            © 2026 RASTURA DINING GROUP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-textMain/40 font-bold text-xs tracking-widest uppercase transition-colors duration-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">FSSAI Lic. 10019012000123</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
