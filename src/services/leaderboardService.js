import API from './api';

export const leaderboardService = {
  // Get leaderboard
  async getLeaderboard(params = {}) {
    try {
      const response = await API.get('/leaderboard', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch leaderboard' };
    }
  },

  // Get top users
  async getTopUsers() {
    try {
      const response = await API.get('/leaderboard/top');
      return response.data.data.users;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch top users' };
    }
  }
};