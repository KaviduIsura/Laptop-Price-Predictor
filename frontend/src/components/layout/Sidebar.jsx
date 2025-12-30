import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { recommendationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, onFilterChange, currentFilters }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Categories', count: 200 },
    { id: 'gaming', name: 'Gaming Laptops', count: 45 },
    { id: 'business', name: 'Business Laptops', count: 32 },
    { id: 'student', name: 'Student Laptops', count: 28 },
    { id: 'ultrabook', name: 'Ultrabooks', count: 38 },
    { id: 'workstation', name: 'Workstations', count: 22 },
    { id: 'budget', name: 'Budget Laptops', count: 67 }
  ]);

  const [brands, setBrands] = useState([
    { id: 'apple', name: 'Apple', count: 25 },
    { id: 'dell', name: 'Dell', count: 35 },
    { id: 'hp', name: 'HP', count: 28 },
    { id: 'lenovo', name: 'Lenovo', count: 32 },
    { id: 'asus', name: 'Asus', count: 24 },
    { id: 'acer', name: 'Acer', count: 20 },
    { id: 'msi', name: 'MSI', count: 18 },
    { id: 'razer', name: 'Razer', count: 12 }
  ]);

  const [ramOptions, setRamOptions] = useState([
    { id: '4', name: '4 GB', count: 15 },
    { id: '8', name: '8 GB', count: 75 },
    { id: '16', name: '16 GB', count: 68 },
    { id: '32', name: '32 GB', count: 32 },
    { id: '64', name: '64 GB', count: 10 }
  ]);

  const [storageOptions, setStorageOptions] = useState([
    { id: '256', name: '256 GB SSD', count: 45 },
    { id: '512', name: '512 GB SSD', count: 85 },
    { id: '1tb', name: '1 TB SSD', count: 52 },
    { id: '2tb', name: '2 TB SSD', count: 18 },
    { id: '1tb-hdd', name: '1 TB HDD + SSD', count: 22 }
  ]);

  const [priceRanges, setPriceRanges] = useState([
    { id: '0-500', name: 'Under $500', min: 0, max: 500 },
    { id: '500-1000', name: '$500 - $1000', min: 500, max: 1000 },
    { id: '1000-1500', name: '$1000 - $1500', min: 1000, max: 1500 },
    { id: '1500-2000', name: '$1500 - $2000', min: 1500, max: 2000 },
    { id: '2000-3000', name: '$2000 - $3000', min: 2000, max: 3000 },
    { id: '3000+', name: 'Over $3000', min: 3000, max: 10000 }
  ]);

  const [processorOptions, setProcessorOptions] = useState([
    { id: 'intel-i3', name: 'Intel Core i3', count: 25 },
    { id: 'intel-i5', name: 'Intel Core i5', count: 85 },
    { id: 'intel-i7', name: 'Intel Core i7', count: 65 },
    { id: 'intel-i9', name: 'Intel Core i9', count: 20 },
    { id: 'amd-ryzen5', name: 'AMD Ryzen 5', count: 45 },
    { id: 'amd-ryzen7', name: 'AMD Ryzen 7', count: 35 },
    { id: 'amd-ryzen9', name: 'AMD Ryzen 9', count: 15 },
    { id: 'apple-m1', name: 'Apple M1/M2', count: 25 }
  ]);

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

  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [ratings, setRatings] = useState([
    { id: '5', name: '5 Stars', value: 5, count: 45 },
    { id: '4', name: '4 Stars & Up', value: 4, count: 85 },
    { id: '3', name: '3 Stars & Up', value: 3, count: 120 },
    { id: '2', name: '2 Stars & Up', value: 2, count: 150 }
  ]);

  const [features, setFeatures] = useState([
    { id: 'touchscreen', name: 'Touchscreen', count: 38 },
    { id: 'backlit', name: 'Backlit Keyboard', count: 75 },
    { id: 'fingerprint', name: 'Fingerprint Scanner', count: 42 },
    { id: 'thunderbolt', name: 'Thunderbolt Ports', count: 65 },
    { id: 'hdmi', name: 'HDMI Port', count: 180 },
    { id: 'ethernet', name: 'Ethernet Port', count: 95 }
  ]);

  const [personalizedRecs, setPersonalizedRecs] = useState([]);

  useEffect(() => {
    if (user) {
      loadPersonalizedRecommendations();
    }
  }, [user]);

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
    setPriceRange({ min, max });
    onFilterChange('price', { min, max });
  };

  const handleCheckboxChange = (filterType, id, checked) => {
    onFilterChange(filterType, id, checked);
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => ({ ...prev, max: value }));
    onFilterChange('price', { min: priceRange.min, max: value });
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 5000 });
    onFilterChange('clear', null, null);
  };

  const FilterSection = ({ title, children, section, badgeCount }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-gray-700"
        onClick={() => toggleSection(section)}
      >
        <span className="flex items-center">
          {title}
          {badgeCount && (
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {badgeCount}
            </span>
          )}
        </span>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const FilterCheckbox = ({ id, name, count, filterType, checked = false }) => (
    <label className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          checked={checked}
          onChange={(e) => handleCheckboxChange(filterType, id, e.target.checked)}
        />
        <span className="ml-2 text-sm text-gray-700">{name}</span>
      </div>
      <span className="text-xs text-gray-500">{count}</span>
    </label>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Personalized Recommendations */}
            {user && personalizedRecs.length > 0 && (
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Recommended for you</h3>
                <div className="space-y-2">
                  {personalizedRecs.slice(0, 2).map(rec => (
                    <Link
                      key={rec.laptop?._id}
                      to={`/product/${rec.laptop?._id}`}
                      className="flex items-center p-2 bg-white rounded border hover:shadow-sm"
                    >
                      <img
                        src={rec.laptop?.images?.[0]}
                        alt={rec.laptop?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium line-clamp-1">
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
            )}

            {/* Categories */}
            <FilterSection title="Categories" section="category">
              {categories.map(category => (
                <FilterCheckbox
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  count={category.count}
                  filterType="category"
                  checked={currentFilters?.category?.includes(category.id)}
                />
              ))}
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" section="price">
              <div className="space-y-3">
                {priceRanges.map(range => (
                  <button
                    key={range.id}
                    className="block w-full text-left text-sm py-1 px-1 rounded hover:bg-gray-50"
                    onClick={() => handlePriceRangeChange(range.min, range.max)}
                  >
                    {range.name}
                  </button>
                ))}
                
                {/* Custom Range */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Custom Range</span>
                    <span className="font-medium">
                      ${priceRange.min} - ${priceRange.max}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange.max)}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange(priceRange.min, Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="mt-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange.max}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$0</span>
                      <span>$2500</span>
                      <span>$5000</span>
                    </div>
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Brands */}
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

            {/* RAM */}
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

            {/* Storage */}
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

            {/* Processor */}
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

            {/* Features */}
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

            {/* Rating */}
            <FilterSection title="Customer Rating" section="rating">
              {ratings.map(rating => (
                <label key={rating.id} className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      onChange={(e) => handleCheckboxChange('rating', rating.value, e.target.checked)}
                      checked={currentFilters?.rating?.includes(rating.value)}
                    />
                    <div className="ml-2 flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rating.value ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-700">& up</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{rating.count}</span>
                </label>
              ))}
            </FilterSection>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              Showing results based on your selections
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;