import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData as staticMenuData, menuCategories } from '../data/menuData';
import FadeUp from './FadeUp';
import { Flame } from 'lucide-react';




// Assign spice levels to items based on name (for static data)
const spiceMap = {
  'Paneer Tikka': 2, 'Seekh Kebab': 2, 'Dahi Puri': 1, 'Chicken Malai Tikka': 1,
  'Butter Chicken': 2, 'Dal Makhani': 1, 'Hyderabadi Dum Biryani': 3,
  'Palak Paneer': 1, 'Rogan Josh': 3, 'Gulab Jamun': 0, 'Rasmalai': 0,
  'Kulfi Falooda': 0, 'Mango Lassi': 0, 'Masala Chai': 1, 'Rose Sharbat': 0,
};

const AddButton = ({ item, cartItem, onAddToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const qty = cartItem ? cartItem.qty : 0;

  const handleClick = (e) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    if (onAddToCart) onAddToCart(item);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-[#EF7C5D] rounded-full z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        onClick={handleClick}
        className="relative w-14 h-14 bg-surface rounded-full flex items-center justify-center text-[#EF7C5D] shadow-lg transition-colors hover:bg-primary hover:text-white z-10 border-2 border-transparent"
      >
        <span className="text-3xl font-bold leading-none mb-1">+</span>
        <AnimatePresence>
          {qty > 0 && (
            <motion.span
              key={qty}
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-textMain text-surface rounded-full text-xs font-bold flex items-center justify-center border-2 border-surface shadow-md"
            >
              {qty}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

const Menu = ({ onAddToCart, cart = [] }) => {
  const [activeTab, setActiveTab] = useState("Starters");
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/menu`);
        if (response.ok) {
          const serverData = await response.json();
          if (serverData.length > 0) {
            setMenuItems(serverData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
          } else {
            setMenuItems(staticMenuData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
          }
        } else {
          setMenuItems(staticMenuData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
        }
      } catch (error) {
        setMenuItems(staticMenuData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const catMatch = item.category === activeTab;
    if (vegFilter === 'veg') return catMatch && item.isVeg;
    if (vegFilter === 'nonveg') return catMatch && !item.isVeg;
    return catMatch;
  });

  return (
    <section id="menu" className="py-24 bg-parchment transition-colors duration-500 shadow-inner">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <FadeUp>
            <h2 className="text-7xl md:text-9xl font-retro text-textMain mb-8 uppercase tracking-tighter">
              EXPLORE OUR MENU
            </h2>
          </FadeUp>

          {/* Veg / Non-Veg Filter */}
          <FadeUp delay={0.1}>
            <div className="flex justify-center gap-3 mb-8">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-6 py-2 rounded-full font-bold text-sm border-2 transition-all ${vegFilter === 'all' ? 'bg-textMain text-surface border-textMain' : 'border-textMain/20 text-textMain/50 hover:border-textMain/50'
                  }`}
              >
                ALL
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm border-2 transition-all ${vegFilter === 'veg' ? 'bg-green-600 text-white border-green-600' : 'border-green-600/40 text-green-600 hover:border-green-600'
                  }`}
              >
                <span className="w-3 h-3 rounded-sm border-2 border-green-600 bg-green-600 inline-block flex-shrink-0" />
                VEG ONLY
              </button>
              <button
                onClick={() => setVegFilter('nonveg')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm border-2 transition-all ${vegFilter === 'nonveg' ? 'bg-red-500 text-white border-red-500' : 'border-red-500/40 text-red-500 hover:border-red-500'
                  }`}
              >
                <span className="w-3 h-3 rounded-sm border-2 border-red-500 bg-red-500 inline-block flex-shrink-0" />
                NON-VEG
              </button>
            </div>
          </FadeUp>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 bg-bg p-2 rounded-full max-w-fit mx-auto mb-12 transition-colors duration-500 shadow-inner">
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`relative px-10 py-3 text-sm font-bold transition-all rounded-full ${activeTab === category
                    ? 'bg-[#EF7C5D] text-white shadow-lg scale-105'
                    : 'text-textMain/60 hover:text-[#EF7C5D]'
                  }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-3 text-center py-20 text-textMain/30 font-retro text-4xl uppercase"
              >
                No items found
              </motion.div>
            ) : filteredItems.map((item) => (
              <motion.div
                key={item.id || item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -10 }}
                className="bg-bg rounded-[45px] shadow-xl shadow-primary/5 group relative transition-all duration-500 overflow-hidden flex flex-col"
              >
                {item.image && (
                  <div className="h-56 w-full relative flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                
                <div className="p-8 pb-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                    {/* Indian Veg / Non-Veg indicator */}
                    <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                    </div>
                    <h3 className="text-3xl font-retro text-textMain uppercase tracking-tight group-hover:text-[#EF7C5D] transition-colors leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <span className="text-3xl font-retro text-[#EF7C5D] flex-shrink-0 ml-2">
                    ₹{item.price}
                  </span>
                </div>

                {/* Spice Level */}
                {item.spice > 0 && (
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(3)].map((_, i) => (
                      <Flame
                        key={i}
                        size={16}
                        className={`transition-all ${i < item.spice ? 'text-orange-500' : 'text-textMain/10'}`}
                        fill={i < item.spice ? 'currentColor' : 'none'}
                      />
                    ))}
                    <span className="text-xs font-bold text-textMain/40 ml-1 uppercase tracking-widest">
                      {item.spice === 1 ? 'Mild' : item.spice === 2 ? 'Medium' : 'Hot'}
                    </span>
                  </div>
                )}

                <p className="text-textMain/70 font-medium leading-relaxed text-base pr-10">
                  {item.desc}
                </p>

                {/* Add to Cart Button */}
                <div className="absolute bottom-8 right-8">
                  {(() => {
                    const cartItem = cart.find(c => (c._id || c.id) === (item._id || item.id));
                    const qty = cartItem ? cartItem.qty : 0;
                    return (
                      <AddButton item={item} cartItem={cartItem} onAddToCart={onAddToCart} />
                    );
                  })()}
                </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Menu;
