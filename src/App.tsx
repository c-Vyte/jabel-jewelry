/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import SplashScreen from './components/SplashScreen';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';
import { products as initialProducts } from './data';
import { Product, CartItem } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Smooth page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 }
};

const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8
};

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash || '#');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastProduct, setToastProduct] = useState<Product | null>(null);
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('jabel_splash_shown');
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('jabel_splash_shown', 'true');
  };
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jabel_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jabel_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jabel_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jabel_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const onHashChange = () => {
      setIsLoading(true);
      setRoute(window.location.hash || '#');
      window.scrollTo(0, 0);
      const timer = setTimeout(() => setIsLoading(false), 350);
      return () => clearTimeout(timer);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastProduct(product);
    setTimeout(() => {
      setToastProduct(prev => (prev?.id === product.id ? null : prev));
    }, 4000);
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const handleNavigate = (hash: string) => {
    window.location.hash = hash;
  };

  let content;
  if (route === '#admin') {
    content = <AdminPanel products={products} setProducts={setProducts} />;
  } else if (route.startsWith('#product/')) {
    const productId = route.split('/')[1];
    const product = products.find(p => p.id === productId);
    content = <ProductDetail product={product} onAddToCart={handleAddToCart} />;
  } else if (route.startsWith('#category/')) {
    const category = decodeURIComponent(route.split('/')[1] || '');
    content = <Home products={products} searchQuery={searchQuery} onAddToCart={handleAddToCart} initialCategory={category} />;
  } else {
    content = <Home products={products} searchQuery={searchQuery} onAddToCart={handleAddToCart} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-stone-200">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Header 
        cartCount={cartItemsCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminRoute={route === '#admin'}
        onNavigate={handleNavigate}
      />
      <main className="flex-grow relative">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-theme-bg/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 min-h-[50vh]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-theme-border border-t-theme-accent rounded-full"
            />
            <p className="text-xs font-medium uppercase tracking-widest text-theme-muted">Loading collection...</p>
          </motion.div>
        ) : null}
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={handleNavigate} />
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        setCart={setCart}
      />

      <Toast 
        product={toastProduct} 
        onClose={() => setToastProduct(null)} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      <BackToTop />
    </div>
  );
}

// Smooth page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 }
};

const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8
};
