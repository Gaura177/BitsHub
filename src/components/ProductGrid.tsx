import React from 'react';
import { ProductCard } from './ProductCard';
import { useApp } from '../contexts/AppContext';

export function ProductGrid() {
  const { state } = useApp();

  const filteredProducts = state.products.filter(product => {
    const matchesCategory = state.selectedCategory === 'all' || product.category === state.selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}