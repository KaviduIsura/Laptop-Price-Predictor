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
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top Bar */}
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
  <img
    src="/logo.png"
    alt="Laptop Wizard Logo"
    className="object-contain w-12 h-12"
  />
  <span className="text-2xl font-bold text-blue-600">
    Laptop Wizard
  </span>
</Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 hidden max-w-2xl mx-8 md:flex">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search laptops by brand, model, RAM, SSD..."
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
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
              <div className="items-center hidden space-x-4 md:flex">
                <div className="relative user-dropdown-container">
                  <button 
                    className="flex items-center p-2 space-x-1 rounded-lg hover:bg-gray-100"
                    onClick={toggleUserDropdown}
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 z-10 w-48 mt-2 bg-white border rounded-lg shadow-lg">
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
                        className="flex items-center w-full px-4 py-2 text-left text-red-600 border-t hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden text-blue-600 md:block hover:text-blue-700">
                Login / Register
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2">
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-600 rounded-full -top-1 -right-1">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 md:hidden"
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
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search laptops..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="border-t bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="items-center hidden py-2 space-x-4 overflow-x-auto md:flex">
            {loading ? (
              <div className="flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 transition-all rounded-lg whitespace-nowrap hover:text-blue-600 hover:bg-white"
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
            <div className="flex items-center pl-4 ml-auto space-x-4 border-l">
              <Link to="/compare" className="text-sm text-gray-700 hover:text-blue-600">
                Compare
              </Link>
              <Link to="/predict" className="text-sm text-gray-700 hover:text-blue-600">
                Price Predictor
              </Link>
              <Link to="/deals" className="text-sm font-medium text-red-600 hover:text-red-700">
                🔥 Deals
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t max-h-[80vh] overflow-y-auto">
          <div className="container px-4 py-4 mx-auto">
            {/* User Section */}
            {!user ? (
              <div className="mb-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 mb-2 text-center text-white bg-blue-600 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-blue-600 border border-blue-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="p-3 mb-4 rounded-lg bg-gray-50">
                <div className="mb-2 font-medium">Welcome, {user.name}</div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center bg-white border rounded"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="py-2 text-center text-red-600 border border-red-200 rounded bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Categories Section */}
            <div className="mb-4">
              <h3 className="mb-3 font-medium text-gray-900">Categories</h3>
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
                      className="flex flex-col items-center justify-center p-3 transition-colors border rounded-lg bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="mb-1 text-lg">{category.icon}</div>
                      <div className="text-xs font-medium text-center">
                        {category.displayName || formatCategoryName(category.name)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{category.count}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t">
              <h3 className="mb-3 font-medium text-gray-900">Quick Links</h3>
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
                  className="flex items-center py-2 font-medium text-red-600 hover:text-red-700"
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