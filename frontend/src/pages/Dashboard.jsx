import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, BarChart3, Settings, History, LogOut, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { Link } from 'react-router-dom';

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

  const refreshDashboard = async () => {
    setLoading(true);
    await loadDashboardData();
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

  // Get viewed laptops from dashboard data - check both possible structures
  const viewedLaptops = dashboardData?.viewedLaptops || 
                      (dashboardData?.preferences?.viewedLaptops ? 
                        dashboardData.preferences.viewedLaptops.slice(0, 5) : []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={refreshDashboard}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <span>Refresh</span>
            </button>
          </div>
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
                      <Eye className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Recently Viewed Items */}
                {viewedLaptops && viewedLaptops.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Recently Viewed</h3>
                      {dashboardData.stats?.viewedLaptops > 5 && (
                        <Link 
                          to="/dashboard?tab=history" 
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => setActiveTab('history')}
                        >
                          View All ({dashboardData.stats?.viewedLaptops})
                        </Link>
                      )}
                    </div>
                    <div className="space-y-4">
                      {viewedLaptops.map((view, index) => (
                        view.laptop ? (
                          <div key={index} className="flex items-center border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <img
                              src={view.laptop.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                              alt={view.laptop.name}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{view.laptop.name}</div>
                              <div className="text-sm text-gray-600">
                                ${view.laptop.price?.current || 'N/A'} • {view.laptop.specifications?.ram || 'N/A'}GB RAM
                              </div>
                              <div className="text-xs text-gray-500">
                                Viewed {new Date(view.viewedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Link
                              to={`/product/${view.laptopId || view.laptop._id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        ) : (
                          <div key={index} className="flex items-center border border-gray-200 rounded-lg p-3 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded mr-4 flex items-center justify-center">
                              <Eye className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Product unavailable</div>
                              <div className="text-sm">This laptop may have been removed</div>
                              <div className="text-xs">
                                Viewed {new Date(view.viewedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Predictions */}
                {dashboardData.recentPredictions && dashboardData.recentPredictions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Predictions</h3>
                    <div className="space-y-4">
                      {dashboardData.recentPredictions.map(prediction => (
                        <div key={prediction._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Budget Range</div>
                          <div className="font-medium text-lg text-blue-600">
                            ${dashboardData.preferences.preferences?.budget?.min || 0} - 
                            ${dashboardData.preferences.preferences?.budget?.max || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Usage Type</div>
                          <div className="font-medium text-lg text-purple-600 capitalize">
                            {user?.usageType || 'General'}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Performance Importance</div>
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(dashboardData.preferences.preferences?.performance?.importance || 5) * 10}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 font-medium">{dashboardData.preferences.preferences?.performance?.importance || 5}/10</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Portability Importance</div>
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${(dashboardData.preferences.preferences?.portability?.importance || 5) * 10}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 font-medium">{dashboardData.preferences.preferences?.portability?.importance || 5}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Viewed Items Message */}
                {(!viewedLaptops || viewedLaptops.length === 0) && (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Recently Viewed Items</h3>
                    <p className="text-gray-600 mb-4">
                      Start browsing laptops to see them here
                    </p>
                    <Link
                      to="/laptops"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Laptops
                    </Link>
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
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab (Basic Implementation) */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Your Activity History</h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This section would show your complete browsing and prediction history.
                  </p>
                  {/* You can expand this section later with more detailed history */}
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