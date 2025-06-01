<!-- src\components\Layout\MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- Navigation Header -->
    <header class="main-header" :class="{ 'scrolled': isScrolled }">
      <div class="header-container">
        <!-- Logo and Brand -->
        <div class="header-brand">
          <router-link to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">EcoQuest</span>
              <span class="brand-tagline">Green Challenge</span>
            </div>
          </router-link>
        </div>

        <!-- Navigation Menu -->
        <nav class="main-nav" :class="{ 'nav-open': showMobileNav }">
          <div class="nav-links">
            <router-link to="/" class="nav-link" @click="closeMobileNav">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
              Home
            </router-link>
            
            <router-link to="/challenges" class="nav-link" @click="closeMobileNav">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" />
              </svg>
              Challenges
            </router-link>
            
            <router-link to="/education" class="nav-link" @click="closeMobileNav">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
              Education
            </router-link>
            
            <router-link to="/community" class="nav-link" @click="closeMobileNav">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5,12C19,12 22,13.34 22,15V17H20V15C20,14.41 18.57,14 16.5,14C17.71,13.1 18.5,11.65 18.5,10A4,4 0 0,0 14.5,6A4,4 0 0,0 10.5,10C10.5,11.65 11.29,13.1 12.5,14C10.43,14 9,14.41 9,15V17H7V15C7,13.34 10,12 12.5,12M12.5,4A2,2 0 0,1 14.5,6A2,2 0 0,1 12.5,8A2,2 0 0,1 10.5,6A2,2 0 0,1 12.5,4M7,13C9.21,13 11,12.79 11,12V10C11,9.21 9.21,8 7,8C4.79,8 3,9.21 3,10V12C3,12.79 4.79,13 7,13M7,6A2,2 0 0,1 9,8A2,2 0 0,1 7,10A2,2 0 0,1 5,8A2,2 0 0,1 7,6Z" />
              </svg>
              Community
            </router-link>
            
            <router-link to="/leaderboard" class="nav-link" @click="closeMobileNav">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,5V4A1,1 0 0,0 15,3H9A1,1 0 0,0 8,4V5H5V7H7V19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V7H19V5H16M9,5H15V7H9V5M9,9H11V17H9V9M13,9H15V17H13V9Z" />
              </svg>
              Leaderboard
            </router-link>
          </div>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <!-- Notifications (only for authenticated users) -->
          <UserNotifications v-if="isAuthenticated" />
          
          <!-- User Menu -->
          <div v-if="isAuthenticated" class="user-menu" ref="userMenuRef">
            <button @click="toggleUserMenu" class="user-menu-trigger">
              <img :src="currentUser?.avatar" :alt="currentUser?.username" class="user-avatar" />
              <span class="user-name">{{ currentUser?.username }}</span>
              <svg class="dropdown-icon" :class="{ 'rotated': showUserMenu }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,10L12,15L17,10H7Z" />
              </svg>
            </button>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="user-info">
                <img :src="currentUser?.avatar" :alt="currentUser?.username" class="user-avatar-large" />
                <div class="user-details">
                  <div class="user-name-large">{{ currentUser?.username }}</div>
                  <div class="user-level">Level {{ currentUser?.gameStats?.level || 1 }}</div>
                  <div class="user-points">{{ formatNumber(currentUser?.gameStats?.totalPoints || 0) }} points</div>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
                My Profile
              </router-link>
              
              <!-- Add to navigation links -->
<router-link to="/my-submissions" class="nav-link">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
  My Submissions
</router-link>
              
              <router-link to="/forest" class="dropdown-item" @click="closeUserMenu">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
                My Forest
              </router-link>
              
              <div class="dropdown-divider"></div>
              
              <router-link v-if="isAdmin" to="/admin" class="dropdown-item admin" @click="closeUserMenu">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H16V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z" />
                </svg>
                Admin Dashboard
              </router-link>
              
              <button @click="logout" class="dropdown-item logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
          
          <!-- Auth Buttons (for guests) -->
          <div v-else class="auth-buttons">
            <router-link to="/login" class="btn btn-outline">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Register</router-link>
          </div>
          
          <!-- Mobile Menu Toggle -->
          <button @click="toggleMobileNav" class="mobile-menu-toggle">
            <svg v-if="!showMobileNav" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Overlay -->
    <div v-if="showMobileNav" class="mobile-nav-overlay" @click="closeMobileNav"></div>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-brand">
              <div class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
              </div>
              <span class="brand-name">EcoQuest</span>
            </div>
            <p class="footer-description">
              Join the environmental movement. Complete challenges, learn about sustainability, and make a positive impact on our planet.
            </p>
          </div>
          
          <div class="footer-section">
            <h4>Platform</h4>
            <ul class="footer-links">
              <li><router-link to="/challenges">Challenges</router-link></li>
              <li><router-link to="/education">Education</router-link></li>
              <li><router-link to="/community">Community</router-link></li>
              <li><router-link to="/leaderboard">Leaderboard</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Support</h4>
            <ul class="footer-links">
              <li><router-link to="/help">Help & FAQ</router-link></li>
              <li><router-link to="/about">About Us</router-link></li>
              <li><router-link to="/privacy">Privacy Policy</router-link></li>
              <li><router-link to="/terms">Terms of Service</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Connect</h4>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001zM8.449 2.982c.259-.002.704-.007 1.26-.007 2.739.003 5.497.001 8.238.001.907.002 1.798.096 2.634.269 1.27.263 2.438.77 3.467 1.518 1.029.747 1.901 1.67 2.634 2.634.748 1.029 1.255 2.197 1.518 3.467.263.836.367 1.727.269 2.634-.001 2.741-.001 5.499-.001 8.238 0 .556.005 1.001.007 1.26-.261 6.621-5.628 11.988-12.249 11.988s-11.988-5.367-11.988-11.988c0-6.62 5.367-11.987 11.988-11.987z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2024 EcoQuest. All rights reserved.</p>
          </div>
          <div class="footer-meta">
            <span>Made with 💚 for the environment</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserNotifications from '@/components/User/UserNotifications.vue'

