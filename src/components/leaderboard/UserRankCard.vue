<template>
  <div class="user-rank-card" :class="{ 'current-user': isCurrentUser, 'top-3': isTop3 }">
    <div class="rank-position" :class="rankClass">{{ position || 0 }}</div>
    
    <div class="user-info">
      <img 
        :src="user?.avatar || '/default-avatar.png'" 
        :alt="user?.username || 'User'" 
        class="user-avatar" 
      />
      <div class="user-details">
        <div class="username">
          {{ user?.username || 'Unknown User' }}
          <span v-if="isCurrentUser" class="current-user-badge">Kamu</span>
        </div>
        <div class="user-stats">
          <div class="user-level">Level {{ user?.level || 1 }}</div>
          <div class="user-badge-count" v-if="user?.badges && user.badges.length">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,16V10H22V16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H16V4H8V16H20M10.91,7.08L14,10.17L20.59,3.58L22,5L14,13L9.5,8.5L10.91,7.08M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z" />
            </svg>
            {{ user.badges.length }} badge
          </div>
        </div>
      </div>
    </div>
    
    <div class="user-points">
      <div class="points-value">{{ formatNumber(getUserPoints()) }}</div>
      <div class="points-label">poin</div>
    </div>
    
    <div v-if="showBadge && isTop3" class="rank-badge">
      <img :src="getBadgeIcon(position)" :alt="`Badge #${position}`" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRankCard',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({})
    },
    position: {
      type: Number,
      required: true,
      default: 0
    },
    isCurrentUser: {
      type: Boolean,
      default: false
    },
    showBadge: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isTop3() {
      return this.position <= 3 && this.position > 0
    },
    rankClass() {
      if (this.position === 1) return 'rank-gold'
      if (this.position === 2) return 'rank-silver'
      if (this.position === 3) return 'rank-bronze'
      return ''
    }
  },
  methods: {
    getUserPoints() {
      // Prioritas: gameStats.totalPoints > points > 0
      if (this.user?.gameStats?.totalPoints !== undefined && this.user.gameStats.totalPoints !== null) {
        return this.user.gameStats.totalPoints
      }
      if (this.user?.points !== undefined && this.user.points !== null) {
        return this.user.points
      }
      return 0
    },
    
    formatNumber(num) {
      // Handle semua kemungkinan nilai yang invalid
      if (num === null || num === undefined || num === '' || isNaN(num)) {
        return '0'
      }
      
      // Konversi ke number jika berupa string
      const numValue = typeof num === 'string' ? parseFloat(num) : Number(num)
      
      // Double check setelah konversi
      if (isNaN(numValue)) {
        return '0'
      }
      
      return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    
    getBadgeIcon(position) {
      // Gunakan @ untuk Vite/Vue CLI asset handling
      if (position === 1) return '@/assets/images/badge-gold.svg'
      if (position === 2) return '@/assets/images/badge-silver.svg'
      if (position === 3) return '@/assets/images/badge-bronze.svg'
      return ''
    }
  }
}
</script>

<style scoped>
.user-rank-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-md);
  margin-bottom: 1rem;
  transition: transform var(--transition-fast);
  position: relative;
}

.user-rank-card:hover {
  transform: translateX(5px);
}

.user-rank-card.current-user {
  background-color: rgba(76, 175, 80, 0.05);
  border-left: 4px solid var(--color-primary);
}

.rank-position {
  font-size: 1.25rem;
  font-weight: 700;
  min-width: 2.5rem;
  text-align: center;
  color: var(--text-tertiary);
}

.rank-gold {
  color: var(--color-gold);
}

.rank-silver {
  color: var(--color-silver);
}

.rank-bronze {
  color: var(--color-bronze);
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.user-details {
  flex: 1;
}

.username {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.current-user-badge {
  background-color: var(--color-primary);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  margin-left: 0.5rem;
}

.user-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.user-badge-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.user-badge-count svg {
  color: var(--color-primary);
}

.user-points {
  text-align: right;
  min-width: 100px;
}

.points-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.points-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.rank-badge {
  position: absolute;
  top: -10px;
  right: 10px;
  width: 30px;
  height: 30px;
}

.rank-badge img {
  width: 100%;
  height: 100%;
}

@media (max-width: 640px) {
  .user-rank-card {
    padding: 0.75rem;
  }
  
  .rank-position {
    min-width: 1.5rem;
    font-size: 1rem;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
    margin-right: 0.75rem;
  }
  
  .user-points {
    min-width: 70px;
  }
  
  .points-value {
    font-size: 1rem;
  }
  
  .user-stats {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
