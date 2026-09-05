import { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThemeSelector from './ThemeSelector';

const searchVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 }
};

const searchTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminRoute: boolean;
  onNavigate: (hash: string) => void;
}

export default function Header({ cartCount, onOpenCart, searchQuery, setSearchQuery, isAdminRoute }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-theme-bg/90 backdrop-blur-md border-b border-theme-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button className="text-theme-muted hover:text-theme-text p-2 transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-6" aria-label="Main navigation">
              <a href="#" className="text-sm font-medium text-theme-muted hover:text-theme-text transition-colors">Shop</a>
              <a href="#collection" className="text-sm font-medium text-theme-muted hover:text-theme-text transition-colors">All Products</a>
              <button onClick={() => onNavigate('#category/Necklaces')} className="text-sm font-medium text-theme-muted hover:text-theme-text transition-colors">Necklaces</button>
              <button onClick={() => onNavigate('#category/Watches')} className="text-sm font-medium text-theme-muted hover:text-theme-text transition-colors">Watches</button>
              <button onClick={() => onNavigate('#category/Rings')} className="text-sm font-medium text-theme-muted hover:text-theme-text transition-colors">Rings</button>
            </nav>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <a href="#" className="flex items-center group">
                <img src="/logo.png" alt="Jabel Logo" className="h-20 w-20 object-contain rounded-full border border-theme-border/40 bg-theme-surface shadow-md transition-transform duration-300 group-hover:scale-105" />
              </a>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-[80px] justify-end">
              <ThemeSelector />
              {!isAdminRoute && (
                <>
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="text-theme-muted hover:text-theme-text p-2 hidden sm:block transition-colors"
                  >
                    {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                  </button>
                  <button 
                    onClick={onOpenCart}
                    className="text-theme-muted hover:text-theme-text p-2 relative transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-theme-accent text-theme-accent-fg text-[10px] font-medium border border-theme-bg">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              variants={searchVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={searchTransition}
              className="overflow-hidden bg-theme-surface border-b border-theme-border"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-theme-muted" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search rings, necklaces, perfumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-theme-border bg-theme-bg text-theme-text placeholder-theme-muted focus:outline-none focus:ring-1 focus:ring-theme-accent focus:border-theme-accent sm:text-sm transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-theme-text transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

const searchVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 }
};

const searchTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};
