import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Product } from '../types';
import OptimizedImage from './OptimizedImage';

const toastVariants = {
  initial: { opacity: 0, y: 60, scale: 0.9, rotateX: 15 },
  animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
  exit: { opacity: 0, y: 30, scale: 0.95, rotateX: -10 }
};

const toastTransition = {
  type: "spring",
  stiffness: 220,
  damping: 20,
  mass: 1.2
};

interface ToastProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export default function Toast({ product, onClose, onOpenCart }: ToastProps) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={toastTransition}
          className="fixed bottom-6 right-6 z-[80] bg-theme-surface border border-theme-border shadow-2xl p-4 rounded-lg max-w-sm w-full flex items-center gap-4 transition-colors"
        >
          <div className="w-12 h-12 bg-theme-border/30 flex-shrink-0 overflow-hidden border border-theme-border/50">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              width={48}
              height={48}
              className="w-full h-full"
            />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-0.5">
              <Check className="w-3.5 h-3.5" /> Added to Bag
            </div>
            <h4 className="text-sm font-medium text-theme-text truncate">{product.name}</h4>
            <p className="text-xs text-theme-muted">GH₵{product.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenCart();
                onClose();
              }}
              className="px-3 py-1.5 bg-theme-accent text-theme-accent-fg text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              View
            </button>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-text p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
