import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { state, dispatch } = useApp();

  const handleAddToCart = () => {
    if (!state.user) {
      dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleBuyNow = () => {
    if (!state.user) {
      dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' });
      return;
    }
    
    // Add to cart first
    dispatch({ type: 'ADD_TO_CART', payload: product });
    
    // Check if user has addresses
    if (state.user.addresses.length === 0) {
      // Show cart modal which will prompt for address
      dispatch({ type: 'SET_AUTH_MODAL', payload: 'cart' });
    } else {
      // Go directly to checkout
      dispatch({ type: 'SET_AUTH_MODAL', payload: 'cart' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {product.discount && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
          -{product.discount}%
        </div>
      )}
      
      <div className="aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>
        
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="ml-2 text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        
        <div className="mb-4">
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
          
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}