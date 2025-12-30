import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, AlertCircle } from 'lucide-react';

const Compare = () => {
  const { compareList, toggleCompare } = useCart();

  const features = [
    { label: 'Price', key: 'price.current', format: 'currency' },
    { label: 'Brand', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Processor', key: 'specifications.processor' },
    { label: 'RAM', key: 'specifications.ram', format: 'ram' },
    { label: 'Storage', key: 'specifications.storage' },
    { label: 'GPU', key: 'specifications.gpu' },
    { label: 'Display Size', key: 'specifications.displaySize', format: 'inches' },
    { label: 'Resolution', key: 'specifications.resolution' },
    { label: 'Weight', key: 'specifications.weight', format: 'weight' },
    { label: 'Battery Life', key: 'specifications.batteryLife', format: 'hours' },
    { label: 'Rating', key: 'rating.average', format: 'rating' },
    { label: 'Reviews', key: 'rating.count' },
    { label: 'Touchscreen', key: 'features.touchscreen', format: 'boolean' },
    { label: 'Backlit Keyboard', key: 'features.backlitKeyboard', format: 'boolean' },
  ];

  const getValue = (laptop, path) => {
    const keys = path.split('.');
    let value = laptop;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return '-';
    }
    return value;
  };

  const formatValue = (value, format) => {
    if (value === '-') return '-';
    
    switch (format) {
      case 'currency':
        return `$${value}`;
      case 'ram':
        return `${value}GB`;
      case 'inches':
        return `${value}"`;
      case 'weight':
        return `${value} kg`;
      case 'hours':
        return `${value} hours`;
      case 'rating':
        return `${value}/5`;
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Laptops to Compare</h2>
            <p className="text-gray-600 mb-6">
              Add laptops to compare by clicking the "Compare" checkbox on product cards
            </p>
            <Link
              to="/laptops"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Laptops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compare Laptops</h1>
          <p className="text-gray-600">
            Compare {compareList.length} laptop{compareList.length > 1 ? 's' : ''} side by side
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 border-b bg-gray-50">
            <div className="p-4 font-semibold">Features</div>
            {compareList.map((laptop, index) => (
              <div key={laptop._id} className="p-4 relative">
                <button
                  onClick={() => toggleCompare(laptop)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
                <Link to={`/product/${laptop._id}`} className="block">
                  <img
                    src={laptop.images?.[0]}
                    alt={laptop.name}
                    className="w-32 h-32 object-cover mx-auto mb-3"
                  />
                  <h3 className="font-medium text-center line-clamp-2">{laptop.name}</h3>
                  <div className="text-center text-blue-600 font-bold mt-2">
                    ${laptop.price?.current}
                  </div>
                </Link>
              </div>
            ))}
            {/* Empty columns for remaining slots */}
            {[...Array(3 - compareList.length)].map((_, i) => (
              <div key={`empty-${i}`} className="p-4 text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                  <div>
                    <div className="text-gray-400 mb-2">Add Laptop</div>
                    <Link
                      to="/laptops"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Browse →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          {features.map((feature) => (
            <div key={feature.key} className="grid grid-cols-5 border-b hover:bg-gray-50">
              <div className="p-4 font-medium bg-gray-50">{feature.label}</div>
              {compareList.map((laptop) => (
                <div key={`${laptop._id}-${feature.key}`} className="p-4">
                  <div className="text-center">
                    {formatValue(getValue(laptop, feature.key), feature.format)}
                  </div>
                </div>
              ))}
              {/* Empty cells */}
              {[...Array(3 - compareList.length)].map((_, i) => (
                <div key={`empty-cell-${i}`} className="p-4"></div>
              ))}
            </div>
          ))}

          {/* Actions Row */}
          <div className="grid grid-cols-5 p-4 bg-gray-50">
            <div className="font-medium">Actions</div>
            {compareList.map((laptop) => (
              <div key={laptop._id} className="text-center">
                <Link
                  to={`/product/${laptop._id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
            {[...Array(3 - compareList.length)].map((_, i) => (
              <div key={`empty-action-${i}`}></div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Best Price</div>
              <div className="text-2xl font-bold text-green-600">
                ${Math.min(...compareList.map(l => l.price?.current || 0))}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Highest Rated</div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.max(...compareList.map(l => l.rating?.average || 0)).toFixed(1)}/5
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Lightest</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.min(...compareList.map(l => l.specifications?.weight || 0))} kg
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/laptops"
            className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 mr-4"
          >
            Browse More Laptops
          </Link>
          <button
            onClick={() => compareList.forEach(laptop => toggleCompare(laptop))}
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compare;