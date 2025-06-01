<template>
  <div class="my-submissions-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">My Challenge Submissions</h1>
        <div class="page-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalSubmissions }}</span>
            <span class="stat-label">Total Submissions</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ approvedSubmissions }}</span>
            <span class="stat-label">Approved</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ pendingSubmissions }}</span>
            <span class="stat-label">Under Review</span>
          </div>
        </div>
      </div>

      <div class="submissions-filters">
        <div class="filter-group">
          <label>Status:</label>
          <select v-model="selectedStatus" @change="loadSubmissions">
            <option value="">All Status</option>
            <option value="pending">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading submissions...</p>
      </div>

      <div v-else-if="submissions.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
        <h3>No submissions found</h3>
        <p>You haven't submitted any challenges yet</p>
        <router-link to="/challenges" class="btn btn-primary">Browse Challenges</router-link>
      </div>

      <div v-else class="submissions-list">
        <div v-for="submission in submissions" :key="submission._id" class="submission-card">
          <div class="submission-header">
            <div class="submission-info">
              <h3>{{ submission.title }}</h3>
              <p class="challenge-title">{{ submission.challenge.title }}</p>
            </div>
            <div class="submission-meta">
              <span class="submission-status" :class="submission.status">
                {{ getStatusText(submission.status) }}
              </span>
              <span class="submission-date">
                {{ formatDate(submission.submittedAt) }}
              </span>
            </div>
          </div>

          <div class="submission-body">
            <p class="submission-description">{{ submission.description }}</p>
            
            <div v-if="submission.images.length > 0" class="submission-images">
              <div class="image-grid">
                <img 
                  v-for="(image, index) in submission.images.slice(0, 3)" 
                  :key="index"
                  :src="getImageUrl(image.url)" 
                  :alt="image.originalName"
                  @click="openImageModal(submission.images, index)"
                />
                <div v-if="submission.images.length > 3" class="more-images">
                  +{{ submission.images.length - 3 }}
                </div>
              </div>
            </div>

            <div class="challenge-info">
              <span class="challenge-category">{{ submission.challenge.category }}</span>
              <span class="challenge-points">{{ submission.challenge.points }} Points</span>
            </div>
          </div>

          <div v-if="submission.adminReview" class="submission-review">
            <div class="review-header">
              <span class="review-title">Admin Review</span>
              <span class="review-date">{{ formatDate(submission.adminReview.reviewedAt) }}</span>
            </div>
            <p v-if="submission.adminReview.comment" class="review-comment">
              {{ submission.adminReview.comment }}
            </p>
            <div v-if="submission.adminReview.rating" class="review-rating">
              <span>Rating: {{ submission.adminReview.rating }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMoreSubmissions" class="load-more-section">
        <button @click="loadMoreSubmissions" class="btn btn-secondary" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
      <div class="image-modal" @click.stop>
        <div class="image-modal-header">
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ currentImages.length }}</span>
          <button @click="closeImageModal" class="modal-close">×</button>
        </div>
        <div class="image-modal-content">
          <button v-if="currentImages.length > 1" @click="previousImage" class="nav-button prev">‹</button>
          <img :src="getImageUrl(currentImages[currentImageIndex]?.url)" :alt="currentImages[currentImageIndex]?.originalName" />
          <button v-if="currentImages.length > 1" @click="nextImage" class="nav-button next">›</button>
        </div>
        <div class="image-modal-footer">
          <span class="image-name">{{ currentImages[currentImageIndex]?.originalName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MySubmissions',
  data() {
    return {
      selectedStatus: '',
      showImageModal: false,
      currentImages: [],
      currentImageIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      submissions: 'submissions/getUserSubmissions',
      pagination: 'submissions/getUserPagination',
      isLoading: 'submissions/isLoading'
    }),
    
    totalSubmissions() {
      return this.submissions.length
    },
    
    approvedSubmissions() {
      return this.submissions.filter(s => s.status === 'approved').length
    },
    
    pendingSubmissions() {
      return this.submissions.filter(s => s.status === 'pending').length
    },
    
    hasMoreSubmissions() {
      return this.pagination.page < this.pagination.pages
    }
  },
  
  created() {
    this.loadSubmissions()
  },
  
  methods: {
    async loadSubmissions() {
      try {
        await this.$store.dispatch('submissions/fetchUserSubmissions', {
          page: 1,
          limit: 10,
          status: this.selectedStatus
        })
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to load submissions',
          timeout: 5000
        })
      }
    },
    
    async loadMoreSubmissions() {
      try {
        await this.$store.dispatch('submissions/loadMoreUserSubmissions')
      } catch (error) {
        console.error('Error loading more submissions:', error)
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'pending':
          return 'Under Review'
        case 'approved':
          return 'Approved'
        case 'rejected':
          return 'Rejected'
        default:
          return status
      }
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getImageUrl(url) {
      if (!url) return '/api/placeholder/300/200'
      return url.startsWith('http') ? url : `${process.env.VUE_APP_API_URL || 'http://localhost:5000'}${url}`
    },
    
    openImageModal(images, index = 0) {
      this.currentImages = images
      this.currentImageIndex = index
      this.showImageModal = true
    },
    
    closeImageModal() {
      this.showImageModal = false
      this.currentImages = []
      this.currentImageIndex = 0
    },
    
    previousImage() {
      this.currentImageIndex = this.currentImageIndex > 0 
        ? this.currentImageIndex - 1 
        : this.currentImages.length - 1
    },
    
    nextImage() {
      this.currentImageIndex = this.currentImageIndex < this.currentImages.length - 1 
        ? this.currentImageIndex + 1 
        : 0
    }
  }
}
</script>