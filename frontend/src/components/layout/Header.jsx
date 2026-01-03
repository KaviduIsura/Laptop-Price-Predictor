import React, { useState, useEffect } from 'react';
import { 
  Search, User, Heart, ShoppingCart, Menu, X, 
  Laptop, GamepadIcon, Briefcase, GraduationCap, 
  DollarSign, Smartphone, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { laptopAPI } from '../../services/api';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await laptopAPI.getAll({ limit: 1 });
      
      // Get unique categories from laptops data
      const categoriesResponse = await laptopAPI.getAll({ limit: 100 });
      const laptops = categoriesResponse.data?.laptops || [];
      
      // Extract unique categories and count laptops in each
      const categoryMap = {};
      laptops.forEach(laptop => {
        if (laptop.category) {
          if (!categoryMap[laptop.category]) {
            categoryMap[laptop.category] = {
              name: laptop.category,
              count: 0,
              icon: getCategoryIcon(laptop.category)
            };
          }
          categoryMap[laptop.category].count++;
        }
      });
      
      // Convert to array and sort by count
      const categoryList = Object.values(categoryMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Show top 8 categories
      
      setCategories(categoryList);
      
      // Add "All Categories" at the beginning
      if (categoryList.length > 0) {
        const allCategories = {
          name: 'all',
          displayName: 'All Categories',
          count: laptops.length,
          icon: <Laptop className="w-4 h-4 mr-2" />
        };
        setCategories(prev => [allCategories, ...prev]);
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories(getDefaultCategories());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCategories = () => {
    return [
      { name: 'all', displayName: 'All Categories', count: 200, icon: <Laptop className="w-4 h-4 mr-2" /> },
      { name: 'gaming', displayName: 'Gaming Laptops', count: 45, icon: <GamepadIcon className="w-4 h-4 mr-2" /> },
      { name: 'business', displayName: 'Business Laptops', count: 32, icon: <Briefcase className="w-4 h-4 mr-2" /> },
      { name: 'student', displayName: 'Student Laptops', count: 28, icon: <GraduationCap className="w-4 h-4 mr-2" /> },
      { name: 'budget', displayName: 'Budget Laptops', count: 67, icon: <DollarSign className="w-4 h-4 mr-2" /> },
      { name: 'convertible', displayName: '2-in-1 Convertibles', count: 38, icon: <Smartphone className="w-4 h-4 mr-2" /> },
      { name: 'ultrabook', displayName: 'Ultrabooks', count: 42, icon: <Laptop className="w-4 h-4 mr-2" /> },
      { name: 'workstation', displayName: 'Workstations', count: 22, icon: <Briefcase className="w-4 h-4 mr-2" /> }
    ];
  };

  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'gaming':
        return <GamepadIcon className="w-4 h-4 mr-2" />;
      case 'business':
        return <Briefcase className="w-4 h-4 mr-2" />;
      case 'student':
        return <GraduationCap className="w-4 h-4 mr-2" />;
      case 'budget':
        return <DollarSign className="w-4 h-4 mr-2" />;
      case 'convertible':
        return <Smartphone className="w-4 h-4 mr-2" />;
      case 'ultrabook':
        return <Laptop className="w-4 h-4 mr-2" />;
      case 'workstation':
        return <Briefcase className="w-4 h-4 mr-2" />;
      case 'notebook':
        return <Laptop className="w-4 h-4 mr-2" />;
      case 'netbook':
        return <Laptop className="w-4 h-4 mr-2" />;
      default:
        return <Laptop className="w-4 h-4 mr-2" />;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/laptops?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category) => {
    if (category === 'all') {
      navigate('/laptops');
    } else {
      navigate(`/laptops?category=${category}`);
    }
    setMobileMenuOpen(false);
  };

  const formatCategoryName = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleDropdownLinkClick = () => {
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">LaptopStore</div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search laptops by brand, model, RAM, SSD..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* User Actions */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative user-dropdown-container">
                  <button 
                    className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100"
                    onClick={toggleUserDropdown}
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={handleDropdownLinkClick}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/predict" 
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={handleDropdownLinkClick}
                      >
                        <Laptop className="w-4 h-4 mr-2" />
                        Price Predictor
                      </Link>
                      {/* Recommendations Link */}
                      <Link 
                        to="/recommendations" 
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={handleDropdownLinkClick}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Recommendations
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={handleDropdownLinkClick}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </Link>
                      <button 
                        onClick={() => {
                          handleDropdownLinkClick();
                          logout();
                        }} 
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-t"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block text-blue-600 hover:text-blue-700">
                Login / Register
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2">
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search laptops..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-4 py-2 overflow-x-auto">
            {loading ? (
              <div className="flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex items-center whitespace-nowrap px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                >
                  {category.icon}
                  <span>{category.displayName || formatCategoryName(category.name)}</span>
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))
            )}
            
            {/* Extra Navigation Links */}
            <div className="flex items-center space-x-4 ml-auto pl-4 border-l">
              <Link to="/compare" className="text-sm text-gray-700 hover:text-blue-600">
                Compare
              </Link>
              <Link to="/predict" className="text-sm text-gray-700 hover:text-blue-600">
                Price Predictor
              </Link>
              <Link to="/deals" className="text-sm text-red-600 hover:text-red-700 font-medium">
                🔥 Deals
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            {/* User Section */}
            {!user ? (
              <div className="mb-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg mb-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 border border-blue-600 text-blue-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Welcome, {user.name}</div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 bg-white border rounded"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-center py-2 bg-red-50 text-red-600 border border-red-200 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Categories Section */}
            <div className="mb-4">
              <h3 className="font-medium mb-3 text-gray-900">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-xs font-medium text-center">
                        {category.displayName || formatCategoryName(category.name)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{category.count}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 text-gray-900">Quick Links</h3>
              <div className="space-y-2">
                <Link 
                  to="/compare" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                >
                  <span>🔄 Compare Laptops</span>
                </Link>
                <Link 
                  to="/predict" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                >
                  <span>🤖 Price Predictor</span>
                </Link>
                {/* Recommendations Link for Mobile */}
                <Link 
                  to="/recommendations" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                >
                  <span>✨ Recommendations</span>
                </Link>
                <Link 
                  to="/deals" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <span>🔥 Hot Deals</span>
                </Link>
                <Link 
                  to="/wishlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>
                <Link 
                  to="/cart" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span>Cart ({cart.length})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;