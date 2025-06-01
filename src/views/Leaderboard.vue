<template>
  <div class="leaderboard-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Papan Skor</h1>
        <div class="page-actions">
          <div class="leaderboard-tabs">
            <button 
              class="tab-btn" 
              :class="{ 'active': timeFrame === 'all-time' }"
              @click="changeTimeFrame('all-time')"
            >
              Sepanjang Waktu
            </button>
            <button 
              class="tab-btn" 
              :class="{ 'active': timeFrame === 'monthly' }"
              @click="changeTimeFrame('monthly')"
            >
              Bulanan
            </button>
            <button 
              class="tab-btn" 
              :class="{ 'active': timeFrame === 'weekly' }"
              @click="changeTimeFrame('weekly')"
            >
              Mingguan
            </button>
          </div>
        </div>
      </div>
      
      <div class="leaderboard-layout">
        <!-- Top 3 Users -->
        <div class="top-performers" v-if="topUsers && topUsers.length > 0">
          <div class="top-performer second-place" v-if="topUsers.length > 1 && topUsers[1]">
            <div class="performer-position">2</div>
            <img 
              :src="topUsers[1].avatar || '/default-avatar.png'" 
              :alt="topUsers[1].username || 'User'" 
              class="performer-avatar" 
            />
            <div class="performer-info">
              <div class="performer-username">{{ topUsers[1].username || 'Unknown User' }}</div>
              <div class="performer-points">
                {{ formatNumber(getPointsFromUser(topUsers[1])) }}
              </div>
            </div>
            <div class="performer-badge">
              <img src="@/assets/images/badge-silver.svg" alt="Second Place" />
            </div>
          </div>
          
          <div class="top-performer first-place" v-if="topUsers[0]">
            <div class="performer-position">1</div>
            <div class="performer-crown">👑</div>
            <img 
              :src="topUsers[0].avatar || '/default-avatar.png'" 
              :alt="topUsers[0].username || 'User'" 
              class="performer-avatar" 
            />
            <div class="performer-info">
              <div class="performer-username">{{ topUsers[0].username || 'Unknown User' }}</div>
              <div class="performer-points">
                {{ formatNumber(getPointsFromUser(topUsers[0])) }}
              </div>
            </div>
            <div class="performer-badge">
              <img src="@/assets/images/badge-gold.svg" alt="First Place" />
            </div>
          </div>
          
          <div class="top-performer third-place" v-if="topUsers.length > 2 && topUsers[2]">
            <div class="performer-position">3</div>
            <img 
              :src="topUsers[2].avatar || '/default-avatar.png'" 
              :alt="topUsers[2].username || 'User'" 
              class="performer-avatar" 
            />
            <div class="performer-info">
              <div class="performer-username">{{ topUsers[2].username || 'Unknown User' }}</div>
              <div class="performer-points">
                {{ formatNumber(getPointsFromUser(topUsers[2])) }}
              </div>
            </div>
            <div class="performer-badge">
              <img src="@/assets/images/badge-bronze.svg" alt="Third Place" />
            </div>
          </div>
        </div>
        
        <!-- Current User Rank -->
        <div v-if="currentUserRank && currentUserRank.user && isAuthenticated" class="current-user-rank">
          <div class="rank-label">Peringkatmu Saat Ini</div>
          <UserRankCard 
            :user="currentUserRank.user" 
            :position="currentUserRank.rank || 0" 
            :isCurrentUser="true" 
            :showBadge="false"
          />
        </div>
        
        <!-- Leaderboard Table -->
        <div class="leaderboard-table">
          <div class="leaderboard-header">
            <div class="header-cell rank-cell">Peringkat</div>
            <div class="header-cell user-cell">Pengguna</div>
            <div class="header-cell level-cell">Level</div>
            <div class="header-cell badges-cell">Badge</div>
            <div class="header-cell points-cell">Poin</div>
          </div>
          
          <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat data papan skor...</p>
          </div>
          
          <div v-else-if="!leaderboardUsers || leaderboardUsers.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
            </svg>
            <p>Belum ada data papan skor untuk periode ini</p>
          </div>
          
          <div v-else class="leaderboard-list">
            <UserRankCard 
              v-for="(user, index) in leaderboardUsers" 
              :key="getUserKey(user, index)"
              :user="user" 
              :position="user.rank || (index + 4)" 
              :isCurrentUser="isAuthenticated && isCurrentUserCheck(user)" 
              :showBadge="false"
            />
          </div>
          
          <div class="load-more" v-if="hasMoreUsers && !isLoading">
            <button class="btn btn-outline" @click="loadMoreUsers">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserRankCard from '@/components/leaderboard/UserRankCard.vue'
import { leaderboardService } from '@/services/leaderboardService'

export default {
  name: 'LeaderboardView',
  components: {
    UserRankCard
  },
  data() {
    return {
      isLoading: false,
      leaderboardUsers: [],
      timeFrame: 'all-time',
      page: 1,
      limit: 10,
      hasMoreUsers: true,
      currentUserRank: null,
      error: null
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser',
      isAuthenticated: 'user/isAuthenticated'
    }),
    topUsers() {
      if (!this.leaderboardUsers || !Array.isArray(this.leaderboardUsers)) {
        return []
      }
      return this.leaderboardUsers.slice(0, 3)
    }
  },
  created() {
    this.loadLeaderboard()
  },
  beforeDestroy() {
    // Clean up any pending requests
    this.error = null
  },
  methods: {
    async loadLeaderboard() {
      this.isLoading = true
      this.error = null
      
      try {
        const params = {
          timeFrame: this.timeFrame,
          page: this.page,
          limit: this.limit + 3 // Get extra for top 3
        }

        const data = await leaderboardService.getLeaderboard(params)
        
        // Validate and sanitize users data
        let users = []
        if (data && data.users && Array.isArray(data.users)) {
          users = data.users.map((user, index) => this.sanitizeUser(user, index))
        }
        
        if (this.page === 1) {
          this.leaderboardUsers = users
          // Validate and sanitize currentUserRank
          this.currentUserRank = this.sanitizeCurrentUserRank(data.currentUserRank)
        } else {
          this.leaderboardUsers = [...this.leaderboardUsers, ...users]
        }
        
        this.hasMoreUsers = data && data.pagination ? 
          data.pagination.page < data.pagination.pages : false
        
      } catch (error) {
        console.error('Error loading leaderboard:', error)
        this.error = error
        
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal memuat papan skor',
          timeout: 5000
        })
        
        // Set empty state on error
        if (this.page === 1) {
          this.leaderboardUsers = []
          this.currentUserRank = null
        }
        this.hasMoreUsers = false
      } finally {
        this.isLoading = false
      }
    },

    sanitizeUser(user, index) {
      if (!user || typeof user !== 'object') {
        return this.createDefaultUser(index)
      }

      return {
        // Essential properties with fallbacks
        _id: user._id || user.id || `user-${index}-${Date.now()}`,
        id: user.id || user._id || `user-${index}-${Date.now()}`,
        username: user.username || `User ${index + 1}`,
        avatar: user.avatar || '/default-avatar.png',
        level: this.validateNumber(user.level, 1),
        
        // Points with multiple fallback sources
        points: this.validateNumber(user.points, 0),
        
        // Game stats with safe defaults
        gameStats: user.gameStats ? {
          totalPoints: this.validateNumber(user.gameStats.totalPoints, user.points || 0),
          ...user.gameStats
        } : {
          totalPoints: this.validateNumber(user.points, 0)
        },
        
        // Badges with safe array
        badges: Array.isArray(user.badges) ? user.badges : [],
        
        // Rank
        rank: this.validateNumber(user.rank, index + 1),
        
        // Preserve other properties
        ...user
      }
    },

    sanitizeCurrentUserRank(currentUserRank) {
      if (!currentUserRank || !currentUserRank.user) {
        return null
      }

      return {
        rank: this.validateNumber(currentUserRank.rank, 0),
        user: this.sanitizeUser(currentUserRank.user, 0)
      }
    },

    createDefaultUser(index) {
      return {
        _id: `default-user-${index}`,
        id: `default-user-${index}`,
        username: `User ${index + 1}`,
        avatar: '/default-avatar.png',
        level: 1,
        points: 0,
        gameStats: { totalPoints: 0 },
        badges: [],
        rank: index + 1
      }
    },

    validateNumber(value, defaultValue) {
      if (value === null || value === undefined || value === '' || isNaN(value)) {
        return defaultValue
      }
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
      return isNaN(numValue) ? defaultValue : numValue
    },

    getPointsFromUser(user) {
      if (!user) return 0
      
      // Priority: gameStats.totalPoints > points > 0
      if (user.gameStats && typeof user.gameStats.totalPoints === 'number') {
        return user.gameStats.totalPoints
      }
      if (typeof user.points === 'number') {
        return user.points
      }
      return 0
    },

    getUserKey(user, index) {
      // Create safe key for v-for
      if (user && (user._id || user.id)) {
        return user._id || user.id
      }
      return `user-${index}-${this.timeFrame}`
    },

    isCurrentUserCheck(user) {
      if (!this.currentUser || !user) return false
      
      const currentUserId = this.currentUser.id || this.currentUser._id
      const userId = user._id || user.id
      
      return currentUserId && userId && currentUserId === userId
    },

    async loadMoreUsers() {
      if (!this.isLoading && this.hasMoreUsers) {
        this.page++
        await this.loadLeaderboard()
      }
    },

    async changeTimeFrame(timeFrame) {
      if (this.timeFrame !== timeFrame) {
        this.timeFrame = timeFrame
        this.page = 1
        this.hasMoreUsers = true
        this.leaderboardUsers = []
        this.currentUserRank = null
        this.error = null
        await this.loadLeaderboard()
      }
    },

    formatNumber(num) {
      // Handle all possible invalid values
      if (num === null || num === undefined || num === '' || isNaN(num)) {
        return '0'
      }
      
      // Convert to number if string
      const numValue = typeof num === 'string' ? parseFloat(num) : Number(num)
      
      // Double check after conversion
      if (isNaN(numValue)) {
        return '0'
      }
      
      return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }
}
</script>

  <style scoped>
  .page-header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem; 
  }

  .page-title {
    margin-bottom: 0;
    font-family: "Tagesschrift", system-ui;
  }

  .leaderboard-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .tab-btn {
    background: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-color);
  }

  .tab-btn.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  /* Top Performers Section */
  .top-performers {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 3rem;
    padding: 1.5rem;
    position: relative;
  }

  .top-performer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 2rem 1.5rem 1.5rem;
    width: 180px;
    box-shadow: var(--shadow-md);
  }

  .top-performer.first-place {
    background-color: rgba(255, 215, 0, 0.1);
    border: 2px solid var(--color-gold);
    padding-top: 3rem;
    z-index: 2;
    transform: scale(1.1);
  }

  .top-performer.second-place {
    background-color: rgba(192, 192, 192, 0.1);
    border: 2px solid var(--color-silver);
    margin-top: 1.5rem;
    z-index: 1;
  }

  .top-performer.third-place {
    background-color: rgba(205, 127, 50, 0.1);
    border: 2px solid var(--color-bronze);
    margin-top: 1.5rem;
    z-index: 1;
  }

  .performer-position {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
  }

  .first-place .performer-position {
    background-color: var(--color-gold);
    color: white;
  }

  .second-place .performer-position {
    background-color: var(--color-silver);
    color: white;
  }

  .third-place .performer-position {
    background-color: var(--color-bronze);
    color: white;
  }

  .performer-crown {
    position: absolute;
    top: -15px;
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .performer-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: var(--shadow-md);
    margin-bottom: 1rem;
  }

  .first-place .performer-avatar {
    width: 100px;
    height: 100px;
    border-color: var(--color-gold);
  }

  .performer-info {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .performer-username {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .performer-points {
    color: var(--color-primary);
    font-weight: 700;
  }

  .first-place .performer-points {
    font-size: 1.25rem;
  }

  .performer-badge {
    margin-top: 0.5rem;
    width: 32px;
    height: 32px;
  }

  .first-place .performer-badge {
    width: 40px;
    height: 40px;
  }

  /* Current User Rank */
  .current-user-rank {
    margin-bottom: 2rem;
  }

  .rank-label {
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  /* Leaderboard Table */
  .leaderboard-table {
    background-color: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
  }

  .leaderboard-header {
    display: flex;
    padding: 1rem;
    background-color: var(--bg-secondary);
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-color);
  }

  .header-cell {
    padding: 0 0.5rem;
  }

  .rank-cell {
    width: 80px;
    text-align: center;
  }

  .user-cell {
    flex: 1;
  }

  .level-cell {
    width: 100px;
    text-align: center;
  }

  .badges-cell {
    width: 100px;
    text-align: center;
  }

  .points-cell {
    width: 120px;
    text-align: right;
  }

  .leaderboard-list {
    padding: 1rem;
  }

  .loading-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spinner 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .empty-state svg {
    color: var(--text-tertiary);
    margin-bottom: 1rem;
  }

  .load-more {
    display: flex;
    justify-content: center;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .top-performers {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    
    .top-performer {
      width: 100%;
      max-width: 280px;
    }
    
    .top-performer.first-place {
      order: -1;
      transform: none;
    }
    
    .top-performer.second-place,
    .top-performer.third-place {
      margin-top: 0;
    }
  }
  </style>