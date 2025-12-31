import React, { useState, useEffect } from 'react';
import { Cpu, MemoryStick, Monitor, Cpu as GpuIcon, Smartphone, Target, AlertCircle, CheckCircle, History } from 'lucide-react';
import { predictionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/notifications';

const Predict = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ram: '16',
    weight: '2.5',
    company: 'dell',
    typename: 'gaming',
    opsys: 'windows',
    cpu: 'intelcorei7',
    gpu: 'nvidia',
    touchscreen: false,
    ips: true
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const companies = ['acer', 'apple', 'asus', 'dell', 'hp', 'lenovo', 'msi', 'other', 'toshiba'];
  const types = ['2in1convertible', 'gaming', 'netbook', 'notebook', 'ultrabook', 'workstation'];
  const os = ['linux', 'mac', 'other', 'windows'];
  const cpus = ['amd', 'intelcorei3', 'intelcorei5', 'intelcorei7', 'intelcorei9', 'other'];
  const gpus = ['amd', 'intel', 'nvidia'];

  useEffect(() => {
    if (user) {
      loadPredictionHistory();
    }
  }, [user]);

  const loadPredictionHistory = async () => {
    try {
      const response = await predictionAPI.getHistory();
      setHistory(response.data?.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
      // Don't show error for guests - they won't have history
      if (user) {
        showToast('Failed to load prediction history', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Call the prediction API
      const response = await predictionAPI.predictPrice(formData);
      
      if (response.data.success) {
        setPrediction(response.data);
        
        // Show success notification
        showToast('Price predicted successfully!', 'success');
        
        // Reload history if user is logged in
        if (user) {
          loadPredictionHistory();
        }
      } else {
        setError(response.data.error || 'Prediction failed');
        showToast(response.data.error || 'Prediction failed', 'error');
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Prediction failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // If user is not logged in, show a message
  const GuestMessage = () => (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
        <div>
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are not logged in. Your prediction history will not be saved. 
            <a href="/login" className="ml-1 text-blue-600 hover:underline">Login</a> to save your predictions.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Price Predictor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your laptop specifications to get an accurate price prediction powered by machine learning
          </p>
        </div>

        {/* Guest Message */}
        {!user && <GuestMessage />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prediction Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* RAM */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <MemoryStick className="w-4 h-4 mr-2 text-blue-600" />
                        RAM (GB)
                      </div>
                    </label>
                    <select
                      name="ram"
                      value={formData.ram}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {[4, 8, 16, 32, 64].map(ram => (
                        <option key={ram} value={ram}>{ram} GB</option>
                      ))}
                    </select>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 mr-2 text-blue-600" />
                        Weight (kg)
                      </div>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      min="0.5"
                      max="5"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2.5"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {companies.map(company => (
                        <option key={company} value={company}>
                          {formatLabel(company)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      name="typename"
                      value={formData.typename}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {types.map(type => (
                        <option key={type} value={type}>
                          {formatLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* OS */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operating System
                    </label>
                    <select
                      name="opsys"
                      value={formData.opsys}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {os.map(os => (
                        <option key={os} value={os}>
                          {formatLabel(os)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CPU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Cpu className="w-4 h-4 mr-2 text-blue-600" />
                        Processor
                      </div>
                    </label>
                    <select
                      name="cpu"
                      value={formData.cpu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {cpus.map(cpu => (
                        <option key={cpu} value={cpu}>
                          {formatLabel(cpu)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* GPU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <GpuIcon className="w-4 h-4 mr-2 text-blue-600" />
                        Graphics Card
                      </div>
                    </label>
                    <select
                      name="gpu"
                      value={formData.gpu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {gpus.map(gpu => (
                        <option key={gpu} value={gpu}>
                          {formatLabel(gpu)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex space-x-8">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="touchscreen"
                      checked={formData.touchscreen}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Touchscreen</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="ips"
                      checked={formData.ips}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">IPS Display</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Predicting...
                    </div>
                  ) : (
                    'Predict Price'
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-fade-in">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Prediction Result */}
              {prediction && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Price Prediction Result
                      </h3>
                    </div>
                    {prediction.historyId && (
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                        Saved to history
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">
                        € {prediction.price_euros?.toFixed(2) || '0'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Euro Price</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-green-600">
                        $ {(prediction.price_euros * 1.07)?.toFixed(2) || '0'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">USD Price</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-purple-600">
                        ₨ {(prediction.price_euros * 350)?.toFixed(2) || '0'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">LKR Price</div>
                    </div>
                  </div>

                  {prediction.similarLaptops && prediction.similarLaptops.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-3">Similar Laptops in Market</h4>
                      <div className="space-y-3">
                        {prediction.similarLaptops.slice(0, 3).map((laptop, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                            <div>
                              <div className="font-medium">{laptop.name}</div>
                              <div className="text-sm text-gray-600">{laptop.brand}</div>
                            </div>
                            <div className="font-bold">${laptop.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-green-200 flex justify-between">
                    <button
                      onClick={() => {
                        setFormData({
                          ram: '16',
                          weight: '2.5',
                          company: 'dell',
                          typename: 'gaming',
                          opsys: 'windows',
                          cpu: 'intelcorei7',
                          gpu: 'nvidia',
                          touchscreen: false,
                          ips: true
                        });
                        setPrediction(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Make Another Prediction
                    </button>
                    
                    {prediction.historyId && (
                      <button
                        onClick={() => setShowHistory(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <History className="w-4 h-4 mr-2" />
                        View History
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Prediction History & Tips */}
          <div>
            {/* Prediction History */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Prediction History</h3>
                {history.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showHistory ? 'Show Less' : 'Show All'}
                  </button>
                )}
              </div>
              
              {!user ? (
                <div className="text-center py-8 text-gray-500">
                  <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Login to view history</p>
                  <p className="text-sm mt-1">Your predictions will be saved here</p>
                  <a 
                    href="/login" 
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Login Now
                  </a>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No predictions yet</p>
                  <p className="text-sm mt-1">Make your first prediction!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(showHistory ? history : history.slice(0, 5)).map((item, index) => (
                    <div 
                      key={item._id || index} 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        // Fill form with previous prediction data
                        if (item.inputData) {
                          setFormData({
                            ram: item.inputData.ram?.toString() || '16',
                            weight: item.inputData.weight?.toString() || '2.5',
                            company: item.inputData.company || 'dell',
                            typename: item.inputData.typename || 'gaming',
                            opsys: item.inputData.opsys || 'windows',
                            cpu: item.inputData.cpu || 'intelcorei7',
                            gpu: item.inputData.gpu || 'nvidia',
                            touchscreen: item.inputData.touchscreen || false,
                            ips: item.inputData.ips || true
                          });
                          setPrediction(null);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium capitalize">{item.inputData?.company}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {item.inputData?.ram}GB RAM • {item.inputData?.cpu}
                      </div>
                      <div className="font-bold text-blue-600">
                        €{item.predictionResult?.price_euros?.toFixed(2) || '0'}
                      </div>
                    </div>
                  ))}
                  
                  {history.length > 5 && !showHistory && (
                    <button
                      onClick={() => setShowHistory(true)}
                      className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
                    >
                      View All ({history.length}) →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3">💡 Prediction Tips</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Higher RAM and faster processors increase price significantly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Gaming laptops are typically 20-30% more expensive</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Apple laptops have premium pricing compared to similar specs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Touchscreen and IPS displays add 10-15% to the price</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Weight below 2kg adds premium for portability</span>
                </li>
              </ul>
            </div>

            {/* Quick Presets */}
            <div className="mt-6 bg-white rounded-xl p-6 border shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">⚡ Quick Presets</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setFormData({
                      ram: '16',
                      weight: '1.8',
                      company: 'apple',
                      typename: 'ultrabook',
                      opsys: 'mac',
                      cpu: 'apple m1',
                      gpu: 'apple',
                      touchscreen: false,
                      ips: true
                    });
                    setPrediction(null);
                  }}
                  className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50 text-sm"
                >
                  MacBook Pro Preset
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      ram: '32',
                      weight: '2.5',
                      company: 'msi',
                      typename: 'gaming',
                      opsys: 'windows',
                      cpu: 'intelcorei9',
                      gpu: 'nvidia',
                      touchscreen: false,
                      ips: true
                    });
                    setPrediction(null);
                  }}
                  className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50 text-sm"
                >
                  Gaming Laptop Preset
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      ram: '8',
                      weight: '1.2',
                      company: 'dell',
                      typename: '2in1convertible',
                      opsys: 'windows',
                      cpu: 'intelcorei5',
                      gpu: 'intel',
                      touchscreen: true,
                      ips: true
                    });
                    setPrediction(null);
                  }}
                  className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50 text-sm"
                >
                  Student Laptop Preset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enter Specifications</h3>
              <p className="text-gray-600">
                Fill in your desired laptop configuration including RAM, processor, brand, and features
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our machine learning model analyzes thousands of laptop prices to find patterns
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Accurate Price</h3>
              <p className="text-gray-600">
                Receive a fair market price prediction with similar laptop recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;