import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FadeUp from './FadeUp';

const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-bg transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-12">
            <FadeUp>
              <h2 className="text-7xl md:text-9xl font-retro text-textMain leading-[0.9] uppercase tracking-tighter">
                WE ARE <br />
                <span className="text-primary">RASTURA</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-xl md:text-2xl font-medium text-textMain/70 leading-relaxed max-w-xl">
                Born from a passion for authentic flavors and retro aesthetics, 
                Rastura is where tradition meets modern culinary art. 
                Every dish is a tribute to the classics, reimagined for today.
              </p>
            </FadeUp>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 py-12 bg-surface rounded-[40px] px-8 shadow-xl shadow-primary/5 transition-colors duration-500">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-retro text-primary mb-2">
                  <Counter end={10} />+
                </div>
                <div className="text-textMain/60 font-bold text-xs uppercase tracking-widest">Master Chefs</div>
              </div>
              <div className="text-center border-x border-primary/10">
                <div className="text-4xl md:text-6xl font-retro text-primary mb-2">
                  <Counter end={50} />+
                </div>
                <div className="text-textMain/60 font-bold text-xs uppercase tracking-widest">Daily Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-retro text-primary mb-2">
                  <Counter end={15} />
                </div>
                <div className="text-textMain/60 font-bold text-xs uppercase tracking-widest">Major Awards</div>
              </div>
            </div>
          </div>

          {/* Right: Image Montage */}
          <div className="relative">
            <FadeUp delay={0.4}>
              <div className="aspect-square bg-surface p-4 rounded-[60px] shadow-2xl relative transition-colors duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" 
                  alt="Restaurant interior"
                  className="w-full h-full object-cover rounded-[50px] grayscale hover:grayscale-0 transition-all duration-700"
                />
                {/* Floating Badge */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary text-white rounded-full flex items-center justify-center p-8 text-center font-retro text-xl leading-none shadow-xl"
                >
                  PREMIUM QUALITY FOOD
                </motion.div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
