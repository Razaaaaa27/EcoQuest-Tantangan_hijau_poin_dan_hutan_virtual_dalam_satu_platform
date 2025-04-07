import { createStore } from 'vuex'
import user from './modules/user'
import challenges from './modules/challenges'
import forest from './modules/forest'
import community from './modules/community'

export default createStore({
  state: {
    appName: 'EcoQuest',
    isLoading: false,
    darkMode: false,
    notifications: []
  },
  getters: {
    getAppName: state => state.appName,
    getLoadingStatus: state => state.isLoading,
    getDarkMode: state => state.darkMode,
    getNotifications: state => state.notifications
  },
  mutations: {
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    TOGGLE_DARK_MODE(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push(notification)
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(notification => notification.id !== id)
    }
  },
  actions: {
    setLoading({ commit }, status) {
      commit('SET_LOADING', status)
    },
    toggleDarkMode({ commit }) {
      commit('TOGGLE_DARK_MODE')
    },
    addNotification({ commit }, notification) {
      const id = Date.now()
      commit('ADD_NOTIFICATION', { id, ...notification })
      
      if (notification.timeout !== 0) {
        setTimeout(() => {
          commit('REMOVE_NOTIFICATION', id)
        }, notification.timeout || 3000)
      }
    },
    removeNotification({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id)
    }
  },
  modules: {
    user,
    challenges,
    forest,
    community
  }
})