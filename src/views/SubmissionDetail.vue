<!-- src\views\SubmissionDetail.vue -->
<template>
  <div class="submission-detail-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading submission details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
          </svg>
        </div>
        <h3>Error Loading Submission</h3>
        <p>{{ error }}</p>
        <button @click="loadSubmission" class="btn btn-primary">Try Again</button>
      </div>

      <!-- Submission Content -->
      <div v-else-if="submission" class="submission-detail">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-content">
            <button @click="goBack" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              Back to Submissions
            </button>
            
            <div class="header-info">
              <h1 class="submission-title">Submission Detail</h1>
              <div class="submission-status" :class="submission.status">
                <svg v-if="submission.status === 'approved'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                <svg v-else-if="submission.status === 'rejected'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                </svg>
                {{ getStatusText(submission.status) }}
              </div>
            </div>
          </div>
          
          <div class="header-meta">
            <div class="meta-item">
              <span class="meta-label">Submitted:</span>
              <span class="meta-value">{{ formatDate(submission.submittedAt) }}</span>
            </div>
            <div v-if="submission.adminReview?.reviewedAt" class="meta-item">
              <span class="meta-label">Reviewed:</span>
              <span class="meta-value">{{ formatDate(submission.adminReview.reviewedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Challenge Information -->
        <div class="challenge-section card">
          <div class="section-header">
            <h2>Challenge Information</h2>
            <router-link :to="`/challenges/${submission.challenge._id}`" class="view-challenge-btn">
              View Challenge
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
              </svg>
            </router-link>
          </div>
          
          <div class="challenge-info">
            <h3 class="challenge-title">{{ submission.challenge.title }}</h3>
            <p class="challenge-description">{{ submission.challenge.description }}</p>
            
            <div class="challenge-meta">
              <div class="meta-badge category">
                <span class="badge-label">Category:</span>
                <span class="badge-value">{{ submission.challenge.category }}</span>
              </div>
              <div class="meta-badge difficulty" :class="submission.challenge.difficulty">
                <span class="badge-label">Difficulty:</span>
                <span class="badge-value">{{ submission.challenge.difficulty }}</span>
              </div>
              <div class="meta-badge points">
                <span class="badge-label">Points:</span>
                <span class="badge-value">{{ submission.challenge.points }}</span>
              </div>
            </div>

            <!-- Challenge Requirements -->
            <div v-if="submission.challenge.requirements?.length" class="challenge-requirements">
              <h4>Requirements:</h4>
              <ul>
                <li v-for="(requirement, index) in submission.challenge.requirements" :key="index">
                  {{ requirement }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Submission Content -->
        <div class="submission-section card">
          <div class="section-header">
            <h2>Your Submission</h2>
          </div>
          
          <div class="submission-content">
            <div class="submission-text-section">
              <h4>Description:</h4>
              <p class="submission-text">{{ submission.submissionText }}</p>
            </div>

            <!-- Location -->
            <div v-if="submission.location" class="location-section">
              <h4>Location:</h4>
              <p class="location-text">{{ submission.location.address || `${submission.location.latitude}, ${submission.location.longitude}` }}</p>
            </div>

            <!-- Submission Images -->
            <div v-if="submission.submissionImages?.length" class="images-section">
              <h4>Evidence Photos ({{ submission.submissionImages.length }}):</h4>
              <div class="images-gallery">
                <div 
                  v-for="(image, index) in submission.submissionImages" 
                  :key="index"
                  class="image-item"
                  @click="openImageModal(submission.submissionImages, index)"
                >
                  <img :src="getImageUrl(image.url)" :alt="image.originalName" />
                  <div class="image-overlay">
                    <div class="image-info">
                      <span class="image-name">{{ image.originalName }}</span>
                      <span class="image-size">{{ formatFileSize(image.size) }}</span>
                    </div>
                    <div class="view-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Review Section -->
        <div v-if="submission.adminReview" class="review-section card" :class="submission.status">
          <div class="section-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              Admin Review
            </h2>
            <div class="review-date">{{ formatDate(submission.adminReview.reviewedAt) }}</div>
          </div>

          <div class="review-content">
            <div class="review-status" :class="submission.status">
              <div class="status-icon">
                <svg v-if="submission.status === 'approved'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </div>
              <div class="status-content">
                <h3 v-if="submission.status === 'approved'">Submission Approved! 🎉</h3>
                <h3 v-else>Submission Needs Revision</h3>
                <p v-if="submission.status === 'approved'">Great work! Your submission meets all the requirements.</p>
                <p v-else>Please review the feedback below and submit again with improvements.</p>
              </div>
            </div>

            <div class="review-comment">
              <h4>Feedback:</h4>
              <p>{{ submission.adminReview.comment }}</p>
            </div>

            <!-- Rating -->
            <div v-if="submission.adminReview.rating" class="review-rating">
              <h4>Rating:</h4>
              <div class="rating-stars">
                <svg 
                  v-for="i in 5" 
                  :key="i"
                  :class="['star', { filled: i <= submission.adminReview.rating }]"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
                </svg>
                <span class="rating-text">{{ submission.adminReview.rating }}/5</span>
              </div>
            </div>

            <!-- Points Awarded -->
            <div v-if="submission.status === 'approved' && submission.pointsAwarded" class="points-section">
              <div class="points-awarded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" />
                </svg>
                <span class="points-text">+{{ submission.pointsAwarded }} points earned!</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <div class="action-buttons">
            <button v-if="submission.status === 'rejected'" @click="resubmitChallenge" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" />
              </svg>
              Submit Again
            </button>
            
            <router-link :to="`/challenges/${submission.challenge._id}`" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" />
              </svg>
              View Challenge
            </router-link>
            
            <router-link to="/my-submissions" class="btn btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,11A1,1 0 0,1 11,12A1,1 0 0,1 10,11A1,1 0 0,1 11,10A1,1 0 0,1 12,11M15,14C15,13.45 14.55,13 14,13H10C9.45,13 9,13.45 9,14V15H15V14Z" />
              </svg>
              All Submissions
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal (same as previous implementations) -->
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
          <div class="image-details">
            <span class="image-name">{{ currentImages[currentImageIndex]?.originalName }}</span>
            <span class="image-size">{{ formatFileSize(currentImages[currentImageIndex]?.size) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SubmissionDetail',
  data() {
    return {
      loading: true,
      error: null,
      submission: null,
      
      // Image modal
      showImageModal: false,
      currentImages: [],
      currentImageIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser',
      isAuthenticated: 'user/isAuthenticated'
    }),
    
    submissionId() {
      return this.$route.params.id
    }
  },
  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/login')
      return
    }
    
    this.loadSubmission()
  },
  methods: {
    async loadSubmission() {
      this.loading = true
      this.error = null
      
      try {
        const response = await this.$axios.get(`/admin/submissions/${this.submissionId}`)
        this.submission = response.data.data.submission
        
        // Check if user owns this submission
        if (this.submission.user._id !== this.currentUser.id) {
          this.error = 'You do not have permission to view this submission'
          return
        }
        
      } catch (error) {
        console.error('Error loading submission:', error)
        if (error.response?.status === 404) {
          this.error = 'Submission not found'
        } else if (error.response?.status === 403) {
          this.error = 'You do not have permission to view this submission'
        } else {
          this.error = 'Failed to load submission details'
        }
      } finally {
        this.loading = false
      }
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'Under Review',
        approved: 'Approved',
        rejected: 'Needs Revision'
      }
      return statusMap[status] || status
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    getImageUrl(url) {
      return url.startsWith('http') ? url : `${process.env.VUE_APP_API_URL || 'http://localhost:5000'}${url}`
    },

    // Image modal methods
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
      this.currentImageIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : this.currentImages.length - 1
    },

    nextImage() {
      this.currentImageIndex = this.currentImageIndex < this.currentImages.length - 1 ? this.currentImageIndex + 1 : 0
    },

    // Navigation methods
    goBack() {
      if (window.history.length > 2) {
        this.$router.go(-1)
      } else {
        this.$router.push('/my-submissions')
      }
    },

    resubmitChallenge() {
      this.$router.push(`/challenges/${this.submission.challenge._id}`)
    }
  }
}
</script>

<style scoped>
.submission-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Loading & Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon svg {
  color: #d32f2f;
  margin-bottom: 16px;
}

.error-state h3 {
  margin: 0 0 12px;
  color: #1a1a1a;
}

/* Header */
.detail-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e1e8ed;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #e1e8ed;
  padding: 12px 16px;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.back-button:hover {
  border-color: #1976d2;
  color: #1976d2;
  background: #f0f8ff;
}

.header-info {
  flex: 1;
}

.submission-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.submission-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.submission-status.approved {
  background: #e8f5e8;
  color: #2e7d32;
}

.submission-status.rejected {
  background: #ffebee;
  color: #d32f2f;
}

.submission-status.pending {
  background: #fff3e0;
  color: #f57c00;
}

.header-meta {
  display: flex;
  gap: 32px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  font-weight: 600;
}

.meta-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

/* Card Sections */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-challenge-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.view-challenge-btn:hover {
  background: #f0f8ff;
}

/* Challenge Section */
.challenge-title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
}

