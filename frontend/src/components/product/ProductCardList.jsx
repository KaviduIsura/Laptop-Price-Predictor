import React from 'react';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCardList = ({ laptop }) => {
  const { addToCart, addToWishlist, toggleCompare, compareList } = useCart();
  const isInCompare = compareList.some(item => item._id === laptop._id);

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/4">
          <img
            src={laptop.images?.[0] || 'https://lapgadgets.in/wp-content/plugins/elementor/assets/images/placeholder.png'}
            alt={laptop.name}
            className="w-full h-48 md:h-40 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between">
            <div className="flex-1">
              <Link to={`/product/${laptop._id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {laptop.name}
                </h3>
              </Link>
              
              {/* Full Specs */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">RAM</div>
                  <div className="font-medium">{laptop.specifications?.ram}GB</div>
                </div>
                <div>
                  <div className="text-gray-500">Storage</div>
                  <div className="font-medium">{laptop.specifications?.storage}</div>
                </div>
                <div>
                  <div className="text-gray-500">Processor</div>
                  <div className="font-medium">{laptop.specifications?.processor}</div>
                </div>
                <div>
                  <div className="text-gray-500">Display</div>
                  <div className="font-medium">{laptop.specifications?.displaySize}"</div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-4 flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(laptop.rating?.average || 0) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {laptop.rating?.count || 0} reviews
                </span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  Rs.{(laptop.price?.current * 316) || 0}
                </div>
                {laptop.price?.original && laptop.price.original > laptop.price.current && (
                  <div className="text-sm text-gray-500 line-through">
                    Rs.{(laptop.price.original * 316) || 0}
                  </div>
                )}
                <div className="text-sm text-green-600 mt-1">
                  Free Delivery
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCompare(laptop)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg border ${
                    isInCompare
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {isInCompare && <Check className="w-4 h-4" />}
                  <span>Compare</span>
                </button>
                
                <button
                  onClick={() => addToWishlist(laptop)}
                  className="p-2 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={() => addToCart(laptop)}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;