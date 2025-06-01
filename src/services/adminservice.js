// src/services/adminService.js
import API from './api';

export const adminService = {
  // Dashboard Statistics
   async getDashboardStats() {
    try {
      console.log('Calling /admin/stats endpoint...');
      const response = await API.get('/admin/stats');
      console.log('API Response:', response);
      return response.data.data;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  // PERBAIKAN: TAMBAH method getSubmissions yang hilang
  async getSubmissions(params = {}) {
    try {
      console.log('🔄 AdminService: Fetching submissions with params:', params)
      
      const response = await API.get('/submissions/admin', {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          status: params.status || '',
          sort: params.sort || '-submittedAt',
          challengeId: params.challengeId || '',
          userId: params.userId || ''
        }
      })
      
      console.log('✅ AdminService: Submissions fetched successfully')
      return response
      
    } catch (error) {
      console.error('❌ AdminService: Error fetching submissions:', error)
      throw error.response?.data || { message: 'Failed to fetch submissions' }
    }
  },

  // PERBAIKAN: TAMBAH method reviewSubmission yang hilang
  async reviewSubmission(submissionId, reviewData) {
    try {
      console.log('🔄 AdminService: Reviewing submission:', submissionId, reviewData)
      
      const response = await API.put(`/submissions/${submissionId}/review`, {
        status: reviewData.status,
        comment: reviewData.comment || '',
        rating: reviewData.rating || null
      })
      
      console.log('✅ AdminService: Submission reviewed successfully')
      return response
      
    } catch (error) {
      console.error('❌ AdminService: Error reviewing submission:', error)
      throw error.response?.data || { message: 'Failed to review submission' }
    }
  },


  // User Management
  async getUsers(params = {}) {
    try {
      const response = await API.get('/admin/users', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  async updateUserRole(userId, role) {
    try {
      const response = await API.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },

  async suspendUser(userId, suspended, reason) {
    try {
      const response = await API.put(`/admin/users/${userId}/suspend`, { suspended, reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to suspend/unsuspend user' };
    }
  },

  async deleteUser(userId) {
    try {
      const response = await API.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Challenge Management
  async getChallenges(params = {}) {
    try {
      const response = await API.get('/admin/challenges', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch challenges' };
    }
  },

  validateChallengeData(data) {
    const errors = [];
    
    if (!data.title || data.title.length < 5 || data.title.length > 100) {
      errors.push('Judul challenge harus 5-100 karakter');
    }
    
    if (!data.description || data.description.length < 20 || data.description.length > 1000) {
      errors.push('Deskripsi challenge harus 20-1000 karakter');
    }
    
    const validCategories = ['recycle', 'plantation', 'conservation', 'water', 'energy', 'education', 'community'];
    if (!data.category || !validCategories.includes(data.category)) {
      errors.push('Kategori tidak valid');
    }
    
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!data.difficulty || !validDifficulties.includes(data.difficulty)) {
      errors.push('Tingkat kesulitan tidak valid');
    }
    
    if (!data.points || data.points < 10 || data.points > 500) {
      errors.push('Poin harus antara 10-500');
    }
    
    if (!Array.isArray(data.requirements) || data.requirements.length === 0) {
      errors.push('Minimal 1 requirement diperlukan');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  async createChallenge(challengeData) {
    try {
      // Validate data before sending
      const validation = this.validateChallengeData(challengeData);
      if (!validation.isValid) {
        throw {
          response: {
            data: {
              status: 'error',
              message: 'Data tidak valid',
              errors: validation.errors
            }
          }
        };
      }

      const response = await API.post('/admin/challenges', challengeData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        status: 'error',
        message: 'Failed to create challenge',
        errors: [error.message]
      };
    }
  },

  async updateChallenge(challengeId, challengeData) {
    try {
      const response = await API.put(`/admin/challenges/${challengeId}`, challengeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update challenge' };
    }
  },

  async deleteChallenge(challengeId) {
    try {
      const response = await API.delete(`/admin/challenges/${challengeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete challenge' };
    }
  },

  async toggleChallengeFeatured(challengeId) {
    try {
      const response = await API.put(`/admin/challenges/${challengeId}/featured`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle challenge featured status' };
    }
  },

  async getChallengeParticipants(challengeId, params = {}) {
    try {
      const response = await API.get(`/admin/challenges/${challengeId}/participants`, { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch challenge participants' };
    }
  },

  // Educational Content Management
  async getEduContent(params = {}) {
    try {
      const response = await API.get('/admin/edu-content', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch educational content' };
    }
  },

async createEduContent(contentData) {
  try {
    // Validate data before sending
    const validation = this.validateContentData(contentData);
    if (!validation.isValid) {
      throw {
        response: {
          data: {
            status: 'error',
            message: 'Data tidak valid',
            errors: validation.errors
          }
        }
      };
    }

    const response = await API.post('/admin/edu-content', contentData);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      status: 'error', 
      message: 'Failed to create educational content',
      errors: [error.message]
    };
  }
},

  async updateEduContent(contentId, contentData) {
    try {
      const response = await API.put(`/admin/edu-content/${contentId}`, contentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update educational content' };
    }
  },

  async deleteEduContent(contentId) {
    try {
      const response = await API.delete(`/admin/edu-content/${contentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete educational content' };
    }
  },

  async toggleContentFeatured(contentId) {
    try {
      const response = await API.put(`/admin/edu-content/${contentId}/featured`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle content featured status' };
    }
  },

  async updateContentStatus(contentId, status) {
    try {
      const response = await API.put(`/admin/edu-content/${contentId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update content status' };
    }
  },

  // Posts Management
  async getPosts(params = {}) {
    try {
      const response = await API.get('/admin/posts', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },

  async deletePost(postId) {
    try {
      const response = await API.delete(`/admin/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete post' };
    }
  },

  // Analytics
  async getAnalytics(period = '7d') {
    try {
      const response = await API.get(`/admin/analytics?period=${period}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  },

  // Reports
  async generateReport(type, params = {}) {
    try {
      const response = await API.get(`/admin/reports/${type}`, { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate report' };
    }
  },

  async exportReport(type, params = {}, format = 'json') {
    try {
      const response = await API.get(`/admin/reports/${type}`, { 
        params: { ...params, format },
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export report' };
    }
  },

  // Bulk Actions
  async performBulkAction(action, type, ids, data = {}) {
    try {
      const response = await API.post('/admin/bulk-actions', {
        action,
        type,
        ids,
        data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to perform bulk action' };
    }
  },

  // System Health
  async getSystemHealth() {
    try {
      const response = await API.get('/admin/system-health');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system health' };
    }
  },

  // File Upload (if needed)
  async uploadFile(file, type = 'general') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await API.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload file' };
    }
  },

  // Batch Operations
  async batchUpdateUsers(updates) {
    try {
      const response = await API.put('/admin/users/batch', { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to batch update users' };
    }
  },

  async batchUpdateChallenges(updates) {
    try {
      const response = await API.put('/admin/challenges/batch', { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to batch update challenges' };
    }
  },

  async batchUpdateContent(updates) {
    try {
      const response = await API.put('/admin/edu-content/batch', { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to batch update content' };
    }
  },

  // Search and Filtering Helpers
  async searchUsers(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      return await this.getUsers(params);
    } catch (error) {
      throw error;
    }
  },

  async searchChallenges(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      return await this.getChallenges(params);
    } catch (error) {
      throw error;
    }
  },

  async searchContent(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      return await this.getEduContent(params);
    } catch (error) {
      throw error;
    }
  },

  // Validation Helpers
  validateContentData(data) {
    const errors = {};
    
    if (!data.title || data.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long';
    }
    
    if (!data.description || data.description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters long';
    }
    
    if (!data.fullContent || data.fullContent.trim().length < 100) {
      errors.fullContent = 'Full content must be at least 100 characters long';
    }
    
    if (!data.type) {
      errors.type = 'Content type is required';
    }
    
    if (!data.category) {
      errors.category = 'Category is required';
    }
    
    if (!data.author || !data.author.name) {
      errors['author.name'] = 'Author name is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Utility Functions
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('id-ID', { ...defaultOptions, ...options });
  },

  formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  },

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Constants
  CATEGORIES: {
    CHALLENGES: [
      'recycle',
      'plantation', 
      'conservation',
      'water',
      'energy',
      'education',
      'community'
    ],
    CONTENT: [
      'Perubahan Iklim',
      'Konservasi Air',
      'Energi Terbarukan',
      'Pengelolaan Sampah',
      'Pertanian Berkelanjutan',
      'Biodiversitas'
    ]
  },

  DIFFICULTIES: {
    CHALLENGES: ['easy', 'medium', 'hard'],
    CONTENT: ['beginner', 'intermediate', 'advanced']
  },

  CONTENT_TYPES: ['article', 'video', 'infographic'],

  USER_ROLES: ['user', 'admin'],

  STATUS_OPTIONS: {
    CHALLENGES: ['draft', 'active', 'completed', 'cancelled'],
    CONTENT: ['draft', 'published', 'archived']
  }
};