import React, { useState } from 'react';
import { X, Package, MapPin, Plus, Edit, Trash2, LogOut, Bell, Calendar, CreditCard } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Address, Order } from '../types';

export function UserProfile() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (state.authModal !== 'profile' || !state.user) return null;

  const userOrders = state.orders.filter(order => order.userId === state.user!.id);
  const userNotifications = state.notifications.filter(n => n.userId === state.user!.id);

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_AUTH_MODAL', payload: null });
  };

  const handleCancelOrder = (orderId: string) => {
    const order = userOrders.find(o => o.id === orderId);
    if (order && order.canCancel) {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= 24) {
        dispatch({ type: 'CANCEL_ORDER', payload: orderId });
      } else {
        alert('Order can only be cancelled within 24 hours of placement.');
      }
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 25;
      default: return 0;
    }
  };

  const getStatusBarColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: null })}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
              {state.user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{state.user.fullName}</h3>
              <p className="text-gray-600">{state.user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 px-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>My Orders ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'addresses'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Addresses ({state.user.addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications ({userNotifications.filter(n => !n.read).length})</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {userOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()} at{' '}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                          {order.estimatedDelivery && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">
                                Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {order.canCancel && order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

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
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.product.price}</p>
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
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <CreditCard className="h-4 w-4" />
                          <span>Payment: {order.paymentMethod}</span>
                        </div>
                      </div>

                      {/* Order Status Progress - Enhanced Green Line */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Pending</span>
                          <span>Confirmed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 relative">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${getStatusBarColor(order.status)}`}
                            style={{ width: `${getStatusProgress(order.status)}%` }}
                          />
                          {/* Status indicator dot */}
                          <div
                            className={`absolute top-0 w-3 h-3 rounded-full border-2 border-white ${getStatusBarColor(order.status)} transition-all duration-500`}
                            style={{ left: `calc(${getStatusProgress(order.status)}% - 6px)` }}
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <span className={`text-sm font-medium ${
                            order.status === 'delivered' ? 'text-green-600' :
                            order.status === 'shipped' ? 'text-purple-600' :
                            order.status === 'confirmed' ? 'text-blue-600' :
                            order.status === 'cancelled' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {order.status === 'pending' && 'Order Placed - Waiting for Confirmation'}
                            {order.status === 'confirmed' && 'Order Confirmed - Preparing for Shipment'}
                            {order.status === 'shipped' && 'Order Shipped - On the Way'}
                            {order.status === 'delivered' && 'Order Delivered Successfully'}
                            {order.status === 'cancelled' && 'Order Cancelled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {state.user.addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No addresses saved yet</p>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {state.user.addresses.map((address) => (
                    <div key={address.id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{address.name}</h4>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">Default</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingAddress(address)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this address?')) {
                                dispatch({
                                  type: 'DELETE_ADDRESS',
                                  payload: { userId: state.user!.id, addressId: address.id }
                                });
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-600">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                      <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                      {!address.isDefault && (
                        <button
                          onClick={() => dispatch({
                            type: 'SET_DEFAULT_ADDRESS',
                            payload: { userId: state.user!.id, addressId: address.id }
                          })}
                          className="mt-2 text-sm text-orange-600 hover:text-orange-800"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              {userNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                            {new Date(notification.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {(showAddAddress || editingAddress) && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setShowAddAddress(false);
            setEditingAddress(null);
          }}
          onSave={(address) => {
            if (editingAddress) {
              dispatch({
                type: 'UPDATE_ADDRESS',
                payload: { userId: state.user!.id, address }
              });
            } else {
              dispatch({
                type: 'ADD_ADDRESS',
                payload: { userId: state.user!.id, address: { ...address, id: Date.now().toString() } }
              });
            }
            setShowAddAddress(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}

interface AddressFormModalProps {
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}

function AddressFormModal({ address, onClose, onSave }: AddressFormModalProps) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: address?.name || '',
    phone: address?.phone || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: address?.id || '' } as Address);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{address ? 'Edit Address' : 'Add New Address'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input
              type="text"
              required
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              required
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
              Set as default address
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
              {address ? 'Update' : 'Add'} Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}