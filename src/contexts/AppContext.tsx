import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem, User, Order, AuthModalType, Address, Notification } from '../types';
import { products as initialProducts } from '../data/products';

interface AppState {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  notifications: Notification[];
  authModal: AuthModalType;
  searchQuery: string;
  selectedCategory: string;
  adminPanel: boolean;
  showAddedToCart: boolean;
  searchResults: Product[];
  users: User[]; // Store all registered users
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'SET_AUTH_MODAL'; payload: AuthModalType }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_ADMIN_PANEL'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status']; estimatedDelivery?: string } }
  | { type: 'CANCEL_ORDER'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_ADDRESS'; payload: { userId: string; address: Address } }
  | { type: 'UPDATE_ADDRESS'; payload: { userId: string; address: Address } }
  | { type: 'DELETE_ADDRESS'; payload: { userId: string; addressId: string } }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: { userId: string; addressId: string } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SHOW_ADDED_TO_CART' }
  | { type: 'HIDE_ADDED_TO_CART' }
  | { type: 'SET_SEARCH_RESULTS'; payload: Product[] };

const initialState: AppState = {
  products: initialProducts,
  cart: [],
  user: null,
  orders: [],
  notifications: [],
  authModal: null,
  searchQuery: '',
  selectedCategory: 'all',
  adminPanel: false,
  showAddedToCart: false,
  searchResults: [],
  users: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          showAddedToCart: true,
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload, quantity: 1 }],
        showAddedToCart: true,
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'REGISTER_USER':
      return { 
        ...state, 
        users: [...state.users, action.payload],
        user: action.payload 
      };
    case 'SET_AUTH_MODAL':
      return { ...state, authModal: action.payload };
    case 'SET_SEARCH_QUERY': {
      const query = action.payload.toLowerCase();
      const results = query ? state.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      ) : [];
      return { 
        ...state, 
        searchQuery: action.payload,
        searchResults: results
      };
    }
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_ADMIN_PANEL':
      return { ...state, adminPanel: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { 
                ...order, 
                status: action.payload.status,
                estimatedDelivery: action.payload.estimatedDelivery || order.estimatedDelivery,
                canCancel: action.payload.status === 'pending' || action.payload.status === 'confirmed'
              }
            : order
        ),
      };
    case 'CANCEL_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload
            ? { ...order, status: 'cancelled' as const, canCancel: false }
            : order
        ),
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        user: state.user?.id === action.payload.userId
          ? {
              ...state.user,
              addresses: [...state.user.addresses, action.payload.address]
            }
          : state.user,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, addresses: [...user.addresses, action.payload.address] }
            : user
        ),
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        user: state.user?.id === action.payload.userId
          ? {
              ...state.user,
              addresses: state.user.addresses.map(addr =>
                addr.id === action.payload.address.id ? action.payload.address : addr
              )
            }
          : state.user,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? {
                ...user,
                addresses: user.addresses.map(addr =>
                  addr.id === action.payload.address.id ? action.payload.address : addr
                )
              }
            : user
        ),
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        user: state.user?.id === action.payload.userId
          ? {
              ...state.user,
              addresses: state.user.addresses.filter(addr => addr.id !== action.payload.addressId)
            }
          : state.user,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? {
                ...user,
                addresses: user.addresses.filter(addr => addr.id !== action.payload.addressId)
              }
            : user
        ),
      };
    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        user: state.user?.id === action.payload.userId
          ? {
              ...state.user,
              addresses: state.user.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === action.payload.addressId
              }))
            }
          : state.user,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? {
                ...user,
                addresses: user.addresses.map(addr => ({
                  ...addr,
                  isDefault: addr.id === action.payload.addressId
                }))
              }
            : user
        ),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'SHOW_ADDED_TO_CART':
      return { ...state, showAddedToCart: true };
    case 'HIDE_ADDED_TO_CART':
      return { ...state, showAddedToCart: false };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('bitshub_users');
    const savedCurrentUser = localStorage.getItem('bitshub_current_user');
    const savedCart = localStorage.getItem('bitshub_cart');
    const savedOrders = localStorage.getItem('bitshub_orders');
    const savedNotifications = localStorage.getItem('bitshub_notifications');
    const savedProducts = localStorage.getItem('bitshub_products');

    // Load all registered users
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      users.forEach((user: User) => {
        if (!user.addresses || !Array.isArray(user.addresses)) {
          user.addresses = [];
        }
      });
      // Set users in state without dispatching individual actions
      state.users = users;
    }

    // Load current logged-in user
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      if (!user.addresses || !Array.isArray(user.addresses)) {
        user.addresses = [];
      }
      dispatch({ type: 'SET_USER', payload: user });
    }

    if (savedCart) {
      const cart = JSON.parse(savedCart);
      cart.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item.product });
        if (item.quantity > 1) {
          dispatch({
            type: 'UPDATE_CART_QUANTITY',
            payload: { productId: item.product.id, quantity: item.quantity },
          });
        }
      });
    }
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      orders.forEach((order: Order) => {
        dispatch({ type: 'ADD_ORDER', payload: order });
      });
    }
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      notifications.forEach((notification: Notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });
    }
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      // Only add products that don't already exist
      const existingIds = state.products.map(p => p.id);
      products.forEach((product: Product) => {
        if (!existingIds.includes(product.id)) {
          dispatch({ type: 'ADD_PRODUCT', payload: product });
        }
      });
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('bitshub_users', JSON.stringify(state.users));
  }, [state.users]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('bitshub_current_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('bitshub_current_user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('bitshub_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('bitshub_orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('bitshub_notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  useEffect(() => {
    localStorage.setItem('bitshub_products', JSON.stringify(state.products));
  }, [state.products]);

  // Auto-hide "Added to Cart" notification
  useEffect(() => {
    if (state.showAddedToCart) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_ADDED_TO_CART' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showAddedToCart]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}