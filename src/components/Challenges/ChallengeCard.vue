<template>
  <div class="challenge-card card" :class="{ 'completed': isCompleted }">
    <div class="challenge-header">
      <div class="challenge-meta">
        <span class="challenge-difficulty" :class="challenge.difficulty">
          {{ challenge.difficulty }}
        </span>
        <span class="challenge-category">{{ challenge.category }}</span>
      </div>
      <div class="challenge-points">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" />
        </svg>
        {{ challenge.points }} poin
      </div>
    </div>
    
    <div class="card-body">
      <h3 class="challenge-title">{{ challenge.title }}</h3>
      <p class="challenge-description">{{ challenge.description }}</p>
      
      <div class="challenge-details">
        <div class="challenge-detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
          </svg>
          <span v-if="challenge.timeLimit">{{ challenge.timeLimit }}</span>
          <span v-else>{{ daysLeft }} hari lagi</span>
        </div>
        
        <div class="challenge-detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
          </svg>
          {{ challenge.participants }} peserta
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <button v-if="isCompleted" class="btn btn-success" disabled>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
        </svg>
        Selesai
      </button>
      <button v-else class="btn btn-primary" @click="completeChallenge">
        Selesaikan Tantangan
      </button>
    </div>
    
    <div v-if="isCompleted" class="completion-badge">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M15.59,10.58L16.17,7.77L14.1,5.7L16.9,5.13L18,2.5L19.1,5.13L21.9,5.7L19.83,7.77L20.41,10.58L18,9.27L15.59,10.58M7.88,3.77L8.29,5.86L6.78,7.36L8.87,7.78L9.8,9.77L10.73,7.78L12.82,7.36L11.31,5.86L11.72,3.77L9.8,4.76L7.88,3.77Z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChallengeCard',
  props: {
    challenge: {
      type: Object,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    daysLeft() {
      if (!this.challenge.endDate) return 7 // Default to a week
      
      const today = new Date()
      const endDate = new Date(this.challenge.endDate)
      const diffTime = endDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays > 0 ? diffDays : 0
    }
  },
  methods: {
    completeChallenge() {
      this.$emit('complete', this.challenge)
    }
  }
}
</script>

<style scoped>
.challenge-card {
  position: relative;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.challenge-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.challenge-card.completed {
  border-left: 4px solid var(--color-success);
  background-color: rgba(76, 175, 80, 0.05);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.challenge-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.challenge-difficulty {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.challenge-difficulty.easy {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.challenge-difficulty.medium {
  background-color: rgba(255, 152, 0, 0.1);
  color: #F57F17;
}

.challenge-difficulty.hard {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-danger);
}

.challenge-category {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.challenge-points {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-primary);
  font-weight: 600;
}

.card-body {
  flex: 1;
  padding: 1.5rem 1rem;
}

.challenge-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.challenge-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.challenge-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: auto;
}

.challenge-detail {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-success {
  background-color: var(--color-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.completion-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--color-success);
}
</style>