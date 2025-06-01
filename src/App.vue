<template>
  <div class="app">
    <!-- Conditional Navbar - hanya muncul jika bukan halaman auth -->
    <Navbar v-if="!isAuthPage" />
    
    <main class="main-content" :class="{ 'auth-page': isAuthPage }">
      <router-view />
    </main>
    
    <!-- Conditional Footer - hanya muncul jika bukan halaman auth -->
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  computed: {
    isAuthPage() {
      // Daftar route yang tidak memerlukan navbar/footer
      const authRoutes = ['/login', '/register', '/forgot-password']
      return authRoutes.includes(this.$route.path)
    }
  },
  watch: {
    // Watch route changes untuk memastikan reactivity
    '$route'() {
      // Trigger re-evaluation of computed properties
    }
  }
}
</script>

<style>
@import './styles/main.css';

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 60px; /* Height of the navbar untuk halaman normal */
  transition: padding-top 0.3s ease;
}



/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    padding-top: 50px; /* Adjust for mobile navbar height */
  }
  
  .main-content.auth-page {
    padding-top: 0;
  }
}
</style>