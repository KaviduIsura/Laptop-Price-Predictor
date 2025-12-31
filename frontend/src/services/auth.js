import api from './api';

// Authentication service functions
export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get profile' 
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update profile' 
      };
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/auth/preferences', { preferences });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update preferences' 
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Set token after login
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Set user data
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get stored user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;