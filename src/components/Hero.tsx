import { motion } from 'motion/react';

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-theme-bg to-theme-surface"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2 bg-theme-surface/80 backdrop-blur-sm border border-theme-border/50 px-4 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-theme-accent rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-medium text-theme-muted">New Collection</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-['Playfair_Display'] text-theme-text mb-8 leading-tight tracking-tight"
        >
          Timeless <br />
          <span className="font-light">Elegance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lg sm:text-xl text-theme-muted max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Discover hand-selected pieces crafted with exceptional attention to detail. 
          Where heritage meets modern sophistication.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#collection"
            className="bg-theme-accent text-theme-accent-fg px-10 py-4 text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Collection
          </a>
          <a
            href="#"
            className="border border-theme-border text-theme-text px-10 py-4 text-sm font-medium uppercase tracking-widest hover:bg-theme-border/50 transition-colors"
          >
            View Lookbook
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-theme-muted"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.section>
  );
}