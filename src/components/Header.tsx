import React from 'react';
import { Search, ShoppingCart, User, Monitor, Bell, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Header() {
  const { state, dispatch } = useApp();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'headphones', name: 'Headphones' },
  ];

  const handleCategoryChange = (categoryId: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId });
    
    // Scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    if (state.user) {
      if (state.user.isAdmin) {
        dispatch({ type: 'SET_ADMIN_PANEL', payload: true });
      } else {
        dispatch({ type: 'SET_AUTH_MODAL', payload: 'profile' });
      }
    } else {
      dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_AUTH_MODAL', payload: null });
  };

  const handleCartClick = () => {
    if (!state.user) {
      dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' });
      return;
    }
    dispatch({ type: 'SET_AUTH_MODAL', payload: 'cart' });
  };

  const handleSearchResultClick = (product: any) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    // Scroll to products section and highlight the product
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = state.notifications.filter(n => !n.read && n.userId === state.user?.id).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BitsHub</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for products..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {state.searchQuery && state.searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                {state.searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchResultClick(product)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {state.user && !state.user.isAdmin && (
              <button
                onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: 'profile' })}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            )}

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{state.user ? (state.user.isAdmin ? 'Admin' : state.user.fullName.split(' ')[0]) : 'Login'}</span>
              </button>
              
              {state.user && (
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="flex space-x-8 py-4 border-t border-gray-100">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`text-sm font-medium transition-colors ${
                state.selectedCategory === category.id
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-2'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}