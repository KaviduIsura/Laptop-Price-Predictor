import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Truck, Shield, Heart, Share2, 
  ShoppingCart, Check, AlertCircle, ChevronRight,
  Cpu, MemoryStick, HardDrive, Monitor, Battery,
  Package, CreditCard, RotateCcw, Award
} from 'lucide-react';
import { laptopAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { showToast } from '../utils/notifications';
import { useAuth } from "../context/AuthContext";
import ProductCardGrid from '../components/product/ProductCardGrid';
import RecommendationWidget from '../components/recommendations/RecommendationWidget';

const ProductDetail = () => {
  const { id } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [similarLaptops, setSimilarLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specifications');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const EUR_TO_LKR = 316;
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // Load product details
      const response = await laptopAPI.getById(id);
      
      // Check response structure
      if (response.data && response.data.success) {
        setLaptop(response.data.laptop || response.data);
      } else {
        setLaptop(response.data);
      }
      
      // TRACK PRODUCT VIEW - ADD THIS
      if (user && id) {
        await trackProductView(id);
      }
      
      // Load similar laptops based on category
      if (response.data?.laptop?.category || response.data?.category) {
        const category = response.data.laptop?.category || response.data?.category;
        const similarResponse = await laptopAPI.getAll({
          category: category,
          limit: 4,
          exclude: id
        });
        
        if (similarResponse.data?.laptops) {
          const filtered = similarResponse.data.laptops
            .filter(item => item._id !== id)
            .slice(0, 4);
          setSimilarLaptops(filtered);
        }
      }
      
    } catch (error) {
      console.error('Error loading product:', error);
      showToast('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS FUNCTION TO TRACK VIEWS
  const trackProductView = async (laptopId) => {
    if (!user || !laptopId) {
      console.log('Not tracking - user not logged in or no laptopId');
      return;
    }
    
    try {
      console.log('Tracking view for laptop:', laptopId);
      
      // Call your API to track the view
      const response = await fetch('/api/users/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ laptopId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to track view:', data.error);
      } else {
        console.log('View tracked successfully:', data);
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  const handleAddToCart = () => {
    if (!laptop) return;
    
    addToCart({ ...laptop, quantity });
    showToast(`${laptop.name} added to cart!`, 'success');
  };

  const handleAddToWishlist = () => {
    if (!laptop) return;
    
    addToWishlist(laptop);
    showToast(`${laptop.name} added to wishlist!`, 'success');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatEuroToLKR = (priceInEuro) => {
  const priceInLKR = priceInEuro * EUR_TO_LKR;

  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(priceInLKR);
};

  const getSpecificationIcon = (key) => {
    switch(key.toLowerCase()) {
      case 'processor':
      case 'cpu':
        return <Cpu className="w-4 h-4 mr-2" />;
      case 'ram':
      case 'memory':
        return <MemoryStick className="w-4 h-4 mr-2" />;
      case 'storage':
      case 'ssd':
      case 'hdd':
        return <HardDrive className="w-4 h-4 mr-2" />;
      case 'display':
      case 'screen':
      case 'displaysize':
      case 'resolution':
        return <Monitor className="w-4 h-4 mr-2" />;
      case 'battery':
      case 'batterylife':
        return <Battery className="w-4 h-4 mr-2" />;
      case 'weight':
        return <Package className="w-4 h-4 mr-2" />;
      default:
        return <Cpu className="w-4 h-4 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The laptop you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/laptops"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Laptops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600 flex items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/laptops" className="hover:text-blue-600">Laptops</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={`/laptops?category=${laptop.category}`} className="hover:text-blue-600 capitalize">
            {laptop.category}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{laptop.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border">
              <img
                src={laptop.images?.[selectedImage] || laptop.images?.[0] || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop'}
                alt={laptop.name}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {(laptop.images && laptop.images.length > 0 
                ? laptop.images 
                : ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop']
              ).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg p-1 hover:border-blue-500 transition-all ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8 border">
              {/* Title & Brand */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1 uppercase tracking-wider">
                      {laptop.brand}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{laptop.name}</h1>
                    <div className="text-sm text-gray-600 mt-1">{laptop.model}</div>
                  </div>
                  {laptop.tags && laptop.tags.includes('new') && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(laptop.rating?.average || 0) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium mr-2">
                    {laptop.rating?.average?.toFixed(1) || '4.5'}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({laptop.rating?.count || 0} reviews)
                  </span>
                </div>
                <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {laptop.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

           {/* Price */}
<div className="mb-6 p-4 bg-blue-50 rounded-lg">
  <div className="mb-2">
    <span className="text-4xl font-bold text-gray-900 block">
      {formatEuroToLKR(laptop.price?.current || 0)}
    </span>
    {laptop.price?.original && laptop.price.original > laptop.price.current && (
      <div className="flex items-center space-x-4 mt-2">
        <span className="text-2xl text-gray-500 line-through">
          {formatEuroToLKR(laptop.price.original)}
        </span>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
          Save {formatEuroToLKR(laptop.price.original - laptop.price.current)}
        </span>
      </div>
    )}
  </div>
  {laptop.price?.original && laptop.price.original > laptop.price.current && (
    <div className="text-sm text-gray-600">
      <span className="font-medium">Save {Math.round((1 - laptop.price.current / laptop.price.original) * 100)}%</span> off original price
    </div>
  )}
</div>
              {/* Quick Specs */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Cpu className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Processor</div>
                      <div className="font-medium">{laptop.specifications?.processor || 'Not specified'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MemoryStick className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">RAM</div>
                      <div className="font-medium">{laptop.specifications?.ram || 'N/A'} GB</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <HardDrive className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Storage</div>
                      <div className="font-medium">{laptop.specifications?.storage || 'Not specified'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Monitor className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Display</div>
                      <div className="font-medium">{laptop.specifications?.displaySize || 'N/A'}"</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-medium"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x text-center min-w-[60px] font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-medium"
                      disabled={quantity >= (laptop.stock || 10)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {laptop.stock || 10} units available
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!laptop.stock || laptop.stock <= 0}
                    className="flex-1 flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    className="flex-1 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 font-semibold text-lg"
                  >
                    Buy Now
                  </button>
                  
                  <button
                    onClick={handleAddToWishlist}
                    className="p-4 border-2 border-gray-300 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors"
                    title="Add to wishlist"
                  >
                    <Heart className="w-6 h-6 text-gray-600" />
                  </button>
                  
                  <button
                    className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center border hover:shadow-sm transition-shadow">
                <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-medium text-sm">Free Delivery</div>
                <div className="text-xs text-gray-500">2-3 days</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border hover:shadow-sm transition-shadow">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-sm">2 Year Warranty</div>
                <div className="text-xs text-gray-500">Full coverage</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border hover:shadow-sm transition-shadow">
                <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-medium text-sm">30-Day Returns</div>
                <div className="text-xs text-gray-500">Easy returns</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border hover:shadow-sm transition-shadow">
                <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="font-medium text-sm">Secure Payment</div>
                <div className="text-xs text-gray-500">SSL encrypted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border">
          <div className="border-b">
            <nav className="flex flex-wrap px-6">
              {['specifications', 'features', 'description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 font-medium text-sm md:text-base ${
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

          <div className="p-8">
            {activeTab === 'specifications' && laptop.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(laptop.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                    <div className="text-gray-500 mr-3 mt-1">
                      {getSpecificationIcon(key)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-gray-900 font-semibold">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'features' && laptop.features && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(laptop.features).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    {value ? (
                      <>
                        <Check className="w-5 h-5 text-green-600 mr-3" />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 border border-gray-300 rounded mr-3"></div>
                        <span className="capitalize text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4">About this Laptop</h3>
                <p className="text-gray-700 text-lg mb-6">
                  The {laptop.name} is designed for {laptop.category} use, offering a perfect blend 
                  of performance and portability. With its {laptop.specifications?.processor} processor 
                  and {laptop.specifications?.ram}GB of RAM, this laptop handles demanding tasks with ease.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Key Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-1" />
                        <span>High-performance {laptop.specifications?.processor} processor</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-1" />
                        <span>{laptop.specifications?.ram}GB RAM for smooth multitasking</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-1" />
                        <span>Fast {laptop.specifications?.storage} storage</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Best For</h4>
                    <ul className="space-y-2">
                      {laptop.category === 'gaming' && (
                        <li>🎮 High-performance gaming</li>
                      )}
                      {laptop.category === 'business' && (
                        <li>💼 Professional work and presentations</li>
                      )}
                      {laptop.category === 'student' && (
                        <li>📚 Studies and research</li>
                      )}
                      {laptop.category === 'convertible' && (
                        <li>📱 Tablet and laptop modes</li>
                      )}
                      <li>🎬 Media consumption and entertainment</li>
                      <li>⚡ Everyday productivity tasks</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center mt-2">
                      <div className="text-3xl font-bold mr-3">{laptop.rating?.average?.toFixed(1) || '4.5'}</div>
                      <div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(laptop.rating?.average || 0) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Based on {laptop.rating?.count || 0} reviews
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Write a Review
                  </button>
                </div>
                
                {laptop.reviews && laptop.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {laptop.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-b pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{review.userId?.name || 'Anonymous'}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm">{review.rating}/5</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
      {user && <RecommendationWidget />}

        {/* Similar Products */}
        {similarLaptops.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Similar Laptops</h2>
              <Link 
                to={`/laptops?category=${laptop.category}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarLaptops.map((similarLaptop) => (
                <ProductCardGrid key={similarLaptop._id} laptop={similarLaptop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;