// src/store/modules/admin.js
import { adminService } from '@/services/adminService'

export default {
  namespaced: true,
  
  state: {
    // Dashboard Stats
    dashboardStats: {
      totalUsers: 0,
      totalChallenges: 0,
      totalPosts: 0,
      totalEduContent: 0,
      activeUsers: 0,
      activeChallenges: 0,
      userGrowth: 0,
      challengeGrowth: 0,
      postGrowth: 0,
      contentGrowth: 0
    },
    
    // Analytics Data
    analytics: {
      userRegistrations: [],
      challengeCompletions: [],
      popularCategories: [],
      userLevels: []
    },
    
    // Data Lists
    users: [],
    challenges: [],
    eduContent: [],
    posts: [],
    
    // Pagination Info
    usersPagination: { page: 1, limit: 20, total: 0, pages: 0 },
    challengesPagination: { page: 1, limit: 20, total: 0, pages: 0 },
    contentPagination: { page: 1, limit: 20, total: 0, pages: 0 },
    postsPagination: { page: 1, limit: 20, total: 0, pages: 0 },
    
    // Loading States
    loading: {
      dashboard: false,
      users: false,
      challenges: false,
      content: false,
      posts: false,
      analytics: false
    },
    
    // Filters and Search
    filters: {
      users: {
        search: '',
        role: '',
        level: '',
        status: '',
        sort: '-createdAt'
      },
      challenges: {
        search: '',
        status: '',
        category: '',
        difficulty: '',
        sort: '-createdAt'
      },
      content: {
        search: '',
        type: '',
        category: '',
        status: '',
        sort: '-createdAt'
      },
      posts: {
        search: '',
        reported: false,
        sort: '-createdAt'
      }
    },
    
    // System Health
    systemHealth: null,
    
    // Reports
    reports: {},
    
    // Error Handling
    errors: {}
  },
  
  getters: {
    // Dashboard
    getDashboardStats: state => state.dashboardStats,
    getAnalytics: state => state.analytics,
    getSystemHealth: state => state.systemHealth,
    
    // Data Lists
    getUsers: state => state.users,
    getChallenges: state => state.challenges,
    getEduContent: state => state.eduContent,
    getPosts: state => state.posts,
    
    // Pagination
    getUsersPagination: state => state.usersPagination,
    getChallengesPagination: state => state.challengesPagination,
    getContentPagination: state => state.contentPagination,
    getPostsPagination: state => state.postsPagination,
    
    // Loading States
    isLoading: state => resource => state.loading[resource] || false,
    isAnyLoading: state => Object.values(state.loading).some(loading => loading),
    
    // Filters
    getUsersFilter: state => state.filters.users,
    getChallengesFilter: state => state.filters.challenges,
    getContentFilter: state => state.filters.content,
    getPostsFilter: state => state.filters.posts,
    
    // Statistics
    getTotalUsers: state => state.dashboardStats.totalUsers,
    getActiveUsers: state => state.dashboardStats.activeUsers,
    getUserGrowthRate: state => state.dashboardStats.userGrowth,
    
    // Reports
    getReport: state => type => state.reports[type] || null,
    
    // Error Handling
    getError: state => resource => state.errors[resource] || null,
    hasError: state => resource => !!state.errors[resource]
  },
  
  mutations: {
    // Loading States
    SET_LOADING(state, { resource, loading }) {
      state.loading[resource] = loading
    },
    
    // Dashboard Stats
    SET_DASHBOARD_STATS(state, stats) {
      state.dashboardStats = { ...state.dashboardStats, ...stats }
    },
    
    // Analytics
    SET_ANALYTICS(state, analytics) {
      state.analytics = { ...state.analytics, ...analytics }
    },
    
    // Users
    SET_USERS(state, { users, pagination }) {
      state.users = users
      if (pagination) {
        state.usersPagination = pagination
      }
    },
    
    ADD_USER(state, user) {
      state.users.unshift(user)
      state.usersPagination.total += 1
    },
    
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(user => user._id === updatedUser._id)
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser)
      }
    },
    
    REMOVE_USER(state, userId) {
      state.users = state.users.filter(user => user._id !== userId)
      state.usersPagination.total -= 1
    },
    
    // Challenges
    SET_CHALLENGES(state, { challenges, pagination }) {
      state.challenges = challenges
      if (pagination) {
        state.challengesPagination = pagination
      }
    },
    
    ADD_CHALLENGE(state, challenge) {
      state.challenges.unshift(challenge)
      state.challengesPagination.total += 1
    },
    
    UPDATE_CHALLENGE(state, updatedChallenge) {
      const index = state.challenges.findIndex(challenge => challenge._id === updatedChallenge._id)
      if (index !== -1) {
        state.challenges.splice(index, 1, updatedChallenge)
      }
    },
    
    REMOVE_CHALLENGE(state, challengeId) {
      state.challenges = state.challenges.filter(challenge => challenge._id !== challengeId)
      state.challengesPagination.total -= 1
    },
    
    // Educational Content
    SET_EDU_CONTENT(state, { eduContent, pagination }) {
      state.eduContent = eduContent
      if (pagination) {
        state.contentPagination = pagination
      }
    },
    
    ADD_EDU_CONTENT(state, content) {
      state.eduContent.unshift(content)
      state.contentPagination.total += 1
    },
    
    UPDATE_EDU_CONTENT(state, updatedContent) {
      const index = state.eduContent.findIndex(content => content._id === updatedContent._id)
      if (index !== -1) {
        state.eduContent.splice(index, 1, updatedContent)
      }
    },
    
    REMOVE_EDU_CONTENT(state, contentId) {
      state.eduContent = state.eduContent.filter(content => content._id !== contentId)
      state.contentPagination.total -= 1
    },
    
    // Posts
    SET_POSTS(state, { posts, pagination }) {
      state.posts = posts
      if (pagination) {
        state.postsPagination = pagination
      }
    },
    
    REMOVE_POST(state, postId) {
      state.posts = state.posts.filter(post => post._id !== postId)
      state.postsPagination.total -= 1
    },
    
    // Filters
    SET_USERS_FILTER(state, filter) {
      state.filters.users = { ...state.filters.users, ...filter }
    },
    
    SET_CHALLENGES_FILTER(state, filter) {
      state.filters.challenges = { ...state.filters.challenges, ...filter }
    },
    
    SET_CONTENT_FILTER(state, filter) {
      state.filters.content = { ...state.filters.content, ...filter }
    },
    
    SET_POSTS_FILTER(state, filter) {
      state.filters.posts = { ...state.filters.posts, ...filter }
    },
    
    RESET_FILTERS(state, type) {
      switch (type) {
        case 'users':
          state.filters.users = {
            search: '',
            role: '',
            level: '',
            status: '',
            sort: '-createdAt'
          }
          break
        case 'challenges':
          state.filters.challenges = {
            search: '',
            status: '',
            category: '',
            difficulty: '',
            sort: '-createdAt'
          }
          break
        case 'content':
          state.filters.content = {
            search: '',
            type: '',
            category: '',
            status: '',
            sort: '-createdAt'
          }
          break
        case 'posts':
          state.filters.posts = {
            search: '',
            reported: false,
            sort: '-createdAt'
          }
          break
      }
    },
    
    // System Health
    SET_SYSTEM_HEALTH(state, health) {
      state.systemHealth = health
    },
    
    // Reports
    SET_REPORT(state, { type, data }) {
      state.reports[type] = data
    },
    
    // Error Handling
    SET_ERROR(state, { resource, error }) {
      state.errors[resource] = error
    },
    
    CLEAR_ERROR(state, resource) {
      delete state.errors[resource]
    },
    
    CLEAR_ALL_ERRORS(state) {
      state.errors = {}
    }
  },
  
  actions: {
    // Dashboard Actions
    async loadDashboardStats({ commit }) {
      commit('SET_LOADING', { resource: 'dashboard', loading: true })
      commit('CLEAR_ERROR', 'dashboard')
      
      try {
        const stats = await adminService.getDashboardStats()
        commit('SET_DASHBOARD_STATS', stats)
      } catch (error) {
        commit('SET_ERROR', { resource: 'dashboard', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'dashboard', loading: false })
      }
    },
    
    async loadAnalytics({ commit }, period = '7d') {
      commit('SET_LOADING', { resource: 'analytics', loading: true })
      commit('CLEAR_ERROR', 'analytics')
      
      try {
        const analytics = await adminService.getAnalytics(period)
        commit('SET_ANALYTICS', analytics)
      } catch (error) {
        commit('SET_ERROR', { resource: 'analytics', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'analytics', loading: false })
      }
    },
    
    // User Management Actions
    async loadUsers({ commit, state }, params = {}) {
      commit('SET_LOADING', { resource: 'users', loading: true })
      commit('CLEAR_ERROR', 'users')
      
      try {
        const queryParams = {
          ...state.filters.users,
          ...params
        }
        const data = await adminService.getUsers(queryParams)
        commit('SET_USERS', data)
      } catch (error) {
        commit('SET_ERROR', { resource: 'users', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'users', loading: false })
      }
    },
    
    async updateUserRole({ commit }, { userId, role }) {
      try {
        const response = await adminService.updateUserRole(userId, role)
        commit('UPDATE_USER', response.data.user)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async deleteUser({ commit }, userId) {
      try {
        const response = await adminService.deleteUser(userId)
        commit('REMOVE_USER', userId)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async suspendUser({ commit }, { userId, suspended, reason }) {
      try {
        const response = await adminService.suspendUser(userId, suspended, reason)
        commit('UPDATE_USER', response.data.user)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // Challenge Management Actions
    async loadChallenges({ commit, state }, params = {}) {
      commit('SET_LOADING', { resource: 'challenges', loading: true })
      commit('CLEAR_ERROR', 'challenges')
      
      try {
        const queryParams = {
          ...state.filters.challenges,
          ...params
        }
        const data = await adminService.getChallenges(queryParams)
        commit('SET_CHALLENGES', data)
      } catch (error) {
        commit('SET_ERROR', { resource: 'challenges', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'challenges', loading: false })
      }
    },
    
    async createChallenge({ commit }, challengeData) {
      try {
        const response = await adminService.createChallenge(challengeData)
        commit('ADD_CHALLENGE', response.data.challenge)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async updateChallenge({ commit }, { challengeId, challengeData }) {
      try {
        const response = await adminService.updateChallenge(challengeId, challengeData)
        commit('UPDATE_CHALLENGE', response.data.challenge)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async deleteChallenge({ commit }, challengeId) {
      try {
        const response = await adminService.deleteChallenge(challengeId)
        commit('REMOVE_CHALLENGE', challengeId)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async toggleChallengeFeatured({ commit }, challengeId) {
      try {
        const response = await adminService.toggleChallengeFeatured(challengeId)
        commit('UPDATE_CHALLENGE', response.data.challenge)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // Educational Content Actions
    async loadEduContent({ commit, state }, params = {}) {
      commit('SET_LOADING', { resource: 'content', loading: true })
      commit('CLEAR_ERROR', 'content')
      
      try {
        const queryParams = {
          ...state.filters.content,
          ...params
        }
        const data = await adminService.getEduContent(queryParams)
        commit('SET_EDU_CONTENT', data)
      } catch (error) {
        commit('SET_ERROR', { resource: 'content', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'content', loading: false })
      }
    },
    
    async createEduContent({ commit }, contentData) {
      try {
        const response = await adminService.createEduContent(contentData)
        commit('ADD_EDU_CONTENT', response.data.eduContent)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async updateEduContent({ commit }, { contentId, contentData }) {
      try {
        const response = await adminService.updateEduContent(contentId, contentData)
        commit('UPDATE_EDU_CONTENT', response.data.eduContent)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async deleteEduContent({ commit }, contentId) {
      try {
        const response = await adminService.deleteEduContent(contentId)
        commit('REMOVE_EDU_CONTENT', contentId)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async toggleContentFeatured({ commit }, contentId) {
      try {
        const response = await adminService.toggleContentFeatured(contentId)
        commit('UPDATE_EDU_CONTENT', response.data.eduContent)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async updateContentStatus({ commit }, { contentId, status }) {
      try {
        const response = await adminService.updateContentStatus(contentId, status)
        commit('UPDATE_EDU_CONTENT', response.data.eduContent)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // Posts Management Actions
    async loadPosts({ commit, state }, params = {}) {
      commit('SET_LOADING', { resource: 'posts', loading: true })
      commit('CLEAR_ERROR', 'posts')
      
      try {
        const queryParams = {
          ...state.filters.posts,
          ...params
        }
        const data = await adminService.getPosts(queryParams)
        commit('SET_POSTS', data)
      } catch (error) {
        commit('SET_ERROR', { resource: 'posts', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'posts', loading: false })
      }
    },
    
    async deletePost({ commit }, postId) {
      try {
        const response = await adminService.deletePost(postId)
        commit('REMOVE_POST', postId)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // Filter Actions
    updateUsersFilter({ commit }, filter) {
      commit('SET_USERS_FILTER', filter)
    },
    
    updateChallengesFilter({ commit }, filter) {
      commit('SET_CHALLENGES_FILTER', filter)
    },
    
    updateContentFilter({ commit }, filter) {
      commit('SET_CONTENT_FILTER', filter)
    },
    
    updatePostsFilter({ commit }, filter) {
      commit('SET_POSTS_FILTER', filter)
    },
    
    resetFilters({ commit }, type) {
      commit('RESET_FILTERS', type)
    },
    
    // Bulk Actions
    async performBulkAction({ dispatch }, { action, type, ids, data }) {
      try {
        const response = await adminService.performBulkAction(action, type, ids, data)
        
        // Reload data after bulk action
        switch (type) {
          case 'users':
            await dispatch('loadUsers')
            break
          case 'challenges':
            await dispatch('loadChallenges')
            break
          case 'edu-content':
            await dispatch('loadEduContent')
            break
          case 'posts':
            await dispatch('loadPosts')
            break
        }
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    // Reports
    async generateReport({ commit }, { type, params }) {
      commit('SET_LOADING', { resource: 'reports', loading: true })
      commit('CLEAR_ERROR', 'reports')
      
      try {
        const report = await adminService.generateReport(type, params)
        commit('SET_REPORT', { type, data: report })
        return report
      } catch (error) {
        commit('SET_ERROR', { resource: 'reports', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'reports', loading: false })
      }
    },
    
    // System Health
    async loadSystemHealth({ commit }) {
      commit('SET_LOADING', { resource: 'system', loading: true })
      commit('CLEAR_ERROR', 'system')
      
      try {
        const health = await adminService.getSystemHealth()
        commit('SET_SYSTEM_HEALTH', health)
      } catch (error) {
        commit('SET_ERROR', { resource: 'system', error: error.message })
        throw error
      } finally {
        commit('SET_LOADING', { resource: 'system', loading: false })
      }
    },
    
    // Search and Pagination Actions
    async searchUsers({ dispatch }, searchQuery) {
      await dispatch('updateUsersFilter', { search: searchQuery, page: 1 })
      await dispatch('loadUsers')
    },
    
    async searchChallenges({ dispatch }, searchQuery) {
      await dispatch('updateChallengesFilter', { search: searchQuery, page: 1 })
      await dispatch('loadChallenges')
    },
    
    async searchContent({ dispatch }, searchQuery) {
      await dispatch('updateContentFilter', { search: searchQuery, page: 1 })
      await dispatch('loadEduContent')
    },
    
    async searchPosts({ dispatch }, searchQuery) {
      await dispatch('updatePostsFilter', { search: searchQuery, page: 1 })
      await dispatch('loadPosts')
    },
    
    async changeUsersPage({ dispatch }, page) {
      await dispatch('loadUsers', { page })
    },
    
    async changeChallengesPage({ dispatch }, page) {
      await dispatch('loadChallenges', { page })
    },
    
    async changeContentPage({ dispatch }, page) {
      await dispatch('loadEduContent', { page })
    },
    
    async changePostsPage({ dispatch }, page) {
      await dispatch('loadPosts', { page })
    },
    
    // Sort Actions
    async sortUsers({ dispatch }, { column, direction }) {
      const sort = direction === 'asc' ? column : `-${column}`
      await dispatch('updateUsersFilter', { sort, page: 1 })
      await dispatch('loadUsers')
    },
    
    async sortChallenges({ dispatch }, { column, direction }) {
      const sort = direction === 'asc' ? column : `-${column}`
      await dispatch('updateChallengesFilter', { sort, page: 1 })
      await dispatch('loadChallenges')
    },
    
    async sortContent({ dispatch }, { column, direction }) {
      const sort = direction === 'asc' ? column : `-${column}`
      await dispatch('updateContentFilter', { sort, page: 1 })
      await dispatch('loadEduContent')
    },
    
    async sortPosts({ dispatch }, { column, direction }) {
      const sort = direction === 'asc' ? column : `-${column}`
      await dispatch('updatePostsFilter', { sort, page: 1 })
      await dispatch('loadPosts')
    },
    
    // Error Handling Actions
    clearError({ commit }, resource) {
      commit('CLEAR_ERROR', resource)
    },
    
    clearAllErrors({ commit }) {
      commit('CLEAR_ALL_ERRORS')
    },
    
    // Utility Actions
    async refreshData({ dispatch }, sections = ['dashboard', 'users', 'challenges', 'content']) {
      const promises = []
      
      if (sections.includes('dashboard')) {
        promises.push(dispatch('loadDashboardStats'))
      }
      if (sections.includes('users')) {
        promises.push(dispatch('loadUsers'))
      }
      if (sections.includes('challenges')) {
        promises.push(dispatch('loadChallenges'))
      }
      if (sections.includes('content')) {
        promises.push(dispatch('loadEduContent'))
      }
      if (sections.includes('posts')) {
        promises.push(dispatch('loadPosts'))
      }
      
      await Promise.allSettled(promises)
    },
    
    // Initialize Admin Data
    async initializeAdmin({ dispatch }) {
      await Promise.allSettled([
        dispatch('loadDashboardStats'),
        dispatch('loadUsers', { page: 1, limit: 10 }),
        dispatch('loadChallenges', { page: 1, limit: 10 }),
        dispatch('loadEduContent', { page: 1, limit: 10 })
      ])
    }
  }
}