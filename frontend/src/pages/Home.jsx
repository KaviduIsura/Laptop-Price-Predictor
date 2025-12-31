import React, { useState, useEffect } from "react";
import ProductCardGrid from "../components/product/ProductCardGrid";
import { laptopAPI, recommendationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import RecommendationWidget from "../components/recommendations/RecommendationWidget";

const Home = () => {
  const [featuredLaptops, setFeaturedLaptops] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load featured laptops (in real app, this would be an API call)
      const laptops = await laptopAPI.getAll({ limit: 8 });
      setFeaturedLaptops(laptops.data?.laptops || []);

      // Load personalized recommendations if user is logged in
      if (user) {
        const recs = await recommendationAPI.getPersonalized();
        setRecommendations(recs.data?.recommendations || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Gaming", icon: "🎮", count: 45 },
    { name: "Business", icon: "💼", count: 32 },
    { name: "Student", icon: "📚", count: 28 },
    { name: "Creative", icon: "🎨", count: 19 },
    { name: "Budget", icon: "💰", count: 67 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Your Perfect Laptop
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Compare prices, specs, and reviews from thousands of laptops
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for laptops, brands, or specifications..."
                  className="w-full px-6 py-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-gray-500">
                  {category.count} laptops
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {user && <RecommendationWidget />}
      
      {/* Featured Laptops */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Laptops</h2>
            <Link to="/laptops" className="text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded mt-4"></div>
                  <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredLaptops.slice(0, 8).map((laptop) => (
                <ProductCardGrid key={laptop._id} laptop={laptop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Personalized Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.laptop?._id}
                  className="bg-white rounded-lg p-6 border"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={rec.laptop?.images?.[0]}
                      alt={rec.laptop?.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{rec.laptop?.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        Match: {(rec.matchScore * 100).toFixed(0)}%
                      </div>
                      <div className="mt-2">
                        {rec.reasons?.map((reason, i) => (
                          <div key={i} className="text-sm text-green-600">
                            ✓ {reason}
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/product/${rec.laptop?._id}`}
                        className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Prediction CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure About Prices?</h2>
          <p className="text-xl mb-8 opacity-90">
            Use our AI-powered price predictor to know the fair price for any
            laptop configuration
          </p>
          <Link
            to="/predict"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Try Price Predictor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
