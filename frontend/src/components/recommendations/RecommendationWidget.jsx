import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { recommendationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const RecommendationWidget = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await recommendationAPI.getPersonalized();
      if (response.data.success) {
        setRecommendations(response.data.recommendations.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Recommended For You</h3>
        </div>
        <Link 
          to="/recommendations" 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="bg-gray-200 h-40 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <Link
              key={rec.laptop?._id || index}
              to={`/product/${rec.laptop?._id}`}
              className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
            >
              {rec.matchScore && (
                <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">
                  {Math.round(rec.matchScore * 100)}% Match
                </div>
              )}
              <img
                src={rec.laptop?.images?.[0]}
                alt={rec.laptop?.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h4 className="font-medium text-gray-900 line-clamp-1">{rec.laptop?.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="text-lg font-bold text-blue-600">${rec.laptop?.price?.current}</div>
                <div className="text-sm text-gray-600">{rec.laptop?.specifications?.ram}GB RAM</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">No recommendations yet. Update your preferences!</p>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Update Preferences
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendationWidget;