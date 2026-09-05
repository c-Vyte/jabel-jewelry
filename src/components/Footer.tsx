export default function Footer() {
  return (
    <footer className="bg-theme-surface border-t border-theme-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center justify-center md:justify-start mb-6">
              <img src="/logo.png" alt="Jabel Logo" className="h-16 w-16 object-contain rounded-full border border-theme-border/40 bg-theme-surface shadow-md" />
            </a>
            <p className="text-theme-muted text-sm leading-relaxed max-w-xs">
              Curated luxury jewelry and accessories for the modern sophisticate. 
              Each piece tells a story of craftsmanship, heritage, and timeless elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-theme-text mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <nav className="space-y-3">
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Shop All</a>
              <a href="#admin" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Admin Panel</a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Gift Guide</a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Our Story</a>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-medium text-theme-text mb-4 uppercase tracking-wider text-sm">Customer Service</h4>
            <nav className="space-y-3">
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Shipping & Returns</a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Size Guide</a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Care Instructions</a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors text-sm block">Contact Us</a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-theme-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-theme-muted text-sm">
              &copy; {new Date().getFullYear()} Jabel. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.163-6.162-6.163zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
              </a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.308.906-6.115-7.085-7.78 8.634-3.072-.906 8.57-9.316-7.533-8.157h3.345l6.343 7.206 6.95-8.067z"/></svg>
              </a>
              <a href="#" className="text-theme-muted hover:text-theme-text transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.046V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.058 24 12.073z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}