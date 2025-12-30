import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you like to your wishlist
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
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">{wishlist.length} items</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm border group">
              <div className="p-4">
                {/* Image */}
                <div className="relative mb-4">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Details */}
                <Link to={`/product/${item._id}`}>
                  <h3 className="font-medium hover:text-blue-600 line-clamp-2 h-12">
                    {item.name}
                  </h3>
                </Link>

                <div className="mt-2 text-sm text-gray-600">
                  {item.specifications?.ram}GB RAM • {item.specifications?.storage}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-lg font-bold">${item.price?.current}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;