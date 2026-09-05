import React, { useState } from 'react';
import { X, Minus, Plus, User, Mail, Phone, MapPin } from 'lucide-react';
import { CartItem, Order, OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import OptimizedImage from './OptimizedImage';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const cartVariants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  panel: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  },
  checkout: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  },
  item: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }
};

const cartTransition = {
  type: "spring",
  stiffness: 280,
  damping: 25
};

export default function Cart({ isOpen, onClose, cart, setCart }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [giftWrap, setGiftWrap] = useState({
    enabled: false,
    message: ''
  });

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setCart(cart.filter(item => item.id !== id));
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const giftWrapTotal = cart.reduce((total, item) => total + (item.giftWrap?.enabled ? (item.giftWrap.price || 0) : 0), 0);
  const cartTotal = cartSubtotal + giftWrapTotal;

  const createOrder = (): Order => {
    const now = new Date().toISOString();
    return {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: now,
      status: 'pending',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
        giftWrap: item.giftWrap
      })),
      total: cartTotal,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      shippingAddress: customerInfo.address,
      statusHistory: [{ status: 'pending', timestamp: now }],
      giftWrap: giftWrap.enabled ? { ...giftWrap, price: cart.reduce((t, i) => t + (i.giftWrap?.enabled ? i.giftWrap?.price || 0 : 0), 0) } : undefined
    };
  };

  const saveOrder = (order: Order) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('jabel_orders') || '[]');
      localStorage.setItem('jabel_orders', JSON.stringify([order, ...existingOrders]));
    } catch {}
  };

  const sendWhatsAppNotification = (order: Order, customMessage?: string) => {
    let message = customMessage || `*New Order Request - #${order.id}*\n\n`;
    message += `Customer: ${order.customerName || 'N/A'}\n`;
    if (order.customerPhone) message += `Phone: ${order.customerPhone}\n`;
    if (order.customerEmail) message += `Email: ${order.customerEmail}\n`;
    message += `\nItems:\n`;
    order.items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (GH₵${item.price.toLocaleString()})\n`;
      if (item.giftWrap?.enabled) message += `  + Gift wrap (GH₵${item.giftWrap.price})\n`;
    });
    if (order.giftWrap?.enabled) {
      message += `\nGift Wrapping: GH₵${order.giftWrap.price}`;
      if (order.giftWrap.message) message += `\nMessage: ${order.giftWrap.message}`;
    }
    message += `\n\n*Total:* GH₵${order.total.toLocaleString()}\n`;
    if (order.shippingAddress) message += `\nShipping to: ${order.shippingAddress}\n`;
    message += `\nStatus: ${order.status.toUpperCase()}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/233241129815?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendEmailNotification = (order: Order) => {
    const subject = encodeURIComponent(`Order Confirmation - #${order.id}`);
    const body = encodeURIComponent(
      `Order #${order.id}\n` +
      `Status: ${order.status.toUpperCase()}\n` +
      `Date: ${new Date(order.date).toLocaleString()}\n` +
      `Customer: ${order.customerName || 'N/A'}\n` +
      `Phone: ${order.customerPhone || 'N/A'}\n` +
      `Email: ${order.customerEmail || 'N/A'}\n` +
      `Address: ${order.shippingAddress || 'N/A'}\n\n` +
      `Items:\n` +
      order.items.map(i => `- ${i.quantity}x ${i.name} (GH₵${i.price.toLocaleString()})${i.giftWrap?.enabled ? ` + Gift wrap (GH₵${i.giftWrap.price})` : ''}`).join('\n') +
      `\n\nTotal: GH₵${order.total.toLocaleString()}`
    );
    window.open(`mailto:${order.customerEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please fill in your name and phone number');
      return;
    }
    
    const order = createOrder();
    saveOrder(order);
    sendWhatsAppNotification(order, `*New Order Request - #${order.id}*\n\n`);
    sendEmailNotification(order);
    
    setCart([]);
    setShowCheckout(false);
    setCustomerInfo({ name: '', phone: '', email: '', address: '' });
    setGiftWrap({ enabled: false, message: '' });
    onClose();
    alert('Order placed successfully! We\'ll contact you via WhatsApp shortly.');
  };

  const cartVariants = {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    panel: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 }
    },
    checkout: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 }
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    }
  };

  const cartTransition = {
    type: "spring",
    stiffness: 280,
    damping: 25
  };

  if (showCheckout) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              variants={{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}
              transition={cartTransition}
              onClick={() => setShowCheckout(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              variants={{ initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '100%', opacity: 0 } }}
              transition={cartTransition}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-theme-surface shadow-2xl z-[70] flex flex-col border-l border-theme-border transition-colors duration-300"
            >
              <div className="flex justify-between items-center p-6 border-b border-theme-border">
                <h2 className="font-['Playfair_Display'] text-2xl text-theme-text">Checkout</h2>
                <button onClick={() => setShowCheckout(false)} className="p-2 text-theme-muted hover:text-theme-text transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6">
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium text-theme-text flex items-center gap-2"><User className="w-4 h-4" /> Customer Information</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-theme-border px-3 py-2.5 bg-theme-bg text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number * (for WhatsApp)"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-theme-border px-3 py-2.5 bg-theme-bg text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-theme-border px-3 py-2.5 bg-theme-bg text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                    <textarea
                      placeholder="Shipping Address (optional)"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full border border-theme-border px-3 py-2.5 bg-theme-bg text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-theme-border pt-4 space-y-3">
                  <h3 className="font-medium text-theme-text">Order Summary</h3>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-theme-muted">{item.quantity}x {item.name}</span>
                      <span className="text-theme-text">GH₵{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {cart.reduce((t, i) => t + (i.giftWrap?.enabled ? i.giftWrap?.price || 0 : 0), 0) > 0 && (
                    <div className="flex justify-between text-sm text-purple-600">
                      <span>Gift Wrapping</span>
                      <span>GH₵{cart.reduce((t, i) => t + (i.giftWrap?.enabled ? i.giftWrap?.price || 0 : 0), 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-theme-text pt-2 border-t border-theme-border">
                    <span>Total</span>
                    <span>GH₵{cart.reduce((t, i) => t + i.price * i.quantity, 0) + cart.reduce((t, i) => t + (i.giftWrap?.enabled ? i.giftWrap?.price || 0 : 0), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-theme-border bg-theme-bg/50 space-y-3">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-theme-accent text-theme-accent-fg py-4 text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                >
                  Place Order via WhatsApp
                </button>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="w-full text-center text-theme-muted hover:text-theme-text text-sm font-medium transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const giftWrapTotal = cart.reduce((total, item) => total + (item.giftWrap?.enabled ? (item.giftWrap?.price || 0) : 0), 0);
  const cartTotal = cartSubtotal + giftWrapTotal;

  const cartVariants = {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    panel: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 }
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    }
  };

  const cartTransition = {
    type: "spring",
    stiffness: 280,
    damping: 25
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            variants={cartVariants.overlay}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={cartTransition}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            variants={cartVariants.panel}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={cartTransition}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-theme-surface shadow-2xl z-[70] flex flex-col border-l border-theme-border transition-colors duration-300"
          >
            <div className="flex justify-between items-center p-6 border-b border-theme-border">
              <h2 className="font-['Playfair_Display'] text-2xl text-theme-text">Your Bag</h2>
              <button onClick={onClose} className="p-2 text-theme-muted hover:text-theme-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-theme-border/30 rounded-full flex items-center justify-center border border-theme-border/50">
                    <span className="text-theme-muted">0</span>
                  </div>
                  <p className="text-theme-muted font-light">Your shopping bag is empty.</p>
                  <button onClick={onClose} className="text-sm font-medium text-theme-text border-b border-theme-text pb-1 hover:text-theme-muted hover:border-theme-muted transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } }}
                      transition={{ type: "spring", stiffness: 280, damping: 25, delay: index * 0.06 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-24 bg-theme-border/30 flex-shrink-0 border border-theme-border/50">
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={96}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-theme-text line-clamp-1">{item.name}</h3>
                            <button onClick={() => updateQuantity(item.id, 0)} className="text-theme-muted hover:text-theme-text transition-colors p-1">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-theme-muted mt-1">{item.category}</p>
                          {item.giftWrap?.enabled && (
                            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                              <span>🎁</span> Gift wrap: GH₵{item.giftWrap?.price?.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-theme-border">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-theme-muted hover:bg-theme-border/30 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-medium w-8 text-center text-theme-text">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-theme-muted hover:bg-theme-border/30 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-theme-text">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-theme-border bg-theme-bg/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-theme-muted font-light">Subtotal</span>
                  <span className="text-lg font-medium text-theme-text">GH₵{cartSubtotal.toLocaleString()}</span>
                </div>
                {giftWrapTotal > 0 && (
                  <div className="flex justify-between items-center text-purple-600">
                    <span className="text-sm">Gift Wrapping</span>
                    <span className="text-sm font-medium">GH₵{giftWrapTotal.toLocaleString()}</span>
                  </div>
                )}
                <p className="text-xs text-theme-muted text-center">Shipping & taxes calculated at checkout.</p>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-theme-accent text-theme-accent-fg py-4 text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => {
                    const order = {
                      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                      date: new Date().toISOString(),
                      status: 'pending' as const,
                      items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        category: item.category,
                        image: item.image
                      })),
                      total: cart.reduce((t, i) => t + i.price * i.quantity, 0) + cart.reduce((t, i) => t + (i.giftWrap?.enabled ? i.giftWrap?.price || 0 : 0), 0),
                      customerName: '',
                      customerPhone: '',
                      statusHistory: [{ status: 'pending' as const, timestamp: new Date().toISOString() }]
                    };
                    const existingOrders = JSON.parse(localStorage.getItem('jabel_orders') || '[]');
                    localStorage.setItem('jabel_orders', JSON.stringify([order, ...existingOrders]));
                    const message = `*Quick Order - #${order.id}*\n\n${cart.map(item => `- ${item.quantity}x ${item.name} (GH₵${item.price.toLocaleString()})`).join('\n')}\n\n*Total:* GH₵${order.total.toLocaleString()}`;
                    const encodedMessage = encodeURIComponent(message);
                    window.open(`https://wa.me/233241129815?text=${encodedMessage}`, '_blank');
                    setCart([]);
                    onClose();
                    alert('Quick order sent via WhatsApp!');
                  }}
                  className="w-full border border-theme-border text-theme-text py-3 text-sm font-medium uppercase tracking-wider hover:bg-theme-border/30 transition-colors"
                >
                  Quick WhatsApp Order (No Details)
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
const giftWrapTotal = cart.reduce((total, item) => total + (item.giftWrap?.enabled ? (item.giftWrap?.price || 0) : 0), 0);
const cartTotal = cartSubtotal + giftWrapTotal;