import { Product } from '../types';
import { Eye } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  return (
    <div className="group block relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-theme-border/30 mb-4 border border-theme-border/50">
        <a href={`#product/${product.id}`} className="block h-full w-full cursor-pointer">
          <OptimizedImage
            src={product.image}
            alt={product.name}
            width={400}
            height={500}
            className="h-full w-full"
            priority={false}
          />
        </a>
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-theme-surface px-3 py-1 text-xs font-medium uppercase tracking-wider text-theme-text shadow-sm pointer-events-none">
            New
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex gap-2 justify-center pb-6">
          <a 
            href={`#product/${product.id}`}
            className="flex-1 bg-theme-surface/95 backdrop-blur-sm py-3 text-xs font-medium uppercase tracking-wider text-theme-text text-center shadow-sm hover:bg-theme-accent hover:text-theme-accent-fg transition-colors duration-300"
          >
            Details
          </a>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="px-3 bg-theme-surface/95 backdrop-blur-sm py-3 text-xs font-medium uppercase tracking-wider text-theme-text shadow-sm hover:bg-theme-accent hover:text-theme-accent-fg transition-colors duration-300 flex items-center justify-center cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <a href={`#product/${product.id}`} className="text-sm font-medium text-theme-text hover:underline transition-colors block">
            {product.name}
          </a>
          <p className="mt-1 text-sm text-theme-muted transition-colors">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-theme-text transition-colors">GH₵{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}