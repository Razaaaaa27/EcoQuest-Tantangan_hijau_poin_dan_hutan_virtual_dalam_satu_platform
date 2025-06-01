<template>
  <div class="ecoedu-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">EcoEdu</h1>
        <div class="page-actions">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
            <input 
              type="text" 
              placeholder="Cari materi edukasi..." 
              v-model="searchQuery"
              @input="debounceSearch"
            />
          </div>
        </div>
      </div>
      
      <div class="ecoedu-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-btn" 
          :class="{ 'active': activeTab === tab.value }"
          @click="setActiveTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="ecoedu-filters">
        <div class="filter-group">
          <label for="category-filter">Kategori:</label>
          <select id="category-filter" v-model="filters.category" @change="filterContent">
            <option value="">Semua</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="difficulty-filter">Tingkat Kesulitan:</label>
          <select id="difficulty-filter" v-model="filters.difficulty" @change="filterContent">
            <option value="">Semua</option>
            <option value="beginner">Pemula</option>
            <option value="intermediate">Menengah</option>
            <option value="advanced">Lanjut</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-by">Urutkan:</label>
          <select id="sort-by" v-model="filters.sort" @change="filterContent">
            <option value="-createdAt">Terbaru</option>
            <option value="createdAt">Terlama</option>
            <option value="-views">Paling Populer</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Memuat materi edukasi...</p>
      </div>
      
      <div v-else-if="content.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3C7.79,3 3.7,4.41 0.38,7C4.41,12.06 7.89,16.37 12,21.5C16.08,16.42 20.24,11.24 23.65,7C20.32,4.41 16.22,3 12,3M12,5C15.07,5 18.09,5.86 20.71,7.45L20.27,7.93C18.28,10.27 15.39,13.54 12,17.3C8.6,13.53 5.71,10.25 3.72,7.93L3.29,7.45C5.91,5.86 8.93,5 12,5Z" />
        </svg>
        <h3>Tidak ada materi edukasi</h3>
        <p>Coba ubah filter atau cari dengan kata kunci berbeda</p>
        <button class="btn btn-primary" @click="resetFilters">Reset Filter</button>
      </div>
      
      <div v-else class="ecoedu-grid">
        <EduCard 
          v-for="item in content" 
          :key="item._id"
          :content="item"
          @view="viewContent"
          @like="handleLike"
          @bookmark="handleBookmark"
        />
      </div>
      
      <div class="load-more" v-if="pagination.page < pagination.pages && !loading">
        <button class="btn btn-outline" @click="loadMoreContent">
          Muat Lebih Banyak
        </button>
      </div>
    </div>
    
    <!-- Content Detail Modal -->
    <div v-if="selectedContent" class="modal-overlay" @click="selectedContent = null">
      <div class="modal-content content-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedContent.title }}</h3>
          <button class="modal-close" @click="selectedContent = null">×</button>
        </div>
        <div class="modal-body">
          <div class="content-header">
            <div class="content-type" :class="selectedContent.type">
              {{ formatType(selectedContent.type) }}
            </div>
            <div class="content-category">{{ selectedContent.category }}</div>
            <div v-if="selectedContent.difficulty" class="content-difficulty">
              {{ formatDifficulty(selectedContent.difficulty) }}
            </div>
          </div>
          
          <div v-if="selectedContent.type === 'video'" class="content-video">
            <div class="video-placeholder" v-if="!selectedContent.videoUrl">
              <img :src="selectedContent.thumbnail" :alt="selectedContent.title" />
              <div class="play-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </div>
            </div>
            <video v-else controls class="content-video-player">
              <source :src="selectedContent.videoUrl" type="video/mp4">
              Browser Anda tidak mendukung tag video.
            </video>
          </div>
          
          <div v-else-if="selectedContent.type === 'infographic'" class="content-infographic">
            <img :src="selectedContent.thumbnail" :alt="selectedContent.title" class="infographic-image" />
          </div>
          
          <div class="content-details">
            <p class="content-description">{{ selectedContent.fullContent || selectedContent.description }}</p>
            
            <div class="content-meta">
              <div class="content-author">
                <img :src="selectedContent.author.avatar" :alt="selectedContent.author.name" class="author-avatar" />
                <div class="author-info">
                  <div class="author-name">{{ selectedContent.author.name }}</div>
                  <div class="author-role">{{ selectedContent.author.role }}</div>
                </div>
              </div>
              <div class="content-stats">
                <div class="content-date">
                  Diterbitkan pada {{ formatDate(selectedContent.createdAt) }}
                </div>
                <div class="content-views">{{ selectedContent.views }} tayangan</div>
                <div v-if="selectedContent.readTime" class="content-read-time">
                  {{ selectedContent.readTime }} menit baca
                </div>
              </div>
            </div>
            
            <div class="content-actions">
              <button 
                class="action-btn" 
                :class="{ active: selectedContent.isLiked }"
                @click="toggleLike(selectedContent._id)"
                :disabled="actionLoading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
                </svg>
                {{ selectedContent.likeCount || 0 }}
              </button>
              <button class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
                </svg>
                Bagikan
              </button>
              <button 
                class="action-btn" 
                :class="{ active: selectedContent.isBookmarked }"
                @click="toggleBookmark(selectedContent._id)"
                :disabled="actionLoading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
                Simpan
              </button>
            </div>
          </div>
          
          <!-- Comments Section -->
          <div class="comments-section">
            <h4>Komentar ({{ selectedContent.commentCount || 0 }})</h4>
            
            <div class="comment-form" v-if="$store.getters.isAuthenticated">
              <textarea 
                v-model="newComment" 
                placeholder="Tulis komentar..."
                rows="3"
                :disabled="actionLoading"
              ></textarea>
              <button 
                @click="addComment" 
                class="btn btn-primary"
                :disabled="!newComment.trim() || actionLoading"
              >
                Kirim Komentar
              </button>
            </div>
            
            <div class="comments-list">
              <div 
                v-for="comment in selectedContent.comments" 
                :key="comment._id"
                class="comment-item"
              >
                <img 
                  :src="comment.author?.avatar || '/default-avatar.png'" 
                  :alt="comment.author?.username" 
                  class="comment-avatar" 
                />
                <div class="comment-content">
                  <div class="comment-author">{{ comment.author?.username }}</div>
                  <div class="comment-text">{{ comment.text }}</div>
                  <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="related-content" v-if="relatedContent.length > 0">
            <h4>Materi Terkait</h4>
            <div class="related-items">
              <div 
                v-for="item in relatedContent" 
                :key="item._id"
                class="related-item"
                @click="viewContent(item._id)"
              >
                <img :src="item.thumbnail" :alt="item.title" class="related-thumbnail" />
                <div class="related-info">
                  <div class="related-title">{{ item.title }}</div>
                  <div class="related-type">{{ formatType(item.type) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EduCard from '@/components/ecoedu/EduCard.vue'
import { ecoEduService } from '@/services/EcoEduServices'

export default {
  name: 'EcoEduView',
  components: {
    EduCard
  },
  data() {
    return {
      content: [],
      loading: false,
      actionLoading: false,
      searchQuery: '',
      activeTab: 'all',
      filters: {
        category: '',
        difficulty: '',
        sort: '-createdAt'
      },
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      },
      selectedContent: null,
      relatedContent: [],
      newComment: '',
      searchTimeout: null,
      tabs: [
        { value: 'all', label: 'Semua' },
        { value: 'article', label: 'Artikel' },
        { value: 'video', label: 'Video' },
        { value: 'infographic', label: 'Infografis' }
      ],
      categories: [
        'Perubahan Iklim',
        'Konservasi Air',
        'Energi Terbarukan',
        'Pengelolaan Sampah',
        'Pertanian Berkelanjutan',
        'Biodiversitas'
      ]
    }
  },
  created() {
    this.loadContent()
  },
  methods: {
    async loadContent(loadMore = false) {
      this.loading = true
      
      try {
        const params = {
          page: loadMore ? this.pagination.page + 1 : 1,
          limit: this.pagination.limit,
          sort: this.filters.sort
        }
        
        if (this.activeTab !== 'all') {
          params.type = this.activeTab
        }
        
        if (this.filters.category) {
          params.category = this.filters.category
        }
        
        if (this.filters.difficulty) {
          params.difficulty = this.filters.difficulty
        }
        
        if (this.searchQuery.trim()) {
          params.search = this.searchQuery.trim()
        }
        
        const response = await ecoEduService.getContent(params)
        
        if (loadMore) {
          this.content = [...this.content, ...response.content]
          this.pagination.page += 1
        } else {
          this.content = response.content
          this.pagination = response.pagination
        }
        
      } catch (error) {
        console.error('Error loading content:', error)
        this.$toast.error(error.message || 'Gagal memuat konten')
      } finally {
        this.loading = false
      }
    },
    
    loadMoreContent() {
      this.loadContent(true)
    },
    
    filterContent() {
      this.pagination.page = 1
      this.loadContent()
    },
    
    setActiveTab(tab) {
      this.activeTab = tab
      this.filterContent()
    },
    
    debounceSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.filterContent()
      }, 500)
    },
    
    resetFilters() {
      this.searchQuery = ''
      this.activeTab = 'all'
      this.filters = {
        category: '',
        difficulty: '',
        sort: '-createdAt'
      }
      this.filterContent()
    },
    
    async viewContent(contentId) {
      try {
        this.loading = true
        const response = await ecoEduService.getSingleContent(contentId)
        this.selectedContent = response.content
        this.relatedContent = response.relatedContent || []
      } catch (error) {
        console.error('Error loading content:', error)
        this.$toast.error(error.message || 'Gagal memuat konten')
      } finally {
        this.loading = false
      }
    },
    
    async handleLike(contentId) {
      if (!this.$store.getters.isAuthenticated) {
        this.$toast.warning('Silakan login untuk menyukai konten')
        return
      }
      
      await this.toggleLike(contentId)
    },
    
    async handleBookmark(contentId) {
      if (!this.$store.getters.isAuthenticated) {
        this.$toast.warning('Silakan login untuk menyimpan konten')
        return
      }
      
      await this.toggleBookmark(contentId)
    },
    
    async toggleLike(contentId) {
      try {
        this.actionLoading = true
        const response = await ecoEduService.toggleLike(contentId)
        
        // Update local state
        const contentIndex = this.content.findIndex(item => item._id === contentId)
        if (contentIndex !== -1) {
          this.content[contentIndex].isLiked = response.data.action === 'liked'
          this.content[contentIndex].likeCount = response.data.likeCount
        }
        
        if (this.selectedContent && this.selectedContent._id === contentId) {
          this.selectedContent.isLiked = response.data.action === 'liked'
          this.selectedContent.likeCount = response.data.likeCount
        }
        
        this.$toast.success(response.message)
      } catch (error) {
        console.error('Error toggling like:', error)
        this.$toast.error(error.message || 'Gagal mengubah status like')
      } finally {
        this.actionLoading = false
      }
    },
    
    async toggleBookmark(contentId) {
      try {
        this.actionLoading = true
        const response = await ecoEduService.toggleBookmark(contentId)
        
        // Update local state
        const contentIndex = this.content.findIndex(item => item._id === contentId)
        if (contentIndex !== -1) {
          this.content[contentIndex].isBookmarked = response.data.action === 'bookmarked'
        }
        
        if (this.selectedContent && this.selectedContent._id === contentId) {
          this.selectedContent.isBookmarked = response.data.action === 'bookmarked'
        }
        
        this.$toast.success(response.message)
      } catch (error) {
        console.error('Error toggling bookmark:', error)
        this.$toast.error(error.message || 'Gagal mengubah status bookmark')
      } finally {
        this.actionLoading = false
      }
    },
    
    async addComment() {
      if (!this.newComment.trim()) return
      
      try {
        this.actionLoading = true
        const response = await ecoEduService.addComment(this.selectedContent._id, this.newComment.trim())
        
        // Add comment to local state
        this.selectedContent.comments.push(response.data.comment)
        this.selectedContent.commentCount = this.selectedContent.comments.length
        
        this.newComment = ''
        this.$toast.success(response.message)
      } catch (error) {
        console.error('Error adding comment:', error)
        this.$toast.error(error.message || 'Gagal menambahkan komentar')
      } finally {
        this.actionLoading = false
      }
    },
    
    formatType(type) {
      const types = {
        article: 'Artikel',
        video: 'Video',
        infographic: 'Infografis'
      }
      return types[type] || type
    },
    
    formatDifficulty(difficulty) {
      const difficulties = {
        beginner: 'Pemula',
        intermediate: 'Menengah',
        advanced: 'Lanjut'
      }
      return difficulties[difficulty] || difficulty
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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

.ecoedu-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-btn {
  background: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  font-size: 0.975rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  border: 1px solid var(--border-color);
}

.tab-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.ecoedu-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.filter-group label {
  color: var(--text-secondary);
}

.filter-group select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
}

.ecoedu-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .ecoedu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .ecoedu-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Loading and Empty State */
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
  margin-top: 2rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-tertiary);
}

.modal-body {
  padding: 1.5rem;
}

/* Content Detail */
.content-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.content-type {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.content-type.article {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.content-type.video {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.content-type.infographic {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
}

.content-category {
  padding: 0.375rem 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.content-video {
  margin-bottom: 2rem;
}

.video-placeholder {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  border-radius: var(--radius-md);
  overflow: hidden;
}

.video-placeholder img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.play-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.content-infographic {
  margin-bottom: 2rem;
  text-align: center;
}

.infographic-image {
  max-width: 100%;
  border-radius: var(--radius-md);
}

.content-details {
  margin-bottom: 2rem;
}

.content-description {
  margin-bottom: 1.5rem;
  white-space: pre-line;
  line-height: 1.6;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.content-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.author-role {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.content-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  max-width: 30%;
  text-align: right;
}

.content-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.action-btn:hover {
  background-color: var(--bg-tertiary);
}

.related-content {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.related-content h4 {
  margin-bottom: 1rem;
}

.related-items {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .related-items {
    grid-template-columns: repeat(3, 1fr);
  }
}

.related-item {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.related-item:hover {
  transform: translateY(-5px);
}

.related-thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.related-info {
  padding: 0.75rem;
  background-color: var(--bg-secondary);
}

.related-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.5rem;
}

.related-type {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
</style>

