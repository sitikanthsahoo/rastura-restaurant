import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Send, CheckCircle, Loader2 } from 'lucide-react';
import { reviewsData as staticReviews } from '../data/menuData';
import FadeUp from './FadeUp';

const StarRating = ({ rating, setRating }) => (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating && setRating(star)}
        className="transition-transform hover:scale-125"
      >
        <Star
          size={28}
          className={star <= rating ? 'text-primary fill-primary' : 'text-textMain/20'}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      </button>
    ))}
  </div>
);

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState(staticReviews);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState('idle'); // idle | loading | success
  const [form, setForm] = useState({ name: '', table: '', quote: '', rating: 5 });

  // Auto-advance carousel
  useEffect(() => {
    if (showForm) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length, showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.quote) return;
    setFormState('loading');

    // Simulate a brief save (works offline too — stores in state)
    await new Promise((r) => setTimeout(r, 1000));

    const newReview = {
      id: Date.now(),
      name: form.name.trim(),
      table: form.table.trim() || 'Guest',
      quote: form.quote.trim(),
      rating: form.rating,
      avatar: `https://i.pravatar.cc/150?u=${form.name.replace(' ', '')}${Date.now()}`
    };

    setReviews((prev) => [...prev, newReview]);
    setIndex(reviews.length); // Jump to the new review
    setFormState('success');

    setTimeout(() => {
      setShowForm(false);
      setFormState('idle');
      setForm({ name: '', table: '', quote: '', rating: 5 });
    }, 2500);
  };

  return (
    <section className="py-24 bg-bg transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <h2 className="text-7xl md:text-9xl font-retro text-textMain uppercase tracking-tighter">
                GUEST <span className="text-primary">TALK</span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-pill font-retro text-xl shadow-xl shadow-primary/20 flex-shrink-0"
              >
                <Send size={20} />
                {showForm ? 'VIEW REVIEWS' : 'SHARE YOUR STORY'}
              </motion.button>
            </div>
          </FadeUp>

          <AnimatePresence mode="wait">
            {/* ---- REVIEW SUBMISSION FORM ---- */}
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-surface rounded-[60px] p-10 md:p-16 shadow-2xl"
              >
                {formState === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={48} className="text-green-600" />
                    </motion.div>
                    <h3 className="text-4xl font-retro text-textMain uppercase">Thank You!</h3>
                    <p className="text-textMain/60 font-bold text-lg">Your review has been added. We are so happy you loved it!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="text-center mb-8">
                      <h3 className="text-4xl font-retro text-textMain uppercase tracking-tighter">Share Your Experience</h3>
                      <p className="text-textMain/50 font-bold mt-2">We'd love to hear what you think of RASTURA</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-retro text-xs text-textMain/40 tracking-widest uppercase ml-4">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Priya Sharma"
                          className="w-full bg-bg rounded-pill px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-retro text-xs text-textMain/40 tracking-widest uppercase ml-4">Table / Visit</label>
                        <input
                          type="text"
                          value={form.table}
                          onChange={e => setForm({ ...form, table: e.target.value })}
                          placeholder="e.g. Table 07"
                          className="w-full bg-bg rounded-pill px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="font-retro text-xs text-textMain/40 tracking-widest uppercase ml-4">Your Rating *</label>
                      <div className="ml-4">
                        <StarRating rating={form.rating} setRating={(r) => setForm({ ...form, rating: r })} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-retro text-xs text-textMain/40 tracking-widest uppercase ml-4">Your Review *</label>
                      <textarea
                        required
                        value={form.quote}
                        onChange={e => setForm({ ...form, quote: e.target.value })}
                        placeholder="Tell us about your dining experience at RASTURA..."
                        className="w-full bg-bg rounded-[30px] px-6 py-4 text-textMain font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-2 border-transparent focus:border-primary min-h-[140px]"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={formState === 'loading'}
                      className="w-full py-5 bg-primary text-white font-retro text-2xl rounded-pill flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70"
                    >
                      {formState === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={20} /> SUBMIT REVIEW</>}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            ) : (
              /* ---- REVIEW CAROUSEL ---- */
              <motion.div
                key="carousel"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-surface rounded-[60px] p-10 md:p-20 shadow-2xl relative overflow-hidden transition-colors duration-500"
              >
                <Quote className="absolute -top-10 -left-10 text-primary/5 w-64 h-64 -rotate-12" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 text-center space-y-10"
                  >
                    <div className="flex justify-center">
                      <StarRating rating={reviews[index]?.rating || 5} />
                    </div>

                    <blockquote className="text-3xl md:text-4xl font-medium text-textMain leading-tight italic transition-colors duration-500">
                      "{reviews[index]?.quote}"
                    </blockquote>

                    <div className="flex flex-col items-center gap-4 pt-4">
                      <div className="w-20 h-20 rounded-full border-4 border-primary p-1">
                        <img
                          src={reviews[index]?.avatar}
                          alt={reviews[index]?.name}
                          className="w-full h-full object-cover rounded-full grayscale"
                        />
                      </div>
                      <div>
                        <div className="text-2xl font-retro text-textMain uppercase tracking-tight">{reviews[index]?.name}</div>
                        <div className="text-primary font-bold uppercase tracking-widest text-sm">{reviews[index]?.table}</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-4 mt-12">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-4 rounded-full transition-all duration-500 ${
                        index === i ? 'w-12 bg-primary' : 'w-4 bg-primary/20 hover:bg-primary/40'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
