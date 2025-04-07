export default {
    namespaced: true,
    state: {
      currentUser: {
        id: 'user123',
        username: 'RazaWarior',
        avatar: 'https://ui-avatars.com/api/?name=Raza+Warrior&background=random',
        level: 5,
        totalPoints: 1250,
        badges: ['tree-lover', 'recycling-master'],
        rank: 8
      },
      isAuthenticated: true,
      completedChallenges: [
        { id: 'ch1', date: '2023-05-01', points: 50 },
        { id: 'ch3', date: '2023-05-02', points: 75 },
        { id: 'ch7', date: '2023-05-05', points: 100 }
      ],
      statistics: {
        treesPlanted: 12,
        wasteRecycled: 45,
        waterSaved: 120,
        challengesCompleted: 15
      }
    },
    getters: {
      getCurrentUser: state => state.currentUser,
      isAuthenticated: state => state.isAuthenticated,
      getCompletedChallenges: state => state.completedChallenges,
      getUserStatistics: state => state.statistics,
      getUserLevel: state => state.currentUser.level,
      getUserBadges: state => state.currentUser.badges,
      getUserPoints: state => state.currentUser.totalPoints,
      getUserRank: state => state.currentUser.rank
    },
    mutations: {
      SET_USER(state, user) {
        state.currentUser = user
      },
      SET_AUTHENTICATION(state, status) {
        state.isAuthenticated = status
      },
      ADD_COMPLETED_CHALLENGE(state, challenge) {
        state.completedChallenges.push(challenge)
      },
      UPDATE_STATISTICS(state, newStats) {
        state.statistics = { ...state.statistics, ...newStats }
      },
      UPDATE_USER_POINTS(state, points) {
        state.currentUser.totalPoints += points
        
        // Update level based on points (simple calculation)
        state.currentUser.level = Math.floor(state.currentUser.totalPoints / 250) + 1
      },
      ADD_BADGE(state, badge) {
        if (!state.currentUser.badges.includes(badge)) {
          state.currentUser.badges.push(badge)
        }
      }
    },
    actions: {
      login({ commit }, userData) {
        // Simulate API call
        return new Promise(resolve => {
          setTimeout(() => {
            commit('SET_USER', userData)
            commit('SET_AUTHENTICATION', true)
            resolve(userData)
          }, 1000)
        })
      },
      logout({ commit }) {
        commit('SET_USER', {})
        commit('SET_AUTHENTICATION', false)
      },
      completeChallenge({ commit, state }, challenge) {
        // Add to completed challenges
        const completedChallenge = {
          id: challenge.id,
          date: new Date().toISOString().split('T')[0],
          points: challenge.points
        }
        commit('ADD_COMPLETED_CHALLENGE', completedChallenge)
        
        // Update user points
        commit('UPDATE_USER_POINTS', challenge.points)
        
        // Update statistics based on challenge type
        const newStats = {}
        if (challenge.type === 'tree') {
          newStats.treesPlanted = state.statistics.treesPlanted + 1
        } else if (challenge.type === 'recycle') {
          newStats.wasteRecycled = state.statistics.wasteRecycled + challenge.amount
        } else if (challenge.type === 'water') {
          newStats.waterSaved = state.statistics.waterSaved + challenge.amount
        }
        
        newStats.challengesCompleted = state.statistics.challengesCompleted + 1
        commit('UPDATE_STATISTICS', newStats)
        
        // Check for badges
        this.dispatch('user/checkForBadges')
      },
      checkForBadges({ commit, state }) {
        // Simple badge logic based on statistics
        if (state.statistics.treesPlanted >= 10 && !state.currentUser.badges.includes('tree-lover')) {
          commit('ADD_BADGE', 'tree-lover')
        }
        
        if (state.statistics.wasteRecycled >= 50 && !state.currentUser.badges.includes('recycling-master')) {
          commit('ADD_BADGE', 'recycling-master')
        }
        
        if (state.statistics.waterSaved >= 100 && !state.currentUser.badges.includes('water-saver')) {
          commit('ADD_BADGE', 'water-saver')
        }
        
        if (state.statistics.challengesCompleted >= 20 && !state.currentUser.badges.includes('challenge-champion')) {
          commit('ADD_BADGE', 'challenge-champion')
        }
      }
    }
  }