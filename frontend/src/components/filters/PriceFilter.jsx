import React, { useState } from 'react';

const PriceFilter = ({ onChange }) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const handleChange = (values) => {
    setPriceRange(values);
    onChange('price', values);
  };

  const priceOptions = [
    { label: 'Under $500', value: [0, 500] },
    { label: '$500 - $1000', value: [500, 1000] },
    { label: '$1000 - $1500', value: [1000, 1500] },
    { label: '$1500 - $2000', value: [1500, 2000] },
    { label: 'Over $2000', value: [2000, 5000] },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {priceOptions.map((option) => (
          <button
            key={option.label}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => handleChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Custom Range</span>
          <span className="text-sm font-medium">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <div className="space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="w-24 px-2 py-1 border rounded"
            value={priceRange[0]}
            onChange={(e) => handleChange([Number(e.target.value), priceRange[1]])}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-24 px-2 py-1 border rounded"
            value={priceRange[1]}
            onChange={(e) => handleChange([priceRange[0], Number(e.target.value)])}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;