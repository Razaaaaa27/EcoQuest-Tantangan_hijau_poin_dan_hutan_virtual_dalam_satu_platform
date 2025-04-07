// src/store/modules/community.js
export default {
    namespaced: true,
    state: () => ({
      members: [],
    }),
    mutations: {
      setMembers(state, members) {
        state.members = members;
      },
      addMember(state, member) {
        state.members.push(member);
      }
    },
    actions: {
      fetchCommunityMembers({ commit }) {
        const dummyMembers = [
          { id: 1, name: 'Ayu' },
          { id: 2, name: 'Budi' },
        ];
        commit('setMembers', dummyMembers);
      }
    },
    getters: {
      memberCount(state) {
        return state.members.length;
      },
      allMembers(state) {
        return state.members;
      }
    }
  };
  