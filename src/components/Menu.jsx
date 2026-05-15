import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData as staticMenuData, menuCategories } from '../data/menuData';
import FadeUp from './FadeUp';
import { Flame, Star, X, Loader2, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const spiceMap = {
  'Paneer Tikka': 2, 'Seekh Kebab': 2, 'Dahi Puri': 1, 'Chicken Malai Tikka': 1,
  'Butter Chicken': 2, 'Dal Makhani': 1, 'Hyderabadi Dum Biryani': 3,
  'Palak Paneer': 1, 'Rogan Josh': 3, 'Gulab Jamun': 0, 'Rasmalai': 0,
  'Kulfi Falooda': 0, 'Mango Lassi': 0, 'Masala Chai': 1, 'Rose Sharbat': 0,
};

/* ---- Star Rating Display ---- */
const StarRating = ({ avg, count, size = 14, className = '' }) => {
  if (!count) return null;
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} size={size}
            fill={s <= Math.round(avg) ? '#f59e0b' : 'none'}
            className={s <= Math.round(avg) ? 'text-amber-400' : 'text-textMain/20'}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-textMain/50">{avg} ({count})</span>
    </div>
  );
};

/* ---- Interactive Star Picker ---- */
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button"
          onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}>
          <Star size={28}
            fill={s <= (hovered || value) ? '#f59e0b' : 'none'}
            className={s <= (hovered || value) ? 'text-amber-400' : 'text-textMain/20'}
          />
        </button>
      ))}
    </div>
  );
};

