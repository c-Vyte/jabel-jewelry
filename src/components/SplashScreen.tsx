import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const logoVariants = {
  initial: { scale: 0.6, opacity: 0, rotate: -15 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 1.2, opacity: 0, rotate: 15 }
};

const textVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const springConfig = {
  type: "spring",
  stiffness: 180,
  damping: 18,
  mass: 1
};

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      const completeTimer = setTimeout(onComplete, 600);
      return () => clearTimeout(completeTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-theme-bg flex flex-col items-center justify-center p-4 selection:bg-transparent"
        >
          <motion.div
            variants={logoVariants}
            transition={springConfig}
            className="flex flex-col items-center max-w-sm text-center"
          >
            <div className="w-32 h-32 mb-6 relative flex items-center justify-center overflow-hidden rounded-full shadow-2xl border border-theme-border/50 bg-theme-surface">
              <motion.img 
                src="/logo.png" 
                alt="Jabel Logo" 
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, ...springConfig }}
              />
            </div>
            <motion.h1
              variants={textVariants}
              transition={{ delay: 0.4, ...springConfig }}
              className="font-['Playfair_Display'] text-3xl text-theme-text tracking-widest mb-2"
            >
              JABEL
            </motion.h1>
            <motion.p
              variants={textVariants}
              transition={{ delay: 0.5, ...springConfig }}
              className="text-xs uppercase tracking-[0.3em] text-theme-muted font-light"
            >
              Fine Wares & Collection
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
