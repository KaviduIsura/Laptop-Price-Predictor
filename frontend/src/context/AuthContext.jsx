import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

// Export useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = authService.getToken();
    if (token) {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setUser(response.data.user);
          authService.setUser(response.data.user);
        } else {
          authService.logout();
        }
      } catch (error) {
        authService.logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        const { token, user } = result.data;
        authService.setToken(token);
        authService.setUser(user);
        setUser(user);
        return { success: true };
      }
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        const { token, user } = result.data;
        authService.setToken(token);
        authService.setUser(user);
        setUser(user);
        return { success: true };
      }
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};