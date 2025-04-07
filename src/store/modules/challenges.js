// src/store/modules/challenges.js
export default {
    namespaced: true,
    state: () => ({
      challengeList: [],
    }),
    mutations: {
      setChallenges(state, challenges) {
        state.challengeList = challenges;
      }
    },
    actions: {
      fetchChallenges({ commit }) {
        // Simulasikan ambil data
        const dummyChallenges = [
          { id: 1, title: 'Tanam Pohon' },
          { id: 2, title: 'Kurangi Plastik' },
        ];
        commit('setChallenges', dummyChallenges);
      }
    },
    getters: {
      allChallenges(state) {
        return state.challengeList;
      }
    }
  };
  