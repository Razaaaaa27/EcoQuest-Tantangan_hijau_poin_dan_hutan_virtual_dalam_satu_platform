<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <h1 class="page-title">Profil Pengguna</h1>
        <button class="btn btn-outline" @click="showEditModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
          Edit Profil
        </button>
          <!-- Action Buttons -->
          <div class="profile-actions">
            <button class="btn btn-outline btn-full" @click="showChangePasswordModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
              Ubah Password
            </button>
            
            <button class="btn btn-danger btn-full" @click="confirmLogout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
              </svg>
              Logout
            </button>
          </div>
      </div>

      <div class="profile-layout">
        <!-- Main Profile Card -->
        <div class="profile-main">
          <div class="profile-card">
            <div class="profile-avatar-section">
              <img :src="user.avatar" :alt="user.username" class="profile-avatar" />
              <div class="avatar-upload" @click="showEditModal = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z" />
                </svg>
              </div>
            </div>

            <div class="profile-info">
              <h2 class="profile-name">{{ user.profile?.fullName || user.username }}</h2>
              <p class="profile-username">@{{ user.username }}</p>
              <p class="profile-bio" v-if="user.profile?.bio">{{ user.profile.bio }}</p>
              
              <div class="profile-meta">
                <div class="meta-item" v-if="user.profile?.location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                  </svg>
                  {{ user.profile.location }}
                </div>
                
                <div class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                  </svg>
                  Bergabung {{ formatDate(user.profile?.joinDate || user.createdAt) }}
                </div>
              </div>
            </div>

            <!-- Game Stats -->
            <div class="game-stats">
              <div class="stats-header">
                <h3>Statistik Game</h3>
              </div>
              <div class="stats-grid">
                <div class="stat-item level">
                  <div class="stat-icon">🏆</div>
                  <div class="stat-value">{{ user.gameStats?.level || 1 }}</div>
                  <div class="stat-label">Level</div>
                </div>
                
                <div class="stat-item points">
                  <div class="stat-icon">⭐</div>
                  <div class="stat-value">{{ formatNumber(user.gameStats?.totalPoints || 0) }}</div>
                  <div class="stat-label">Total Poin</div>
                </div>
                
                <div class="stat-item rank" v-if="user.gameStats?.rank">
                  <div class="stat-icon">🥇</div>
                  <div class="stat-value">#{{ user.gameStats.rank }}</div>
                  <div class="stat-label">Peringkat</div>
                </div>
              </div>

              <!-- Level Progress -->
              <div class="level-progress">
                <div class="progress-header">
                  <span>Progress ke Level {{ (user.gameStats?.level || 1) + 1 }}</span>
                  <span>{{ nextLevelProgress }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: nextLevelProgress + '%' }"></div>
                </div>
                <p class="progress-text">{{ pointsToNextLevel }} poin lagi untuk naik level</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Stats -->
        <div class="profile-sidebar">
          <!-- Achievement Stats -->
          <div class="stats-card">
            <h3 class="card-title">Pencapaian Lingkungan</h3>
            <div class="achievement-stats">
              <div class="achievement-item">
                <div class="achievement-icon">🌱</div>
                <div class="achievement-info">
                  <div class="achievement-number">{{ user.statistics?.challengesCompleted || 0 }}</div>
                  <div class="achievement-text">Tantangan Selesai</div>
                </div>
              </div>
              
              <div class="achievement-item">
                <div class="achievement-icon">🌳</div>
                <div class="achievement-info">
                  <div class="achievement-number">{{ user.statistics?.treesPlanted || 0 }}</div>
                  <div class="achievement-text">Pohon Ditanam</div>
                </div>
              </div>
              
              <div class="achievement-item">
                <div class="achievement-icon">♻️</div>
                <div class="achievement-info">
                  <div class="achievement-number">{{ user.statistics?.wasteRecycled || 0 }} kg</div>
                  <div class="achievement-text">Sampah Didaur Ulang</div>
                </div>
              </div>
              
              <div class="achievement-item">
                <div class="achievement-icon">💧</div>
                <div class="achievement-info">
                  <div class="achievement-number">{{ user.statistics?.waterSaved || 0 }}L</div>
                  <div class="achievement-text">Air Dihemat</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="badges-card">
            <h3 class="card-title">Badge Koleksi</h3>
            <div v-if="user.gameStats?.badges && user.gameStats.badges.length > 0" class="badges-grid">
              <div v-for="badge in user.gameStats.badges" :key="badge.name" class="badge-item" :title="badge.description">
                <div class="badge-icon">{{ getBadgeIcon(badge.name) }}</div>
                <div class="badge-name">{{ badge.name }}</div>
                <div class="badge-date">{{ formatDate(badge.earnedAt) }}</div>
              </div>
            </div>
            <div v-else class="empty-badges">
              <p>Belum ada badge yang diperoleh</p>
              <router-link to="/challenges" class="btn btn-sm btn-primary">
                Ikuti Tantangan
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Profil</h3>
          <button class="modal-close" @click="showEditModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Lengkap</label>
            <input type="text" class="form-control" v-model="editForm.fullName" placeholder="Masukkan nama lengkap">
          </div>
          
          <div class="form-group">
            <label class="form-label">Bio</label>
            <textarea class="form-control" v-model="editForm.bio" rows="3" placeholder="Ceritakan tentang diri Anda..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Lokasi</label>
            <input type="text" class="form-control" v-model="editForm.location" placeholder="Kota, Negara">
          </div>
          
          <div class="form-group">
            <label class="form-label">Website</label>
            <input type="url" class="form-control" v-model="editForm.website" placeholder="https://website.com">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showEditModal = false">Batal</button>
          <button class="btn btn-primary" @click="updateProfile" :disabled="updating">
            {{ updating ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="modal-overlay" @click="showChangePasswordModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Ubah Password</h3>
          <button class="modal-close" @click="showChangePasswordModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Password Lama</label>
            <input type="password" class="form-control" v-model="passwordForm.currentPassword" placeholder="Masukkan password lama">
          </div>
          
          <div class="form-group">
            <label class="form-label">Password Baru</label>
            <input type="password" class="form-control" v-model="passwordForm.newPassword" placeholder="Masukkan password baru">
          </div>
          
          <div class="form-group">
            <label class="form-label">Konfirmasi Password Baru</label>
            <input type="password" class="form-control" v-model="passwordForm.confirmPassword" placeholder="Konfirmasi password baru">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showChangePasswordModal = false">Batal</button>
          <button class="btn btn-primary" @click="changePassword" :disabled="changingPassword">
            {{ changingPassword ? 'Mengubah...' : 'Ubah Password' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { authService } from '@/services/authService'

export default {
  name: 'ProfileView',
  data() {
    return {
      showEditModal: false,
      showChangePasswordModal: false,
      updating: false,
      changingPassword: false,
      editForm: {
        fullName: '',
        bio: '',
        location: '',
        website: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getCurrentUser'
    }),
    
    nextLevelProgress() {
      if (!this.user.gameStats?.totalPoints) return 0
      const pointsInCurrentLevel = this.user.gameStats.totalPoints % 250
      return Math.round((pointsInCurrentLevel / 250) * 100)
    },
    
    pointsToNextLevel() {
      if (!this.user.gameStats?.totalPoints) return 250
      const pointsInCurrentLevel = this.user.gameStats.totalPoints % 250
      return 250 - pointsInCurrentLevel
    }
  },
  created() {
    this.initializeEditForm()
  },
  methods: {
    ...mapActions({
      logout: 'user/logout'
    }),

    initializeEditForm() {
      if (this.user?.profile) {
        this.editForm = {
          fullName: this.user.profile.fullName || '',
          bio: this.user.profile.bio || '',
          location: this.user.profile.location || '',
          website: this.user.profile.website || ''
        }
      }
    },

    async updateProfile() {
      this.updating = true
      try {
        await authService.updateProfile({
          fullName: this.editForm.fullName,
          bio: this.editForm.bio,
          location: this.editForm.location,
          website: this.editForm.website
        })

        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Profil berhasil diperbarui!',
          timeout: 3000
        })

        this.showEditModal = false
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal memperbarui profil',
          timeout: 5000
        })
      } finally {
        this.updating = false
      }
    },

    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Konfirmasi password tidak cocok',
          timeout: 3000
        })
        return
      }

      if (this.passwordForm.newPassword.length < 6) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Password baru minimal 6 karakter',
          timeout: 3000
        })
        return
      }

      this.changingPassword = true
      try {
        await authService.changePassword(
          this.passwordForm.currentPassword,
          this.passwordForm.newPassword
        )

        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Password berhasil diubah!',
          timeout: 3000
        })

        this.showChangePasswordModal = false
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal mengubah password',
          timeout: 5000
        })
      } finally {
        this.changingPassword = false
      }
    },

    async confirmLogout() {
      if (confirm('Apakah Anda yakin ingin logout?')) {
        try {
          await this.logout()
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Logout berhasil!',
            timeout: 3000
          })
          this.$router.push('/')
        } catch (error) {
          console.error('Logout error:', error)
        }
      }
    },

    getBadgeIcon(badgeName) {
      const icons = {
        'Tree Lover': '🌳',
        'Challenge Master': '🏆',
        'Recycling Master': '♻️',
        'Water Saver': '💧',
        'Challenge Starter': '⭐',
        'Challenge Champion': '🥇',
        'Penemu Hutan': '🌱',
        'Kebun Mini': '🌿',
        'Tukang Kebun': '👨‍🌾',
        'Kolektor Pohon': '🌲',
        'Penghijauan': '🌳'
      }
      return icons[badgeName] || '🏅'
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long'
      })
    },

    formatNumber(num) {
      if (!num) return '0'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  },

  watch: {
    user: {
      handler() {
        this.initializeEditForm()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
/* Defining color variables for light and dark modes */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: rgba(255, 255, 255, 0.95);
  --text-heading: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
  --danger-color: #ef4444;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --modal-overlay: rgba(0, 0, 0, 0.7);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --bg-secondary: #374151;
    --bg-card: rgba(31, 41, 55, 0.95);
    --text-heading: #f3f4f6;
    --text-secondary: #9ca3af;
    --border-color: #4b5563;
    --accent-color: #60a5fa;
    --danger-color: #f87171;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --modal-overlay: rgba(0, 0, 0, 0.8);
  }
}

/* Profile Page Styles */
.profile-page {
  min-height: 100vh;
  padding: 1.5rem 0;
  background: var(--bg-primary);
  overflow-y: auto;
  transition: background 0.3s ease;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header Section */
.profile-header {
  display: flex;
  align-items: center;
}

.profile-header .page-title {
  margin-right: auto;
}

.profile-header .btn.btn-outline {
  margin-right: 0.25rem;
}

.profile-actions {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-outline {
  background: transparent;
  color: var(--text-heading);
  border: 2px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-secondary);
  transform: scale(1.05);
  box-shadow: 0 4px 15px var(--shadow-color);
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Layout */
.profile-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  flex: 1;
}

/* Main Profile Card */
.profile-main {
  display: flex;
  flex-direction: column;
}

.profile-card {
  background: var(--bg-card);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 30px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px var(--shadow-color);
}

.profile-avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--bg-primary);
  box-shadow: 0 6px 20px var(--shadow-color);
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.avatar-upload {
  position: absolute;
  bottom: 10px;
  right: calc(50% - 60px);
  background: var(--accent-color);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  border: 2px solid var(--bg-primary);
  transition: all 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.profile-info {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 0.5rem 0;
}

.profile-username {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.profile-bio {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.profile-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.meta-item svg {
  opacity: 0.8;
}

/* Game Stats */
.game-stats {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.stats-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.stat-item.level {
  background: var(--bg-secondary);
}

.stat-item.points {
  background: var(--bg-secondary);
}

.stat-item.rank {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: white;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--shadow-color);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Level Progress */
.level-progress {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  border-radius: 12 Zachpx;
  color: white;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.9;
  margin: 0;
}

/* Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.stats-card, .badges-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 6px 20px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover, .badges-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-color);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

/* Achievement Stats */
.achievement-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.achievement-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px var(--shadow-color);
}

.achievement-icon {
  font-size: 1.5rem;
}

.achievement-info {
  flex: 1;
}

.achievement-number {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 0.25rem;
}

.achievement-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Badges */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
}

.badge-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.badge-item:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.badge-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.badge-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 0.25rem;
}

.badge-date {
  font-size: 0.625rem;
  color: var(--text-secondary);
}

.empty-badges {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-badges p {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-overlay);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 50px var(--shadow-color);
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-heading);
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-heading);
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control::placeholder {
  color: var(--text-secondary);
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card,
.stats-card,
.badges-card {
  animation: slideIn 0.5s ease-out;
}

.profile-card {
  animation-delay: 0.1s;
}

.stats-card {
  animation-delay: 0.2s;
}

.badges-card {
  animation-delay: 0.3s;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 0;
  }

  .container {
    padding: 0 0.75rem;
  }

  .profile-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .profile-header .page-title {
    margin-right: 0;
  }

  .profile-header .btn.btn-outline {
    margin-right: 0;
  }

  .profile-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .avatar-upload {
    right: calc(50% - 50px);
    width: 32px;
    height: 32px;
  }

  .profile-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem 1.5rem;
  }

  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 0.75rem;
  }

  .profile-card {
    padding: 1rem;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
  }

  .avatar-upload {
    right: calc(50% - 40px);
    width: 28px;
    height: 28px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .badges-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }

  .achievement-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .achievement-icon {
    font-size: 1.25rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>