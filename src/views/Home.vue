<template>
  <div class="home">
    <div class="container">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- User Stats (only show if authenticated) -->
      <StatsSummary v-if="isAuthenticated" />
      
      <!-- Featured Challenge -->
      <FeaturedChallenge />
      
      <!-- Upcoming Challenges -->
      <div class="upcoming-challenges section">
        <div class="section-header">
          <h2 class="section-title">Tantangan Terbaru</h2>
          <router-link to="/challenges" class="section-link">
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </router-link>
        </div>
        
        <div v-if="challengesLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat tantangan...</p>
        </div>
        
        <div v-else class="challenges-grid">
          <div v-for="challenge in upcomingChallenges" :key="challenge._id" class="challenge-card card">
            <div class="challenge-card-header">
              <span class="challenge-difficulty" :class="challenge.difficulty">
                {{ getDifficultyLabel(challenge.difficulty) }}
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
                {{ formatDate(challenge.createdAt) }}
              </div>
            </div>
            <div class="card-footer">
              <button 
                class="btn btn-outline btn-sm"
                @click="handleChallengeAction(challenge)"
              >
                {{ getChallengeActionText(challenge) }}
              </button>
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

        <div v-if="leaderboardLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat leaderboard...</p>
        </div>

        <div v-else class="scroll-wrapper">
          <div class="performers-grid scrolling">
            <!-- Original users -->
            <div
              v-for="(user, index) in topUsers"
              :key="`original-${user._id || user.id}-${index}`"
              class="performer-card"
            >
              <div class="performer-rank" :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }">
                #{{ index + 1 }}
              </div>
              <img :src="user.avatar" :alt="user.username" class="performer-avatar" />
              <div class="performer-info">
                <div class="performer-name">{{ user.username }}</div>
                <div class="performer-points">{{ formatNumber(user.gameStats?.totalPoints || user.points || 0) }} poin</div>
              </div>
              <div class="performer-badge">
                <img :src="getBadgeImage(index)" :alt="'Badge ' + (index + 1)" class="badge-image" />
              </div>
            </div>
            
            <!-- Duplicated users for seamless scrolling -->
            <div
              v-for="(user, index) in topUsers"
              :key="`duplicate-${user._id || user.id}-${index}`"
              class="performer-card"
            >
              <div class="performer-rank" :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }">
                #{{ index + 1 }}
              </div>
              <img :src="user.avatar" :alt="user.username" class="performer-avatar" />
              <div class="performer-info">
                <div class="performer-name">{{ user.username }}</div>
                <div class="performer-points">{{ formatNumber(user.gameStats?.totalPoints || user.points || 0) }} poin</div>
              </div>
              <div class="performer-badge">
                <img :src="getBadgeImage(index)" :alt="'Badge ' + (index + 1)" class="badge-image" />
              </div>
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
        
        <div v-if="communityLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat postingan...</p>
        </div>
        
        <div v-else class="community-grid">
          <div v-for="post in communityPosts" :key="post._id || post.id" class="community-card card">
            <div class="community-card-header">
              <img :src="post.author?.avatar || post.authorAvatar" :alt="post.author?.username || post.author" class="author-avatar avatar avatar-sm" />
              <div class="post-author-info">
                <div class="post-author">{{ post.author?.username || post.author }}</div>
                <div class="post-date">{{ formatDate(post.createdAt || post.date) }}</div>
              </div>
            </div>
            <div class="card-body">
              <p class="post-content">{{ post.content }}</p>
              <img v-if="post.images && post.images[0]" :src="post.images[0]" :alt="'Post by ' + (post.author?.username || post.author)" class="post-image" />
            </div>
            <div class="card-footer post-actions">
              <div class="post-action">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
                {{ post.likeCount || post.likes || 0 }}
              </div>
              <div class="post-action">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M3,15H1V3A2,2 0 0,1 3,1H17V3H3V15Z" />
                </svg>
                {{ post.commentCount || post.comments?.length || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HeroSection from '@/components/home/HeroSection.vue'
import StatsSummary from '@/components/home/StatsSummary.vue'
import FeaturedChallenge from '@/components/home/FeaturedChallenge.vue'
import { challengeService } from '@/services/challengeService'
import { leaderboardService } from '@/services/leaderboardService'
import { communityService } from '@/services/communityService'
import badgeGold from '@/assets/images/gold-medal.svg'
import badgeSilver from '@/assets/images/silver-medal.svg'
import badgeBronze from '@/assets/images/bronze-medal.svg'
import badgemedal from '@/assets/images/medal.svg'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    StatsSummary,
    FeaturedChallenge
  },
  data() {
    return {
      upcomingChallenges: [],
      topUsers: [],
      communityPosts: [],
      challengesLoading: false,
      leaderboardLoading: false,
      communityLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  },
  async created() {
    await Promise.all([
      this.loadChallenges(),
      this.loadTopUsers(),
      this.loadCommunityPosts()
    ])
  },
  methods: {
    ...mapActions({
      joinChallenge: 'challenges/joinChallenge',
      completeChallenge: 'challenges/completeChallenge'
    }),

    async loadChallenges() {
      this.challengesLoading = true
      try {
        const data = await challengeService.getChallenges({ 
          limit: 3, 
          sort: '-createdAt',
          status: 'active'
        })
        this.upcomingChallenges = data.challenges || []
      } catch (error) {
        console.error('Error loading challenges:', error)
        this.upcomingChallenges = []
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Gagal memuat tantangan',
          timeout: 3000
        })
      } finally {
        this.challengesLoading = false
      }
    },

    async loadTopUsers() {
      this.leaderboardLoading = true
      try {
        const users = await leaderboardService.getTopUsers()
        this.topUsers = users || []
      } catch (error) {
        console.error('Error loading top users:', error)
        this.topUsers = []
        // Don't show error notification for leaderboard as it's not critical
      } finally {
        this.leaderboardLoading = false
      }
    },

    async loadCommunityPosts() {
      this.communityLoading = true
      try {
        const data = await communityService.getPosts({ limit: 2, sort: '-createdAt' })
        this.communityPosts = data.posts || []
      } catch (error) {
        console.error('Error loading community posts:', error)
        this.communityPosts = []
        // Don't show error notification for community as it's not critical
      } finally {
        this.communityLoading = false
      }
    },

    async handleChallengeAction(challenge) {
      if (!this.isAuthenticated) {
        this.$store.dispatch('addNotification', {
          type: 'info',
          message: 'Silakan login untuk mengikuti tantangan',
          timeout: 3000
        })
        this.$router.push('/login')
        return
      }

      try {
        if (challenge.userStatus === 'not-joined' || !challenge.userStatus) {
          await this.joinChallenge(challenge._id)
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Berhasil bergabung dengan tantangan!',
            timeout: 3000
          })
        } else if (challenge.userStatus === 'joined') {
          await this.completeChallenge({
            challengeId: challenge._id,
            submissionData: {
              submissionText: 'Completed from home page'
            }
          })
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Tantangan berhasil diselesaikan!',
            timeout: 3000
          })
        }
        
        // Reload challenges to update status
        await this.loadChallenges()
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Terjadi kesalahan',
          timeout: 5000
        })
      }
    },

    getChallengeActionText(challenge) {
      if (!this.isAuthenticated) return 'Login untuk Ikuti'
      
      switch (challenge.userStatus) {
        case 'completed':
          return 'Selesai'
        case 'joined':
          return 'Selesaikan'
        default:
          return 'Ikuti Tantangan'
      }
    },

    getDifficultyLabel(difficulty) {
      const labels = {
        easy: 'Mudah',
        medium: 'Sedang',
        hard: 'Sulit'
      }
      return labels[difficulty] || difficulty
    },

    getBadgeImage(index) {
      if (index === 0) return badgeGold
      if (index === 1) return badgeSilver
      if (index === 2) return badgeBronze
      return badgemedal
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Kemarin'
      if (diffDays < 7) return `${diffDays} hari lalu`
      return date.toLocaleDateString('id-ID')
    },

    formatNumber(num) {
      if (!num) return '0'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }
}
</script>

