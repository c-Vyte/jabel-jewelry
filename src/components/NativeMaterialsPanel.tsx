import React, { useState } from 'react';
import { Sparkles, Check, Scissors, Layers, Info } from 'lucide-react';
import { Product } from '../types';

interface NativeMaterialsPanelProps {
  onAddToCart: (product: Product) => void;
}

interface AfricanMaterial {
  id: string;
  name: string;
  origin: string;
  description: string;
  image: string;
  pricePerYard: number;
  characteristics: string[];
  bestFor: string;
}

const nativeMaterials: AfricanMaterial[] = [
  {
    id: 'mat-1',
    name: 'Royal Kente Weave',
    origin: 'Ghana (Ashanti Kingdom)',
    description: 'Hand-woven masterpiece of silk and cotton strips featuring vibrant geometric patterns laden with deep symbolic history and royalty.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    pricePerYard: 450,
    characteristics: ['Handwoven', 'Heavyweight Silk-Cotton', 'Rich Cultural Symbolism'],
    bestFor: 'Ceremonial Robes, Stoles, Gala Attire, Luxury Trims'
  },
  {
    id: 'mat-2',
    name: 'Vibrant Ankara Wax Print',
    origin: 'West Africa (Dutch Wax Heritage)',
    description: '100% cotton fabric with vibrant, color-saturated batik-inspired patterns on both sides. Breathable, durable, and exceptionally striking.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    pricePerYard: 180,
    characteristics: ['100% Combed Cotton', 'Double-sided Wax Resist', 'Fade Resistant'],
    bestFor: 'Statement Dresses, Blazers, Skirts, Matching Sets'
  },
  {
    id: 'mat-3',
    name: 'Handcrafted Aso Oke',
    origin: 'Nigeria (Yoruba Land)',
    description: 'Prestigious hand-loomed cloth woven by master craftsmen using metallic threads, cotton, and silk yarns for unmatched structural elegance.',
    image: 'https://images.unsplash.com/photo-1590736963159-c3d40fd7df73?auto=format&fit=crop&q=80&w=800',
    pricePerYard: 520,
    characteristics: ['Loom-crafted', 'Stiff & Luxurious Structure', 'Metallic Shimmer Accents'],
    bestFor: 'Traditional Weddings, Agbada, Capes, Headgear (Gele)'
  },
  {
    id: 'mat-4',
    name: 'Authentic Mudcloth (Bògòlanfini)',
    origin: 'Mali',
    description: 'Handmade cotton fabric dyed with fermented mud and botanical decoctions featuring ancient geometric ideograms telling stories of endurance and heritage.',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
    pricePerYard: 380,
    characteristics: ['Handmade Mud-Dyed', 'Raw Organic Cotton', 'Unique Artisan Imperfections'],
    bestFor: 'Bohemian Jackets, Home Decor, Tote Bags, Statement Outerwear'
  },
  {
    id: 'mat-5',
    name: 'Indigo Adire Eleko',
    origin: 'Nigeria (Ogun State)',
    description: 'Hand-painted or resist-dyed indigo cotton cloth created with cassava starch paste and deep natural indigo fermentation vats.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    pricePerYard: 280,
    characteristics: ['Natural Indigo Dye', 'Resist-Dyed Starch Method', 'Breathable Summer Weight'],
    bestFor: 'Kaftans, Wraps, Flowing Tunics, Resort Wear'
  },
  {
    id: 'mat-6',
    name: 'Lustrous Bazin Riche (Damask)',
    origin: 'West & Central Africa',
    description: 'High-grade cotton damask with a brilliant sheen and rich damask jacquard motifs, traditionally starched and beaten for a crisp royal rustle.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
    pricePerYard: 320,
    characteristics: ['High-Sheen Damask', 'Crisp Finish', 'Exceptional Durability'],
    bestFor: 'Bubu Gowns, Grand Boubous, Executive Suits'
  }
];

