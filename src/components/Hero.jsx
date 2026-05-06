import { motion } from 'framer-motion';
import { Phone, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-bg transition-colors duration-500">
      
      {/* Left Floating Bowl - Perfect Circle Crop & Exact Sizing */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          y: [0, -40, 0] 
        }}
        transition={{ 
          opacity: { duration: 1, delay: 0.5 },
          x: { duration: 1, delay: 0.5 },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute left-4 md:left-20 top-[40%] md:top-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-32 h-32 md:w-[280px] md:h-[280px] rounded-full overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)] border-0 flex items-center justify-center bg-white">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=90&w=600"
            alt="Salad Bowl"
            className="w-[110%] h-[110%] object-cover"
          />
        </div>
      </motion.div>

      {/* Right Floating Bowl - Perfect Circle Crop & Exact Sizing */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          y: [0, 40, 0] 
        }}
        transition={{ 
          opacity: { duration: 1, delay: 0.7 },
          x: { duration: 1, delay: 0.7 },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        className="absolute right-4 md:right-20 top-[40%] md:top-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-32 h-32 md:w-[280px] md:h-[280px] rounded-full overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)] border-0 flex items-center justify-center bg-white">
          <img
            src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=90&w=600"
            alt="Soup Bowl"
            className="w-[110%] h-[110%] object-cover"
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Main Headline - EXACT MATCH: Solid Black, Proper Size, Spacing */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-2"
        >
          <h1 className="text-[25vw] md:text-[280px] leading-[0.75] text-textMain font-retro uppercase tracking-[-0.04em]">
            RASTURA
          </h1>
        </motion.div>

        {/* Sub-headline - EXACT MATCH: Black/Charcoal, Bold Scale */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-xl md:text-[64px] font-retro text-textMain uppercase tracking-[0.1em] mb-12">
            WHERE TASTE MEETS ELEGANCE
          </h2>
        </motion.div>

        {/* Social Proof & Contact */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10"
        >
          {/* Phone Pill - Exact Style */}
          <div className="bg-[#EF7C5D] text-white rounded-full px-10 py-5 flex items-center gap-4 shadow-2xl">
            <span className="font-black text-sm md:text-base tracking-widest">+91-98765-43210</span>
            <div className="bg-white text-[#EF7C5D] p-2 rounded-full shadow-inner">
              <Phone size={24} fill="currentColor" strokeWidth={3} />
            </div>
          </div>

          {/* Rating - Exact Style */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-[#F5E6D3] dark:border-[#1A1612] overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-black text-xl md:text-2xl text-[#1A1A1A] dark:text-[#E8D5B0] leading-none mb-1">4.9/5 Rating</div>
              <div className="flex text-[#EF7C5D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#EF7C5D]/5 rounded-full blur-[150px] -z-10" />
    </section>
  );
};

export default Hero;
