import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import FadeUp from './FadeUp';

const galleryImages = [
  { id: 1, span: 'md:col-span-2 md:row-span-2', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800' },
  { id: 2, span: 'md:col-span-1 md:row-span-1', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
  { id: 3, span: 'md:col-span-1 md:row-span-2', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
  { id: 4, span: 'md:col-span-1 md:row-span-1', img: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800' },
  { id: 5, span: 'md:col-span-1 md:row-span-1', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' },
  { id: 6, span: 'md:col-span-2 md:row-span-1', img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800' },
];

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <section id="gallery" className="py-24 bg-surface transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <FadeUp>
            <h2 className="text-7xl md:text-9xl font-retro text-textMain uppercase tracking-tighter">
              VISUAL <span className="text-primary">VIBES</span>
            </h2>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {galleryImages.map((item) => (
            <motion.div
              key={item.id}
              className={`relative overflow-hidden rounded-[40px] cursor-pointer group border-4 border-transparent hover:border-primary transition-all duration-500 ${item.span}`}
              onClick={() => setSelectedImg(item)}
              whileHover={{ scale: 0.98 }}
            >
              <img
                src={item.img}
                alt="Gallery"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-surface p-4 rounded-full text-primary shadow-xl scale-0 group-hover:scale-100 transition-transform duration-500">
                  <Maximize2 size={32} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-textMain/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <button className="absolute top-10 right-10 text-white hover:text-primary transition-colors">
              <X size={48} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-6xl w-full aspect-video rounded-[60px] overflow-hidden border-8 border-surface shadow-2xl transition-colors duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImg.img} alt="Enlarged" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
