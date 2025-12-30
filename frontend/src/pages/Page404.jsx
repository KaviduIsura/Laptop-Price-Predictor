import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

const Page404 = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/laptops"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Laptops
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-4">Quick Links:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/laptops" className="text-blue-600 hover:text-blue-700 text-sm">
              All Laptops
            </Link>
            <Link to="/predict" className="text-blue-600 hover:text-blue-700 text-sm">
              Price Predictor
            </Link>
            <Link to="/compare" className="text-blue-600 hover:text-blue-700 text-sm">
              Compare
            </Link>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;