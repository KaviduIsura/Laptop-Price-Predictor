import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, BarChart3, Settings, History, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              <button
                onClick={logout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-6"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && dashboardData && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{dashboardData.stats?.totalPredictions || 0}</div>
                        <div className="text-sm text-gray-600">Price Predictions</div>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{dashboardData.stats?.savedLaptops || 0}</div>
                        <div className="text-sm text-gray-600">Saved Laptops</div>
                      </div>
                      <Heart className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{dashboardData.stats?.viewedLaptops || 0}</div>
                        <div className="text-sm text-gray-600">Viewed Laptops</div>
                      </div>
                      <ShoppingBag className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Predictions */}
                {dashboardData.recentPredictions && dashboardData.recentPredictions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Predictions</h3>
                    <div className="space-y-4">
                      {dashboardData.recentPredictions.map(prediction => (
                        <div key={prediction._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {prediction.inputData.company} {prediction.inputData.typename}
                              </div>
                              <div className="text-sm text-gray-600">
                                {prediction.inputData.ram}GB RAM • {prediction.inputData.cpu}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">
                                €{prediction.predictionResult?.price_euros?.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(prediction.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {dashboardData.preferences && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Budget Range</div>
                        <div className="font-medium">
                          ${dashboardData.preferences.preferences?.budget?.min || 0} - 
                          ${dashboardData.preferences.preferences?.budget?.max || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Usage Type</div>
                        <div className="font-medium">{user?.usageType}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Notifications
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="ml-2">Price alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="ml-2">New recommendations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="ml-2">Promotional emails</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;