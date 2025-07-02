import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function AddedToCartNotification() {
  const { state } = useApp();

  if (!state.showAddedToCart) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Added to Cart</span>
      </div>
    </div>
  );
}