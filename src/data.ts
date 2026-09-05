import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Eternity Diamond Ring',
    category: 'Rings',
    price: 15500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f6612224b?auto=format&fit=crop&q=80&w=800',
    isNew: true,
    description: 'A timeless symbol of endless love, this eternity band features ethically sourced diamonds set in 18k white gold. Each stone is hand-selected for exceptional brilliance and fire.',
    giftWrap: { enabled: true, price: 50 }
  },
  {
    id: '2',
    name: 'Classic Chronograph Watch',
    category: 'Watches',
    price: 11200,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    description: 'Swiss-engineered precision meets timeless design. This chronograph features a sapphire crystal, 100m water resistance, and a genuine Italian leather strap that ages beautifully.',
    giftWrap: { enabled: true, price: 75 }
  },
  {
    id: '3',
    name: 'Gold Horizon Necklace',
    category: 'Necklaces',
    price: 5800,
    image: 'https://images.unsplash.com/photo-1599643478514-4a4204b4d451?auto=format&fit=crop&q=80&w=800',
    description: 'Inspired by the golden hour, this delicate chain features a hand-hammered 18k gold pendant that catches light with every movement. Adjustable 16-18 inch length.',
    giftWrap: { enabled: true, price: 50 }
  },
  {
    id: '4',
    name: 'Pearl Drop Earrings',
    category: 'Earrings',
    price: 3900,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    description: 'Lustrous freshwater pearls suspended from 14k gold hooks. Each pearl is uniquely shaped, making every pair one-of-a-kind. Lightweight for all-day comfort.',
    giftWrap: { enabled: true, price: 40 }
  },
  {
    id: '5',
    name: 'Minimalist Silver Band',
    category: 'Rings',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1620656798579-1984d9e97e1d?auto=format&fit=crop&q=80&w=800',
    description: 'Understated elegance in sterling silver. This 2mm comfort-fit band is perfect for stacking or wearing alone. Rhodium plated for lasting shine and tarnish resistance.',
    giftWrap: { enabled: true, price: 30 }
  },
  {
    id: '6',
    name: 'Sapphire Pendant',
    category: 'Necklaces',
    price: 8400,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    isNew: true,
    description: 'A deep blue Ceylon sapphire cradled in a halo of diamonds, set in platinum. The 1.2 carat center stone exhibits exceptional color saturation and clarity. Includes 18 inch platinum chain.',
    giftWrap: { enabled: true, price: 50 }
  },
  {
    id: '7',
    name: 'Vintage Leather Watch',
    category: 'Watches',
    price: 6700,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    description: 'Retro-inspired design with modern reliability. Japanese automatic movement, domed mineral crystal, and a hand-stitched Horween leather strap that develops a rich patina over time.',
    giftWrap: { enabled: true, price: 75 }
  },
  {
    id: '8',
    name: 'Rose Gold Bracelet',
    category: 'Accessories',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    description: 'Delicate cable chain in 14k rose gold with a subtle slider clasp for adjustable fit. The warm pink hue complements all skin tones. Perfect for layering or solo wear.',
    giftWrap: { enabled: true, price: 40 }
  },
  {
    id: '9',
    name: 'Diamond Stud Earrings',
    category: 'Earrings',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a53?auto=format&fit=crop&q=80&w=800',
    isNew: true,
    description: 'Brilliant cut diamonds totalling 1.0 carat, set in 18k white gold four-prong settings. G-H color, VS clarity. Push-back posts with comfort backs included. A lifetime essential.',
    giftWrap: { enabled: true, price: 50 }
  },
  {
    id: '10',
    name: 'Gold Hoop Earrings',
    category: 'Earrings',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1635767798638-3e2523422c44?auto=format&fit=crop&q=80&w=800',
    description: 'Classic 25mm hollow hoops in 14k yellow gold. Lightweight for all-day wear with secure latch closures. High-polish finish reflects light beautifully. A wardrobe staple.',
    giftWrap: { enabled: true, price: 40 }
  },
  {
    id: '11',
    name: 'Chandelier Earrings',
    category: 'Earrings',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1621592014428-4c8e9c7f2d3c?auto=format&fit=crop&q=80&w=800',
    description: 'Cascading tiers of pave-set diamonds in 18k white gold create dramatic movement. 2.5 inch drop length. Secure lever backs ensure confident wear for special occasions.',
    giftWrap: { enabled: true, price: 50 }
  },
  {
    id: '12',
    name: 'Emerald Drop Earrings',
    category: 'Earrings',
    price: 11200,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a53?auto=format&fit=crop&q=80&w=800',
    description: 'Vivid Colombian emeralds (1.5 carats total) framed by diamond halos in platinum. French wire backs for secure, comfortable wear. A striking pop of color for evening attire.',
    giftWrap: { enabled: true, price: 50 }
  }
];