<style scoped>
.section {
  margin-bottom: -31px;
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
  font-family: "Tagesschrift", system-ui;
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

/* Top Performers with Continuous Scrolling */
.top-performers {
  overflow: hidden; /* Hide overflow */
}

.scroll-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
}

.performers-grid.scrolling {
  display: flex;
  width: fit-content; /* Allow content to determine width */
  animation: scroll-left 20s linear infinite; /* Adjust speed with the time value */
}

.performers-grid.scrolling .performer-card {
  flex: 0 0 200px; /* Fixed width for each card */
  margin-right: 1rem;
  height: 240px; /* Fixed height to maintain consistency */
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

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    /* Move by -50% because we have duplicated the items */
    transform: translateX(-50%);
  }
}

/* Pause animation on hover - optional */
.scroll-wrapper:hover .performers-grid.scrolling {
  animation-play-state: paused;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
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

/* Regular performers grid (if needed elsewhere) */
.performers-grid:not(.scrolling) {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .performers-grid:not(.scrolling) {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .performers-grid:not(.scrolling) {
    grid-template-columns: repeat(5, 1fr);
  }
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

.post-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Challenge difficulty colors */
.challenge-difficulty {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.challenge-difficulty.easy {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.challenge-difficulty.medium {
  background-color: #fff3e0;
  color: #ef6c00;
}

.challenge-difficulty.hard {
  background-color: #ffebee;
  color: #c62828;
}

/* Styling untuk bagian Tantangan Mendatang dengan warna #1f1f1f */
.upcoming-challenges.section {
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  padding: 20px;
   border-radius: var(--radius-lg);
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* tambahkan shadow nyata */
  border: 2px solid #a5d6a7; /* border hijau terang */
  margin-bottom: 20px;
  background-color: var(--bg-secondary);
}



.section-title {
  font-size: 18px;
  font-weight: 600;
   color: var(--text-secondary);
  margin: 0;
}

.section-link {
  display: flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.section-link:hover {
  color: #5dade2;
}

.section-link svg {
  margin-left: 5px;
}

/* Hover effect pada bingkai */
.upcoming-challenges.section:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s ease;
}

</style>