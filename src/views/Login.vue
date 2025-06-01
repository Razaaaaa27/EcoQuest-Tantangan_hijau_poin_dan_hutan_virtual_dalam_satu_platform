<template>
  <div class="auth-page">
    <!-- Animated Background -->
    <div class="bg-animation">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <div class="auth-container">
      <div class="auth-card" :class="{ 'loading': loading }">
        <!-- Left Side - Branding -->
        <div class="left-side">
          <div class="branding-content">
            <div class="logo animate-fade-in-up">
              <div class="logo-icon">
                <img src="@/assets/images/logo2.svg" alt="EcoQuest Logo" />
              </div>
              <span>EcoQuest</span>
            </div>

            <h1 class="main-title animate-fade-in-up">
              Gabung<br>
              <span class="highlight animate-gradient">Tantangan Hijau</span><br>
              Hari Ini!
            </h1>

            <p class="description animate-fade-in-up">
              Bantu lingkungan melalui aksi nyata yang menyenangkan. 
              Dapatkan poin, tumbuhkan hutan virtual kamu, dan naik 
              peringkat!
            </p>

            <div class="stats animate-fade-in-up">
              <div class="stat" v-for="(stat, index) in stats" :key="index" :style="{ animationDelay: `${0.1 * index}s` }">
                <span class="stat-number animate-counter" :data-target="stat.number">0</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>

            <!-- Decorative Elements -->
            <div class="decorative-dots">
              <div class="dot" v-for="n in 20" :key="n" :style="{ animationDelay: `${Math.random() * 3}s` }"></div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="right-side">
          <div class="glass-overlay"></div>
          
          <div class="auth-header animate-slide-in-right">
            <h1 class="auth-title">Masuk ke Akun</h1>
            <p class="auth-subtitle">Lanjutkan perjalanan hijau Anda</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form animate-slide-in-right">
            <div class="form-group" :class="{ 'focused': focusedField === 'email', 'has-error': errors.email }">
              <label for="email" class="form-label">Email</label>
              <div class="input-wrapper">
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  v-model="form.email"
                  placeholder="Masukkan email Anda"
                  @focus="focusedField = 'email'"
                  @blur="focusedField = ''"
                  required
                />
                <div class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div class="input-effect"></div>
              </div>
              <transition name="error-fade">
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </transition>
            </div>

            <div class="form-group" :class="{ 'focused': focusedField === 'password', 'has-error': errors.password }">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  v-model="form.password"
                  placeholder="Masukkan password Anda"
                  @focus="focusedField = 'password'"
                  @blur="focusedField = ''"
                  required
                />
                <div class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <transition name="icon-flip" mode="out-in">
                    <svg v-if="showPassword" key="show" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else key="hide" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </transition>
                </button>
                <div class="input-effect"></div>
              </div>
              <transition name="error-fade">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </transition>
            </div>

            <div class="form-options">
              <label class="checkbox-label" :class="{ 'checked': form.rememberMe }">
                <input type="checkbox" v-model="form.rememberMe" />
                <span class="checkbox-custom">
                  <svg class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </span>
                <span>Ingat saya</span>
              </label>
              <router-link to="/forgot-password" class="forgot-link">Lupa password?</router-link>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <div class="btn-content">
                <transition name="loading-fade" mode="out-in">
                  <div v-if="loading" key="loading" class="loading-spinner"></div>
                  <span v-else key="text">Masuk</span>
                </transition>
              </div>
              <div class="btn-ripple" ref="ripple"></div>
            </button>

            <transition name="error-slide">
              <div v-if="errors.general" class="error-message error-general">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {{ errors.general }}
              </div>
            </transition>
          </form>

          <div class="auth-footer animate-slide-in-right">
            <p>Belum punya akun? <router-link to="/register" class="auth-link">Daftar di sini</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      showPassword: false,
      loading: false,
      errors: {},
      focusedField: '',
      stats: [
           { number: 17504, label: 'Pulau di Indonesia'  },
  { number: 108000, label: 'km Garis Pantai' },
  { number: 1500, label: 'Sungai Besar' }
      ]
    }
  },
  
  mounted() {
    this.animateCounters()
    this.initRippleEffect()
  },
  
  methods: {
    ...mapActions({
      login: 'user/login'
    }),

    async handleLogin(e) {
      this.createRipple(e)
      this.loading = true
      this.errors = {}

      try {
        await this.login({
          email: this.form.email,
          password: this.form.password
        })

        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Login berhasil! Selamat datang kembali.',
          timeout: 3000
        })

        const redirectTo = this.$route.query.redirect || '/'
        this.$router.push(redirectTo)

      } catch (error) {
        console.error('Login error:', error)
        
        if (error.errors) {
          error.errors.forEach(err => {
            this.errors[err.path] = err.msg
          })
        } else {
          this.errors.general = error.message || 'Login gagal. Silakan coba lagi.'
        }
      } finally {
        this.loading = false
      }
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },

    animateCounters() {
      const counters = document.querySelectorAll('.animate-counter')
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'))
        const duration = 2000
        const step = target / (duration / 16)
        let current = 0
        
        const timer = setInterval(() => {
          current += step
          if (current >= target) {
            counter.textContent = target.toLocaleString()
            clearInterval(timer)
          } else {
            counter.textContent = Math.floor(current).toLocaleString()
          }
        }, 16)
      })
    },

    initRippleEffect() {
      const btn = document.querySelector('.btn-primary')
      if (btn) {
        btn.addEventListener('click', this.createRipple)
      }
    },

    createRipple(e) {
      const btn = e.currentTarget
      const ripple = btn.querySelector('.btn-ripple')
      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      
      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.classList.add('animate')
      
      setTimeout(() => {
        ripple.classList.remove('animate')
      }, 600)
    }
  },

  watch: {
    'form.email'() {
      this.clearError('email')
    },
    'form.password'() {
      this.clearError('password')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Background Animation */
.auth-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f766e 75%, #059669 100%);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 95, 70, 0.05));
  border-radius: 50%;
  animation: float 20s infinite linear;
  backdrop-filter: blur(1px);
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: -5s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 10%;
  right: 30%;
  animation-delay: -10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: -15s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 40%;
  left: 50%;
  animation-delay: -8s;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
  25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
  50% { transform: translateY(0px) rotate(180deg); opacity: 0.8; }
  75% { transform: translateY(-15px) rotate(270deg); opacity: 0.6; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.5; }
}

/* Main Container */
.auth-container {
  width: 100%;
  max-width: 1000px;
  max-height: calc(100vh - 2rem);
  position: relative;
  z-index: 1;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(40px);
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-height: 100%;
  overflow: hidden;
  display: flex;
  min-height: 600px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-card.loading {
  transform: scale(0.99);
}

/* Left Side - Branding */
.left-side {
  flex: 1.2;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f766e 70%, #059669 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem;
  color: white;
  overflow: hidden;
  border-radius: 24px 0 0 24px;
}

.left-side::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(5, 150, 105, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(6, 95, 70, 0.1) 0%, transparent 50%);
}

.branding-content {
  position: relative;
  z-index: 2;
  max-width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.logo-icon img {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.logo span {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.highlight {
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
}

.animate-gradient {
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2rem;
  color: #e2e8f0;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat {
  text-align: left;
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #10b981;
  display: block;
  text-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.25rem;
  color: #cbd5e1;
}

/* Decorative Elements */
.decorative-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.dot {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  animation: twinkle 2s infinite;
}

.dot:nth-child(1) { top: 20%; left: 15%; }
.dot:nth-child(2) { top: 35%; right: 20%; }
.dot:nth-child(3) { bottom: 40%; left: 25%; }
.dot:nth-child(4) { top: 60%; right: 15%; }
.dot:nth-child(5) { bottom: 25%; right: 30%; }

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Right Side - Login Form */
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 0 24px 24px 0;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.auth-form {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

/* Form Styling */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-group.focused .form-label {
  color: #10b981;
  transform: translateY(-2px);
}

.form-group.has-error .form-label {
  color: #ef4444;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.025em;
}

.input-wrapper {
  position: relative;
}

.form-control {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.95); /* Increased opacity */
  backdrop-filter: blur(10px);
  color: #ffffff !important; /* Added !important to ensure visibility */
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; /* Ensure consistent font */
}

.form-control::placeholder {
  color: #9ca3af;
  font-weight: 400;
  opacity: 0.8; /* Added opacity for better visibility */
}

.form-control:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  background: rgba(255, 255, 255, 1); /* Full opacity on focus */
  transform: translateY(-1px);
  color: #1f2937 !important; /* Ensure text remains visible on focus */
}

.form-group.has-error .form-control {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
  background: rgba(255, 255, 255, 0.95); /* Maintain visibility even with error */
  color: #1f2937 !important;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-group.focused .input-icon {
  color: #10b981;
  transform: translateY(-50%) scale(1.1);
}

.input-effect {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #10b981, #34d399);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
  border-radius: 1px;
}

.form-group.focused .input-effect {
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-50%) scale(1.1);
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 500;
}

.error-general {
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #374151;
  user-select: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-label:hover {
  color: #10b981;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-label.checked .checkbox-custom {
  background: #10b981;
  border-color: #10b981;
  transform: scale(1.1);
}

.checkmark {
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-label.checked .checkmark {
  opacity: 1;
  transform: scale(1);
}

.forgot-link {
  color: #10b981;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.forgot-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #10b981, #34d399);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.forgot-link:hover {
  color: #047857;
  transform: translateY(-1px);
}

.forgot-link:hover::after {
  width: 100%;
}

/* Button Styling */
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.025em;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, #059669 0%, #065f46 100%);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

.btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  transform: scale(0);
  opacity: 1;
}

.btn-ripple.animate {
  animation: ripple 0.6s linear;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(243, 244, 246, 0.6);
  color: #6b7280;
  font-size: 0.85rem;
  position: relative;
  z-index: 2;
}

.auth-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.auth-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #10b981, #34d399);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-link:hover {
  color: #047857;
}

.auth-link:hover::after {
  width: 100%;
}

/* Animations */
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Transitions */
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.icon-flip-enter-active,
.icon-flip-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-flip-enter-from,
.icon-flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .auth-card {
    max-width: 800px;
    min-height: 550px;
  }
  
  .left-side {
    flex: 1;
    padding: 2.5rem;
  }
  
  .main-title {
    font-size: 2.25rem;
  }
  
  .stats {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .auth-page {
    padding: 0.5rem;
  }
  
  .auth-card {
    flex-direction: column;
    max-width: 450px;
    min-height: auto;
    border-radius: 20px;
  }
  
  .left-side {
    border-radius: 20px 20px 0 0;
    padding: 2rem;
    text-align: center;
    align-items: center;
    min-height: 300px;
  }

  .main-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .stats {
    gap: 1.25rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .right-side {
    border-radius: 0 0 20px 20px;
    padding: 2rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 0.25rem;
  }
  
  .auth-container {
    max-width: 380px;
  }
  
  .auth-card {
    border-radius: 16px;
    min-height: auto;
  }
  
  .left-side {
    padding: 1.5rem;
    min-height: 250px;
  }
  
  .right-side {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .logo span {
    font-size: 1.5rem;
  }
  
  .form-control {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
    font-size: 0.85rem;
  }
  
  .input-icon {
    left: 0.875rem;
    width: 16px;
    height: 16px;
  }
  
  .password-toggle {
    right: 0.875rem;
    padding: 0.375rem;
  }
  
  .stats {
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .shape {
    display: none;
  }
}

@media (max-width: 360px) {
  .auth-container {
    max-width: 340px;
  }
  
  .left-side, .right-side {
    padding: 1.25rem;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
  
  .stat {
    text-align: center;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .auth-card {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(148, 163, 184, 0.1);
  }
  
  .right-side {
    background: rgba(30, 41, 59, 0.8);
  }
  
  .auth-title {
    color: #f1f5f9;
  }
  
  .auth-subtitle {
    color: #94a3b8;
  }
  
  .form-label {
    color: #e2e8f0;
  }
  
  .form-control {
    background: rgba(51, 65, 85, 0.8);
    border-color: #475569;
    color: #f1f5f9;
  }
  
  .form-control::placeholder {
    color: #64748b;
  }
  
  .checkbox-label {
    color: #e2e8f0;
  }
  
  .auth-footer {
    color: #94a3b8;
    border-top-color: rgba(148, 163, 184, 0.2);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .floating-shapes {
    display: none;
  }
}

</style>