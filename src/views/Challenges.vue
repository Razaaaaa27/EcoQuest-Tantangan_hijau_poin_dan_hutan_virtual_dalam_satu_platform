<template>
  <div class="challenges-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Tantangan Hijau</h1>
        <div class="page-actions">
          <button class="btn btn-sm" @click="toggleFilterMobile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3H19C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
            </svg>
            Filter
          </button>
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
            <input 
            
              type="text" 
              placeholder="Cari tantangan..." 
              v-model="searchQuery"
              @input="filterChallenges"
            />
          </div>
        </div>
      </div>
      
      <div class="challenges-layout">
        <aside class="filter-sidebar" :class="{ 'show': showFilterMobile }">
          <ChallengeFilter @filter-changed="applyFilters" />
        </aside>
        
        <main class="challenges-main">
          <div class="challenges-header">
            <div class="challenges-count">
              Menampilkan {{ filteredChallenges.length }} tantangan
            </div>
            <div class="challenges-sort">
              <span>Urutkan:</span>
              <select v-model="sortOption" @change="sortChallenges">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="points-high">Poin Tertinggi</option>
                <option value="points-low">Poin Terendah</option>
                <option value="popularity">Popularitas</option>
              </select>
            </div>
          </div>
          
          <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat tantangan...</p>
          </div>
          
          <div v-else-if="filteredChallenges.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2M12.19,5.5C11.3,5.5 10.59,5.68 10.05,6.04C9.5,6.4 9.22,7 9.27,7.69H11.24C11.24,7.41 11.34,7.2 11.5,7.06C11.7,6.92 11.92,6.85 12.19,6.85C12.5,6.85 12.77,6.93 12.95,7.11C13.13,7.28 13.22,7.5 13.22,7.8C13.22,8.08 13.14,8.33 13,8.54C12.83,8.76 12.62,8.94 12.36,9.08C11.84,9.4 11.5,9.68 11.29,9.92C11.1,10.16 11,10.5 11,11H13C13,10.72 13.05,10.5 13.14,10.32C13.23,10.15 13.4,10 13.66,9.85C14.12,9.64 14.5,9.36 14.79,9C15.08,8.63 15.23,8.24 15.23,7.8C15.23,7.1 14.96,6.54 14.42,6.12C13.88,5.71 13.13,5.5 12.19,5.5M11,12V14H13V12H11Z" />
            </svg>
            <h3>Tidak ada tantangan yang ditemukan</h3>
            <p>Coba ubah filter atau cari dengan kata kunci berbeda</p>
            <button class="btn btn-primary" @click="resetFilters">Reset Filter</button>
          </div>
          
          <div v-else class="challenges-grid">
          
            <ChallengeCard 
              v-for="challenge in filteredChallenges" 
              :key="challenge.id"
              :challenge="challenge"
              :isCompleted="isCompleted(challenge.id)"
              @complete="completeChallenge"
            />
          </div>
          
          <div class="load-more" v-if="hasMoreChallenges && !isLoading">
            <button class="btn btn-outline" @click="loadMoreChallenges">
              Muat Lebih Banyak
            </button>
          </div>
        </main>
      </div>
    </div>
    
    <!-- Mobile filter overlay -->
    <div 
      v-if="showFilterMobile" 
      class="filter-overlay"
      @click="showFilterMobile = false"
    ></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChallengeCard from '@/components/challenges/ChallengeCard.vue'
import ChallengeFilter from '@/components/challenges/ChallengeFilter.vue'

