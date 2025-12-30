import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Loader, { Spinner } from './components/ui/Loader';
import Toast from './components/ui/Toast';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Compare = lazy(() => import('./pages/Compare'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Predict = lazy(() => import('./pages/Predict'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Page404 = lazy(() => import('./pages/Page404'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Guest Route Component
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Main App Component
function App() {
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setToastConfig({ message, type });
    setShowToast(true);
  };

  useEffect(() => {
    // Listen for custom events for notifications
    const handleShowToast = (e) => {
      showNotification(e.detail.message, e.detail.type);
    };

    window.addEventListener('show-toast', handleShowToast);
    
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Suspense fallback={<Loader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/laptops" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/predict" element={<Predict />} />
                  
                  {/* Auth Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <GuestRoute>
                        <Login />
                      </GuestRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <GuestRoute>
                        <Register />
                      </GuestRoute>
                    } 
                  />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/wishlist" 
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes (example) */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute>
                        {/* Add admin routes here */}
                        <div className="container mx-auto px-4 py-8">
                          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                          <p>Admin features coming soon...</p>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            
            {/* Global Toast Notification */}
            {showToast && (
              <Toast
                message={toastConfig.message}
                type={toastConfig.type}
                onClose={() => setShowToast(false)}
              />
            )}
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;