import { useState, useEffect, useRef } from 'react';
import { Palette } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'rose' | 'midnight';

export default function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('jabel_theme') as Theme) || 'light';
  });
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jabel_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; name: string; color: string }[] = [
    { id: 'light', name: 'Classic Light', color: '#FAFAFA' },
    { id: 'dark', name: 'Onyx Dark', color: '#1c1917' },
    { id: 'rose', name: 'Rose Gold', color: '#f8e1e4' },
    { id: 'midnight', name: 'Midnight Blue', color: '#0f172a' }
  ];

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-theme-muted hover:text-theme-text p-2 transition-colors flex items-center justify-center"
        title="Select Theme"
      >
        <Palette className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-theme-surface border border-theme-border shadow-lg py-2 z-50 rounded-md">
          <div className="px-4 py-2 text-[10px] font-bold text-theme-muted uppercase tracking-widest">Select Theme</div>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-theme-border/30 transition-colors ${theme === t.id ? 'bg-theme-border/20 font-medium text-theme-text' : 'text-theme-muted'}`}
            >
              <span className="w-4 h-4 rounded-full border border-theme-border shadow-sm" style={{ backgroundColor: t.color }}></span>
              <span className="text-sm">{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