export default {
  name: 'MainLayout',
  components: {
    UserNotifications
  },
  data() {
    return {
      isScrolled: false,
      showMobileNav: false,
      showUserMenu: false
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated',
      currentUser: 'user/getCurrentUser'
    }),
    
    isAdmin() {
      return this.currentUser?.role === 'admin'
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    ...mapActions({
      logoutUser: 'user/logout'
    }),
    
    handleScroll() {
      this.isScrolled = window.scrollY > 20
    },
    
    toggleMobileNav() {
      this.showMobileNav = !this.showMobileNav
      document.body.style.overflow = this.showMobileNav ? 'hidden' : ''
    },
    
    closeMobileNav() {
      this.showMobileNav = false
      document.body.style.overflow = ''
    },
    
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    
    closeUserMenu() {
      this.showUserMenu = false
    },
    
    handleClickOutside(event) {
      if (this.$refs.userMenuRef && !this.$refs.userMenuRef.contains(event.target)) {
        this.showUserMenu = false
      }
    },
    
    async logout() {
      try {
        await this.logoutUser()
        this.closeUserMenu()
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Successfully logged out',
          timeout: 3000
        })
        this.$router.push('/')
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Error logging out',
          timeout: 3000
        })
      }
    },
    
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>

<style scoped>
/* Main Layout */
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
}

/* Header */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.main-header.scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

/* Brand */
.header-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.brand-tagline {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Navigation */
.main-nav {
  flex: 1;
  margin: 0 40px;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #1976d2;
  background: #f0f8ff;
}

.nav-link.router-link-active {
  color: #1976d2;
  background: #e3f2fd;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #1976d2;
  border-radius: 50%;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #e1e8ed;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-menu-trigger:hover {
  border-color: #1976d2;
  background: #f0f8ff;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.dropdown-icon {
  transition: transform 0.2s ease;
  color: #666;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 16px 0;
  margin-top: 8px;
  z-index: 1000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px 16px;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name-large {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.user-level {
  font-size: 12px;
  color: #1976d2;
  font-weight: 500;
}

.user-points {
  font-size: 12px;
  color: #666;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #1a1a1a;
}

.dropdown-item.admin {
  color: #1976d2;
}

.dropdown-item.admin:hover {
  background: #f0f8ff;
  color: #1565c0;
}

.dropdown-item.logout {
  color: #d32f2f;
}

.dropdown-item.logout:hover {
  background: #ffebee;
  color: #b71c1c;
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn-outline {
  background: transparent;
  border-color: #e1e8ed;
  color: #666;
}

.btn-outline:hover {
  border-color: #1976d2;
  color: #1976d2;
  background: #f0f8ff;
}

.btn-primary {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  transform: translateY(-1px);
}

/* Mobile Menu */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-menu-toggle:hover {
  color: #1976d2;
  background: #f0f8ff;
}

.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
}

/* Footer */
.main-footer {
  background: #1a1a1a;
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.footer-brand .brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.footer-brand .brand-name {
  font-size: 18px;
  font-weight: 700;
}

.footer-description {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 14px;
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #4CAF50;
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.footer-copyright p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.footer-meta {
  color: #999;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .main-nav {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 95;
    margin: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-nav.nav-open {
    transform: translateX(0);
  }
  
  .nav-links {
    flex-direction: column;
    padding: 20px;
    gap: 0;
  }
  
  .nav-link {
    width: 100%;
    padding: 16px 20px;
    border-radius: 0;
    border-bottom: 1px solid #f0f0f0;
    justify-content: flex-start;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .user-name {
    display: none;
  }
  
  .auth-buttons {
    gap: 4px;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .header-container {
    height: 70px;
  }
  
  .main-content {
    padding-top: 70px;
  }
  
  .brand-text {
    display: none;
  }
  
  .brand-icon {
    width: 36px;
    height: 36px;
  }
  
  .user-dropdown {
    width: 260px;
    right: -20px;
  }
  
  .footer-container {
    padding: 32px 16px 16px;
  }
}
</style>