/* ---- Add to Cart Button ---- */
const AddButton = ({ item, cartItem, onAddToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const qty = cartItem ? cartItem.qty : 0;

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    if (onAddToCart) onAddToCart(item);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isAnimating && (
          <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-[#EF7C5D] rounded-full z-0 pointer-events-none" />
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} onClick={handleClick}
        className="relative w-14 h-14 bg-surface rounded-full flex items-center justify-center text-[#EF7C5D] shadow-lg transition-colors hover:bg-primary hover:text-white z-10 border-2 border-transparent">
        <span className="text-3xl font-bold leading-none mb-1">+</span>
        <AnimatePresence>
          {qty > 0 && (
            <motion.span key={qty} initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-textMain text-surface rounded-full text-xs font-bold flex items-center justify-center border-2 border-surface shadow-md">
              {qty}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

/* ---- Review Modal ---- */
const ReviewModal = ({ item, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isLoggedIn = !!localStorage.getItem('userToken');

  useEffect(() => {
    const id = item._id || item.id;
    fetch(`${API_URL}/api/reviews/${id}`)
      .then(r => r.json())
      .then(data => { setReviews(data.reviews || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a star rating.');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('userToken') || '' },
        body: JSON.stringify({ menuItemId: item._id || item.id, rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setRating(0);
        setComment('');
        // Refresh reviews
        const id = item._id || item.id;
        fetch(`${API_URL}/api/reviews/${id}`).then(r => r.json()).then(d => setReviews(d.reviews || []));
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-textMain/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-textMain/10 flex items-center justify-between bg-bg">
          <div>
            <h3 className="font-retro text-2xl text-textMain uppercase">{item.name}</h3>
            {reviews.length > 0 && <StarRating avg={parseFloat(avg)} count={reviews.length} size={14} />}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-textMain/10 text-textMain transition-colors"><X size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Write Review */}
          {isLoggedIn ? (
            <div className="bg-bg rounded-2xl p-5 border border-textMain/10">
              <h4 className="font-bold text-textMain mb-3 text-sm uppercase tracking-wider">Leave a Review</h4>
              {submitted ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                  className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-3 rounded-xl">
                  <Check size={18} /> Review submitted! Thank you.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <StarPicker value={rating} onChange={setRating} />
                  <textarea value={comment} onChange={e => setComment(e.target.value)} required
                    placeholder="Share your experience with this dish..."
                    className="w-full bg-surface border border-textMain/10 rounded-xl px-4 py-3 text-textMain text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[90px] resize-none" />
                  <button type="submit" disabled={submitting}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-60 flex items-center gap-2">
                    {submitting ? <Loader2 size={15} className="animate-spin" /> : <Star size={15} />}
                    {submitting ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-bg rounded-2xl p-4 border border-textMain/10 text-center text-textMain/50 font-bold text-sm">
              <a href="/profile" className="text-primary hover:underline">Login</a> to leave a review
            </div>
          )}

          {/* Reviews List */}
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-textMain/40 font-bold py-6 text-sm">No reviews yet. Be the first!</p>
          ) : (
            reviews.map(r => (
              <div key={r._id} className="bg-bg rounded-2xl p-4 border border-textMain/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {r.userName[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-textMain text-sm">{r.userName}</span>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} fill={s <= r.rating ? '#f59e0b' : 'none'}
                        className={s <= r.rating ? 'text-amber-400' : 'text-textMain/20'} />
                    ))}
                  </div>
                </div>
                <p className="text-textMain/70 text-sm leading-relaxed">{r.comment}</p>
                <p className="text-textMain/30 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ---- Main Menu Component ---- */
const Menu = ({ onAddToCart, cart = [] }) => {
  const [activeTab, setActiveTab] = useState('Starters');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState('all');
  const [ratings, setRatings] = useState({});
  const [reviewItem, setReviewItem] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/api/menu`);
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data.length > 0
            ? data.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 }))
            : staticMenuData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
        } else {
          setMenuItems(staticMenuData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
        }
      } catch {
        setMenuItems(staticMenuData.map(i => ({ ...i, spice: spiceMap[i.name] ?? 1 })));
      } finally { setIsLoading(false); }
    };

    const fetchRatings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        if (res.ok) setRatings(await res.json());
      } catch { /* silently fail */ }
    };

    fetchMenu();
    fetchRatings();
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
              <button onClick={() => setVegFilter('all')}
                className={`px-6 py-2 rounded-full font-bold text-sm border-2 transition-all ${vegFilter === 'all' ? 'bg-textMain text-surface border-textMain' : 'border-textMain/20 text-textMain/50 hover:border-textMain/50'}`}>
                ALL
              </button>
              <button onClick={() => setVegFilter('veg')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm border-2 transition-all ${vegFilter === 'veg' ? 'bg-green-600 text-white border-green-600' : 'border-green-600/40 text-green-600 hover:border-green-600'}`}>
                <span className="w-3 h-3 rounded-sm border-2 border-green-600 bg-green-600 inline-block flex-shrink-0" />
                VEG ONLY
              </button>
              <button onClick={() => setVegFilter('nonveg')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm border-2 transition-all ${vegFilter === 'nonveg' ? 'bg-red-500 text-white border-red-500' : 'border-red-500/40 text-red-500 hover:border-red-500'}`}>
                <span className="w-3 h-3 rounded-sm border-2 border-red-500 bg-red-500 inline-block flex-shrink-0" />
                NON-VEG
              </button>
            </div>
          </FadeUp>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 bg-bg p-2 rounded-full max-w-fit mx-auto mb-12 transition-colors duration-500 shadow-inner">
            {menuCategories.map(category => (
              <button key={category} onClick={() => setActiveTab(category)}
                className={`relative px-10 py-3 text-sm font-bold transition-all rounded-full ${activeTab === category ? 'bg-[#EF7C5D] text-white shadow-lg scale-105' : 'text-textMain/60 hover:text-[#EF7C5D]'}`}>
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-3 text-center py-20 text-textMain/30 font-retro text-4xl uppercase">
                No items found
              </motion.div>
            ) : filteredItems.map(item => {
              const id = item._id || item.id;
              const ratingData = ratings[id];
              const cartItem = cart.find(c => (c._id || c.id) === id);
              return (
                <motion.div key={id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} whileHover={{ y: -10 }}
                  className="bg-bg rounded-[45px] shadow-xl shadow-primary/5 group relative transition-all duration-500 overflow-hidden flex flex-col">
                  {item.image && (
                    <div className="h-56 w-full relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {ratingData && (
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star size={11} fill="#f59e0b" className="text-amber-400" />
                          <span className="text-xs font-bold text-slate-700">{ratingData.avg} ({ratingData.count})</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-8 pb-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                        </div>
                        <h3 className="text-3xl font-retro text-textMain uppercase tracking-tight group-hover:text-[#EF7C5D] transition-colors leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <span className="text-3xl font-retro text-[#EF7C5D] flex-shrink-0 ml-2">₹{item.price}</span>
                    </div>

                    {/* Spice Level */}
                    {item.spice > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(3)].map((_, i) => (
                          <Flame key={i} size={16}
                            className={`transition-all ${i < item.spice ? 'text-orange-500' : 'text-textMain/10'}`}
                            fill={i < item.spice ? 'currentColor' : 'none'} />
                        ))}
                        <span className="text-xs font-bold text-textMain/40 ml-1 uppercase tracking-widest">
                          {item.spice === 1 ? 'Mild' : item.spice === 2 ? 'Medium' : 'Hot'}
                        </span>
                      </div>
                    )}

                    <p className="text-textMain/70 font-medium leading-relaxed text-base pr-10 mb-4">
                      {item.desc}
                    </p>

                    {/* Review button */}
                    <button onClick={() => setReviewItem(item)}
                      className="flex items-center gap-1.5 text-xs font-bold text-textMain/40 hover:text-amber-500 transition-colors w-fit mt-auto">
                      <Star size={12} /> {ratingData ? `${ratingData.count} review${ratingData.count !== 1 ? 's' : ''}` : 'Be first to review'}
                    </button>

                    {/* Add to Cart Button */}
                    <div className="absolute bottom-8 right-8">
                      <AddButton item={item} cartItem={cartItem} onAddToCart={onAddToCart} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewItem && <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Menu;
