import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  const updateQuantity = (id, newQuantity) => {
    // Implement quantity update logic
    console.log(`Update quantity for ${id} to ${newQuantity}`);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price?.current || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Add some laptops to your cart and they'll appear here
            </p>
            <Link
              to="/laptops"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Laptops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cart.map((item) => (
                <div key={item._id} className="flex flex-col md:flex-row p-6 border-b">
                  {/* Image */}
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 md:ml-6">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/product/${item._id}`}>
                          <h3 className="text-lg font-medium hover:text-blue-600">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.brand} • {item.specifications?.ram}GB RAM • {item.specifications?.storage}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 border-x">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          ${((item.price?.current || 0) * (item.quantity || 1)).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            ${item.price?.current} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/laptops"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter code"
                  />
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-r-lg hover:bg-gray-900">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4">
                Proceed to Checkout
              </button>

              {/* Security Badges */}
              <div className="text-center pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">Secure Payment</div>
                <div className="flex justify-center space-x-4">
                  <div className="text-2xl">🔒</div>
                  <div className="text-2xl">💳</div>
                  <div className="text-2xl">🛡️</div>
                </div>
              </div>
            </div>

            {/* You Might Also Like */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold mb-4">You Might Also Like</h4>
              <div className="space-y-4">
                {cart.slice(0, 2).map(item => (
                  <div key={`suggestion-${item._id}`} className="flex items-center">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                      <div className="text-sm text-gray-600">${item.price?.current}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;