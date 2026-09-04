import QRCode from 'react-qr-code';
import ThemeSelector from './ThemeSelector';

export default function Footer() {
  return (
    <footer className="bg-theme-surface border-t border-theme-border text-theme-muted py-16 mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-['Playfair_Display'] text-2xl text-theme-text tracking-widest mb-6">JABEL</h2>
            <p className="text-sm text-theme-muted font-light leading-relaxed mb-6">
              Curating fine jewelry and exceptional wares for those who appreciate the poetry of craftsmanship.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-theme-muted">Theme:</span>
              <ThemeSelector />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-theme-text uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">All Products</a></li>
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">Necklaces</a></li>
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">Watches</a></li>
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">Rings</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-theme-text uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3 mb-8">
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm hover:text-theme-text transition-colors">Care Guide</a></li>
            </ul>
            
            <h4 className="text-xs font-medium text-theme-muted uppercase tracking-wider mb-4">WhatsApp Contact</h4>
            <div className="flex gap-4">
              <div className="flex flex-col items-start">
                <div className="bg-white p-1.5 rounded-md mb-2 border border-theme-border/50">
                  <QRCode 
                    value="https://wa.me/233241129815" 
                    size={64} 
                    level="L"
                    fgColor="#1c1917" 
                  />
                </div>
                <p className="text-[10px] text-theme-muted uppercase tracking-wider">Primary</p>
                <a 
                  href="https://wa.me/233241129815" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-theme-text hover:opacity-70 transition-opacity"
                >
                  024 112 9815
                </a>
              </div>

              <div className="flex flex-col items-start">
                <div className="bg-white p-1.5 rounded-md mb-2 border border-theme-border/50">
                  <QRCode 
                    value="https://wa.me/233541852734" 
                    size={64} 
                    level="L"
                    fgColor="#1c1917" 
                  />
                </div>
                <p className="text-[10px] text-theme-muted uppercase tracking-wider">Desk</p>
                <a 
                  href="https://wa.me/233541852734" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-theme-text hover:opacity-70 transition-opacity"
                >
                  054 185 2734
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-theme-text uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-sm text-theme-muted mb-4">Join our newsletter for exclusive releases and private sales.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-theme-bg border border-theme-border px-4 py-2 text-sm text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent w-full transition-colors"
              />
              <button className="bg-theme-accent text-theme-accent-fg px-4 py-2 text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-theme-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-theme-muted">
          <p>&copy; {new Date().getFullYear()} Jabel Wares. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-theme-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-theme-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
