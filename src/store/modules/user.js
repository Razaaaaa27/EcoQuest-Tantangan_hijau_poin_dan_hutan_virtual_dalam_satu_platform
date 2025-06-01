import { authService } from '@/services/authService';

export default {
  namespaced: true,
  state: {
    currentUser: null,
    isAuthenticated: false,
    completedChallenges: [],
    statistics: {
      challengesCompleted: 0,
      treesPlanted: 0,
      wasteRecycled: 0,
      waterSaved: 0
    }
  },
  getters: {
    getCurrentUser: state => state.currentUser,
    isAuthenticated: state => state.isAuthenticated,
    isAdmin: state => state.currentUser?.role === 'admin' || false,
    getCompletedChallenges: state => state.completedChallenges,
    getUserStatistics: state => state.statistics,
    getUserLevel: state => state.currentUser?.gameStats?.level || 1,
    getUserBadges: state => state.currentUser?.gameStats?.badges || [],
    getUserPoints: state => state.currentUser?.gameStats?.totalPoints || 0,
    getUserRank: state => state.currentUser?.gameStats?.rank || 0
  },
  mutations: {
    SET_USER(state, user) {
      state.currentUser = user;
      state.isAuthenticated = !!user;
      if (user) {
        state.statistics = user.statistics;
      }
    },
    SET_AUTHENTICATION(state, status) {
      state.isAuthenticated = status;
    },
    CLEAR_USER(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.completedChallenges = [];
      state.statistics = {
        challengesCompleted: 0,
        treesPlanted: 0,
        wasteRecycled: 0,
        waterSaved: 0
      };
    },
    UPDATE_USER_STATS(state, stats) {
      if (state.currentUser) {
        state.currentUser.statistics = { ...state.currentUser.statistics, ...stats };
        state.statistics = { ...state.statistics, ...stats };
      }
    },
    UPDATE_USER_POINTS(state, points) {
      if (state.currentUser) {
        state.currentUser.gameStats.totalPoints += points;
        // Update level based on points
        state.currentUser.gameStats.level = Math.floor(state.currentUser.gameStats.totalPoints / 250) + 1;
      }
    },
    ADD_BADGE(state, badge) {
      if (state.currentUser && !state.currentUser.gameStats.badges.some(b => b.name === badge.name)) {
        state.currentUser.gameStats.badges.push(badge);
      }
    }
  },
  actions: {
    async initializeAuth({ commit }) {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          commit('SET_USER', user);
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          authService.logout();
        }
      }
    },

    async login({ commit }, { email, password }) {
      try {
        const response = await authService.login(email, password);
        commit('SET_USER', response.data.user);
        return response;
      } catch (error) {
        throw error;
      }
    },

    // PERBAIKAN: Register tidak boleh langsung set user sebagai authenticated
    async register({ commit }, userData) {
      try {
        const response = await authService.register(userData);
        // JANGAN commit SET_USER di sini
        // Biarkan user harus login manual setelah register
        return response;
      } catch (error) {
        throw error;
      }
    },

    async logout({ commit }) {
      await authService.logout();
      commit('CLEAR_USER');
    },

    async updateProfile({ commit }, profileData) {
      try {
        const response = await authService.updateProfile(profileData);
        commit('SET_USER', response.data.user);
        return response;
      } catch (error) {
        throw error;
      }
    },

    updateUserPoints({ commit }, points) {
      commit('UPDATE_USER_POINTS', points);
    },

    updateStatistics({ commit }, stats) {
      commit('UPDATE_USER_STATS', stats);
    },

    addBadge({ commit }, badge) {
      commit('ADD_BADGE', badge);
    }
  }
};