export default function NativeMaterialsPanel({ onAddToCart }: NativeMaterialsPanelProps) {
  const [activeMaterial, setActiveMaterial] = useState<AfricanMaterial>(nativeMaterials[0]);
  const [yards, setYards] = useState<number>(6); // Standard wrapper / outfit length
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddMaterialToCart = () => {
    const productItem: Product = {
      id: `mat-order-${activeMaterial.id}-${Date.now()}`,
      name: `${activeMaterial.name} (${yards} Yards)`,
      category: 'Native African Materials',
      price: activeMaterial.pricePerYard * yards,
      image: activeMaterial.image,
      isNew: true
    };
    onAddToCart(productItem);
    setAddedId(activeMaterial.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-theme-surface border border-theme-border p-6 sm:p-10 shadow-lg relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-theme-border/60 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" /> Heritage Collection
            </div>
            <h2 className="text-3xl sm:text-4xl font-['Playfair_Display'] text-theme-text font-bold">
              Native African Materials & Textiles
            </h2>
            <p className="text-theme-muted text-sm mt-2 max-w-2xl">
              Immerse yourself in centuries of African textile artistry. Sourced directly from master weavers across West and Central Africa, our authentic fabrics celebrate rich cultural heritage, vibrant motifs, and heirloom durability.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-theme-muted bg-theme-bg px-4 py-2 border border-theme-border">
            <Layers className="w-4 h-4 text-theme-accent" />
            <span>Sold by the Yard (Cut to order or full 6-yard wrappers)</span>
          </div>
        </div>

        {/* Material Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {nativeMaterials.map(mat => (
            <button
              key={mat.id}
              onClick={() => setActiveMaterial(mat)}
              className={`p-3 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                activeMaterial.id === mat.id
                  ? 'border-theme-accent bg-theme-accent/5 ring-1 ring-theme-accent shadow-sm'
                  : 'border-theme-border bg-theme-bg hover:border-theme-muted'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-theme-muted block">{mat.origin.split(' ')[0]}</span>
                <span className="text-xs sm:text-sm font-medium text-theme-text line-clamp-1 mt-0.5">{mat.name}</span>
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-2">GH₵{mat.pricePerYard}/yd</span>
            </button>
          ))}
        </div>

        {/* Active Material Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-theme-bg border border-theme-border p-6 sm:p-8">
          {/* Image */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/3] overflow-hidden border border-theme-border bg-theme-surface">
              <img 
                src={activeMaterial.image} 
                alt={activeMaterial.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-3 left-3 bg-theme-surface/90 backdrop-blur-md px-3 py-1.5 border border-theme-border text-xs text-theme-text font-medium">
              Origin: {activeMaterial.origin}
            </div>
          </div>

          {/* Details & Customizer */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {activeMaterial.characteristics.map((char, i) => (
                  <span key={i} className="text-[11px] bg-theme-surface border border-theme-border text-theme-muted px-2.5 py-0.5">
                    {char}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl font-['Playfair_Display'] text-theme-text font-bold mb-3">
                {activeMaterial.name}
              </h3>
              
              <p className="text-theme-text/80 text-sm leading-relaxed mb-4">
                {activeMaterial.description}
              </p>

              <div className="p-4 bg-theme-surface border border-theme-border mb-6">
                <div className="text-xs text-theme-muted uppercase tracking-wider mb-1 flex items-center gap-1 font-medium">
                  <Scissors className="w-3.5 h-3.5 text-theme-accent" /> Recommended Tailoring & Usage:
                </div>
                <p className="text-xs text-theme-text font-medium">{activeMaterial.bestFor}</p>
              </div>
            </div>

            {/* Quantity and Order Action */}
            <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-theme-muted uppercase tracking-wider mb-1">
                    Yards Required
                  </label>
                  <select
                    value={yards}
                    onChange={(e) => setYards(Number(e.target.value))}
                    className="bg-theme-surface border border-theme-border px-3 py-2 text-sm text-theme-text focus:outline-none cursor-pointer"
                  >
                    <option value={3}>3 Yards (Half Piece)</option>
                    <option value={6}>6 Yards (Standard Wrapper / Outfit)</option>
                    <option value={12}>12 Yards (Double Piece / Family Set)</option>
                    <option value={18}>18 Yards (Bulk / Ceremonial Tailoring)</option>
                  </select>
                </div>
                
                <div>
                  <span className="block text-xs font-medium text-theme-muted uppercase tracking-wider mb-1">
                    Total Price
                  </span>
                  <span className="text-xl font-bold text-theme-text">
                    GH₵{(activeMaterial.pricePerYard * yards).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddMaterialToCart}
                className={`px-6 py-3 font-medium text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  addedId === activeMaterial.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-theme-text text-theme-bg hover:opacity-90'
                }`}
              >
                {addedId === activeMaterial.id ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Add Material to Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tailoring Consultation Note */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 text-xs text-theme-muted">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-theme-text">Custom Tailoring Service Available:</strong> Would you like us to custom-tailor this fabric to your exact measurements? Add the material to your cart and request a bespoke fitting session at checkout or via our admin panel.
          </p>
        </div>
      </div>
    </section>
  );
}
