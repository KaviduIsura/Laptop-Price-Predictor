import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Star, Truck, Shield, Heart, Share2, 
  ShoppingCart, Check, AlertCircle 
} from 'lucide-react';
import { laptopAPI, recommendationAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCardGrid from '../components/product/ProductCardGrid';

const ProductDetail = () => {
  const { id } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [similarLaptops, setSimilarLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      // Load product details
      const response = await laptopAPI.getById(id);
      setLaptop(response.data);
      
      // Load similar laptops
      const similar = await recommendationAPI.getSimilar(id);
      setSimilarLaptops(similar.data?.similarLaptops || []);
      
      // Track view
      await recommendationAPI.trackInteraction({
        laptopId: id,
        interactionType: 'view',
        rating: 4
      });
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 h-96 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-600">The laptop you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/laptops" className="hover:text-blue-600">Laptops</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{laptop.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <div className="bg-white rounded-lg p-4 mb-4">
              <img
                src={laptop.images?.[0] || 'https://via.placeholder.com/600x400'}
                alt={laptop.name}
                className="w-full h-auto rounded"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <button
                  key={i}
                  className="border rounded p-2 hover:border-blue-600"
                >
                  <img
                    src={laptop.images?.[0] || 'https://via.placeholder.com/100x100'}
                    alt={`View ${i + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="bg-white rounded-lg p-6">
              {/* Title & Brand */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">{laptop.brand}</div>
                <h1 className="text-2xl font-bold text-gray-900">{laptop.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(laptop.rating?.average || 0) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 mr-4">
                  {laptop.rating?.average || 0} ({laptop.rating?.count || 0} reviews)
                </span>
                <span className="text-green-600">In Stock</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${laptop.price?.current}
                  </span>
                  {laptop.price?.original && laptop.price.original > laptop.price.current && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${laptop.price.original}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                        Save ${laptop.price.original - laptop.price.current}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  No Cost EMI available
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm">Free Delivery</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm">1 Year Warranty</span>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="mb-6 border-t pt-6">
                <h3 className="font-medium mb-3">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Processor</div>
                    <div className="font-medium">{laptop.specifications?.processor}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">RAM</div>
                    <div className="font-medium">{laptop.specifications?.ram}GB</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Storage</div>
                    <div className="font-medium">{laptop.specifications?.storage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Display</div>
                    <div className="font-medium">{laptop.specifications?.displaySize}" {laptop.specifications?.resolution}</div>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Only {laptop.stock || 0} items left
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => addToCart({ ...laptop, quantity })}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button className="flex-1 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
                    Buy Now
                  </button>
                  
                  <button
                    onClick={() => addToWishlist(laptop)}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  
                  <button className="p-3 border rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-sm">Secure Payment</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <div className="text-2xl mb-1">🚚</div>
                <div className="text-sm">Free Shipping</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <div className="text-2xl mb-1">↩️</div>
                <div className="text-sm">30-Day Returns</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <div className="text-2xl mb-1">🛡️</div>
                <div className="text-sm">Warranty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews', 'qna'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 font-medium ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-b-lg p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700">
                  {laptop.name} is a high-performance laptop designed for {laptop.category} use.
                  With its powerful {laptop.specifications?.processor} processor and {laptop.specifications?.ram}GB of RAM,
                  it handles demanding tasks with ease.
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(laptop.specifications || {}).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="font-medium">{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarLaptops.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Laptops</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarLaptops.slice(0, 4).map((laptop) => (
                <ProductCardGrid key={laptop._id} laptop={laptop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;