import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-b-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-4'
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-600`}></div>
  );
};

export default Loader;