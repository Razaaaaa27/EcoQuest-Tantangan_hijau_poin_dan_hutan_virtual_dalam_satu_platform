<template>
  <div class="forest-stats">
    <div class="stats-header">
      <h3 class="stats-title">Statistik Hutan</h3>
    </div>
    
    <div class="stats-content">
      <div class="stats-item">
        <div class="stats-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.87,11.81L10.09,14.59L8.68,13.18L8,13.86L10.09,16L13.55,12.54L12.87,11.81M15.19,17H8.81V11H5V21H19V11H15.19V17M8,3C9.1,3 10,3.9 10,5C10,5.8 9.5,6.42 8.83,6.78C8.84,6.85 8.84,6.93 8.84,7H11.11C11.12,6.93 11.12,6.85 11.13,6.78C10.46,6.42 10,5.8 10,5C10,3.9 10.9,3 12,3C13.1,3 14,3.9 14,5C14,5.8 13.5,6.42 12.83,6.78C12.84,6.85 12.84,6.93 12.84,7H15.11C15.12,6.93 15.12,6.85 15.13,6.78C14.46,6.42 14,5.8 14,5C14,3.9 14.9,3 16,3C17.1,3 18,3.9 18,5C18,5.8 17.5,6.42 16.83,6.78C16.84,6.85 16.84,6.93 16.84,7H19V9.81L15.53,9.82L16.3,10.59L16.94,10.23L17.61,10.9L16,12.5L15.47,11.97C14.85,11.35 14.5,10.5 14.5,9.81L9.59,9.81C9.59,10.55 9.26,11.44 8.64,12.07L8.07,12.64L6.5,11.07L7.13,10.44L7.97,10.75L8.7,10.03L5.27,10.03V7H7.14C7.12,6.93 7.1,6.85 7.09,6.78C6.46,6.42 6,5.8 6,5C6,3.9 6.9,3 8,3Z" />
          </svg>
        </div>
        <div class="stats-details">
          <div class="stats-value">{{ stats.treeCount }}</div>
          <div class="stats-label">Total Pohon</div>
        </div>
      </div>
      
      <div class="stats-item">
        <div class="stats-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,3C7.58,3 4,4.79 4,7V17C4,19.21 7.59,21 12,21C16.41,21 20,19.21 20,17V7C20,4.79 16.42,3 12,3M18,17C18,17.5 15.87,19 12,19C8.13,19 6,17.5 6,17V14.77C7.61,15.55 9.72,16 12,16C14.28,16 16.39,15.55 18,14.77V17M18,12.45C16.7,13.4 14.42,14 12,14C9.58,14 7.3,13.4 6,12.45V9.64C7.47,10.47 9.61,11 12,11C14.39,11 16.53,10.47 18,9.64V12.45M12,9C8.13,9 6,7.5 6,7C6,6.5 8.13,5 12,5C15.87,5 18,6.5 18,7C18,7.5 15.87,9 12,9Z" />
          </svg>
        </div>
        <div class="stats-details">
          <div class="stats-value">{{ formatNumber(stats.carbonOffset) }}</div>
          <div class="stats-label">kg CO2 Terserap</div>
        </div>
      </div>
      
      <div class="stats-item">
        <div class="stats-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
          </svg>
        </div>
        <div class="stats-details">
          <div class="stats-value">{{ stats.forestLevel }}</div>
          <div class="stats-label">Level Hutan</div>
        </div>
      </div>
      
      <div class="stats-item">
        <div class="stats-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,12.5A1.5,1.5 0 0,1 10.5,11A1.5,1.5 0 0,1 12,9.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 12,12.5M12,7.2C9.9,7.2 8.2,8.9 8.2,11C8.2,14 12,17.5 12,17.5C12,17.5 15.8,14 15.8,11C15.8,8.9 14.1,7.2 12,7.2Z" />
          </svg>
        </div>
        <div class="stats-details">
          <div class="stats-value">{{ stats.lastTreeDate }}</div>
          <div class="stats-label">Terakhir Ditanam</div>
        </div>
      </div>
    </div>
    
    <div class="forest-progress">
      <div class="progress-header">
        <div class="progress-title">Level Hutan Berikutnya</div>
        <div class="progress-value">{{ stats.nextLevelProgress }}%</div>
      </div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: stats.nextLevelProgress + '%' }"></div>
      </div>
      <div class="progress-info">
        {{ stats.treesToNextLevel }} pohon lagi untuk Level {{ stats.forestLevel + 1 }}
      </div>
    </div>
    
    <div class="forest-achievements">
      <div class="achievements-title">Pencapaian Hutan</div>
      <div class="achievements-list">
        <div 
          v-for="(achievement, index) in stats.achievements" 
          :key="index" 
          class="achievement-item"
          :class="{ 'achieved': achievement.achieved }"
        >
          <div class="achievement-icon">
            <svg v-if="achievement.achieved" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </div>
          <div class="achievement-details">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-description">{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForestStats',
  props: {
    stats: {
      type: Object,
      default: () => ({
        treeCount: 0,
        carbonOffset: 0,
        forestLevel: 1,
        lastTreeDate: '-',
        nextLevelProgress: 0,
        treesToNextLevel: 0,
        achievements: []
      })
    }
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }
}
</script>

<style scoped>
.forest-stats {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  width: 100%;
  overflow: hidden;
}

.stats-header {
  margin-bottom: 1.5rem;
}

.stats-title {
  font-size: 1.25rem;
  margin-bottom: 0;
  font-weight: 700;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .stats-content {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stats-item {
  display: flex;
  flex-direction: column;
  background-color: rgba(76, 175, 80, 0.05);
  border-radius: var(--radius-md);
  padding: 0.875rem;
}

.stats-icon {
  width: 36px;
  height: 36px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.stats-details {
  flex: 1;
}

.stats-value {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-heading);
}

.stats-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.forest-progress {
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.progress-value {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.875rem;
}

.progress {
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
}

.progress-info {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: right;
}

.forest-achievements {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.achievements-title {
  font-weight: 600;
  margin-bottom: 1rem;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.achievement-item.achieved {
  background-color: rgba(76, 175, 80, 0.05);
  border-color: rgba(76, 175, 80, 0.2);
}

.achievement-icon {
  color: var(--text-tertiary);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.achievement-item.achieved .achievement-icon {
  color: var(--color-primary);
}

.achievement-details {
  flex: 1;
}

.achievement-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.achievement-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>