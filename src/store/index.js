// src/store/index.js 
import { createStore } from 'vuex'
import user from './modules/user'
import challenges from './modules/challenges'
import forest from './modules/forest'
import community from './modules/community'
import admin from './modules/admin' // Import admin module
import submissions from './modules/submissions' // Add submissions module import

export default createStore({
  state: {
    appName: 'EcoQuest',
    isLoading: false,
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true' || false,
    notifications: [],
    onlineStatus: navigator.onLine,
    lastActivity: new Date(),
    appVersion: '1.0.0'
  },
  
  getters: {
    getAppName: state => state.appName,
    getLoadingStatus: state => state.isLoading,
    getDarkMode: state => state.darkMode,
    getSidebarCollapsed: state => state.sidebarCollapsed,
    getNotifications: state => state.notifications,
    getOnlineStatus: state => state.onlineStatus,
    getLastActivity: state => state.lastActivity,
    getAppVersion: state => state.appVersion,
    
    // Computed getters
    hasUnreadNotifications: state => state.notifications.some(n => !n.read),
    unreadNotificationCount: state => state.notifications.filter(n => !n.read).length,
    isOffline: state => !state.onlineStatus
  },
  
  mutations: {
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    
    TOGGLE_DARK_MODE(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
      
      // Apply dark mode to document
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    SET_DARK_MODE(state, enabled) {
      state.darkMode = enabled
      localStorage.setItem('darkMode', enabled)
      
      if (enabled) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed)
    },
    
    SET_SIDEBAR_COLLAPSED(state, collapsed) {
      state.sidebarCollapsed = collapsed
      localStorage.setItem('sidebarCollapsed', collapsed)
    },
    
    ADD_NOTIFICATION(state, notification) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        type: 'info',
        title: '',
        message: '',
        timeout: 5000,
        persistent: false,
        read: false,
        createdAt: new Date(),
        ...notification
      }
      
      state.notifications.unshift(newNotification)
      
      // Limit notifications to prevent memory issues
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(notification => notification.id !== id)
    },
    
    MARK_NOTIFICATION_READ(state, id) {
      const notification = state.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },
    
    MARK_ALL_NOTIFICATIONS_READ(state) {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    
    CLEAR_NOTIFICATIONS(state) {
      state.notifications = []
    },
    
    SET_ONLINE_STATUS(state, status) {
      state.onlineStatus = status
    },
    
    UPDATE_LAST_ACTIVITY(state) {
      state.lastActivity = new Date()
    }
  },
  
  actions: {
    // Loading management
    setLoading({ commit }, status) {
      commit('SET_LOADING', status)
    },
    
    // Theme management
    toggleDarkMode({ commit }) {
      commit('TOGGLE_DARK_MODE')
    },
    
    setDarkMode({ commit }, enabled) {
      commit('SET_DARK_MODE', enabled)
    },
    
    initializeTheme({ commit, state }) {
      // Initialize theme based on system preference if not set
      if (!localStorage.getItem('darkMode')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        commit('SET_DARK_MODE', prefersDark)
      } else {
        // Apply stored theme
        commit('SET_DARK_MODE', state.darkMode)
      }
    },
    
    // Sidebar management
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    
    setSidebarCollapsed({ commit }, collapsed) {
      commit('SET_SIDEBAR_COLLAPSED', collapsed)
    },
    
    // Notification management
    addNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
      
      // Auto-remove notification after timeout (unless persistent)
      if (!notification.persistent && notification.timeout > 0) {
        setTimeout(() => {
          commit('REMOVE_NOTIFICATION', notification.id || Date.now())
        }, notification.timeout)
      }
    },
    
    removeNotification({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id)
    },
    
    markNotificationRead({ commit }, id) {
      commit('MARK_NOTIFICATION_READ', id)
    },
    
    markAllNotificationsRead({ commit }) {
      commit('MARK_ALL_NOTIFICATIONS_READ')
    },
    
    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS')
    },
    
    // Show different types of notifications
    showSuccess({ dispatch }, message) {
      dispatch('addNotification', {
        type: 'success',
        message,
        timeout: 3000
      })
    },
    
    showError({ dispatch }, message) {
      dispatch('addNotification', {
        type: 'error',
        message,
        timeout: 5000
      })
    },
    
    showWarning({ dispatch }, message) {
      dispatch('addNotification', {
        type: 'warning',
        message,
        timeout: 4000
      })
    },
    
    showInfo({ dispatch }, message) {
      dispatch('addNotification', {
        type: 'info',
        message,
        timeout: 3000
      })
    },
    
    // Connection status management
    setOnlineStatus({ commit }, status) {
      commit('SET_ONLINE_STATUS', status)
    },
    
    handleOnline({ dispatch, commit }) {
      commit('SET_ONLINE_STATUS', true)
      dispatch('addNotification', {
        type: 'success',
        message: 'Connection restored',
        timeout: 2000
      })
    },
    
    handleOffline({ dispatch, commit }) {
      commit('SET_ONLINE_STATUS', false)
      dispatch('addNotification', {
        type: 'warning',
        message: 'Connection lost. Some features may be unavailable.',
        timeout: 5000
      })
    },
    
    // Activity tracking
    updateLastActivity({ commit }) {
      commit('UPDATE_LAST_ACTIVITY')
    },
    
    // App initialization
    async initializeApp({ dispatch, commit }) {
      try {
        // Initialize theme
        dispatch('initializeTheme')
        
        // Set up event listeners for online/offline
        window.addEventListener('online', () => dispatch('handleOnline'))
        window.addEventListener('offline', () => dispatch('handleOffline'))
        
        // Set up activity tracking
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
        const throttledUpdateActivity = this.throttle(() => dispatch('updateLastActivity'), 60000) // Update every minute
        
        activityEvents.forEach(event => {
          document.addEventListener(event, throttledUpdateActivity, true)
        })
        
        // Initialize user authentication if token exists
        if (localStorage.getItem('ecoquest_token')) {
          await dispatch('user/initializeAuth')
        }
        
        dispatch('addNotification', {
          type: 'success',
          message: 'Welcome to EcoQuest!',
          timeout: 3000
        })
        
      } catch (error) {
        console.error('App initialization error:', error)
        dispatch('addNotification', {
          type: 'error',
          message: 'Failed to initialize application',
          timeout: 5000
        })
      }
    },
    
    // Global error handler
    handleGlobalError({ dispatch }, error) {
      console.error('Global error:', error)
      
      let message = 'An unexpected error occurred'
      
      if (error.response) {
        // HTTP error
        message = error.response.data?.message || `HTTP ${error.response.status} Error`
      } else if (error.message) {
        message = error.message
      }
      
      dispatch('addNotification', {
        type: 'error',
        message,
        timeout: 5000
      })
    },
    
    // Performance monitoring
    reportPerformance({ dispatch }, metrics) {
      // Log performance metrics
      console.log('Performance metrics:', metrics)
      
      // Show warning if performance is poor
      if (metrics.loadTime > 5000) {
        dispatch('addNotification', {
          type: 'warning',
          message: 'Slow loading detected. Check your connection.',
          timeout: 4000
        })
      }
    }
  },
  
  modules: {
    user,
    challenges,
    forest,
    community,
    admin, // Add admin module
    submissions // Add submissions module
  },
  
  plugins: [
    // Plugin untuk persist some state
    (store) => {
      // Subscribe to mutations
      store.subscribe((mutation, state) => {
        // Save certain state to localStorage
        if (mutation.type === 'SET_DARK_MODE') {
          localStorage.setItem('darkMode', state.darkMode)
        }
        if (mutation.type === 'SET_SIDEBAR_COLLAPSED') {
          localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed)
        }
      })
      
      // Initialize state from localStorage
      const savedDarkMode = localStorage.getItem('darkMode')
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      
      if (savedDarkMode !== null) {
        store.commit('SET_DARK_MODE', savedDarkMode === 'true')
      }
      
      if (savedSidebarState !== null) {
        store.commit('SET_SIDEBAR_COLLAPSED', savedSidebarState === 'true')
      }
    },
    
    // Plugin untuk development tools
    ...(process.env.NODE_ENV === 'development' ? [
      (store) => {
        // Development-only features
        window.__ECOQUEST_STORE__ = store
        
        // Log all mutations in development
        store.subscribe((mutation, state) => {
          console.groupCollapsed(`Mutation: ${mutation.type}`)
          console.log('Payload:', mutation.payload)
          console.log('State:', state)
          console.groupEnd()
        })
      }
    ] : [])
  ],
  
  // Store configuration
  strict: process.env.NODE_ENV !== 'production',
  
  // Helper methods (if needed)
  helpers: {
    throttle(func, limit) {
      let inThrottle
      return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
          func.apply(context, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    },
    
    debounce(func, wait, immediate) {
      let timeout
      return function() {
        const context = this
        const args = arguments
        const later = function() {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }
  }
})

// Export helper for accessing store in non-Vue contexts
export const storeHelper = {
  getStore() {
    return store
  },
  
  dispatch(action, payload) {
    return store.dispatch(action, payload)
  },
  
  commit(mutation, payload) {
    return store.commit(mutation, payload)
  },
  
  getState() {
    return store.state
  },
  
  getGetters() {
    return store.getters
  }
}