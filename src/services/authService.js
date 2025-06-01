import API from './api';

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await API.post('/auth/register', userData);
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('ecoquest_token', token);
        localStorage.setItem('ecoquest_user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  async login(email, password) {
  try {
    console.log('Mengirim login ke /auth/login dengan email:', email)
    const response = await API.post('/auth/login', { email, password })
    console.log('Respons dari /auth/login:', response.data)
    
    if (response.data.status === 'success') {
      const { token, user } = response.data.data
      console.log('Token diterima:', token)
      localStorage.setItem('ecoquest_token', token)
      localStorage.setItem('ecoquest_user', JSON.stringify(user))
      console.log('Token disimpan ke localStorage:', localStorage.getItem('ecoquest_token'))
    }
    
    return response.data
  } catch (error) {
    console.error('Error login di authService:', error.response?.data || error.message)
    throw error.response?.data || { message: 'Login failed' }
  }
},

  // Logout user
  async logout() {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('ecoquest_token');
      localStorage.removeItem('ecoquest_user');
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await API.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await API.put('/auth/profile', profileData);
      
      if (response.data.status === 'success') {
        localStorage.setItem('ecoquest_user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('ecoquest_token');
  },

  // Get stored user data
  getStoredUser() {
    const userData = localStorage.getItem('ecoquest_user');
    return userData ? JSON.parse(userData) : null;
  }
};