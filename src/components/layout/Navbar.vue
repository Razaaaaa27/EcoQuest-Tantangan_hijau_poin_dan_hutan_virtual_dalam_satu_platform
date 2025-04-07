<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <router-link to="/" class="navbar-logo">
        <img src="@/assets/images/logo2.svg" alt="EcoQuest Logo" />
        <span>EcoQuest</span>
      </router-link>
      
      <div class="navbar-nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path" 
          class="nav-link" 
          :class="{ 'active': isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="flex items-center gap-4">
        <button 
          class="btn btn-sm btn-outline"
          @click="toggleDarkMode"
        >
          <span v-if="darkMode">☀️</span>
          <span v-else>🌙</span>
        </button>
        
        <router-link to="/profile" class="flex items-center gap-2">
          <img :src="userAvatar" alt="User Avatar" class="avatar avatar-sm" />
          <span class="hidden md:inline">{{ username }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Navbar',
  data() {
    return {
      navItems: [
        { name: 'Beranda', path: '/' },
        { name: 'Tantangan', path: '/challenges' },
        { name: 'Papan Skor', path: '/leaderboard' },
        { name: 'Hutan Virtual', path: '/forest' },
        { name: 'Komunitas', path: '/community' },
        { name: 'EcoEdu', path: '/ecoedu' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      darkMode: 'getDarkMode',
      currentUser: 'user/getCurrentUser'
    }),
    username() {
      return this.currentUser ? this.currentUser.username : 'Tamu'
    },
    userAvatar() {
      return this.currentUser && this.currentUser.avatar 
        ? this.currentUser.avatar 
        : '/src/assets/images/avatars/default.jpg'
    }
  },
  methods: {
    ...mapActions({
      toggleDarkModeAction: 'toggleDarkMode'
    }),
    isActive(path) {
      if (path === '/' && this.$route.path !== '/') {
        return false
      }
      return this.$route.path.startsWith(path)
    },
    toggleDarkMode() {
      this.toggleDarkModeAction()
      
      // Apply dark mode class to body
      if (this.darkMode) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    }
  },
  mounted() {
    // Initialize dark mode from localStorage on page load
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode === 'true') {
      document.body.classList.add('dark-mode')
    }
  }
}
</script>

<style scoped>
/* Additional navbar styles can be added here */
@media (max-width: 768px) {
  .navbar-nav {
    gap: 0.75rem;
  }
  
  .nav-link {
    font-size: 0.875rem;
    padding: 0.375rem;
  }
}
</style>