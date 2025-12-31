import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { recommendationAPI, laptopAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, onFilterChange, currentFilters }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    ram: false,
    storage: false,
    processor: false,
    features: false,
    rating: false
  });

  const [sidebarPriceRange, setSidebarPriceRange] = useState({ min: 0, max: 5000 });

  const [personalizedRecs, setPersonalizedRecs] = useState([]);

  useEffect(() => {
    if (user) {
      loadPersonalizedRecommendations();
    }
  }, [user]);

  useEffect(() => {
    if (currentFilters?.price) {
      setSidebarPriceRange(currentFilters.price);
    }
  }, [currentFilters?.price]);

  useEffect(() => {
    if (categoryParam) {
      if (categoryParam === 'all') {
        onFilterChange('category', null, false, true);
      } else {
        onFilterChange('category', categoryParam, true, true);
      }
    }
  }, [categoryParam]);

  const loadPersonalizedRecommendations = async () => {
    try {
      const response = await recommendationAPI.getPersonalized();
      setPersonalizedRecs(response.data?.recommendations || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setSidebarPriceRange({ min, max });
    onFilterChange('price', { min, max });
  };

  const handleCheckboxChange = (filterType, id, checked) => {
    if (filterType === 'category') {
      if (id === 'all') {
        navigate('/laptops');
      } else if (checked) {
        navigate(`/laptops?category=${id}`);
      } else {
        navigate('/laptops');
      }
    }
    
    onFilterChange(filterType, id, checked);
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSidebarPriceRange(prev => ({ ...prev, max: value }));
    onFilterChange('price', { min: sidebarPriceRange.min, max: value });
  };

  const clearAllFilters = () => {
    setSidebarPriceRange({ min: 0, max: 5000 });
    navigate('/laptops');
    onFilterChange('clear', null, null);
  };

  const FilterSection = ({ title, children, section, badgeCount }) => (
    <div className="border-b border-gray-200 py-3">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-gray-700 text-sm"
        onClick={() => toggleSection(section)}
      >
        <span className="flex items-center">
          {title}
          {badgeCount && (
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
              {badgeCount}
            </span>
          )}
        </span>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-2 space-y-1.5">
          {children}
        </div>
      )}
    </div>
  );

  const FilterCheckbox = ({ id, name, count, filterType, checked = false }) => (
    <label className="flex items-center justify-between py-0.5 cursor-pointer hover:bg-gray-50 px-1 rounded text-sm">
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 text-blue-600 rounded focus:ring-blue-500"
          checked={checked}
          onChange={(e) => handleCheckboxChange(filterType, id, e.target.checked)}
        />
        <span className="ml-2 text-gray-700">{name}</span>
      </div>
      <span className="text-xs text-gray-500">{count}</span>
    </label>
  );

  // Categories data
  const categories = [
    { id: 'all', name: 'All Categories', count: 200 },
    { id: 'gaming', name: 'Gaming Laptops', count: 45 },
    { id: 'business', name: 'Business Laptops', count: 32 },
    { id: 'student', name: 'Student Laptops', count: 28 },
    { id: 'ultrabook', name: 'Ultrabooks', count: 38 },
    { id: 'workstation', name: 'Workstations', count: 22 },
    { id: 'budget', name: 'Budget Laptops', count: 67 }
  ];

  const brands = [
    { id: 'apple', name: 'Apple', count: 25 },
    { id: 'dell', name: 'Dell', count: 35 },
    { id: 'hp', name: 'HP', count: 28 },
    { id: 'lenovo', name: 'Lenovo', count: 32 },
    { id: 'asus', name: 'Asus', count: 24 },
    { id: 'acer', name: 'Acer', count: 20 },
    { id: 'msi', name: 'MSI', count: 18 },
    { id: 'razer', name: 'Razer', count: 12 }
  ];

  const ramOptions = [
    { id: '4', name: '4 GB', count: 15 },
    { id: '8', name: '8 GB', count: 75 },
    { id: '16', name: '16 GB', count: 68 },
    { id: '32', name: '32 GB', count: 32 },
    { id: '64', name: '64 GB', count: 10 }
  ];

  const storageOptions = [
    { id: '256', name: '256 GB SSD', count: 45 },
    { id: '512', name: '512 GB SSD', count: 85 },
    { id: '1tb', name: '1 TB SSD', count: 52 },
    { id: '2tb', name: '2 TB SSD', count: 18 },
    { id: '1tb-hdd', name: '1 TB HDD + SSD', count: 22 }
  ];

  const priceRanges = [
    { id: '0-500', name: 'Under $500', min: 0, max: 500 },
    { id: '500-1000', name: '$500 - $1000', min: 500, max: 1000 },
    { id: '1000-1500', name: '$1000 - $1500', min: 1000, max: 1500 },
    { id: '1500-2000', name: '$1500 - $2000', min: 1500, max: 2000 },
    { id: '2000-3000', name: '$2000 - $3000', min: 2000, max: 3000 },
    { id: '3000+', name: 'Over $3000', min: 3000, max: 10000 }
  ];

  const processorOptions = [
    { id: 'intel-i3', name: 'Intel Core i3', count: 25 },
    { id: 'intel-i5', name: 'Intel Core i5', count: 85 },
    { id: 'intel-i7', name: 'Intel Core i7', count: 65 },
    { id: 'intel-i9', name: 'Intel Core i9', count: 20 },
    { id: 'amd-ryzen5', name: 'AMD Ryzen 5', count: 45 },
    { id: 'amd-ryzen7', name: 'AMD Ryzen 7', count: 35 },
    { id: 'amd-ryzen9', name: 'AMD Ryzen 9', count: 15 },
    { id: 'apple-m1', name: 'Apple M1/M2', count: 25 }
  ];

  const ratings = [
    { id: '5', name: '5 Stars', value: 5, count: 45 },
    { id: '4', name: '4 Stars & Up', value: 4, count: 85 },
    { id: '3', name: '3 Stars & Up', value: 3, count: 120 },
    { id: '2', name: '2 Stars & Up', value: 2, count: 150 }
  ];

  const features = [
    { id: 'touchscreen', name: 'Touchscreen', count: 38 },
    { id: 'backlit', name: 'Backlit Keyboard', count: 75 },
    { id: 'fingerprint', name: 'Fingerprint Scanner', count: 42 },
    { id: 'thunderbolt', name: 'Thunderbolt Ports', count: 65 },
    { id: 'hdmi', name: 'HDMI Port', count: 180 },
    { id: 'ethernet', name: 'Ethernet Port', count: 95 }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - FIXED: Changed position to start from top of page */}
      <aside
        className={`fixed lg:fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out lg:transform-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mt-32 p-3 border-b">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-600 mr-2" />
              <h2 className="text-base font-semibold">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {/* {user && personalizedRecs.length > 0 && (
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                <h3 className="font-medium text-blue-800 mb-1 text-sm">Recommended for you</h3>
                <div className="space-y-1.5">
                  {personalizedRecs.slice(0, 2).map(rec => (
                    <Link
                      key={rec.laptop?._id}
                      to={`/product/${rec.laptop?._id}`}
                      className="flex items-center p-1.5 bg-white rounded border hover:shadow-sm text-sm"
                      onClick={onClose}
                    >
                      <img
                        src={rec.laptop?.images?.[0]}
                        alt={rec.laptop?.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="ml-2 flex-1">
                        <div className="font-medium line-clamp-1">
                          {rec.laptop?.name}
                        </div>
                        <div className="text-xs text-blue-600">
                          {(rec.matchScore * 100).toFixed(0)}% match
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )} */}

            <FilterSection title="Categories" section="category">
              {categories.map(category => {
                const isSelected = categoryParam === category.id || 
                  (category.id === 'all' && !categoryParam);
                return (
                  <FilterCheckbox
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    count={category.count}
                    filterType="category"
                    checked={isSelected}
                  />
                );
              })}
            </FilterSection>

            <FilterSection title="Price Range" section="price">
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <button
                    key={range.id}
                    className={`block w-full text-left text-xs py-0.5 px-1 rounded hover:bg-gray-50 ${
                      sidebarPriceRange.min === range.min && sidebarPriceRange.max === range.max ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => handlePriceRangeChange(range.min, range.max)}
                  >
                    {range.name}
                  </button>
                ))}
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>Custom Range</span>
                    <span className="font-medium">
                      ${sidebarPriceRange.min} - ${sidebarPriceRange.max}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={sidebarPriceRange.min}
                      onChange={(e) => handlePriceRangeChange(Number(e.target.value), sidebarPriceRange.max)}
                      className="w-16 px-1.5 py-0.5 border rounded text-xs"
                      placeholder="Min"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={sidebarPriceRange.max}
                      onChange={(e) => handlePriceRangeChange(sidebarPriceRange.min, Number(e.target.value))}
                      className="w-16 px-1.5 py-0.5 border rounded text-xs"
                      placeholder="Max"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={sidebarPriceRange.max}
                      onChange={handleSliderChange}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                      <span>$0</span>
                      <span>$2500</span>
                      <span>$5000</span>
                    </div>
                  </div>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Brands" section="brand" badgeCount={brands.length}>
              {brands.map(brand => (
                <FilterCheckbox
                  key={brand.id}
                  id={brand.id}
                  name={brand.name}
                  count={brand.count}
                  filterType="brand"
                  checked={currentFilters?.brand?.includes(brand.id)}
                />
              ))}
            </FilterSection>

            <FilterSection title="RAM" section="ram">
              {ramOptions.map(ram => (
                <FilterCheckbox
                  key={ram.id}
                  id={ram.id}
                  name={ram.name}
                  count={ram.count}
                  filterType="ram"
                  checked={currentFilters?.ram?.includes(ram.id)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Storage" section="storage">
              {storageOptions.map(storage => (
                <FilterCheckbox
                  key={storage.id}
                  id={storage.id}
                  name={storage.name}
                  count={storage.count}
                  filterType="storage"
                  checked={currentFilters?.storage?.includes(storage.id)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Processor" section="processor">
              {processorOptions.map(processor => (
                <FilterCheckbox
                  key={processor.id}
                  id={processor.id}
                  name={processor.name}
                  count={processor.count}
                  filterType="processor"
                  checked={currentFilters?.processor?.includes(processor.id)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Features" section="features">
              {features.map(feature => (
                <FilterCheckbox
                  key={feature.id}
                  id={feature.id}
                  name={feature.name}
                  count={feature.count}
                  filterType="features"
                  checked={currentFilters?.features?.includes(feature.id)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Customer Rating" section="rating">
              {ratings.map(rating => (
                <label key={rating.id} className="flex items-center justify-between py-0.5 cursor-pointer hover:bg-gray-50 px-1 rounded text-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 text-blue-600 rounded focus:ring-blue-500"
                      onChange={(e) => handleCheckboxChange('rating', rating.value, e.target.checked)}
                      checked={currentFilters?.rating?.includes(rating.value)}
                    />
                    <div className="ml-2 flex items-center">
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rating.value ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="ml-1 text-gray-700">& up</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{rating.count}</span>
                </label>
              ))}
            </FilterSection>
          </div>

          <div className="border-t p-3 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-1.5 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-1.5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Apply Filters
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {categoryParam && categoryParam !== 'all' ? (
                <span>Filtering: <span className="font-medium capitalize">{categoryParam.replace('-', ' ')}</span></span>
              ) : (
                'Showing results based on your selections'
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;