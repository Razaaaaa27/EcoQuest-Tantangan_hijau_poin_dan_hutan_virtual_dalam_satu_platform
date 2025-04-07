<template>
  <div class="featured-challenge">
    <div class="featured-challenge-header">
      <h2 class="featured-challenge-title">Tantangan Minggu Ini</h2>
      <router-link to="/challenges" class="featured-challenge-link">
        Lihat Semua
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </router-link>
    </div>
    
    <div class="featured-challenge-content">
      <div class="featured-challenge-image">
        <img :src="challenge.image" :alt="challenge.title" />
        <div class="featured-challenge-badge">FEATURED</div>
      </div>
      
      <div class="featured-challenge-info">
        <div class="challenge-category">
          <span class="challenge-difficulty" :class="challenge.difficulty">
            {{ challenge.difficulty }}
          </span>
          <span class="challenge-type">{{ challenge.type }}</span>
        </div>
        
        <h3 class="featured-challenge-title">{{ challenge.title }}</h3>
        <p class="featured-challenge-description">{{ challenge.description }}</p>
        
        <div class="featured-challenge-meta">
          <div class="featured-challenge-points">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" />
            </svg>
            {{ challenge.points }} poin
          </div>
          
          <div class="featured-challenge-participants">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
            </svg>
            {{ challenge.participants }} peserta
          </div>
          
          <div class="featured-challenge-time">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
            {{ challenge.timeLeft }} tersisa
          </div>
        </div>
        
        <button class="btn btn-primary">Ikuti Tantangan</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FeaturedChallenge',
  data() {
    return {
      challenge: {
        id: 'ch001',
        title: 'Sapu Bersih Pantai',
        description: 'Bergabunglah dengan komunitas untuk membersihkan pantai dari sampah plastik. Dokumentasikan dengan foto sebelum dan sesudah!',
        image: 'https://i.pinimg.com/474x/13/7a/1d/137a1d9d2e9f0786489698390b8c9595.jpg',
        difficulty: 'medium',
        type: 'Komunitas',
        points: 150,
        participants: 324,
        timeLeft: '5 hari',
        category: 'cleanup'
      }
    }
  }
}
</script>


<style scoped>
.featured-challenge {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* tambahkan shadow nyata */
  border: 2px solid #a5d6a7; /* border hijau terang */
  margin-bottom: 2.5rem;
  overflow: hidden;
}


.featured-challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.featured-challenge-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0;
}

.featured-challenge-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  font-weight: 500;
}

.featured-challenge-content {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .featured-challenge-content {
    flex-direction: row;
  }
}

.featured-challenge-image {
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 300px;
  min-height: 250px;
  border-radius: 12px;
  object-fit: cover;
  margin: 0.5rem; /* Tambahkan margin semua sisi */
}


.featured-challenge-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .featured-challenge-image {
    width: 40%;
  }
}

.featured-challenge-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
}

.featured-challenge-info {
  flex: 1.5;
  padding: 2rem;
}

.challenge-category {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.featured-challenge-title {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.featured-challenge-description {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.featured-challenge-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.featured-challenge-points,
.featured-challenge-participants,
.featured-challenge-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.featured-challenge-points svg,
.featured-challenge-participants svg,
.featured-challenge-time svg {
  color: var(--color-primary);
}
</style>