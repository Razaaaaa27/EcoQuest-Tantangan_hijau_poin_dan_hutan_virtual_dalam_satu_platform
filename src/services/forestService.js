import API from './api';

export const forestService = {
  // Get user's forest
  async getForest() {
    try {
      const response = await API.get('/api/forest');
      return response.data.data.forest;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch forest' };
    }
  },

  // Plant new tree
  async plantTree(treeData) {
    try {
      const response = await API.post('/api/forest/plant', treeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to plant tree' };
    }
  }
};