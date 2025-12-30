import React, { useState } from 'react';
import { Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search
    console.log('Searching for:', searchQuery);
  };

  const categories = [
    'All Categories',
    'Gaming Laptops',
    'Student Laptops',
    'Business Laptops',
    'Budget Laptops',
    'Accessories'
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            LaptopStore
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
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* User Actions */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                      Logout
                    </button>
                  </div>
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
            </div>
          </form>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-6 overflow-x-auto py-2">
            {categories.map((category) => (
              <a
                key={category}
                href="#"
                className="text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap py-2"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {!user ? (
              <div className="mb-4">
                <Link
                  to="/login"
                  className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg mb-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="mb-4 space-y-2">
                <div className="font-medium">{user.name}</div>
                <Link to="/profile" className="block py-2 border-t">Profile</Link>
                <Link to="/dashboard" className="block py-2">Dashboard</Link>
                <button onClick={logout} className="block w-full text-left py-2 text-red-600">
                  Logout
                </button>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <a key={category} href="#" className="block py-1">
                    {category}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;