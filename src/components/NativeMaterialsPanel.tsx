import { Product } from '../types';
import { Sparkles, Check, Scissors, Layers, Info } from 'lucide-react';

interface NativeMaterialsPanelProps {
  onAddToCart: (product: Product) => void;
}

const nativeProducts: Product[] = [
  {
    id: 'native-1',
    name: 'Kente Silk Scarf',
    category: 'Native African Materials',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800',
    description: 'Handwoven Kente silk from the Ashanti region. Each pattern tells a story of heritage and pride. 100% silk, natural dyes.',
  },
  {
    id: 'native-2',
    name: 'Brass Adinkra Cuff',
    category: 'Native African Materials',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    description: 'Hand-cast brass cuff featuring traditional Adinkra symbols. Each symbol carries a proverb. Made by master metalsmiths in Kumasi.',
  },
  {
    id: 'native-3',
    name: 'Beaded Waist Chain',
    category: 'Native African Materials',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    description: 'Traditional Ghanaian waist beads in recycled glass beads. Adjustable closure. A celebration of femininity and cultural identity.',
  }
];

export default function NativeMaterialsPanel({ onAddToCart }: NativeMaterialsPanelProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-colors duration-300">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-['Playfair_Display'] text-theme-text mb-6">Heritage Collection</h2>
        <p className="text-theme-muted max-w-2xl mx-auto leading-relaxed">
          Celebrating the rich textile and metalworking traditions of Ghana. 
          Each piece is handcrafted by master artisans using techniques passed down through generations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {nativeProducts.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-theme-surface border border-theme-border overflow-hidden transition-colors hover:border-theme-muted/50"
          >
            <div className="aspect-[4/5] overflow-hidden bg-theme-border/30">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-theme-accent" />
                <span className="text-xs uppercase tracking-widest font-medium text-theme-muted">Native African Materials</span>
              </div>
              <h3 className="text-xl font-['Playfair_Display'] text-theme-text mb-2">{product.name}</h3>
              <p className="text-theme-muted text-sm mb-4 flex-grow leading-relaxed">{product.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-theme-border/50">
                <p className="text-lg font-medium text-theme-text">GH₵{product.price.toLocaleString()}</p>
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-4 py-2 bg-theme-accent text-theme-accent-fg text-xs font-medium uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <Scissors className="w-10 h-10 mx-auto mb-4 text-theme-accent" />
          <h4 className="font-medium text-theme-text mb-2">Handcrafted</h4>
          <p className="text-sm text-theme-muted">Every piece made by master artisans using traditional techniques</p>
        </div>
        <div className="p-6">
          <Layers className="w-10 h-10 mx-auto mb-4 text-theme-accent" />
          <h4 className="font-medium text-theme-text mb-2">Authentic Materials</h4>
          <p className="text-sm text-theme-muted">Locally sourced silk, brass, glass beads, and natural dyes</p>
        </div>
        <div className="p-6">
          <Info className="w-10 h-10 mx-auto mb-4 text-theme-accent" />
          <h4 className="font-medium text-theme-text mb-2">Cultural Stories</h4>
          <p className="text-sm text-theme-muted">Each pattern and symbol carries meaning from our heritage</p>
        </div>
      </div>
    </section>
  );
}