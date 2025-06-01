<!-- src/components/admin/SubmissionReview.vue -->
<template>
  <div class="submission-review">
    <div class="review-header">
      <h2>Review Submission Tantangan</h2>
      <div class="filter-tabs">
        <button 
          v-for="tab in statusTabs" 
          :key="tab.key"
          @click="activeStatus = tab.key"
          :class="['tab-btn', { active: activeStatus === tab.key }]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="count-badge">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Memuat submission...</p>
    </div>

    <div v-else-if="submissions.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,14C10.67,14 8,14.67 8,16V18H16V16C16,14.67 13.33,14 12,14Z" />
      </svg>
      <h3>Tidak ada submission {{ statusTabs.find(t => t.key === activeStatus)?.label.toLowerCase() }}</h3>
      <p>Semua submission sudah direview atau belum ada yang masuk</p>
    </div>

    <div v-else class="submissions-grid">
      <div v-for="submission in submissions" :key="`${submission.challengeId}-${submission.user._id}`" class="submission-card">
        <div class="submission-header">
          <div class="user-info">
            <img :src="submission.user.avatar" :alt="submission.user.username" class="user-avatar" />
            <div class="user-details">
              <h4>{{ submission.user.username }}</h4>
              <span class="user-email">{{ submission.user.email }}</span>
            </div>
          </div>
          <div class="submission-status" :class="submission.review.status">
            {{ getStatusLabel(submission.review.status) }}
          </div>
        </div>

        <div class="challenge-info">
          <h3>{{ submission.challengeTitle }}</h3>
          <div class="challenge-meta">
            <span class="challenge-category">{{ submission.challengeCategory }}</span>
            <span class="challenge-points">{{ submission.challengePoints }} poin</span>
          </div>
        </div>

        <div class="submission-content">
          <div class="submission-text">
            <h5>Deskripsi:</h5>
            <p>{{ submission.submissionData.text }}</p>
          </div>

          <div v-if="submission.submissionData.location" class="submission-location">
            <h5>Lokasi:</h5>
            <p>{{ submission.submissionData.location.address || `${submission.submissionData.location.latitude}, ${submission.submissionData.location.longitude}` }}</p>
          </div>

          <div class="submission-images">
            <h5>Foto Bukti:</h5>
            <div class="images-gallery">
              <div v-for="(image, index) in submission.submissionData.images" :key="index" class="image-container">
                <img 
                  :src="getImageUrl(image.url)" 
                  :alt="`Bukti ${index + 1}`"
                  @click="openImageModal(image, submission)"
                  class="evidence-image"
                />
                <div class="image-info">
                  <span class="image-date">{{ formatDate(image.uploadedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="submission-dates">
            <div class="date-item">
              <span class="label">Dikirim:</span>
              <span class="value">{{ formatDate(submission.submissionData.submittedAt) }}</span>
            </div>
            <div v-if="submission.review.reviewedAt" class="date-item">
              <span class="label">Direview:</span>
              <span class="value">{{ formatDate(submission.review.reviewedAt) }}</span>
            </div>
          </div>

          <div v-if="submission.review.feedback || submission.review.rejectionReason" class="review-feedback">
            <h5>Feedback Admin:</h5>
            <p>{{ submission.review.feedback || submission.review.rejectionReason }}</p>
          </div>
        </div>

        <div v-if="submission.review.status === 'pending'" class="submission-actions">
          <button @click="reviewSubmission(submission, 'reject')" class="btn btn-danger" :disabled="reviewingId === submission._id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
            Tolak
          </button>
          <button @click="reviewSubmission(submission, 'approve')" class="btn btn-success" :disabled="reviewingId === submission._id">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
            Setujui
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="pagination">
      <button 
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page === 1 || isLoading"
        class="btn btn-outline"
      >
        Sebelumnya
      </button>
      <span class="page-info">
        Halaman {{ pagination.page }} dari {{ pagination.pages }}
      </span>
      <button 
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page === pagination.pages || isLoading"
        class="btn btn-outline"
      >
        Selanjutnya
      </button>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
      <div class="image-modal" @click.stop>
        <button @click="closeImageModal" class="modal-close">×</button>
        <div class="modal-header">
          <h3>Bukti dari {{ selectedSubmission?.user.username }}</h3>
          <div class="image-meta">
            <span>{{ formatDate(selectedImage?.uploadedAt) }}</span>
          </div>
        </div>
        <div class="modal-body">
          <img :src="getImageUrl(selectedImage?.url)" :alt="selectedImage?.filename" />
        </div>
        <div v-if="selectedSubmission?.review.status === 'pending'" class="modal-actions">
          <button @click="reviewSubmissionFromModal('reject')" class="btn btn-danger">
            Tolak Submission
          </button>
          <button @click="reviewSubmissionFromModal('approve')" class="btn btn-success">
            Setujui Submission
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
      <div class="review-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ reviewAction === 'approve' ? 'Setujui' : 'Tolak' }} Submission</h3>
          <button @click="closeReviewModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="submission-summary">
            <h4>{{ selectedSubmission?.challengeTitle }}</h4>
            <p>Oleh: {{ selectedSubmission?.user.username }}</p>
          </div>
          
          <div class="form-group">
            <label for="reviewFeedback">
              {{ reviewAction === 'approve' ? 'Feedback (Opsional)' : 'Alasan Penolakan *' }}
            </label>
            <textarea
              id="reviewFeedback"
              v-model="reviewForm.feedback"
              rows="4"
              :placeholder="reviewAction === 'approve' 
                ? 'Berikan feedback positif untuk user...' 
                : 'Jelaskan mengapa submission ini ditolak...'"
              :required="reviewAction === 'reject'"
            ></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeReviewModal" class="btn btn-secondary">Batal</button>
          <button @click="confirmReview" class="btn" :class="reviewAction === 'approve' ? 'btn-success' : 'btn-danger'">
            {{ reviewAction === 'approve' ? 'Setujui' : 'Tolak' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminService } from '@/services/adminService'

export default {
  name: 'SubmissionReview',
  data() {
    return {
      isLoading: false,
      submissions: [],
      activeStatus: 'pending',
      pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
      },
      reviewingId: null,
      
      // Modal states
      showImageModal: false,
      selectedImage: null,
      selectedSubmission: null,
      
      showReviewModal: false,
      reviewAction: null,
      reviewForm: {
        feedback: ''
      },

      statusTabs: [
        { key: 'pending', label: 'Menunggu Review', count: 0 },
        { key: 'approved', label: 'Disetujui', count: 0 },
        { key: 'rejected', label: 'Ditolak', count: 0 },
        { key: 'all', label: 'Semua', count: 0 }
      ]
    }
  },
  created() {
    this.loadSubmissions()
    this.loadSubmissionCounts()
  },
  watch: {
    activeStatus() {
      this.pagination.page = 1
      this.loadSubmissions()
    }
  },
  methods: {
    async loadSubmissions() {
      this.isLoading = true
      try {
        // In a real implementation, you'd need to modify the API to get all challenge submissions
        // For now, we'll simulate getting submissions from a specific challenge
        const data = await adminService.getChallengeSubmissions('all', {
          status: this.activeStatus,
          page: this.pagination.page,
          limit: this.pagination.limit
        })
        
        this.submissions = data.submissions
        this.pagination = data.pagination
      } catch (error) {
        console.error('Error loading submissions:', error)
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal memuat submission',
          timeout: 5000
        })
      } finally {
        this.isLoading = false
      }
    },

    async loadSubmissionCounts() {
      try {
        // Load counts for each status
        const counts = await Promise.all([
          adminService.getChallengeSubmissions('all', { status: 'pending', limit: 1 }),
          adminService.getChallengeSubmissions('all', { status: 'approved', limit: 1 }),
          adminService.getChallengeSubmissions('all', { status: 'rejected', limit: 1 }),
          adminService.getChallengeSubmissions('all', { status: 'all', limit: 1 })
        ])

        this.statusTabs[0].count = counts[0].pagination.total
        this.statusTabs[1].count = counts[1].pagination.total
        this.statusTabs[2].count = counts[2].pagination.total
        this.statusTabs[3].count = counts[3].pagination.total
      } catch (error) {
        console.error('Error loading submission counts:', error)
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.pages) {
        this.pagination.page = page
        this.loadSubmissions()
      }
    },

    getStatusLabel(status) {
      const labels = {
        pending: 'Menunggu Review',
        approved: 'Disetujui',
        rejected: 'Ditolak'
      }
      return labels[status] || status
    },

    getImageUrl(url) {
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`
      }
      return url
    },

    openImageModal(image, submission) {
      this.selectedImage = image
      this.selectedSubmission = submission
      this.showImageModal = true
    },

    closeImageModal() {
      this.showImageModal = false
      this.selectedImage = null
      this.selectedSubmission = null
    },

    reviewSubmission(submission, action) {
      this.selectedSubmission = submission
      this.reviewAction = action
      this.reviewForm.feedback = ''
      this.showReviewModal = true
    },

    reviewSubmissionFromModal(action) {
      this.reviewAction = action
      this.reviewForm.feedback = ''
      this.showReviewModal = true
      this.showImageModal = false
    },

    closeReviewModal() {
      this.showReviewModal = false
      this.reviewAction = null
      this.selectedSubmission = null
      this.reviewForm.feedback = ''
    },

    async confirmReview() {
      if (this.reviewAction === 'reject' && !this.reviewForm.feedback.trim()) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Alasan penolakan harus diisi',
          timeout: 3000
        })
        return
      }

      try {
        this.reviewingId = this.selectedSubmission._id

        const reviewData = {
          action: this.reviewAction,
          feedback: this.reviewForm.feedback || null,
          rejectionReason: this.reviewAction === 'reject' ? this.reviewForm.feedback : null
        }

        await adminService.reviewSubmission(
          this.selectedSubmission.challengeId,
          this.selectedSubmission.user._id,
          reviewData
        )

        this.$store.dispatch('addNotification', {
          type: 'success',
          message: `Submission berhasil ${this.reviewAction === 'approve' ? 'disetujui' : 'ditolak'}`,
          timeout: 3000
        })

        this.closeReviewModal()
        await this.loadSubmissions()
        await this.loadSubmissionCounts()
      } catch (error) {
        console.error('Error reviewing submission:', error)
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal mereview submission',
          timeout: 5000
        })
      } finally {
        this.reviewingId = null
      }
    },

    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.submission-review {
  padding: 1.5rem;
}

.review-header {
  margin-bottom: 2rem;
}

.review-header h2 {
  margin: 0 0 1rem 0;
  color: #111827;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  color: #10b981;
  border-bottom-color: #10b981;
}

.count-badge {
  background: #e5e7eb;
  color: #374151;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tab-btn.active .count-badge {
  background: #10b981;
  color: white;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state svg {
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.submissions-grid {
  display: grid;
  gap: 1.5rem;
}

.submission-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e5e7eb;
}

.submission-card:has(.submission-status.pending) {
  border-left-color: #f59e0b;
}

.submission-card:has(.submission-status.approved) {
  border-left-color: #10b981;
}

.submission-card:has(.submission-status.rejected) {
  border-left-color: #ef4444;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details h4 {
  margin: 0;
  color: #111827;
  font-weight: 600;
}

.user-email {
  color: #6b7280;
  font-size: 0.875rem;
}

.submission-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.submission-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.submission-status.approved {
  background: #dcfce7;
  color: #16a34a;
}

.submission-status.rejected {
  background: #fee2e2;
  color: #dc2626;
}

.challenge-info {
  margin-bottom: 1.5rem;
}

.challenge-info h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.challenge-meta {
  display: flex;
  gap: 1rem;
}

.challenge-category {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 20px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.challenge-points {
  color: #10b981;
  font-weight: 600;
  font-size: 0.875rem;
}

.submission-content h5 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.submission-text {
  margin-bottom: 1rem;
}

.submission-text p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.submission-location {
  margin-bottom: 1rem;
}

.submission-location p {
  margin: 0;
  color: #6b7280;
}

.submission-images {
  margin-bottom: 1rem;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
}

.evidence-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.evidence-image:hover {
  transform: scale(1.05);
}

.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 0.5rem;
  color: white;
  font-size: 0.75rem;
}

.submission-dates {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-item .label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.date-item .value {
  color: #6b7280;
  font-size: 0.875rem;
}

.review-feedback {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.review-feedback p {
  margin: 0;
  color: #166534;
  font-style: italic;
}

.submission-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  color: #374151;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-info {
  color: #6b7280;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay, .image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.image-modal, .review-modal {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.image-modal {
  max-width: 800px;
}

.review-modal {
  max-width: 500px;
  width: 100%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #111827;
}

.image-meta {
  color: #6b7280;
  font-size: 0.875rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.submission-summary {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.submission-summary h4 {
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.submission-summary p {
  margin: 0;
  color: #6b7280;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
  box-sizing: border-box;
}

.form-group textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .submission-review {
    padding: 1rem;
  }

  .filter-tabs {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .filter-tabs::-webkit-scrollbar {
    display: none;
  }

  .submission-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .challenge-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .submission-dates {
    flex-direction: column;
    gap: 1rem;
  }

  .submission-actions {
    flex-direction: column;
  }

  .images-gallery {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .image-modal, .review-modal {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 1rem);
  }
}
</style>