.challenge-description {
  margin: 0 0 20px;
  color: #666;
  line-height: 1.6;
}

.challenge-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.meta-badge.category {
  background: #e3f2fd;
  color: #1976d2;
}

.meta-badge.difficulty.easy {
  background: #e8f5e8;
  color: #2e7d32;
}

.meta-badge.difficulty.medium {
  background: #fff3e0;
  color: #f57c00;
}

.meta-badge.difficulty.hard {
  background: #ffebee;
  color: #d32f2f;
}

.meta-badge.points {
  background: #f3e5f5;
  color: #7b1fa2;
}

.challenge-requirements h4 {
  margin: 0 0 12px;
  color: #1a1a1a;
  font-size: 16px;
}

.challenge-requirements ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.challenge-requirements li {
  margin-bottom: 8px;
  line-height: 1.4;
}

/* Submission Section */
.submission-text-section h4,
.location-section h4,
.images-section h4 {
  margin: 0 0 12px;
  color: #1a1a1a;
  font-size: 16px;
}

.submission-text {
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.location-text {
  color: #666;
  margin: 0 0 24px;
  font-style: italic;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-item:hover {
  transform: scale(1.02);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.image-name {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.image-size {
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
}

.view-icon {
  color: white;
}

/* Review Section */
.review-section.approved {
  border-left: 4px solid #2e7d32;
  background: #f1f8e9;
}

.review-section.rejected {
  border-left: 4px solid #d32f2f;
  background: #fef1f2;
}

.review-status {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
}

.review-status.approved {
  background: rgba(76, 175, 80, 0.1);
}

.review-status.rejected {
  background: rgba(244, 67, 54, 0.1);
}

.status-icon {
  flex-shrink: 0;
}

.status-icon svg {
  color: inherit;
}

.review-status.approved .status-icon svg {
  color: #2e7d32;
}

.review-status.rejected .status-icon svg {
  color: #d32f2f;
}

.status-content h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #1a1a1a;
}

.status-content p {
  margin: 0;
  color: #666;
}

.review-comment {
  margin-bottom: 20px;
}

.review-comment h4 {
  margin: 0 0 12px;
  color: #1a1a1a;
}

.review-comment p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  font-style: italic;
}

.review-rating {
  margin-bottom: 20px;
}

.review-rating h4 {
  margin: 0 0 8px;
  color: #1a1a1a;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star {
  color: #e0e0e0;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-weight: 600;
  color: #666;
}

.points-section {
  margin-top: 20px;
}

.points-awarded {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(76, 175, 80, 0.1);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.points-awarded svg {
  color: #2e7d32;
}

.points-text {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
}

/* Actions */
.actions-section {
  margin-top: 32px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  transform: translateY(-1px);
}

.btn-secondary {
  background: #2e7d32;
  color: white;
}

.btn-secondary:hover {
  background: #1b5e20;
  transform: translateY(-1px);
}

.btn-outline {
  background: white;
  border: 2px solid #e1e8ed;
  color: #666;
}

.btn-outline:hover {
  background: #f8f9fa;
  border-color: #1976d2;
  color: #1976d2;
}

/* Image Modal (same styles as previous implementations) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.image-modal {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  max-height: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.image-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.8);
}

.image-counter {
  color: white;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.image-modal-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.image-modal-footer {
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.8);
}

.image-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .detail-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-meta {
    flex-direction: column;
    gap: 16px;
  }
  
  .challenge-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .images-gallery {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .nav-button.prev {
    left: 10px;
  }
  
  .nav-button.next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .card {
    padding: 16px;
  }
  
  .detail-header {
    padding: 16px;
  }
  
  .back-button {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .submission-title {
    font-size: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .images-gallery {
    grid-template-columns: 1fr 1fr;
  }
}
</style>