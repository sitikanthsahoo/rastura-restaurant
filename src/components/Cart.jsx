import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';

const Cart = ({ cart, onRemove, onAdd, onMinus, onClose }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <>
          {/* Floating Cart Bar */}
          <motion.div
            key="cart-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <div className="bg-textMain text-surface rounded-[30px] p-4 flex items-center justify-between shadow-2xl gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white w-10 h-10 rounded-2xl flex items-center justify-center font-retro text-xl flex-shrink-0">
                  {totalItems}
                </div>
                <div>
                  <div className="font-retro text-lg uppercase tracking-tight leading-none">Your Order</div>
                  <div className="text-surface/60 font-bold text-sm">₹{total.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="bg-surface/10 hover:bg-surface/20 text-surface p-2 rounded-xl transition-all"
                >
                  <ShoppingBag size={20} />
                </button>
                <a
                  href="#reservations"
                  className="bg-primary text-white px-6 py-2 rounded-pill font-retro text-lg flex items-center gap-2 hover:scale-105 transition-all"
                >
                  RESERVE <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Cart Detail Panel (on click of bag icon) */}
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
