<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">
        Gabung <span class="hero-title-highlight">Tantangan Hijau</span> Hari Ini!
      </h1>
      <p class="hero-subtitle">
        Bantu lingkungan melalui aksi nyata yang menyenangkan. Dapatkan poin, tumbuhkan hutan virtual kamu, dan naik peringkat!
      </p>
      <div class="hero-actions">
        <router-link to="/challenges" class="btn btn-primary btn-lg">
          Ikuti Tantangan
        </router-link>
        <router-link to="/leaderboard" class="btn btn-outline btn-lg">
          Lihat Papan Skor
        </router-link>
      </div>
      <div class="hero-stats">
        <div class="hero-stat-item">
          <div class="hero-stat-number">{{ formatNumber(globalStats.treesPlanted) }}</div>
          <div class="hero-stat-label">Pohon Ditanam</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-number">{{ formatNumber(globalStats.usersCount) }}</div>
          <div class="hero-stat-label">Ecowarrior</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-number">{{ formatNumber(globalStats.challengesCompleted) }}</div>
          <div class="hero-stat-label">Tantangan Selesai</div>
        </div>
      </div>
    </div>
    <div class="hero-image">
      <img src="https://i.pinimg.com/originals/0f/a3/da/0fa3dafffb04721fe538596eef9247c7.gif" alt="EcoQuest Hero" />

    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      globalStats: {
        treesPlanted: 12587,
        usersCount: 3456,
        challengesCompleted: 42879
      }
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
.hero {
  position: relative;
  min-height: .550px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #f0f8f1;
  border-radius: var(--radius-lg);
  margin-bottom: 4rem;
  margin-top:2rem;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;
  max-width: 600px;
}

.hero-title {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--text-heading);
}

.hero-title-highlight {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}

.hero-title-highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: rgba(76, 175, 80, 0.2);
  z-index: -1;
  border-radius: 4px;
}

.hero-subtitle {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  
}

.hero-stat-item {
  text-align: center;
}

.hero-stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.hero-stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.hero-image {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 50%;
  display: none;
  object-fit: cover;
  transform: scale(1.1) translateX(-10px);

  
}



.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 1024px) {
  .hero-content {
    padding: 4rem;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-image {
    display: block;
  }
}
</style>