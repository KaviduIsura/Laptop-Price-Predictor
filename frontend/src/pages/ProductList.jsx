import React, { useState, useEffect, useRef } from 'react';
import { Grid, List, ChevronDown, Filter, X } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import ProductCardGrid from '../components/product/ProductCardGrid';
import ProductCardList from '../components/product/ProductCardList';
import CompareModal from '../components/product/CompareModal';
import { laptopAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const { compareList } = useCart();
  const [filters, setFilters] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [pagePriceRange, setPagePriceRange] = useState({ min: 0, max: 5000 });
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const searchParam = queryParams.get('search');
  
  const contentRef = useRef(null);

  useEffect(() => {
    const initialFilters = {};
    
    if (categoryParam && categoryParam !== 'all') {
      initialFilters.category = [categoryParam];
    }
    
    setFilters(initialFilters);
    loadLaptops();
    
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location.search]);

  useEffect(() => {
    if (filters.price) {
      setPagePriceRange(filters.price);
    } else {
      setPagePriceRange({ min: 0, max: 5000 });
    }
    
    applyFilters();
  }, [laptops, filters, sortBy]);

  const loadLaptops = async () => {
    try {
      setLoading(true);
      
      const apiParams = {};
      
      if (categoryParam && categoryParam !== 'all') {
        apiParams.category = categoryParam;
      }
      
      if (searchParam) {
        const searchResponse = await laptopAPI.search(searchParam);
        setLaptops(searchResponse.data?.laptops || []);
      } else {
        const response = await laptopAPI.getAll(apiParams);
        setLaptops(response.data?.laptops || []);
      }
    } catch (error) {
      console.error('Error loading laptops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value, isChecked, fromURL = false) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'clear') {
        return {};
      }
      
      if (isChecked) {
        if (!newFilters[filterType]) newFilters[filterType] = [];
        
        if (filterType === 'category' && fromURL) {
          newFilters[filterType] = [value];
        } else {
          newFilters[filterType].push(value);
        }
      } else {
        newFilters[filterType] = newFilters[filterType]?.filter(v => v !== value);
        if (newFilters[filterType]?.length === 0) delete newFilters[filterType];
      }
      return newFilters;
    });
  };

  const handlePagePriceChange = (min, max) => {
    setPagePriceRange({ min, max });
    handleFilterChange('price', { min, max }, true);
  };

  const applyFilters = () => {
    let filtered = [...laptops];

    if (filters.category?.length > 0) {
      filtered = filtered.filter(laptop => {
        const laptopCategory = laptop.category?.toLowerCase().replace(/\s+/g, '-');
        return filters.category.some(filterCat => 
          filterCat === laptopCategory || 
          (filterCat === 'gaming' && laptopCategory === 'gaming-laptops') ||
          (filterCat === 'business' && laptopCategory === 'business-laptops') ||
          (filterCat === 'student' && laptopCategory === 'student-laptops') ||
          (filterCat === 'budget' && laptopCategory === 'budget-laptops') ||
          (filterCat === 'ultrabook' && laptopCategory === 'ultrabooks') ||
          (filterCat === 'workstation' && laptopCategory === 'workstations')
        );
      });
    }

    if (filters.brand?.length > 0) {
      filtered = filtered.filter(laptop => 
        filters.brand.includes(laptop.brand?.toLowerCase())
      );
    }

    if (filters.price) {
      filtered = filtered.filter(laptop => 
        laptop.price?.current >= filters.price.min && laptop.price?.current <= filters.price.max
      );
    }

    if (filters.ram?.length > 0) {
      filtered = filtered.filter(laptop => {
        const ramGB = parseInt(laptop.specifications?.ram);
        return filters.ram.some(filterRam => {
          const filterGB = parseInt(filterRam);
          return ramGB === filterGB;
        });
      });
    }

    if (filters.storage?.length > 0) {
      filtered = filtered.filter(laptop => {
        const storage = laptop.specifications?.storage?.toLowerCase() || '';
        return filters.storage.some(filterStorage => {
          if (filterStorage.includes('tb')) {
            const tbValue = parseInt(filterStorage);
            return storage.includes(`${tbValue}tb`) || storage.includes(`${tbValue * 1024}gb`);
          } else if (filterStorage.includes('gb')) {
            const gbValue = parseInt(filterStorage);
            return storage.includes(`${gbValue}gb`) || (gbValue === 1024 && storage.includes('1tb'));
          }
          return false;
        });
      });
    }

    if (filters.processor?.length > 0) {
      filtered = filtered.filter(laptop => {
        const processor = laptop.specifications?.processor?.toLowerCase() || '';
        return filters.processor.some(filterProcessor => {
          if (filterProcessor.includes('intel')) {
            return processor.includes('intel') && processor.includes(filterProcessor.split('-')[1]);
          } else if (filterProcessor.includes('amd')) {
            return processor.includes('amd') && processor.includes(filterProcessor.split('-')[1]);
          } else if (filterProcessor.includes('apple')) {
            return processor.includes('apple') || processor.includes('m1') || processor.includes('m2');
          }
          return false;
        });
      });
    }

    if (filters.features?.length > 0) {
      filtered = filtered.filter(laptop => {
        return filters.features.some(feature => {
          const featureMap = {
            'touchscreen': laptop.features?.touchscreen,
            'backlit': laptop.features?.backlitKeyboard,
            'fingerprint': laptop.features?.fingerprintScanner,
            'thunderbolt': laptop.features?.thunderbolt,
            'hdmi': laptop.features?.hdmi,
            'ethernet': laptop.features?.ethernet
          };
          return featureMap[feature];
        });
      });
    }

    if (filters.rating?.length > 0) {
      const minRating = Math.min(...filters.rating);
      filtered = filtered.filter(laptop => 
        (laptop.rating?.average || 0) >= minRating
      );
    }

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
      default:
        filtered.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
    }

    setFilteredLaptops(filtered);
  };

  const clearCategoryFilter = () => {
    const newFilters = { ...filters };
    delete newFilters.category;
    setFilters(newFilters);
    navigate('/laptops');
  };

  const clearAllFilters = () => {
    setFilters({});
    setPagePriceRange({ min: 0, max: 5000 });
    navigate('/laptops');
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'newest', label: 'Newest' },
  ];

  const getCategoryDisplayName = () => {
    if (!categoryParam || categoryParam === 'all') return null;
    
    const categoryMap = {
      'gaming': 'Gaming Laptops',
      'business': 'Business Laptops',
      'student': 'Student Laptops',
      'budget': 'Budget Laptops',
      'ultrabook': 'Ultrabooks',
      'workstation': 'Workstations',
      'all': 'All Categories'
    };
    
    return categoryMap[categoryParam] || 
      categoryParam.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  const formatFilterValue = (filterType, value) => {
    switch(filterType) {
      case 'brand':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'ram':
        return `${value} GB`;
      case 'storage':
        const storageMap = {
          '256': '256 GB SSD',
          '512': '512 GB SSD',
          '1tb': '1 TB SSD',
          '2tb': '2 TB SSD',
          '1tb-hdd': '1 TB HDD + SSD'
        };
        return storageMap[value] || value.toUpperCase();
      case 'processor':
        const processorMap = {
          'intel-i3': 'Intel Core i3',
          'intel-i5': 'Intel Core i5',
          'intel-i7': 'Intel Core i7',
          'intel-i9': 'Intel Core i9',
          'amd-ryzen5': 'AMD Ryzen 5',
          'amd-ryzen7': 'AMD Ryzen 7',
          'amd-ryzen9': 'AMD Ryzen 9',
          'apple-m1': 'Apple M1/M2'
        };
        return processorMap[value] || value.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      case 'features':
        const featureMap = {
          'touchscreen': 'Touchscreen',
          'backlit': 'Backlit Keyboard',
          'fingerprint': 'Fingerprint Scanner',
          'thunderbolt': 'Thunderbolt Ports',
          'hdmi': 'HDMI Port',
          'ethernet': 'Ethernet Port'
        };
        return featureMap[value] || value.charAt(0).toUpperCase() + value.slice(1);
      case 'rating':
        return `${value} Stars & Up`;
      default:
        return value;
    }
  };

  const pagePriceRanges = [
    { id: '0-500', name: 'Under $500', min: 0, max: 500 },
    { id: '500-1000', name: '$500 - $1000', min: 500, max: 1000 },
    { id: '1000-1500', name: '$1000 - $1500', min: 1000, max: 1500 },
    { id: '1500-2000', name: '$1500 - $2000', min: 1500, max: 2000 },
    { id: '2000-3000', name: '$2000 - $3000', min: 2000, max: 3000 },
    { id: '3000+', name: 'Over $3000', min: 3000, max: 10000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

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

      {/* Main Content - FIXED: Removed the lg:ml-80 wrapper that was causing empty space */}
      <div className="lg:ml-72"> {/* Changed from lg:ml-80 to lg:ml-72 to match sidebar width */}
        {/* Remove the extra div wrapper and add proper top padding */}
        <div ref={contentRef} className="min-h-screen overflow-y-auto pt-0"> {/* Added pt-0 to remove top padding */}
          <div className="container mx-auto px-4">
            {/* Header - START CONTENT FROM TOP */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm mt-0"> {/* Added mt-0 to remove top margin */}
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-3 md:mb-0">
                  <h1 className="text-2xl font-bold">
                    {searchParam 
                      ? `Search Results for "${searchParam}"`
                      : categoryParam && categoryParam !== 'all'
                      ? `${getCategoryDisplayName()}`
                      : 'All Laptops'
                    }
                  </h1>
                  <p className="text-gray-600">
                    {loading ? 'Loading...' : `${filteredLaptops.length} products found`}
                  </p>
                  
                  {categoryParam && categoryParam !== 'all' && (
                    <div className="mt-2 flex items-center">
                      <button
                        onClick={() => navigate('/laptops')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        All Laptops
                      </button>
                      <span className="mx-2 text-gray-400">›</span>
                      <span className="text-sm font-medium">{getCategoryDisplayName()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden flex items-center space-x-2 px-3 py-2 border rounded-lg"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  </div>

                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters with Separate Price Slider */}
              {(Object.keys(filters).length > 0 || categoryParam) && (
                <div className="mt-4">
                  {/* Price Range Slider for Page */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Price Range</span>
                      <span className="text-sm font-medium">
                        ${pagePriceRange.min} - ${pagePriceRange.max}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 mb-3">
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={pagePriceRange.min}
                        onChange={(e) => handlePagePriceChange(Number(e.target.value), pagePriceRange.max)}
                        className="w-24 px-2 py-1 border rounded text-sm"
                        placeholder="Min"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={pagePriceRange.max}
                        onChange={(e) => handlePagePriceChange(pagePriceRange.min, Number(e.target.value))}
                        className="w-24 px-2 py-1 border rounded text-sm"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={pagePriceRange.max}
                      onChange={(e) => handlePagePriceChange(pagePriceRange.min, Number(e.target.value))}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$0</span>
                      <span>$2500</span>
                      <span>$5000</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {pagePriceRanges.map(range => (
                        <button
                          key={range.id}
                          onClick={() => handlePagePriceChange(range.min, range.max)}
                          className={`px-3 py-1 text-xs rounded ${
                            pagePriceRange.min === range.min && pagePriceRange.max === range.max
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {range.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Badges */}
                  <div className="flex flex-wrap gap-2">
                    {categoryParam && categoryParam !== 'all' && (
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Category: {getCategoryDisplayName()}
                        <button
                          onClick={clearCategoryFilter}
                          className="ml-2 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {Object.entries(filters).map(([filterType, values]) => {
                      if (filterType === 'category' || filterType === 'price') return null;
                      
                      return values.map(value => (
                        <div
                          key={`${filterType}-${value}`}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {formatFilterValue(filterType, value)}
                          <button
                            onClick={() => handleFilterChange(filterType, value, false)}
                            className="ml-2 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ));
                    })}
                    
                    {filters.price && (
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Price: ${filters.price.min} - ${filters.price.max}
                        <button
                          onClick={() => handleFilterChange('price', null, false)}
                          className="ml-2 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {(Object.keys(filters).length > 0 || categoryParam) && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
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
                <h3 className="text-xl font-medium mb-2">
                  {searchParam 
                    ? `No laptops found for "${searchParam}"`
                    : categoryParam && categoryParam !== 'all'
                    ? `No ${getCategoryDisplayName()} laptops found`
                    : 'No laptops found'
                  }
                </h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {searchParam ? 'Clear Search' : 'Clear Filters'}
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