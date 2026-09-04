export interface Product {
  id: string;
  name: string;
  category: 'Necklaces' | 'Watches' | 'Rings' | 'Accessories' | 'Perfumes' | 'Native African Materials' | 'Earrings';
  price: number;
  image: string;
  isNew?: boolean;
  description?: string;
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
}
