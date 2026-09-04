import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="relative bg-theme-surface overflow-hidden h-[70vh] min-h-[500px]">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover object-center opacity-90"
          src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000"
          alt="Elegant jewelry collection"
        />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-sm border border-white/20 shadow-xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Playfair_Display'] font-medium text-white tracking-tight mb-4">
            Elegance in Every Detail
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-light mb-8 max-w-xl mx-auto">
            Discover our curated collection of fine rings, necklaces, and timepieces designed for the modern sophisticate.
          </p>
          <a
            href="#collection"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-theme-accent-fg bg-theme-accent hover:opacity-90 transition-opacity duration-300 uppercase tracking-widest"
          >
            Shop the Collection
          </a>
        </motion.div>
      </div>
    </div>
  );
}
