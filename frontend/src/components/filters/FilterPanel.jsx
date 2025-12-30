import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PriceFilter from './PriceFilter';

const FilterPanel = ({ onFilterChange }) => {
  const [openSection, setOpenSection] = useState('price');

  const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer'];
  const ramOptions = ['4GB', '8GB', '16GB', '32GB', '64GB'];
  const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD'];
  const processors = ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7'];
  const screenSizes = ['13"', '14"', '15.6"', '16"', '17"'];
  const ratings = [4, 3, 2, 1];

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const FilterSection = ({ title, children, section }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium"
        onClick={() => toggleSection(section)}
      >
        <span>{title}</span>
        {openSection === section ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {openSection === section && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <PriceFilter onChange={onFilterChange} />
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand" section="brand">
        {brands.map((brand) => (
          <label key={brand} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              onChange={(e) => onFilterChange('brand', brand, e.target.checked)}
            />
            <span>{brand}</span>
          </label>
        ))}
      </FilterSection>

      {/* RAM */}
      <FilterSection title="RAM" section="ram">
        {ramOptions.map((ram) => (
          <label key={ram} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              onChange={(e) => onFilterChange('ram', ram, e.target.checked)}
            />
            <span>{ram}</span>
          </label>
        ))}
      </FilterSection>

      {/* Storage */}
      <FilterSection title="Storage" section="storage">
        {storageOptions.map((storage) => (
          <label key={storage} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              onChange={(e) => onFilterChange('storage', storage, e.target.checked)}
            />
            <span>{storage}</span>
          </label>
        ))}
      </FilterSection>

      {/* Processor */}
      <FilterSection title="Processor" section="processor">
        {processors.map((processor) => (
          <label key={processor} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              onChange={(e) => onFilterChange('processor', processor, e.target.checked)}
            />
            <span>{processor}</span>
          </label>
        ))}
      </FilterSection>

      {/* Screen Size */}
      <FilterSection title="Screen Size" section="screen">
        {screenSizes.map((size) => (
          <label key={size} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              onChange={(e) => onFilterChange('screen', size, e.target.checked)}
            />
            <span>{size}</span>
          </label>
        ))}
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" section="rating">
        {ratings.map((rating) => (
          <label key={rating} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              onChange={(e) => onFilterChange('rating', rating, e.target.checked)}
            />
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
              <span className="ml-1">& up</span>
            </div>
          </label>
        ))}
      </FilterSection>
    </div>
  );
};

export default FilterPanel;