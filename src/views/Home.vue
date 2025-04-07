<template>
  <div class="home">
    <div class="container">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- User Stats -->
      <StatsSummary />
      
      <!-- Featured Challenge -->
      <FeaturedChallenge />
      
      <!-- Upcoming Challenges -->
      <div class="upcoming-challenges section">
        <div class="section-header">
          <h2 class="section-title">Tantangan Mendatang</h2>
          <router-link to="/challenges" class="section-link">
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </router-link>
        </div>
        
        <div class="challenges-grid">
          <div v-for="challenge in upcomingChallenges" :key="challenge.id" class="challenge-card card">
            <div class="challenge-card-header">
              <span class="challenge-difficulty" :class="challenge.difficulty">
                {{ challenge.difficulty }}
              </span>
              <span class="challenge-points">{{ challenge.points }} poin</span>
            </div>
            <div class="card-body">
              <h3 class="challenge-card-title">{{ challenge.title }}</h3>
              <p class="challenge-card-description">{{ challenge.description }}</p>
              <div class="challenge-card-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                </svg>
                Mulai {{ challenge.startDate }}
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline btn-sm">Pengingat</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Top Performers -->
      <div class="top-performers section">
        <div class="section-header">
          <h2 class="section-title">Top Performers</h2>
          <router-link to="/leaderboard" class="section-link">
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </router-link>
        </div>
        
        <div class="performers-grid">
          <div v-for="(user, index) in topUsers" :key="user.id" class="performer-card">
            <div class="performer-rank" :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }">
              #{{ index + 1 }}
            </div>
            <img :src="user.avatar" :alt="user.username" class="performer-avatar" />
            <div class="performer-info">
              <div class="performer-name">{{ user.username }}</div>
              <div class="performer-points">{{ user.points }} poin</div>
            </div>
            <div class="performer-badge">
              <img :src="getBadgeImage(index)" :alt="'Badge ' + (index + 1)" class="badge-image" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Latest From Community -->
      <div class="latest-community section">
        <div class="section-header">
          <h2 class="section-title">Terbaru dari Komunitas</h2>
          <router-link to="/community" class="section-link">
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </router-link>
        </div>
        
        <div class="community-grid">
          <div v-for="post in communityPosts" :key="post.id" class="community-card card">
            <div class="community-card-header">
              <img :src="post.authorAvatar" :alt="post.author" class="author-avatar avatar avatar-sm" />
              <div class="post-author-info">
                <div class="post-author">{{ post.author }}</div>
                <div class="post-date">{{ post.date }}</div>
              </div>
            </div>
            <div class="card-body">
              <p class="post-content">{{ post.content }}</p>
              <img v-if="post.image" :src="post.image" :alt="'Post by ' + post.author" class="post-image" />
            </div>
            <div class="card-footer post-actions">
              <div class="post-action">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
                {{ post.likes }}
              </div>
              <div class="post-action">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M3,15H1V3A2,2 0 0,1 3,1H17V3H3V15Z" />
                </svg>
                {{ post.comments }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeroSection from '@/components/home/HeroSection.vue'
import StatsSummary from '@/components/home/StatsSummary.vue'
import FeaturedChallenge from '@/components/home/FeaturedChallenge.vue'
import badgeGold from '@/assets/images/gold-medal.svg';
import badgeSilver from '@/assets/images/silver-medal.svg';
import badgeBronze from '@/assets/images/bronze-medal.svg';
import badgemedal from '@/assets/images/medal.svg';

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    StatsSummary,
    FeaturedChallenge
  },
  data() {
    return {
      upcomingChallenges: [
        {
          id: 'ch002',
          title: 'Hemat Daya Listrik',
          description: 'Kurangi konsumsi listrik rumah selama sepekan dan dokumentasikan hasilnya!',
          startDate: '12 Juni 2023',
          difficulty: 'easy',
          points: 75
        },
        {
          id: 'ch003',
          title: 'Belanja Tanpa Plastik',
          description: 'Gunakan tas belanja sendiri dan hindari kemasan plastik sekali pakai selama seminggu.',
          startDate: '15 Juni 2023',
          difficulty: 'medium',
          points: 100
        },
        {
          id: 'ch004',
          title: 'Tanam 5 Pohon',
          description: 'Ajak 4 temanmu untuk menanam pohon di lingkungan sekitar atau taman kota.',
          startDate: '20 Juni 2023',
          difficulty: 'hard',
          points: 200
        }
      ],
      topUsers: [
         {
    id: 'user1',
    username: 'RazaWarrior',
    points: 3450,
    
   avatar: 'https://ui-avatars.com/api/?name=Raza+Warrior&background=random',
  },
  {
    id: 'user2',
    username: 'bobon santoso',
    points: 3280,
    avatar: 'https://ui-avatars.com/api/?name=bobon+santoso&background=random'
  },
  {
    id: 'user3',
    username: 'tarizrizkii',
    points: 3150,
    avatar: 'https://ui-avatars.com/api/?name=tarizrizkii&background=random'
  },
  {
    id: 'user4',
    username: 'oceanGuardian',
    points: 2950,
    avatar: 'https://ui-avatars.com/api/?name=ocean+Guardian&background=random'
  },
  {
    id: 'user5',
    username: 'earthHero',
    points: 2840,
    avatar: 'https://ui-avatars.com/api/?name=earth+Hero&background=random'
  }
      ],
      communityPosts: [
        {
          id: 'post1',
          author: 'greenWarrior',
          authorAvatar: '/src/assets/images/avatars/user1.jpg',
          content: 'Baru selesai tantangan Sapu Bersih Pantai! Kami mengumpulkan lebih dari 20 kantong sampah plastik. Bangga dengan tim kami!',
          image: '/src/assets/images/beach-cleanup.jpg',
          date: '2 jam lalu',
          likes: 42,
          comments: 8
        },
        {
          id: 'post2',
          author: 'ecoNinja',
          authorAvatar: '/src/assets/images/avatars/user2.jpg',
          content: 'Hari ketiga tantangan Belanja Tanpa Plastik. Ternyata lebih mudah dari yang kukira! Cukup siapkan tas belanja dan wadah sendiri. Kalian juga bisa!',
          image: null,
          date: '5 jam lalu',
          likes: 35,
          comments: 12
        }
      ]
    }
  },
  methods: {
    getBadgeImage(index) {
         if (index === 0) return badgeGold;
    if (index === 1) return badgeSilver;
    if (index === 2) return badgeBronze;
    return badgemedal;
    }
  }
}
</script> 

<style scoped>
.section {
  margin-bottom: -1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 0;
}

.section-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

/* Upcoming Challenges */
.challenges-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .challenges-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.challenge-card {
  height: 100%;
  border-top: 3px solid var(--color-primary);
}

.challenge-card-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.challenge-card-title {
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
}

.challenge-card-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.challenge-card-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* Top Performers */
.performers-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .performers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .performers-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.performer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  text-align: center;
  position: relative;
  transition: all var(--transition-fast);
}

.performer-card:hover {
  transform: translateY(-5px);
}

.performer-rank {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.performer-rank.top-1 {
  color: var(--color-gold);
}

.performer-rank.top-2 {
  color: var(--color-silver);
}

.performer-rank.top-3 {
  color: var(--color-bronze);
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

.performer-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.performer-points {
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.badge-image {
  width: 32px;
  height: 32px;
}

/* Community Posts */
.community-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .community-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.community-card {
  height: 100%;
}

.community-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.post-author {
  font-weight: 600;
  font-size: 0.875rem;
}

.post-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.post-content {
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.post-image {
  width: 100%;
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
}

.post-actions {
  display: flex;
  gap: 1.5rem;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}
</style>