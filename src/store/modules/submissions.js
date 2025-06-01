import API from '@/services/api'

export default {
  namespaced: true,
  
  state: {
    userSubmissions: [],
    adminSubmissions: [],
    submissionStats: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    currentSubmission: null,
    loading: {
      create: false,
      fetch: false,
      review: false
    },
    pagination: {
      user: { page: 1, limit: 10, total: 0, pages: 0 },
      admin: { page: 1, limit: 20, total: 0, pages: 0 }
    }
  },
  
  getters: {
    getUserSubmissions: state => state.userSubmissions,
    getAdminSubmissions: state => state.adminSubmissions,
    getSubmissionStats: state => state.submissionStats,
    getCurrentSubmission: state => state.currentSubmission,
    isLoading: state => type => state.loading[type] || false,
    getUserPagination: state => state.pagination.user,
    getAdminPagination: state => state.pagination.admin,
    
    // Helper getters
    getPendingSubmissions: state => state.adminSubmissions.filter(s => s.status === 'pending'),
    getApprovedSubmissions: state => state.adminSubmissions.filter(s => s.status === 'approved'),
    getRejectedSubmissions: state => state.adminSubmissions.filter(s => s.status === 'rejected'),
    
    // Get submission by challenge ID
    getSubmissionByChallenge: state => challengeId => {
      return state.userSubmissions.find(s => s.challenge._id === challengeId)
    }
  },
  
  mutations: {
    SET_LOADING(state, { type, loading }) {
      state.loading[type] = loading
    },
    
    SET_USER_SUBMISSIONS(state, { submissions, pagination }) {
      state.userSubmissions = submissions
      if (pagination) {
        state.pagination.user = pagination
      }
    },
    
    SET_ADMIN_SUBMISSIONS(state, { submissions, stats, pagination }) {
      state.adminSubmissions = submissions
      if (stats) {
        state.submissionStats = stats
      }
      if (pagination) {
        state.pagination.admin = pagination
      }
    },
    
    ADD_SUBMISSION(state, submission) {
      state.userSubmissions.unshift(submission)
    },
    
    UPDATE_SUBMISSION(state, updatedSubmission) {
      // Update in user submissions
      const userIndex = state.userSubmissions.findIndex(s => s._id === updatedSubmission._id)
      if (userIndex !== -1) {
        state.userSubmissions.splice(userIndex, 1, updatedSubmission)
      }
      
      // Update in admin submissions
      const adminIndex = state.adminSubmissions.findIndex(s => s._id === updatedSubmission._id)
      if (adminIndex !== -1) {
        state.adminSubmissions.splice(adminIndex, 1, updatedSubmission)
      }
      
      // Update stats
      if (updatedSubmission.status === 'approved') {
        state.submissionStats.pending = Math.max(0, state.submissionStats.pending - 1)
        state.submissionStats.approved += 1
      } else if (updatedSubmission.status === 'rejected') {
        state.submissionStats.pending = Math.max(0, state.submissionStats.pending - 1)
        state.submissionStats.rejected += 1
      }
    },
    
    SET_CURRENT_SUBMISSION(state, submission) {
      state.currentSubmission = submission
    },
    
    CLEAR_CURRENT_SUBMISSION(state) {
      state.currentSubmission = null
    }
  },
  
  actions: {
    // Create new submission
    async createSubmission({ commit }, formData) {
      commit('SET_LOADING', { type: 'create', loading: true })
      
      try {
        const response = await API.post('/submissions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        commit('ADD_SUBMISSION', response.data.data.submission)
        return response.data
        
      } catch (error) {
        throw error.response?.data || { message: 'Failed to create submission' }
      } finally {
        commit('SET_LOADING', { type: 'create', loading: false })
      }
    },
    
    // Get user's submissions
    async fetchUserSubmissions({ commit }, params = {}) {
      commit('SET_LOADING', { type: 'fetch', loading: true })
      
      try {
        const response = await API.get('/submissions/user', { params })
        commit('SET_USER_SUBMISSIONS', response.data.data)
        return response.data.data
        
      } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch user submissions' }
      } finally {
        commit('SET_LOADING', { type: 'fetch', loading: false })
      }
    },
    
    // Get admin submissions
    async fetchAdminSubmissions({ commit }, params = {}) {
      commit('SET_LOADING', { type: 'fetch', loading: true })
      
      try {
        const response = await API.get('/submissions/admin', { params })
        commit('SET_ADMIN_SUBMISSIONS', response.data.data)
        return response.data.data
        
      } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch admin submissions' }
      } finally {
        commit('SET_LOADING', { type: 'fetch', loading: false })
      }
    },
    
    // Review submission (admin)
    async reviewSubmission({ commit }, { submissionId, status, comment, rating }) {
      commit('SET_LOADING', { type: 'review', loading: true })
      
      try {
        const response = await API.put(`/submissions/${submissionId}/review`, {
          status,
          comment,
          rating
        })
        
        commit('UPDATE_SUBMISSION', response.data.data.submission)
        return response.data
        
      } catch (error) {
        throw error.response?.data || { message: 'Failed to review submission' }
      } finally {
        commit('SET_LOADING', { type: 'review', loading: false })
      }
    },
    
    // Get single submission
    async fetchSubmission({ commit }, submissionId) {
      commit('SET_LOADING', { type: 'fetch', loading: true })
      
      try {
        const response = await API.get(`/submissions/${submissionId}`)
        commit('SET_CURRENT_SUBMISSION', response.data.data.submission)
        return response.data.data.submission
        
      } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch submission' }
      } finally {
        commit('SET_LOADING', { type: 'fetch', loading: false })
      }
    },
    
    // Clear current submission
    clearCurrentSubmission({ commit }) {
      commit('CLEAR_CURRENT_SUBMISSION')
    },
    
    // Utility actions
    async loadMoreUserSubmissions({ state, dispatch }) {
      const nextPage = state.pagination.user.page + 1
      if (nextPage <= state.pagination.user.pages) {
        await dispatch('fetchUserSubmissions', { page: nextPage })
      }
    },
    
    async loadMoreAdminSubmissions({ state, dispatch }) {
      const nextPage = state.pagination.admin.page + 1
      if (nextPage <= state.pagination.admin.pages) {
        await dispatch('fetchAdminSubmissions', { page: nextPage })
      }
    },
    
    // Filter submissions
    async filterSubmissions({ dispatch }, { type, filters }) {
      if (type === 'admin') {
        await dispatch('fetchAdminSubmissions', filters)
      } else {
        await dispatch('fetchUserSubmissions', filters)
      }
    }
  }
}