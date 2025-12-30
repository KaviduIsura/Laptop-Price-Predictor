import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CompareModal = ({ isOpen, onClose }) => {
  const { compareList } = useCart();

  if (!isOpen || compareList.length === 0) return null;

  const features = [
    { label: 'Price', key: 'price.current' },
    { label: 'Brand', key: 'brand' },
    { label: 'Processor', key: 'specifications.processor' },
    { label: 'RAM', key: 'specifications.ram' },
    { label: 'Storage', key: 'specifications.storage' },
    { label: 'Display', key: 'specifications.displaySize' },
    { label: 'GPU', key: 'specifications.gpu' },
    { label: 'Weight', key: 'specifications.weight' },
    { label: 'Battery', key: 'specifications.batteryLife' },
    { label: 'Rating', key: 'rating.average' },
  ];

  const getValue = (laptop, path) => {
    const keys = path.split('.');
    let value = laptop;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Compare Laptops</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compare Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left">Features</th>
                    {compareList.map((laptop) => (
                      <th key={laptop._id} className="p-4 text-center">
                        <Link
                          to={`/product/${laptop._id}`}
                          className="block hover:text-blue-600"
                        >
                          <div className="font-medium">{laptop.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            ${laptop.price?.current}
                          </div>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature.key} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium bg-gray-50">
                        {feature.label}
                      </td>
                      {compareList.map((laptop) => {
                        const value = getValue(laptop, feature.key);
                        return (
                          <td key={`${laptop._id}-${feature.key}`} className="p-4 text-center">
                            {typeof value === 'number' ? (
                              <span className="font-medium">{value}</span>
                            ) : (
                              <span>{value || '-'}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {compareList.length} of 3 laptops selected
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <Link
                  to="/compare"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Detailed Comparison
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareModal;