<!-- src\components\User\UserNotifications.vue -->
<template>
  <div class="notifications-component">
    <!-- Notification Bell Icon -->
    <div class="notification-trigger" @click="toggleNotifications" ref="trigger">
      <div class="notification-icon" :class="{ 'has-unread': unreadCount > 0 }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C13.05,2 14,2.95 14,4C14,4.1 14,4.2 14,4.3L19.1,8L20,18H4L4.9,8L10,4.3C10,4.2 10,4.1 10,4C10,2.95 10.95,2 12,2M12,22A2,2 0 0,0 14,20H10A2,2 0 0,0 12,22Z" />
        </svg>
        <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
      </div>
    </div>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown" @click.stop>
      <div class="notifications-header">
        <h3>Notifikasi</h3>
        <div class="header-actions">
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="mark-all-read">
            Tandai Sudah Dibaca
          </button>
          <button @click="toggleNotifications" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="notification-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Notifications List -->
      <div class="notifications-content">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat notifikasi...</p>
        </div>

        <div v-else-if="filteredNotifications.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C13.05,2 14,2.95 14,4C14,4.1 14,4.2 14,4.3L19.1,8L20,18H4L4.9,8L10,4.3C10,4.2 10,4.1 10,4C10,2.95 10.95,2 12,2M12,22A2,2 0 0,0 14,20H10A2,2 0 0,0 12,22Z" />
          </svg>
          <h4>Tidak ada notifikasi</h4>
          <p>{{ activeTab === 'all' ? 'Semua notifikasi akan muncul di sini' : 'Tidak ada notifikasi untuk kategori ini' }}</p>
        </div>

        <div v-else class="notifications-list">
          <div 
            v-for="notification in filteredNotifications" 
            :key="notification.id"
            :class="['notification-item', { 
              'unread': !notification.read,
              [notification.type]: true 
            }]"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon-wrapper">
              <div class="notification-type-icon" :class="notification.type">
                <!-- Success Icon -->
                <svg v-if="notification.type === 'submission_approved'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                <!-- Error Icon -->
                <svg v-else-if="notification.type === 'submission_rejected'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
                <!-- Info Icon -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </div>
            </div>

            <div class="notification-content">
              <div class="notification-header">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
              
              <!-- Challenge Info for Submission Notifications -->
              <div v-if="notification.metadata?.challengeTitle" class="notification-meta">
                <span class="challenge-title">{{ notification.metadata.challengeTitle }}</span>
                <span v-if="notification.metadata?.pointsAwarded" class="points-awarded">
                  +{{ notification.metadata.pointsAwarded }} poin
                </span>
              </div>

              <!-- Action Buttons -->
              <div v-if="notification.actionRequired" class="notification-actions">
                <button 
                  v-if="notification.type === 'submission_approved'"
                  @click.stop="viewSubmission(notification)"
                  class="action-btn primary"
                >
                  Lihat Detail
                </button>
                <button 
                  v-if="notification.type === 'submission_rejected'"
                  @click.stop="resubmitChallenge(notification)"
                  class="action-btn secondary"
                >
                  Submit Ulang
                </button>
              </div>
            </div>

            <div v-if="!notification.read" class="unread-indicator"></div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMoreNotifications && !loading" class="load-more-section">
          <button @click="loadMoreNotifications" class="load-more-btn">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="showNotifications" class="notifications-overlay" @click="toggleNotifications"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserNotifications',
  data() {
    return {
      showNotifications: false,
      loading: false,
      notifications: [],
      activeTab: 'all',
      page: 1,
      limit: 20,
      hasMoreNotifications: true,
      
      tabs: [
        { key: 'all', label: 'Semua', count: 0 },
        { key: 'submissions', label: 'Submissions', count: 0 },
        { key: 'system', label: 'Sistem', count: 0 }
      ],

      // Polling for real-time updates
      pollInterval: null,
      pollDelay: 30000 // 30 seconds
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser',
      isAuthenticated: 'user/isAuthenticated'
    }),
    
    filteredNotifications() {
      if (this.activeTab === 'all') {
        return this.notifications
      }
      
      const typeMap = {
        submissions: ['submission_approved', 'submission_rejected', 'submission_reviewed'],
        system: ['system_update', 'maintenance', 'announcement']
      }
      
      return this.notifications.filter(notification => 
        typeMap[this.activeTab]?.includes(notification.type)
      )
    },
    
    unreadCount() {
      return this.notifications.filter(n => !n.read).length
    }
  },
  mounted() {
    if (this.isAuthenticated) {
      this.loadNotifications()
      this.startPolling()
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    this.stopPolling()
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async loadNotifications(append = false) {
      if (!this.isAuthenticated) return
      
      this.loading = !append
      
      try {
        const params = {
          page: append ? this.page + 1 : 1,
          limit: this.limit,
          sort: '-createdAt'
        }

        const response = await this.$axios.get('/user/notifications', { params })
        const data = response.data.data

        if (append) {
          this.notifications = [...this.notifications, ...data.notifications]
          this.page++
        } else {
          this.notifications = data.notifications
          this.page = 1
        }

        this.hasMoreNotifications = data.pagination.page < data.pagination.pages
        this.updateTabCounts()

      } catch (error) {
        console.error('Error loading notifications:', error)
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Gagal memuat notifikasi',
          timeout: 3000
        })
      } finally {
        this.loading = false
      }
    },

    async loadMoreNotifications() {
      if (!this.loading && this.hasMoreNotifications) {
        await this.loadNotifications(true)
      }
    },

    updateTabCounts() {
      const counts = {
        all: this.notifications.length,
        submissions: this.notifications.filter(n => 
          ['submission_approved', 'submission_rejected', 'submission_reviewed'].includes(n.type)
        ).length,
        system: this.notifications.filter(n => 
          ['system_update', 'maintenance', 'announcement'].includes(n.type)
        ).length
      }

      this.tabs.forEach(tab => {
        tab.count = counts[tab.key] || 0
      })
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      if (this.showNotifications && this.notifications.length === 0) {
        this.loadNotifications()
      }
    },

    handleClickOutside(event) {
      if (!this.$refs.trigger?.contains(event.target)) {
        this.showNotifications = false
      }
    },

    async handleNotificationClick(notification) {
      if (!notification.read) {
        await this.markAsRead(notification.id)
      }
      
      // Handle different notification types
      switch (notification.type) {
        case 'submission_approved':
        case 'submission_rejected':
          this.viewSubmissionDetail(notification)
          break
        case 'challenge_new':
          this.$router.push('/challenges')
          break
        case 'system_update':
          // Handle system updates
          break
        default:
          console.log('Notification clicked:', notification)
      }
    },

    async markAsRead(notificationId) {
      try {
        await this.$axios.put(`/user/notifications/${notificationId}/read`)
        
        // Update local state
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification) {
          notification.read = true
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    },

    async markAllAsRead() {
      try {
        await this.$axios.put('/user/notifications/mark-all-read')
        
        // Update local state
        this.notifications.forEach(notification => {
          notification.read = true
        })

        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Semua notifikasi ditandai sudah dibaca',
          timeout: 3000
        })
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Gagal menandai semua notifikasi',
          timeout: 3000
        })
      }
    },

    viewSubmissionDetail(notification) {
      const submissionId = notification.metadata?.submissionId
      if (submissionId) {
        this.$router.push(`/submissions/${submissionId}`)
      }
      this.showNotifications = false
    },

    resubmitChallenge(notification) {
      const challengeId = notification.metadata?.challengeId
      if (challengeId) {
        this.$router.push(`/challenges/${challengeId}`)
      }
      this.showNotifications = false
    },

    viewSubmission(notification) {
      this.viewSubmissionDetail(notification)
    },

    formatTime(date) {
      const now = new Date()
      const notificationDate = new Date(date)
      const diff = now - notificationDate
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (days > 0) {
        if (days === 1) return 'Kemarin'
        if (days < 7) return `${days} hari lalu`
        return notificationDate.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'short' 
        })
      }
      
      if (hours > 0) return `${hours} jam lalu`
      if (minutes > 0) return `${minutes} menit lalu`
      return 'Baru saja'
    },

    // Real-time polling
    startPolling() {
      if (this.pollInterval) return
      
      this.pollInterval = setInterval(() => {
        if (this.isAuthenticated && !this.loading) {
          this.loadNotifications()
        }
      }, this.pollDelay)
    },

    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
    }
  },

  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.loadNotifications()
        this.startPolling()
      } else {
        this.notifications = []
        this.stopPolling()
      }
    }
  }
}
</script>

<style scoped>
.notifications-component {
  position: relative;
}

.notification-trigger {
  cursor: pointer;
}

.notification-icon {
  position: relative;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #666;
}

.notification-icon:hover {
  background: #f5f5f5;
  color: #1976d2;
}

.notification-icon.has-unread {
  color: #1976d2;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4757;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
  border: 2px solid white;
}

.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e8ed;
  z-index: 1000;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e1e8ed;
  background: #f8f9fa;
}

.notifications-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mark-all-read {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.mark-all-read:hover {
  background: #e3f2fd;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e1e8ed;
  color: #1a1a1a;
}

.notification-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e8ed;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab-button:hover {
  background: #ffffff;
  color: #1976d2;
}

.tab-button.active {
  background: white;
  color: #1976d2;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #1976d2;
}

.tab-badge {
  background: #1976d2;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
}

.notifications-content {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state svg {
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #1a1a1a;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.notifications-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #f0f8ff;
}

.notification-item.unread:hover {
  background: #e3f2fd;
}

.notification-icon-wrapper {
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-type-icon.submission_approved {
  background: #e8f5e8;
  color: #2e7d32;
}

.notification-type-icon.submission_rejected {
  background: #ffebee;
  color: #d32f2f;
}

.notification-type-icon.submission_reviewed,
.notification-type-icon.info {
  background: #e3f2fd;
  color: #1976d2;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.notification-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.notification-time {
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
  margin-left: 12px;
}

.notification-message {
  margin: 0 0 8px;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.challenge-title {
  font-size: 12px;
  color: #1976d2;
  font-weight: 500;
  background: #e3f2fd;
  padding: 2px 8px;
  border-radius: 12px;
}

.points-awarded {
  font-size: 12px;
  color: #2e7d32;
  font-weight: 600;
  background: #e8f5e8;
  padding: 2px 8px;
  border-radius: 12px;
}

.notification-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #1976d2;
  border-color: #1976d2;
  color: white;
}

.action-btn.primary:hover {
  background: #1565c0;
  border-color: #1565c0;
}

.action-btn.secondary {
  background: white;
  border-color: #e1e8ed;
  color: #666;
}

.action-btn.secondary:hover {
  background: #f8f9fa;
  border-color: #1976d2;
  color: #1976d2;
}

.unread-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 8px;
  height: 8px;
  background: #1976d2;
  border-radius: 50%;
}

.load-more-section {
  padding: 16px 20px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.load-more-btn {
  background: none;
  border: 1px solid #e1e8ed;
  padding: 8px 16px;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #f8f9fa;
  border-color: #1976d2;
  color: #1976d2;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notifications-dropdown {
    width: 100vw;
    right: -20px;
    border-radius: 0;
    max-height: 80vh;
  }
  
  .notification-item {
    padding: 12px 16px;
  }
  
  .notification-header {
    padding: 16px;
  }
  
  .notification-tabs {
    padding: 0 8px;
  }
  
  .tab-button {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .notification-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .notifications-dropdown {
    right: -40px;
  }
  
  .notification-title {
    font-size: 13px;
  }
  
  .notification-message {
    font-size: 12px;
  }
  
  .notification-time {
    font-size: 11px;
  }
}
</style>