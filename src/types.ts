export interface Product {
  id: string;
  name: string;
  category: 'Necklaces' | 'Watches' | 'Rings' | 'Earrings' | 'Accessories' | 'Perfumes' | 'Native African Materials';
  price: number;
  image: string;
  isNew?: boolean;
  description?: string;
  giftWrap?: {
    enabled: boolean;
    price: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  giftWrap?: {
    enabled: boolean;
    price: number;
    message?: string;
  };
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  notes?: string;
  statusHistory: { status: OrderStatus; timestamp: string }[];
  giftWrap?: {
    enabled: boolean;
    price: number;
    message?: string;
  };
}