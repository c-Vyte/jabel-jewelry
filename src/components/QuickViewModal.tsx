import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import OptimizedImage from './OptimizedImage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-theme-surface border border-theme-border shadow-2xl max-w-3xl w-full overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-theme-muted hover:text-theme-text bg-theme-surface/80 backdrop-blur-sm rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="aspect-square bg-theme-border/30 overflow-hidden">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full"
              priority={true}
              quality={85}
            />
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-theme-muted mb-2 block">{product.category}</span>
              <h2 className="text-2xl font-['Playfair_Display'] text-theme-text mb-3">{product.name}</h2>
              <p className="text-lg font-medium text-theme-text mb-4">GH₵{product.price.toLocaleString()}</p>
              <p className="text-sm text-theme-muted mb-6 leading-relaxed">
                {product.description || "Crafted with precision and exquisite materials, this piece embodies timeless elegance and exceptional craftsmanship."}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full py-3.5 bg-theme-accent text-theme-accent-fg text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              <a
                href={`#product/${product.id}`}
                onClick={onClose}
                className="w-full py-3 text-center block border border-theme-border text-xs font-medium uppercase tracking-widest text-theme-text hover:bg-theme-border/20 transition-colors"
              >
                View Full Details
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