export default {
  name: 'ChallengesView',
  components: {
    ChallengeCard,
    ChallengeFilter
  },
  data() {
    return {
      isLoading: false,
      challenges: [],
      filteredChallenges: [],
      page: 1,
      limit: 9,
      hasMoreChallenges: true,
      searchQuery: '',
      sortOption: 'newest',
      activeFilters: {
        categories: [],
        difficulties: [],
        statuses: ['active'],
        minPoints: 0
      },
      showFilterMobile: false
    }
  },
  computed: {
    ...mapGetters({
      completedChallenges: 'user/getCompletedChallenges'
    })
  },
  created() {
    this.loadChallenges()
  },
  methods: {
    ...mapActions({
      completeUserChallenge: 'user/completeChallenge'
    }),
    async loadChallenges() {
      this.isLoading = true
      
      try {
        // Simulate API request with mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const newChallenges = [
          {
            id: 'ch001',
            title: 'Sapu Bersih Pantai',
            description: 'Bergabunglah dengan komunitas untuk membersihkan pantai dari sampah plastik. Dokumentasikan dengan foto sebelum dan sesudah!',
            type: 'cleanup',
            category: 'Konservasi',
            difficulty: 'medium',
            points: 150,
            participants: 324,
            endDate: '2023-06-30',
            status: 'active'
          },
          {
            id: 'ch002',
            title: 'Hemat Daya Listrik',
            description: 'Kurangi konsumsi listrik rumah selama sepekan dan dokumentasikan hasilnya!',
            type: 'energy',
            category: 'Energi Hijau',
            difficulty: 'easy',
            points: 75,
            participants: 156,
            endDate: '2023-06-25',
            status: 'active'
          },
          {
            id: 'ch003',
            title: 'Belanja Tanpa Plastik',
            description: 'Gunakan tas belanja sendiri dan hindari kemasan plastik sekali pakai selama seminggu.',
            type: 'recycle',
            category: 'Daur Ulang',
            difficulty: 'medium',
            points: 100,
            participants: 245,
            endDate: '2023-06-28',
            status: 'active'
          },
          {
            id: 'ch004',
            title: 'Tanam 5 Pohon',
            description: 'Ajak 4 temanmu untuk menanam pohon di lingkungan sekitar atau taman kota.',
            type: 'plantation',
            category: 'Penanaman',
            difficulty: 'hard',
            points: 200,
            participants: 72,
            endDate: '2023-07-15',
            status: 'active'
          },
          {
            id: 'ch005',
            title: 'Hemat Air 7 Hari',
            description: 'Lakukan penghematan air di rumah selama seminggu dan catat penggunaan air harianmu.',
            type: 'water',
            category: 'Penghematan Air',
            difficulty: 'easy',
            points: 80,
            participants: 198,
            endDate: '2023-06-22',
            status: 'active'
          },
          {
            id: 'ch006',
            title: 'Sosialisasi Daur Ulang',
            description: 'Buat materi edukasi tentang daur ulang dan bagikan ke 10 orang di lingkunganmu.',
            type: 'education',
            category: 'Edukasi',
            difficulty: 'medium',
            points: 120,
            participants: 89,
            endDate: '2023-07-05',
            status: 'active'
          },
          {
            id: 'ch007',
            title: 'Diet Plastik Sebulan',
            description: 'Hindari penggunaan plastik sekali pakai dalam kegiatan sehari-hari selama 30 hari.',
            type: 'recycle',
            category: 'Daur Ulang',
            difficulty: 'hard',
            points: 250,
            participants: 113,
            endDate: '2023-07-30',
            status: 'active'
          },
          {
            id: 'ch008',
            title: 'Car Free Day',
            description: 'Tinggalkan kendaraan bermotor dan gunakan transportasi umum atau sepeda selama seminggu.',
            type: 'energy',
            category: 'Energi Hijau',
            difficulty: 'medium',
            points: 100,
            participants: 178,
            endDate: '2023-06-27',
            status: 'active'
          },
          {
            id: 'ch009',
            title: 'Kompos Rumahan',
            description: 'Buat sistem kompos sederhana di rumah untuk mengolah sampah organik dapur.',
            type: 'recycle',
            category: 'Daur Ulang',
            difficulty: 'medium',
            points: 130,
            participants: 67,
            endDate: '2023-07-10',
            status: 'active'
          }
        ]
        
        this.challenges = [...this.challenges, ...newChallenges]
        this.filterChallenges()
        
        // Check if we've reached the end of available challenges
        if (this.page >= 3) { // Simulate only having 3 pages
          this.hasMoreChallenges = false
        }
        
        this.page++
      } catch (error) {
        console.error('Error loading challenges:', error)
      } finally {
        this.isLoading = false
      }
    },
    loadMoreChallenges() {
      this.loadChallenges()
    },
    applyFilters(filters) {
      this.activeFilters = filters
      this.filterChallenges()
    },
    filterChallenges() {
      let filtered = [...this.challenges]
      
      // Apply search filter
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(challenge => 
          challenge.title.toLowerCase().includes(query) || 
          challenge.description.toLowerCase().includes(query) ||
          challenge.category.toLowerCase().includes(query)
        )
      }
      
      // Apply category filter
      if (this.activeFilters.categories.length > 0) {
        filtered = filtered.filter(challenge => 
          this.activeFilters.categories.includes(challenge.type)
        )
      }
      
      // Apply difficulty filter
      if (this.activeFilters.difficulties.length > 0) {
        filtered = filtered.filter(challenge => 
          this.activeFilters.difficulties.includes(challenge.difficulty)
        )
      }
      
      // Apply status filter
      if (this.activeFilters.statuses.length > 0) {
        filtered = filtered.filter(challenge => 
          this.activeFilters.statuses.includes(challenge.status)
        )
        
        // Include completed challenges if selected
        if (this.activeFilters.statuses.includes('completed')) {
          const completedIds = this.completedChallenges.map(c => c.id)
          filtered = filtered.filter(challenge => 
            challenge.status === 'completed' || 
            completedIds.includes(challenge.id) ||
            this.activeFilters.statuses.includes(challenge.status)
          )
        }
      }
      
      // Apply points filter
      if (this.activeFilters.minPoints > 0) {
        filtered = filtered.filter(challenge => 
          challenge.points >= this.activeFilters.minPoints
        )
      }
      
      // Apply sorting
      this.sortFilteredChallenges(filtered)
    },
    sortChallenges() {
      this.sortFilteredChallenges(this.filteredChallenges)
    },
    sortFilteredChallenges(challenges) {
      let sorted = [...challenges]
      
      switch (this.sortOption) {
        case 'newest':
          // Assuming newer challenges have more recent end dates
          sorted.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          break
        case 'oldest':
          sorted.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          break
        case 'points-high':
          sorted.sort((a, b) => b.points - a.points)
          break
        case 'points-low':
          sorted.sort((a, b) => a.points - b.points)
          break
        case 'popularity':
          sorted.sort((a, b) => b.participants - a.participants)
          break
      }
      
      this.filteredChallenges = sorted
    },
    isCompleted(challengeId) {
      return this.completedChallenges.some(challenge => challenge.id === challengeId)
    },
    completeChallenge(challenge) {
      this.completeUserChallenge(challenge)
      
      // Show success message
      this.$store.dispatch('addNotification', {
        type: 'success',
        message: `Tantangan "${challenge.title}" berhasil diselesaikan! +${challenge.points} poin`,
        timeout: 5000
      })
    },
    resetFilters() {
      this.searchQuery = ''
      this.activeFilters = {
        categories: [],
        difficulties: [],
        statuses: ['active'],
        minPoints: 0
      }
      this.filterChallenges()
    },
    toggleFilterMobile() {
      this.showFilterMobile = !this.showFilterMobile
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
}

.page-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  width: 250px;
}

.search-box svg {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--transition-fast);
}

.search-box input:focus {
  border-color: var(--color-primary);
}

.challenges-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .challenges-layout {
    grid-template-columns: 280px 1fr;
  }
}

.filter-sidebar {
  display: block;
}

.challenges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.challenges-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  
}

.challenges-sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.challenges-sort span {
  color: var(--text-secondary);
}

.challenges-sort select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .challenges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .challenges-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

/* Mobile filter */
@media (max-width: 1023px) {
  .filter-sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-modal);
    max-height: 80vh;
    overflow-y: auto;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    box-shadow: var(--shadow-lg);
    transform: translateY(100%);
    transition: transform var(--transition-normal);
  }
  
  .filter-sidebar.show {
    transform: translateY(0);
  }
  
  .filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: calc(var(--z-modal) - 1);
  }
}
</style>