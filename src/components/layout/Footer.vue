<template>
  <footer v-if="!isAdmin" class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="@/assets/images/logo2.svg" alt="EcoQuest Logo" />
            <span>EcoQuest</span>
          </div>
          <p class="footer-tagline">
            Bermain sambil menjaga bumi untuk generasi mendatang.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
            </a>
            <a href="#" class="social-link" title="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" />
              </svg>
            </a>
            <a href="#" class="social-link" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2M7.6 4C5.61 4 4 5.61 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C18.39 20 20 18.39 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6M17.25 5.5C18.03 5.5 18.68 6.15 18.68 6.93C18.68 7.71 18.03 8.36 17.25 8.36C16.47 8.36 15.82 7.71 15.82 6.93C15.82 6.15 16.47 5.5 17.25 5.5M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7M12 9C10.35 9 9 10.35 9 12C9 13.65 10.35 15 12 15C13.65 15 15 13.65 15 12C15 10.35 13.65 9 12 9Z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-heading">Navigasi</h3>
          <ul class="footer-links">
            <li v-for="item in navigationLinks" :key="item.path">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-heading">Bantuan & Informasi</h3>
          <ul class="footer-links">
            <li v-for="item in helpLinks" :key="item.name">
              <a :href="item.path">{{ item.name }}</a>
            </li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-heading">Hubungi Kami</h3>
          <p class="contact-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
            </svg>
            Lamnyong, Jl. Teuku Nyak Arief, Kec. Syiah Kuala, Kota Banda Aceh, Aceh 23112
          </p>
          <p class="contact-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
            </svg>
            EcoQuest@gmail.com
          </p>
          <p class="contact-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
            </svg>
            +62 123 4567 890
          </p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          © {{ currentYear }} EcoQuest. Hak Cipta Dilindungi.
        </div>
        <div class="footer-policy-links">
          <a href="#">Kebijakan Privasi</a>
          <span class="separator">|</span>
          <a href="#">Syarat & Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  data() {
    return {
      navigationLinks: [
        { name: 'Beranda', path: '/' },
        { name: 'Tantangan', path: '/challenges' },
        { name: 'Papan Skor', path: '/leaderboard' },
        { name: 'Hutan Virtual', path: '/forest' },
        { name: 'Komunitas', path: '/community' },
        { name: 'EcoEdu', path: '/ecoedu' }
      ],
      helpLinks: [
        { name: 'FAQ', path: '#' },
        { name: 'Tentang Kami', path: '#' },
        { name: 'Hubungi Kami', path: '#' },
        { name: 'Panduan Memulai', path: '#' }
      ]
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    ...mapGetters({
      currentUser: 'user/getCurrentUser' // Assuming this is the getter name from your Vuex store
    }),
    isAdmin() {
      return this.currentUser && this.currentUser.role === 'admin'
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: var(--bg-secondary);
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 640px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
  }
}

.footer-logo {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.footer-logo img {
  height: 28px;
  margin-right: 0.5rem;
}

.footer-tagline {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  max-width: 280px;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.footer-heading {
  font-size: 1rem;
  margin-bottom: 1.25rem;
  color: var(--text-heading);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.contact-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.footer-bottom {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.footer-policy-links {
  font-size: 0.875rem;
}

.footer-policy-links a {
  color: var(--text-secondary);
}

.separator {
  margin: 0 0.5rem;
  color: var(--text-tertiary);
}
</style>