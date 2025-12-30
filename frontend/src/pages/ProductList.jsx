import React, { useState, useEffect } from 'react';
import { Grid, List, ChevronDown, Filter } from 'lucide-react';
import FilterPanel from '../components/filters/FilterPanel';
import ProductCardGrid from '../components/product/ProductCardGrid';
import ProductCardList from '../components/product/ProductCardList';
import CompareModal from '../components/product/CompareModal';
import { laptopAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const { compareList } = useCart();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadLaptops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [laptops, filters, sortBy]);

  const loadLaptops = async () => {
    try {
      // This should be replaced with actual API call
      const response = await laptopAPI.getAll();
      setLaptops(response.data?.laptops || []);
    } catch (error) {
      console.error('Error loading laptops:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...laptops];

    // Apply brand filter
    if (filters.brand?.length > 0) {
      filtered = filtered.filter(laptop => 
        filters.brand.includes(laptop.brand)
      );
    }

    // Apply price filter
    if (filters.price) {
      const [min, max] = filters.price;
      filtered = filtered.filter(laptop => 
        laptop.price?.current >= min && laptop.price?.current <= max
      );
    }

    // Apply RAM filter
    if (filters.ram?.length > 0) {
      filtered = filtered.filter(laptop => {
        const ramGB = parseInt(laptop.specifications?.ram);
        return filters.ram.some(filterRam => {
          const filterGB = parseInt(filterRam);
          return ramGB === filterGB || 
                 (filterRam.includes('+') && ramGB >= parseInt(filterRam));
        });
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price?.current - b.price?.current);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price?.current - a.price?.current);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredLaptops(filtered);
  };

  const handleFilterChange = (filterType, value, isChecked) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (isChecked) {
        if (!newFilters[filterType]) newFilters[filterType] = [];
        newFilters[filterType].push(value);
      } else {
        newFilters[filterType] = newFilters[filterType]?.filter(v => v !== value);
        if (newFilters[filterType]?.length === 0) delete newFilters[filterType];
      }
      return newFilters;
    });
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'newest', label: 'Newest' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compare Floating Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowCompareModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>Compare ({compareList.length})</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-bold">Laptops</h1>
                  <p className="text-gray-600">
                    {filteredLaptops.length} products found
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border rounded-lg"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  </div>

                  {/* View Toggle */}
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {Object.keys(filters).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(filters).map(([type, values]) =>
                    values.map(value => (
                      <div
                        key={`${type}-${value}`}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {value}
                        <button
                          onClick={() => handleFilterChange(type, value, false)}
                          className="ml-2 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => setFilters({})}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredLaptops.length > 0 ? (
              <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
                {filteredLaptops.map(laptop =>
                  viewMode === 'grid' ? (
                    <ProductCardGrid key={laptop._id} laptop={laptop} />
                  ) : (
                    <ProductCardList key={laptop._id} laptop={laptop} />
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🤷‍♂️</div>
                <h3 className="text-xl font-medium mb-2">No laptops found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={() => setFilters({})}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
      />
    </div>
  );
};

export default ProductList;