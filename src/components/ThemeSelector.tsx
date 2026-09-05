import { useState, useEffect } from 'react';
import { Sun, Moon, Rose, Sparkles } from 'lucide-react';

const themes = [
  { id: 'light', name: 'Light', icon: Sun, colors: { bg: '#FAFAFA', text: '#1c1917' } },
  { id: 'dark', name: 'Dark', icon: Moon, colors: { bg: '#121212', text: '#f5f5f5' } },
  { id: 'rose', name: 'Rose', icon: Rose, colors: { bg: '#fdf8f8', text: '#4a3636' } },
  { id: 'midnight', name: 'Midnight', icon: Sparkles, colors: { bg: '#0f172a', text: '#f8fafc' } }
] as const;

type ThemeId = typeof themes[number]['id'];

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('jabel_theme') as ThemeId) || 'light';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('jabel_theme', activeTheme);
  }, [activeTheme]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-theme-muted hover:text-theme-text transition-colors rounded-lg hover:bg-theme-border/30"
        aria-label="Select theme"
      >
        {themes.find(t => t.id === activeTheme)?.icon ?? Sun}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-theme-surface border border-theme-border rounded-lg shadow-lg py-2 z-50">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => { setActiveTheme(theme.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTheme === theme.id
                  ? 'bg-theme-accent/10 text-theme-accent'
                  : 'text-theme-text hover:bg-theme-border/30'
              }`}
            >
              <theme.icon className="w-4 h-4" />
              <span>{theme.name}</span>
              {activeTheme === theme.id && (
                <span className="ml-auto w-2 h-2 rounded-full bg-theme-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}