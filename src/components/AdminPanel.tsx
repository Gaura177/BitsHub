import React, { useState } from 'react';
import { X, Package, ShoppingBag, Users, Plus, Edit, Trash2, LogOut, Calendar, Check, Upload, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Product, Order, Notification } from '../types';

export function AdminPanel() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!state.adminPanel) return null;

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_ADMIN_PANEL', payload: false });
  };

  const handleAcceptOrder = (orderId: string) => {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      // Set estimated delivery date (7 days from now)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: {
          orderId,
          status: 'confirmed',
          estimatedDelivery: estimatedDelivery.toISOString()
        }
      });

      // Send notification to user
      const notification: Notification = {
        id: Date.now().toString(),
        userId: order.userId,
        message: `Your order #${orderId} has been confirmed and will be delivered by ${estimatedDelivery.toLocaleDateString()}`,
        type: 'success',
        createdAt: new Date().toISOString(),
        read: false,
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  const handleShipOrder = (orderId: string) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: 'shipped' }
    });

    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      const notification: Notification = {
        id: Date.now().toString(),
        userId: order.userId,
        message: `Your order #${orderId} has been shipped and is on its way!`,
        type: 'info',
        createdAt: new Date().toISOString(),
        read: false,
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  const handleDeliverOrder = (orderId: string) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: 'delivered' }
    });

    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      const notification: Notification = {
        id: Date.now().toString(),
        userId: order.userId,
        message: `Your order #${orderId} has been delivered successfully!`,
        type: 'success',
        createdAt: new Date().toISOString(),
        read: false,
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  const handleUpdateDeliveryDate = (orderId: string, newDate: string) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: {
        orderId,
        status: state.orders.find(o => o.id === orderId)?.status || 'pending',
        estimatedDelivery: newDate
      }
    });

    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      const notification: Notification = {
        id: Date.now().toString(),
        userId: order.userId,
        message: `Delivery date updated for order #${orderId}. New estimated delivery: ${new Date(newDate).toLocaleDateString()}`,
        type: 'info',
        createdAt: new Date().toISOString(),
        read: false,
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
              A
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">{state.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_ADMIN_PANEL', payload: false })}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Products ({state.products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders ({state.orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Users ({state.users.length})</span>
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Products</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {state.products.map((product) => (
                <div key={product.id} className="bg-white border rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-600 mb-2">₹{product.price}</p>
                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex items-center space-x-1 px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            dispatch({ type: 'DELETE_PRODUCT', payload: product.id });
                          }
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Orders</h2>
            {state.orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {state.orders.map((order) => (
                  <div key={order.id} className="bg-white border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-500">User ID: {order.userId}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Order['status'];
                            dispatch({
                              type: 'UPDATE_ORDER_STATUS',
                              payload: { orderId: order.id, status: newStatus }
                            });
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors animate-pulse"
                          >
                            <Check className="h-3 w-3" />
                            <span>Accept</span>
                          </button>
                        )}
                        
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleShipOrder(order.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                          >
                            <Package className="h-3 w-3" />
                            <span>Ship</span>
                          </button>
                        )}
                        
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleDeliverOrder(order.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            <span>Deliver</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Delivery Date Management */}
                    {(order.status === 'confirmed' || order.status === 'shipped') && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <label className="text-sm font-medium text-blue-900">Estimated Delivery:</label>
                          <input
                            type="date"
                            value={order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleUpdateDeliveryDate(order.id, e.target.value)}
                            className="px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex items-center space-x-3 mb-2">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × ₹{item.product.price} = ₹{item.product.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Address:</h4>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{order.deliveryAddress.name}</p>
                          <p>{order.deliveryAddress.phone}</p>
                          <p>{order.deliveryAddress.addressLine1}</p>
                          {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                          <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="text-lg font-semibold">Total: ₹{order.total}</div>
                      <div className="text-sm text-gray-500">Payment: {order.paymentMethod}</div>
                    </div>

                    {/* Order Status Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Pending</span>
                        <span>Confirmed</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            order.status === 'pending' ? 'bg-yellow-500 w-1/4' :
                            order.status === 'confirmed' ? 'bg-blue-500 w-2/4' :
                            order.status === 'shipped' ? 'bg-purple-500 w-3/4' :
                            order.status === 'delivered' ? 'bg-green-500 w-full' :
                            'bg-red-500 w-1/4'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Users</h2>
            <div className="space-y-4">
              {state.users.map((user) => (
                <div key={user.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Addresses: {user.addresses.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Orders: {state.orders.filter(order => order.userId === user.id).length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddProduct || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            if (editingProduct) {
              dispatch({ type: 'UPDATE_PRODUCT', payload: product });
            } else {
              dispatch({ type: 'ADD_PRODUCT', payload: { ...product, id: Date.now().toString() } });
            }
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    image: product?.image || '',
    category: product?.category || 'laptops',
    rating: product?.rating || 4.0,
    reviews: product?.reviews || 0,
    inStock: product?.inStock ?? true,
    description: product?.description || '',
    specs: product?.specs || [],
    discount: product?.discount || 0,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: product?.id || '' } as Product);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{product ? 'Edit Product' : 'Add Product'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </label>
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="laptops">Laptops</option>
              <option value="accessories">Accessories</option>
              <option value="headphones">Headphones</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
              <input
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
              In Stock
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}