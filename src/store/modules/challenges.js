// src/store/modules/challenges.js
import { challengeService } from '@/services/challengeService';

export default {
  namespaced: true,
  state: () => ({
    challengeList: [],
  }),
  mutations: {
    setChallenges(state, challenges) {
      state.challengeList = challenges;
    },
    updateChallengeStatus(state, { challengeId, status }) {
      const challenge = state.challengeList.find(c => c.id === challengeId);
      if (challenge) {
        challenge.userStatus = status;
      }
    },
  },
  actions: {
    async fetchChallenges({ commit }, params) {
      try {
        const data = await challengeService.getChallenges(params);
        commit('setChallenges', data.challenges);
        return data;
      } catch (error) {
        throw new Error(error.message || 'Gagal mengambil tantangan');
      }
    },
    async joinChallenge({ commit }, challengeId) {
      try {
        await challengeService.joinChallenge(challengeId);
        commit('updateChallengeStatus', { challengeId, status: 'joined' });
      } catch (error) {
        throw new Error(error.message || 'Gagal bergabung dengan tantangan');
      }
    },
    async completeChallenge({ commit }, { challengeId, submissionData }) {
      try {
        const response = await challengeService.completeChallenge(challengeId, submissionData);
        commit('updateChallengeStatus', { challengeId, status: 'completed' });
        return response; // Mengembalikan data seperti pointsEarned
      } catch (error) {
        throw new Error(error.message || 'Gagal menyelesaikan tantangan');
      }
    },
  },
  getters: {
    allChallenges(state) {
      return state.challengeList;
    },
  },
};