import API from './api';

export const ecoEduService = {
  // Get all educational content
  async getContent(params = {}) {
    try {
      const response = await API.get('/ecoedu', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  },

  // Get featured content
  async getFeaturedContent() {
    try {
      const response = await API.get('/ecoedu/featured');
      return response.data.data.content;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured content' };
    }
  },

  // Get single content
  async getSingleContent(id) {
    try {
      const response = await API.get(`/ecoedu/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  },

  // Toggle like on content
  async toggleLike(id) {
    try {
      const response = await API.post(`/ecoedu/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle like' };
    }
  },

  // Toggle bookmark on content
  async toggleBookmark(id) {
    try {
      const response = await API.post(`/ecoedu/${id}/bookmark`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle bookmark' };
    }
  },

  // Add comment to content
  async addComment(id, text) {
    try {
      const response = await API.post(`/ecoedu/${id}/comments`, { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  }
};