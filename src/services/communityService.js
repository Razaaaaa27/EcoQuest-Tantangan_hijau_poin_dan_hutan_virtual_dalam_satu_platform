import API from './api';

export const communityService = {
  // Get all posts
  async getPosts(params = {}) {
    try {
      const response = await API.get('/community/posts', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },

  // Get single post
  async getPost(id) {
    try {
      const response = await API.get(`/community/posts/${id}`);
      return response.data.data.post;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch post' };
    }
  },

  // Create new post
  async createPost(postData) {
    try {
      const response = await API.post('/community/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create post' };
    }
  },

  // Update post
  async updatePost(id, postData) {
    try {
      const response = await API.put(`/community/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update post' };
    }
  },

  // Delete post
  async deletePost(id) {
    try {
      const response = await API.delete(`/community/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete post' };
    }
  },

  // Toggle like on post
  async toggleLike(id) {
    try {
      const response = await API.post(`/community/posts/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle like' };
    }
  },

  // Add comment to post
  async addComment(id, text) {
    try {
      const response = await API.post(`/community/posts/${id}/comments`, { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  }
};