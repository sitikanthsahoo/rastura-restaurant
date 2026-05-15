import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import axios from 'axios';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Cart = ({ cart, onRemove, onAdd, onMinus, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on backend
      const result = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/create-order`, {
        amount: total
      });

      if (!result.data.success) {
        alert("Server error. Are you sure the backend is running?");
        setIsProcessing(false);
        return;
      }

      const { amount, id: order_id, currency } = result.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SpXjV5iAEI00w6',
        amount: amount.toString(),
        currency: currency,
        name: "Rastura Restaurant",
        description: "Delicious Food Order",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=150",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/verify`, data);

          if (verifyRes.data.success) {
            alert("Payment Successful! Order placed.");
            setIsOpen(false);
            if (onClose) onClose(); // Use onClose or similar to clear cart
          } else {
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: "Foodie Guest",
          email: "guest@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#EF7C5D", // Rastura primary color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the payment!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && !isOpen && (
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
                <div className="bg-primary text-white w-10 h-10 rounded-2xl flex items-center justify-center font-retro text-xl flex-shrink-0 shadow-inner">
                  {totalItems}
                </div>
                <div>
                  <div className="font-retro text-lg uppercase tracking-tight leading-none">Your Order</div>
                  <div className="text-surface/60 font-bold text-sm">₹{total.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-surface/10 hover:bg-surface/20 text-surface p-2 rounded-xl transition-all flex gap-2 items-center px-4"
                >
                  <ShoppingBag size={20} />
                  <span className="font-bold">VIEW</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-textMain/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-textMain/10 flex items-center justify-between bg-bg">
                <h2 className="font-retro text-3xl uppercase tracking-tighter text-textMain flex items-center gap-3">
                  <ShoppingBag className="text-primary" /> Your Cart
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-textMain/5 hover:bg-textMain/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-bg/50">
                {cart.length === 0 ? (
                  <div className="text-center text-textMain/50 mt-20 font-bold">Your cart is empty.</div>
                ) : (
                  cart.map(item => (
                    <div key={item._id || item.id} className="flex gap-4 items-center bg-surface p-4 rounded-3xl shadow-sm border border-textMain/5">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image || item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-textMain leading-tight">{item.name}</h3>
                        <div className="text-primary font-bold mt-1">₹{item.price}</div>
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => onMinus(item._id || item.id)} className="w-8 h-8 rounded-full bg-textMain/5 flex items-center justify-center hover:bg-textMain/10 text-textMain transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => onAdd(item)} className="w-8 h-8 rounded-full bg-textMain/5 flex items-center justify-center hover:bg-textMain/10 text-textMain transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => onRemove(item._id || item.id)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors self-start">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-surface border-t border-textMain/10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-textMain/60 font-bold">Total Amount</span>
                    <span className="font-retro text-3xl text-textMain">₹{total.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleCheckout} 
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-full font-retro text-xl uppercase tracking-wider transition-all shadow-[0_10px_20px_rgba(239,124,93,0.3)] hover:shadow-[0_15px_30px_rgba(239,124,93,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "Processing..." : "PAY WITH RAZORPAY"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
