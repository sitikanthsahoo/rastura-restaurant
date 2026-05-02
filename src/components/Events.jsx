import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { eventsData as staticEventsData } from '../data/menuData';
import FadeUp from './FadeUp';
import { ArrowLeft, ArrowRight, Ticket } from 'lucide-react';

const Events = () => {
  const scrollContainerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/events`);
        if (response.ok) {
          const serverEvents = await response.json();
          if (serverEvents.length > 0) {
            setEvents(serverEvents);
          } else {
            setEvents(staticEventsData);
          }
        } else {
          setEvents(staticEventsData);
        }
      } catch (err) {
        console.error('Error loading events:', err);
        setEvents(staticEventsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 500;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="events" className="py-24 bg-bg transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <FadeUp>
            <h2 className="text-7xl md:text-9xl font-retro text-textMain uppercase tracking-tighter leading-[0.8]">
              WHAT'S <br />
              <span className="text-primary">HAPPENING?</span>
            </h2>
          </FadeUp>
          
          <div className="flex flex-col items-end gap-6">
            <FadeUp delay={0.2}>
              <p className="text-xl font-medium text-textMain/60 max-w-sm mb-2 text-right">
                Join us for exclusive nights of music, tasting, and culinary magic.
              </p>
            </FadeUp>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => scroll('left')}
                className="w-16 h-16 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95"
                aria-label="Previous events"
              >
                <ArrowLeft size={32} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary/20"
                aria-label="Next events"
              >
                <ArrowRight size={32} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-12 snap-x no-scrollbar"
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id || index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className="flex-shrink-0 w-[320px] md:w-[450px] snap-start bg-surface rounded-[50px] overflow-hidden border-4 border-surface shadow-2xl group transition-colors duration-500"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-6 left-6 px-6 py-2 bg-primary text-white font-retro text-xl rounded-pill shadow-lg">
                  {event.date.toUpperCase()}
                </div>
              </div>
              
              <div className="p-10 space-y-4">
                <h3 className="text-4xl font-retro text-textMain uppercase group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-textMain/60 font-medium leading-relaxed">
                  {event.desc}
                </p>
                <button className="btn-pill w-full justify-center mt-4">
                  GET TICKETS <Ticket size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
