import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Product } from '../types';
import Hero from './Hero';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import NativeMaterialsPanel from './NativeMaterialsPanel';
import { motion } from 'motion/react';
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Eye, X, Minus, Plus, Filter, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface HomeProps {
  products: Product[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export default function Home({ products, searchQuery, onAddToCart }: HomeProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const debounceRef = useRef<NodeJS.Timeout>();
  const categories = ['Rings', 'Necklaces', 'Watches', 'Accessories', 'Perfumes', 'Native African Materials', 'Earrings'];

  // Debounce search query for better performance
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [products, debouncedSearch, selectedCategories, priceRange, sortBy]);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 50000 });
  }, []);

  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 50000;

  return (
    <>
      {!searchQuery && <Hero />}
      
      <div id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-['Playfair_Display'] text-theme-text mb-2 transition-colors">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Wares"}
            </h2>
            {!searchQuery && <p className="text-theme-muted text-sm transition-colors">Hand-selected pieces for the season.</p>}
          </div>
          
          {/* Filters, Sort & View Toggle Bar */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
            {/* Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 bg-theme-surface border border-theme-border px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                hasActiveFilters ? 'bg-theme-accent/10 border-theme-accent text-theme-accent' : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-theme-accent text-theme-accent-fg text-[10px] px-1.5 py-0.5 rounded-full">
                  {selectedCategories.length + (priceRange.min > 0 || priceRange.max < 50000 ? 1 : 0)}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 bg-theme-surface border border-theme-border px-3 py-2 text-xs">
              <span className="text-theme-muted uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-theme-text focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-theme-surface text-theme-text">Featured</option>
                <option value="price-low" className="bg-theme-surface text-theme-text">Price: Low to High</option>
                <option value="price-high" className="bg-theme-surface text-theme-text">Price: High to Low</option>
                <option value="name-asc" className="bg-theme-surface text-theme-text">Alphabetical: A to Z</option>
                <option value="name-desc" className="bg-theme-surface text-theme-text">Alphabetical: Z to A</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-theme-surface border border-theme-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-theme-accent text-theme-accent-fg' : 'text-theme-muted hover:text-theme-text'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-theme-accent text-theme-accent-fg' : 'text-theme-muted hover:text-theme-text'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden mb-8"
        >
          <div className="bg-theme-surface border border-theme-border p-6 space-y-6 transition-colors">
            {/* Category Multi-Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-theme-text mb-3">
                <Tag className="w-4 h-4" /> Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 accent-theme-accent border-theme-border rounded text-theme-accent focus:ring-theme-accent"
                    />
                    <span className="text-sm text-theme-text capitalize">{cat.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-theme-text mb-3">
                <SlidersHorizontal className="w-4 h-4" /> Price Range
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), priceRange.max) }))}
                    className="w-full accent-theme-accent cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-3 min-w-[160px]">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(Number(e.target.value) || 0, prev.max) }))}
                      min={0}
                      max={priceRange.max}
                      className="w-full bg-theme-bg border border-theme-border px-2 py-1.5 text-sm text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                    <p className="text-xs text-theme-muted mt-0.5">Min</p>
                  </div>
                  <span className="text-theme-muted">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(Number(e.target.value) || 50000, prev.min) }))}
                      min={priceRange.min}
                      max={50000}
                      className="w-full bg-theme-bg border border-theme-border px-2 py-1.5 text-sm text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                    <p className="text-xs text-theme-muted mt-0.5">Max</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-theme-muted mt-1">
                <span>GH₵0</span>
                <span>GH₵{priceRange.min.toLocaleString()} - GH₵{priceRange.max.toLocaleString()}</span>
                <span>GH₵50,000+</span>
              </div>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-theme-border">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 text-theme-muted hover:text-theme-text text-sm font-medium transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Tabs (shown when no search, as quick filter) */}
        {!searchQuery && !showFilters && (
          <div className="flex flex-wrap gap-2.5 mb-12 border-b border-theme-border pb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-all cursor-pointer ${
                  selectedCategories.includes(cat)
                    ? 'bg-theme-accent text-theme-accent-fg shadow-sm'
                    : 'bg-theme-surface text-theme-muted hover:text-theme-text border border-theme-border/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-theme-border transition-colors">
            <p className="text-theme-muted transition-colors">No products found matching your category or price criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
          >
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={(p) => setQuickViewProduct(p)} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-theme-surface border border-theme-border p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm transition-colors">
                <div className="w-full sm:w-48 aspect-[4/5] bg-theme-border/30 overflow-hidden relative flex-shrink-0 border border-theme-border/50">
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={250}
                    className="w-full h-full"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 left-2 bg-theme-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-theme-text">
                      New
                    </div>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between py-1 w-full">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-theme-muted mb-1 block">{product.category}</span>
                    <h3 className="text-xl font-['Playfair_Display'] text-theme-text mb-2">{product.name}</h3>
                    <p className="text-sm text-theme-muted font-light mb-4 line-clamp-2">
                      {product.description || "Crafted with precision and exquisite materials, this piece embodies timeless elegance and exceptional craftsmanship."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-theme-border/50">
                    <p className="text-lg font-medium text-theme-text">GH₵{product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-theme-surface border border-theme-border text-xs font-medium uppercase tracking-wider text-theme-text hover:bg-theme-border/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Quick View
                      </button>
                      <a
                        href={`#product/${product.id}`}
                        className="flex-1 sm:flex-none px-6 py-2 bg-theme-accent text-theme-accent-fg text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity text-center"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
        
        {!searchQuery && hasActiveFilters && (
          <div className="mt-12 text-center sm:hidden">
            <button 
              onClick={resetFilters}
              className="inline-block text-sm font-medium text-theme-text border-b border-theme-text pb-1 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {!searchQuery && <NativeMaterialsPanel onAddToCart={onAddToCart} />}
      
      {/* Category Banner */}
      {!searchQuery && (
        <div className="bg-theme-accent text-theme-accent-fg py-24 my-12 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-['Playfair_Display'] mb-6">The Art of Gifting</h2>
            <p className="text-theme-accent-fg/80 max-w-2xl mx-auto mb-10">
              Whether it's a timeless watch or a delicate necklace, find the perfect piece to celebrate life's most meaningful moments.
            </p>
            <button 
              onClick={() => {
                const el = document.getElementById('collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-theme-bg text-theme-text px-8 py-3 text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              Explore Gifts
            </button>
          </div>
        </div>
      )}

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={onAddToCart} 
      />
    </>
  );
}
