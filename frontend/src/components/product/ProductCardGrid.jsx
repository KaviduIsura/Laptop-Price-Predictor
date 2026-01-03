import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCardGrid = ({ laptop }) => {
  const { addToCart, addToWishlist, toggleCompare } = useCart();

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={laptop.images?.[0] || 'https://lapgadgets.in/wp-content/plugins/elementor/assets/images/placeholder.png'}
          alt={laptop.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => addToWishlist(laptop)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <Link
            to={`/product/${laptop._id}`}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link to={`/product/${laptop._id}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 h-12">
            {laptop.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(laptop.rating?.average || 0) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({laptop.rating?.count || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              Rs.{(laptop.price?.current * 316) || 0}
            </span>
            {laptop.price?.original && laptop.price.original > laptop.price.current && (
              <span className="text-sm text-gray-500 line-through">
                Rs.{(laptop.price.original * 316) || 0}
              </span>
            )}
          </div>
          <div className="text-sm text-green-600 mt-1">
            Free Delivery
          </div>
        </div>

        {/* Quick Specs */}
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <div>{laptop.specifications?.ram}GB RAM</div>
          <div>{laptop.specifications?.storage}</div>
          <div>{laptop.specifications?.processor}</div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              onChange={() => toggleCompare(laptop)}
            />
            <span className="text-sm">Compare</span>
          </label>
          <button
            onClick={() => addToCart(laptop)}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardGrid;