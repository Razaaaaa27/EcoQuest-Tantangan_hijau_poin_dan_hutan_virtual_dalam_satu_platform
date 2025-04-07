<template>
  <div class="stats-summary">
    <h2 class="stats-summary-title">Kontribusi Kamu</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.87,11.81L10.09,14.59L8.68,13.18L8,13.86L10.09,16L13.55,12.54L12.87,11.81M15.19,17H8.81V11.46H3V17.66C3,18.4 3.6,19 4.34,19H19.66C20.4,19 21,18.4 21,17.66V11.46H15.19V17M17.27,5.32L20.68,8.73L19.27,10.14L15.86,6.73M14.19,8.4L12.07,6.28L15.48,2.87L17.6,5M4.34,5H10.15V10.54H15.85V5H19.66C20.4,5 21,5.6 21,6.34V9.32L19,7.32V7H5V7.34L3,9.34V6.34C3,5.6 3.6,5 4.34,5Z" />
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ userStats.challengesCompleted }}</div>
          <div class="stat-label">Tantangan Selesai</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.66,11.2C17.43,10.9 17.15,10.64 16.89,10.38C16.22,9.78 15.46,9.35 14.82,8.72C13.33,7.26 13,4.85 13.95,3C13,3.23 12.17,3.75 11.46,4.32C8.87,6.4 7.85,10.07 9.07,13.22C9.11,13.32 9.15,13.42 9.15,13.55C9.15,13.77 9,13.97 8.8,14.05C8.57,14.15 8.33,14.09 8.14,13.93C8.08,13.88 8.04,13.83 8,13.76C6.87,12.33 6.69,10.28 7.45,8.64C5.78,10 4.87,12.3 5,14.47C5.06,14.97 5.12,15.47 5.29,15.97C5.43,16.57 5.7,17.17 6,17.7C7.08,19.43 8.95,20.67 10.96,20.92C13.1,21.19 15.39,20.8 17.03,19.32C18.86,17.66 19.5,15 18.56,12.72L18.43,12.46C18.22,12 17.66,11.2 17.66,11.2M14.5,17.5C14.22,17.74 13.76,18 13.4,18.1C12.28,18.5 11.16,17.94 10.5,17.28C11.69,17 12.4,16.12 12.61,15.23C12.78,14.43 12.46,13.77 12.33,13C12.21,12.26 12.23,11.63 12.5,10.94C12.69,11.32 12.89,11.7 13.13,12C13.9,13 15.11,13.44 15.37,14.8C15.41,14.94 15.43,15.08 15.43,15.23C15.46,16.05 15.1,16.95 14.5,17.5H14.5Z" />
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ userStats.treesPlanted }}</div>
          <div class="stat-label">Pohon Ditanam</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16C2.77,16 2.41,16.06 2,16.13V6C2,4.89 2.9,4 4,4H20A2,2 0 0,1 22,6V12C21.43,11.95 20.87,12 20.35,12.1C20.09,10.34 19.13,8.76 17.71,7.65L16,9.19L14.33,7.65C12.9,8.76 11.95,10.34 11.69,12.1C10.95,12 10.18,12 9.5,12.1C9.24,10.34 8.29,8.76 6.86,7.65L5.19,9.19L3.53,7.65C2.09,8.77 1.15,10.37 0.9,12.13C1.82,11.68 2.85,11.34 4,11.37C8.47,11.5 12.03,15.92 12.03,15.92C12.27,16.2 12.66,16.2 12.91,15.92L14.5,14.24V16.37L13.26,17.61C13.1,17.77 13,17.97 13,18.21C13,18.67 13.37,19.04 13.83,19.04L15.83,19C16.21,18.97 16.5,18.66 16.5,18.27V18.22L19,15.5C19.24,15.81 19.39,16.16 19.5,16.55C19.063,17.04 19,17.97 19,18.31M8.83,13.95C8.36,13.53 7.5,13.34 7.05,13.17C7.05,13.17 6,12.91 5.71,12.75C5.71,12.75 5.08,12.29 5.08,12.75C5.08,13.21 6.08,13.96 6.57,14.28C7.06,14.6 9.06,16.07 9.06,16.07L10.05,14.97C10.06,14.97 9.3,14.37 8.83,13.95M5.81,10.57C6.29,10.57 6.68,10.18 6.68,9.69C6.68,9.21 6.29,8.82 5.81,8.82C5.33,8.82 4.94,9.21 4.94,9.69C4.94,10.18 5.33,10.57 5.81,10.57M18.19,10.57C18.67,10.57 19.06,10.18 19.06,9.69C19.06,9.21 18.67,8.82 18.19,8.82C17.7,8.82 17.32,9.21 17.32,9.69C17.32,10.18 17.7,10.57 18.19,10.57Z" />
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ userStats.wasteRecycled }}</div>
          <div class="stat-label">Sampah Didaur Ulang</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,6.9C12.44,7.42 12.84,7.85 13.68,9.07C14.89,10.83 16,13.07 16,14.23C16,16.45 14.22,18.23 12,18.23C9.78,18.23 8,16.45 8,14.23C8,13.07 9.11,10.83 10.32,9.07C11.16,7.85 11.56,7.42 12,6.9Z" />
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ userStats.waterSaved }}</div>
          <div class="stat-label">Liter Air Dihemat</div>
        </div>
      </div>
    </div>
    
    <div class="user-level">
      <div class="level-info">
        <div class="level-badge">Level {{ userLevel }}</div>
        <div class="level-label">{{ pointsToNextLevel }} poin lagi untuk level berikutnya</div>
      </div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: levelProgress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StatsSummary',
  computed: {
    ...mapGetters({
      userStatistics: 'user/getUserStatistics',
      userPoints: 'user/getUserPoints',
      userLevel: 'user/getUserLevel'
    }),
    userStats() {
      return {
        challengesCompleted: this.userStatistics.challengesCompleted,
        treesPlanted: this.userStatistics.treesPlanted,
        wasteRecycled: this.userStatistics.wasteRecycled + ' kg',
        waterSaved: this.userStatistics.waterSaved
      }
    },
    // Calculate points needed for next level (simple formula: level * 250)
    pointsToNextLevel() {
      const nextLevelThreshold = (this.userLevel) * 250
      const pointsNeeded = nextLevelThreshold - (this.userPoints % 250)
      return pointsNeeded
    },
    // Calculate progress percentage to next level
    levelProgress() {
      const pointsInCurrentLevel = this.userPoints % 250
      return (pointsInCurrentLevel / 250) * 100
    }
  }
}
</script>

<style scoped>
.stats-summary {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
  border: 2px solid #a5d6a7; 
  padding: 2rem;
  margin-bottom: 3rem;
}

.stats-summary-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-heading);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.user-level {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.level-badge {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
}

.level-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .level-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>