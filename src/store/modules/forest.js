// src/store/modules/forest.js
export default {
    namespaced: true,
    state: () => ({
      treesPlanted: 0,
    }),
    mutations: {
      plantTree(state) {
        state.treesPlanted++;
      },
      resetForest(state) {
        state.treesPlanted = 0;
      }
    },
    actions: {
      simulateTreePlanting({ commit }) {
        commit('plantTree');
      }
    },
    getters: {
      totalTrees(state) {
        return state.treesPlanted;
      }
    }
  };
  