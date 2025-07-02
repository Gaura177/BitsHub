export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'laptops' | 'accessories' | 'headphones';
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  specs?: string[];
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  addresses: Address[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: Address;
  paymentMethod: string;
  estimatedDelivery?: string;
  canCancel: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export type AuthModalType = 'login' | 'signup' | 'cart' | 'profile' | null;