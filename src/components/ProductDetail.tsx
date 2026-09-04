import { Product } from '../types';
import { motion } from 'motion/react';
import OptimizedImage from './OptimizedImage';

interface ProductDetailProps {
  product: Product | undefined;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  if (!product) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-2xl font-['Playfair_Display'] text-theme-text mb-4 transition-colors">Product Not Found</h2>
        <a href="#" className="text-sm font-medium text-theme-muted hover:text-theme-text border-b border-theme-muted hover:border-theme-text transition-all pb-1">
          Return to Storefront
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 transition-colors duration-300">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="aspect-[4/5] w-full overflow-hidden bg-theme-border/30 mb-10 lg:mb-0 border border-theme-border/50"
        >
          <OptimizedImage
            src={product.image}
            alt={product.name}
            width={800}
            height={1000}
            className="h-full w-full"
            priority={true}
            quality={85}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-theme-muted mb-3 transition-colors">{product.category}</h2>
            <h1 className="text-4xl sm:text-5xl font-['Playfair_Display'] text-theme-text mb-6 leading-tight transition-colors">{product.name}</h1>
            <p className="text-2xl font-light text-theme-text transition-colors">GH₵{product.price.toLocaleString()}</p>
          </div>

          <div className="prose prose-stone text-theme-muted font-light mb-12 leading-relaxed transition-colors">
            <p>{product.description || "An exquisite piece crafted with precision and care, designed to elevate your everyday elegance. Each detail is thoughtfully refined for the modern sophisticate, blending timeless tradition with contemporary grace."}</p>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-theme-accent text-theme-accent-fg py-4 text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity mb-6 shadow-sm"
          >
            Add to Bag
          </button>
          
          <div className="border-t border-theme-border pt-8 mt-4 space-y-4 text-sm text-theme-muted font-light transition-colors">
            <div className="flex justify-between items-center">
              <span>Complimentary Shipping & Returns</span>
              <span className="text-theme-muted/50">&mdash;</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Secure Checkout</span>
              <span className="text-theme-muted/50">&mdash;</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
