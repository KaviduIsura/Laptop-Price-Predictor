import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Cpu, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { recommendationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCardGrid from '../components/product/ProductCardGrid';
import { showToast } from '../utils/notifications';

const Recommendations = () => {
  const { user } = useAuth();
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [collaborativeRecs, setCollaborativeRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    ram: [],
    category: []
  });

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Load personalized recommendations
      const personalizedRes = await recommendationAPI.getPersonalized();
      if (personalizedRes.data.success) {
        setPersonalizedRecs(personalizedRes.data.recommendations || []);
      }
      
      // Load collaborative recommendations
      const collaborativeRes = await recommendationAPI.getCollaborative();
      if (collaborativeRes.data.success) {
        setCollaborativeRecs(collaborativeRes.data.recommendations || []);
      }
      
    } catch (error) {
      console.error('Error loading recommendations:', error);
      showToast('Failed to load recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = () => {
    loadRecommendations();
    showToast('Recommendations refreshed!', 'success');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>
            <p className="text-gray-600 mb-6">
              Login to get personalized laptop recommendations based on your preferences and browsing history.
            </p>
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Login to Continue
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personalized', label: 'Personalized', icon: <Sparkles className="w-5 h-5" />, count: personalizedRecs.length },
    { id: 'collaborative', label: 'Similar Users', icon: <Users className="w-5 h-5" />, count: collaborativeRecs.length },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const currentRecs = activeTab === 'personalized' ? personalizedRecs : 
                     activeTab === 'collaborative' ? collaborativeRecs : 
                     [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Recommendations</h1>
              <p className="text-gray-600 mt-2">
                Smart suggestions based on your preferences and similar users
              </p>
            </div>
            <button
              onClick={refreshRecommendations}
              disabled={loading}
              className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{personalizedRecs.length}</div>
              <div className="text-sm text-gray-600">Personalized Matches</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{collaborativeRecs.length}</div>
              <div className="text-sm text-gray-600">From Similar Users</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {personalizedRecs.length > 0 ? Math.max(...personalizedRecs.map(r => Math.round(r.matchScore * 100))) : 0}%
              </div>
              <div className="text-sm text-gray-600">Best Match Score</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {personalizedRecs.reduce((sum, rec) => sum + (rec.laptop?.price?.current || 0), 0) / (personalizedRecs.length || 1) | 0}
              </div>
              <div className="text-sm text-gray-600">Avg. Price</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters & Info */}
          <div className="lg:col-span-1">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-semibold mb-3">Recommendation Types</h3>
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6">
              <h4 className="font-semibold text-blue-800 mb-3">🤖 How We Recommend</h4>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</div>
                  <span>Analyze your preferences and budget</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</div>
                  <span>Match with laptops that fit your needs</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</div>
                  <span>Compare with what similar users liked</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</div>
                  <span>Show you the best matches first</span>
                </div>
              </div>
            </div>

            {/* Update Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-5 border">
              <h4 className="font-semibold mb-3">⚙️ Improve Recommendations</h4>
              <p className="text-sm text-gray-600 mb-4">
                Update your preferences for better matches
              </p>
              <a
                href="/dashboard"
                className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 text-sm"
              >
                Update Preferences
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Recommendations Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {activeTab === 'personalized' && 'Personalized For You'}
                    {activeTab === 'collaborative' && 'Liked By Similar Users'}
                    {activeTab === 'trending' && 'Trending Now'}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {activeTab === 'personalized' && 'Based on your preferences and budget'}
                    {activeTab === 'collaborative' && 'What users with similar tastes are viewing'}
                    {activeTab === 'trending' && 'Popular among all users'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border rounded-lg px-3 py-1 text-sm">
                    <option>Sort by: Match Score</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-64 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : currentRecs.length === 0 ? (
                <div className="text-center py-12">
                  <Cpu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'personalized' 
                      ? 'Update your preferences to get personalized recommendations'
                      : 'Start browsing laptops to get recommendations from similar users'}
                  </p>
                  <a
                    href="/laptops"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Browse Laptops
                  </a>
                </div>
              ) : (
                <>
                  {/* Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentRecs.map((rec, index) => (
                      <div key={rec.laptop?._id || index} className="relative">
                        <ProductCardGrid laptop={rec.laptop} />
                        
                        {/* Match Score Badge */}
                        {rec.matchScore && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              {Math.round(rec.matchScore * 100)}% Match
                            </div>
                          </div>
                        )}
                        
                        {/* Reasons */}
                        {rec.reasons && rec.reasons.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 mb-2">Why we recommend this:</div>
                            <ul className="space-y-1">
                              {rec.reasons.map((reason, i) => (
                                <li key={i} className="flex items-center text-sm text-blue-700">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  {currentRecs.length >= 6 && (
                    <div className="text-center mt-8">
                      <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
                        Load More Recommendations
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recommendation Insights */}
            {personalizedRecs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">📊 Your Recommendation Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Budget Match</div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (personalizedRecs.reduce((sum, rec) => {
                            const price = rec.laptop?.price?.current || 0;
                            return sum + (price >= 500 && price <= 2000 ? 1 : 0);
                          }, 0) / personalizedRecs.length) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 font-bold">
                        {Math.round((personalizedRecs.filter(rec => {
                          const price = rec.laptop?.price?.current || 0;
                          return price >= 500 && price <= 2000;
                        }).length / personalizedRecs.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Top Category</div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(() => {
                          const categories = personalizedRecs.map(rec => rec.laptop?.category);
                          const counts = {};
                          categories.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
                          return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'None';
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Average Match Score</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(personalizedRecs.reduce((sum, rec) => sum + (rec.matchScore || 0), 0) / personalizedRecs.length * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Not Finding What You Need?</h3>
              <p className="opacity-90">Try our AI Price Predictor or compare laptops side by side</p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="/predict"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Try Price Predictor
              </a>
              <a
                href="/compare"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10"
              >
                Compare Laptops
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;