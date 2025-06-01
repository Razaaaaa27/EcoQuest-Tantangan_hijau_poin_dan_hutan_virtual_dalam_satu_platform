<template>
  <div class="admin-dashboard">
    <div class="admin-container">
      <!-- Admin Header -->
      <header class="admin-header">
        <div class="admin-header-content">
          <div class="admin-brand">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
              </svg>
            </div>
            <div class="brand-text">
              <h1>EcoQuest Admin</h1>
              <span>Dashboard Management</span>
            </div>
          </div>
          <div class="admin-user">
            <div class="user-info">
              <span class="user-name">{{ currentUser?.username }}</span>
              <span class="user-role">Administrator</span>
            </div>
            <img :src="currentUser?.avatar" :alt="currentUser?.username" class="user-avatar" />
          </div>
        </div>
      </header>

      <!-- Admin Navigation -->
      <nav class="admin-nav">
        <div class="nav-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="activeTab = tab.key" 
            :class="['nav-tab', { active: activeTab === tab.key }]"
          >
            <div class="tab-icon" v-html="tab.icon"></div>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </nav>
  
      <!-- Main Content -->
      <main class="admin-main">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <div class="overview-header">
            <h2>Dashboard Overview</h2>
            <p>Monitor your platform's performance and key metrics</p>
          </div>

          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card" v-for="stat in dashboardStats" :key="stat.label">
              <div class="stat-icon" :style="{ background: stat.color }">
                <div v-html="stat.icon"></div>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ formatNumber(stat.value) }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.trend">
                  {{ stat.change }}% dari minggu lalu
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="activity-section">
            <h3>Recent Activities</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <div v-html="activity.icon"></div>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ formatTime(activity.time) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <div class="section-header">
            <h2>User Management</h2>
            <div class="section-actions">
              <div class="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  v-model="userSearch"
                  @input="searchUsers"
                />
              </div>
            </div>
          </div>

          <div class="data-table">
            <div class="table-header">
              <div class="table-row">
                <div class="table-cell">User</div>
                <div class="table-cell">Email</div>
                <div class="table-cell">Role</div>
                <div class="table-cell">Points</div>
                <div class="table-cell">Joined</div>
                <div class="table-cell">Actions</div>
              </div>
            </div>

            <div class="table-body">
              <div v-for="user in users" :key="user._id" class="table-row">
                <div class="table-cell">
                  <div class="user-info">
                    <img :src="user.avatar" :alt="user.username" class="user-avatar-small" />
                    <div>
                      <div class="user-name">{{ user.username }}</div>
                      <div class="user-level">Level {{ user.gameStats?.level || 1 }}</div>
                    </div>
                  </div>
                </div>
                <div class="table-cell">{{ user.email }}</div>
                <div class="table-cell">
                  <span class="role-badge" :class="user.role">{{ user.role }}</span>
                </div>
                <div class="table-cell">{{ formatNumber(user.gameStats?.totalPoints || 0) }}</div>
                <div class="table-cell">{{ formatDate(user.createdAt) }}</div>
                <div class="table-cell">
                  <div class="action-buttons">
                    <button 
                      @click="deleteUser(user._id)"
                      class="btn-action delete"
                      :disabled="user.role === 'admin'"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Challenges Tab -->
        <div v-if="activeTab === 'challenges'" class="tab-content">
          <div class="section-header">
            <h2>Challenge Management</h2>
            <div class="section-actions">
              <button @click="showCreateChallenge = true" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" />
                </svg>
                Create Challenge
              </button>
            </div>
          </div>

          <div class="challenges-grid">
            <div v-for="challenge in challenges" :key="challenge._id" class="challenge-card">
              <div class="challenge-header">
                <div class="challenge-meta">
                  <span class="challenge-category">{{ challenge.category }}</span>
                  <span class="challenge-difficulty" :class="challenge.difficulty">
                    {{ challenge.difficulty }}
                  </span>
                </div>
                <div class="challenge-status" :class="challenge.status">
                  {{ challenge.status }}
                </div>
              </div>
              <div class="challenge-content">
                <h3>{{ challenge.title }}</h3>
                <p>{{ challenge.description.substring(0, 100) }}...</p>
                <div class="challenge-stats">
                  <div class="stat">
                    <span class="stat-value">{{ challenge.points }}</span>
                    <span class="stat-label">Points</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ challenge.participantCount || 0 }}</span>
                    <span class="stat-label">Participants</span>
                  </div>
                </div>
              </div>
              <div class="challenge-actions">
                <button @click="editChallenge(challenge)" class="btn-action edit">Edit</button>
                <button @click="deleteChallenge(challenge._id)" class="btn-action delete">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Tab -->
        <div v-if="activeTab === 'content'" class="tab-content">
          <div class="section-header">
            <h2>Educational Content</h2>
            <div class="section-actions">
              <button @click="showCreateContent = true" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Create Content
              </button>
            </div>
          </div>

          <div class="content-grid">
            <div v-for="content in eduContent" :key="content._id" class="content-card">
              <div class="content-thumbnail">
                <img :src="content.thumbnail || '/api/placeholder/300/200'" :alt="content.title" />
                <div class="content-type" :class="content.type">
                  {{ content.type }}
                </div>
              </div>
              <div class="content-info">
                <h3>{{ content.title }}</h3>
                <p>{{ content.description.substring(0, 80) }}...</p>
                <div class="content-meta">
                  <span class="content-category">{{ content.category }}</span>
                  <span class="content-stats">{{ content.views || 0 }} views</span>
                </div>
              </div>
              <div class="content-actions">
                <button @click="editContent(content)" class="btn-action edit">Edit</button>
                <button @click="deleteContent(content._id)" class="btn-action delete">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions'" class="tab-content">
          <div class="section-header">
            <h2>Challenge Submissions Review</h2>
            <div class="section-actions">
              <div class="filter-group">
                <select v-model="submissionFilters.status" @change="loadSubmissions">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div class="submission-stats">
                <span class="stat-badge pending">{{ submissionStats.pending || 0 }} Pending</span>
                <span class="stat-badge approved">{{ submissionStats.approved || 0 }} Approved</span>
                <span class="stat-badge rejected">{{ submissionStats.rejected || 0 }} Rejected</span>
              </div>
            </div>
          </div>

          <div class="submissions-grid">
            <div v-for="submission in submissions" :key="submission._id" class="submission-card">
              <div class="submission-header">
                <div class="submission-meta">
                  <div class="user-info">
                    <img :src="submission.user.avatar" :alt="submission.user.username" class="user-avatar-tiny" />
                    <span class="username">{{ submission.user.username }}</span>
                  </div>
                  <div class="submission-date">{{ formatDate(submission.submittedAt) }}</div>
                </div>
                <div class="submission-status" :class="submission.status">
                  {{ submission.status }}
                </div>
              </div>

              <div class="submission-challenge">
                <h4>{{ submission.challenge?.title || 'No Challenge Title' }}</h4>
                <span class="challenge-category">{{ submission.challenge?.category || 'Uncategorized' }}</span>
                <span class="challenge-points">{{ submission.challenge?.points || 0 }} pts</span>
              </div>

              <div class="submission-content">
                <p class="submission-text">{{ submission.submissionText.substring(0, 150) }}...</p>
                <div v-if="submission.submissionImages.length > 0" class="submission-images">
                  <div class="image-count">{{ submission.submissionImages.length }} foto</div>
                  <div class="image-preview">
                    <img
                      v-for="(image, index) in submission.submissionImages.slice(0, 3)"
                      :key="index"
                      :src="getImageUrl(image.url)"
                      :alt="image.originalName"
                      @click="openImageModal(submission.submissionImages, index)"
                    />
                    <div v-if="submission.submissionImages.length > 3" class="more-images">
                      +{{ submission.submissionImages.length - 3 }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="submission.adminReview" class="submission-review">
                <div class="review-header">
                  <span class="reviewer">Reviewed by {{ submission.adminReview.reviewedBy?.username }}</span>
                  <span class="review-date">{{ formatDate(submission.adminReview.reviewedAt) }}</span>
                </div>
                <p class="review-comment">{{ submission.adminReview.comment }}</p>
              </div>

              <div class="submission-actions">
                <button
                  v-if="submission.status === 'pending'"
                  @click="openReviewModal(submission, 'approve')"
                  class="btn-action approve"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  Approve
                </button>
                <button
                  v-if="submission.status === 'pending'"
                  @click="openReviewModal(submission, 'reject')"
                  class="btn-action reject"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                  Reject
                </button>
                <button @click="viewSubmissionDetail(submission)" class="btn-action view">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                  </svg>
                  View
                </button>
              </div>
            </div>
          </div>

          <div v-if="hasMoreSubmissions" class="load-more-section">
            <button @click="loadMoreSubmissions" class="btn btn-secondary" :disabled="loading.submissions">
              {{ loading.submissions ? 'Loading...' : 'Load More' }}
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
      <div class="review-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ reviewAction === 'approve' ? 'Approve' : 'Reject' }} Submission</h3>
          <button @click="closeReviewModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <!-- Submission Summary -->
          <div class="submission-summary">
            <div class="challenge-info">
              <h4>{{ currentSubmission?.challenge?.title || 'No Challenge Title' }}</h4>
              <p>{{ currentSubmission?.submissionText }}</p>
            </div>
            <div class="user-info">
              <img :src="currentSubmission?.user.avatar" :alt="currentSubmission?.user.username" />
              <div>
                <div class="username">{{ currentSubmission?.user.username }}</div>
                <div class="user-level">Level {{ currentSubmission?.user.gameStats?.level || 1 }}</div>
              </div>
            </div>
          </div>

          <!-- Review Form -->
          <form @submit.prevent="submitReview">
            <div class="form-group">
              <label for="reviewComment">
                {{ reviewAction === 'approve' ? 'Approval Comment (Optional)' : 'Rejection Reason (Required)' }}
              </label>
              <textarea
                id="reviewComment"
                v-model="reviewForm.comment"
                :placeholder="reviewAction === 'approve' ? 'Great job completing this challenge!' : 'Please explain why this submission is being rejected...'"
                rows="4"
                :required="reviewAction === 'reject'"
              ></textarea>
            </div>

            <div v-if="reviewAction === 'approve'" class="form-group">
              <label for="rating">Rating (1-5)</label>
              <select id="rating" v-model.number="reviewForm.rating">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Below Average</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeReviewModal" class="btn btn-secondary">Cancel</button>
              <button 
                type="submit" 
                :class="['btn', reviewAction === 'approve' ? 'btn-success' : 'btn-danger']"
                :disabled="reviewLoading"
              >
                {{ reviewLoading ? 'Processing...' : (reviewAction === 'approve' ? 'Approve' : 'Reject') }}
              </button>
            </div>
          </form>
        </div>
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

    <!-- Create Challenge Modal -->
    <div v-if="showCreateChallenge" class="modal-overlay" @click="showCreateChallenge = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingChallenge ? 'Edit Challenge' : 'Create New Challenge' }}</h3>
          <button @click="showCreateChallenge = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveChallenge">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="challengeForm.title" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="challengeForm.description" rows="4" required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select v-model="challengeForm.category" required>
                  <option value="">Select Category</option>
                  <option value="recycle">Recycle</option>
                  <option value="plantation">Plantation</option>
                  <option value="conservation">Conservation</option>
                  <option value="water">Water</option>
                  <option value="energy">Energy</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div class="form-group">
                <label>Difficulty</label>
                <select v-model="challengeForm.difficulty" required>
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Points</label>
                <input type="number" v-model.number="challengeForm.points" min="10" max="500" required />
              </div>
              <div class="form-group">
                <label>Status</label>
                <select v-model="challengeForm.status">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Requirements</label>
              <div class="requirements-list">
                <div v-for="(requirement, index) in challengeForm.requirements" :key="index" class="requirement-item">
                  <input type="text" v-model="challengeForm.requirements[index]" />
                  <button type="button" @click="removeRequirement(index)" class="btn-remove">×</button>
                </div>
                <button type="button" @click="addRequirement" class="btn-add">Add Requirement</button>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="showCreateChallenge = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ editingChallenge ? 'Update' : 'Create' }} Challenge
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Create Content Modal -->
    <div v-if="showCreateContent" class="modal-overlay" @click="showCreateContent = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingContent ? 'Edit Content' : 'Create New Content' }}</h3>
          <button @click="showCreateContent = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveContent">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="contentForm.title" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="contentForm.description" rows="3" required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type</label>
                <select v-model="contentForm.type" required>
                  <option value="">Select Type</option>
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="infographic">Infographic</option>
                </select>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select v-model="contentForm.category" required>
                  <option value="">Select Category</option>
                  <option value="Perubahan Iklim">Perubahan Iklim</option>
                  <option value="Konservasi Air">Konservasi Air</option>
                  <option value="Energi Terbarukan">Energi Terbarukan</option>
                  <option value="Pengelolaan Sampah">Pengelolaan Sampah</option>
                  <option value="Pertanian Berkelanjutan">Pertanian Berkelanjutan</option>
                  <option value="Biodiversitas">Biodiversitas</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Difficulty</label>
                <select v-model="contentForm.difficulty">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div class="form-group" v-if="contentForm.type === 'article'">
                <label>Read Time (minutes)</label>
                <input type="number" v-model.number="contentForm.readTime" min="1" />
              </div>
            </div>
            <div class="form-group" v-if="contentForm.type === 'video'">
              <label>Video URL</label>
              <input type="url" v-model="contentForm.videoUrl" />
            </div>
            <div class="form-group">
              <label>Thumbnail URL</label>
              <input type="url" v-model="contentForm.thumbnail" />
            </div>
            <div class="form-group">
              <label>Full Content</label>
              <textarea v-model="contentForm.fullContent" rows="8" required></textarea>
            </div>
            <div class="form-group">
              <label>Author Information</label>
              <div class="author-form">
                <input type="text" v-model="contentForm.author.name" placeholder="Author Name" required />
                <input type="text" v-model="contentForm.author.role" placeholder="Author Role" />
                <input type="url" v-model="contentForm.author.avatar" placeholder="Author Avatar URL" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="showCreateContent = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ editingContent ? 'Update' : 'Create' }} Content
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminService } from '@/services/adminService'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'overview',
      apiBaseUrl: 'http://localhost:5000',
      
      loading: {
        general: false,
        submissions: false
      },
      
      dashboardStats: [],
      recentActivities: [],
      users: [],
      challenges: [],
      eduContent: [],
      submissions: [],
      
      userSearch: '',
      
      showCreateChallenge: false,
      showCreateContent: false,
      editingChallenge: null,
      editingContent: null,
      
      submissionStats: {
        pending: 0,
        approved: 0,
        rejected: 0
      },
      submissionFilters: {
        status: 'pending'
      },
      
      pagination: {
        currentPage: 0,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: true
      },
      
      filters: {
        status: '',
        sort: '-submittedAt'
      },
      
      showReviewModal: false,
      currentSubmission: null,
      reviewAction: 'approve',
      reviewForm: {
        comment: '',
        rating: 5
      },
      reviewLoading: false,
      
      showImageModal: false,
      currentImages: [],
      currentImageIndex: 0,
      
      hasMoreSubmissions: true,
      
      challengeForm: {
        title: '',
        description: '',
        category: '',
        difficulty: '',
        points: 50,
        status: 'active',
        requirements: ['']
      },
      contentForm: {
        title: '',
        description: '',
        fullContent: '',
        type: '',
        category: '',
        difficulty: 'beginner',
        thumbnail: '',
        videoUrl: '',
        readTime: 5,
        author: {
          name: '',
          role: '',
          avatar: ''
        }
      },
      
      tabs: [
        {
          key: 'overview',
          label: 'Overview',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" /></svg>'
        },
        {
          key: 'users',
          label: 'Users',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" /></svg>'
        },
        {
          key: 'challenges',
          label: 'Challenges',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" /></svg>'
        },
        {
          key: 'content',
          label: 'Content',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>'
        },
        {
          key: 'submissions',
          label: 'Submissions',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9,12L11,14L15,10M13,3A9,9 0 0,1 22,12A9,9 0 0,1 13,21H5V3H13M13,5H7V19H13A7,7 0 0,0 20,12A7,7 0 0,0 13,5Z" /></svg>'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser'
    })
  },
  created() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading.general = true  
      try {
        if (this.activeTab === 'overview') {
          await this.loadDashboardStats()
        } else if (this.activeTab === 'users') {
          await this.loadUsers()
        } else if (this.activeTab === 'challenges') {
          await this.loadChallenges()
        } else if (this.activeTab === 'content') {
          await this.loadEduContent()
        } else if (this.activeTab === 'submissions') {
          await this.loadSubmissions()
        }
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to load dashboard data',
          timeout: 5000
        })
      } finally {
        this.loading.general = false  
      }
    },

    async loadDashboardStats() {
      try {
        const stats = await adminService.getDashboardStats()
        this.dashboardStats = [
          {
            label: 'Total Users',
            value: stats.totalUsers || 0,
            change: '+12',
            trend: 'positive',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" /></svg>'
          },
          {
            label: 'Active Challenges',
            value: stats.activeChallenges || 0,
            change: '+8',
            trend: 'positive',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" /></svg>'
          },
          {
            label: 'Total Posts',
            value: stats.totalPosts || 0,
            change: '+15',
            trend: 'positive',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17,12V3A1,1 0 0,0 16,2H3A1,1 0 0,0 2,3V17L6,13H16A1,1 0 0,0 17,12M21,6H19V15H6V17A1,1 0 0,0 7,18H18L22,22V7A1,1 0 0,0 21,6Z" /></svg>'
          },
          {
            label: 'Educational Content',
            value: stats.totalEduContent || 0,
            change: '+5',
            trend: 'positive',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>'
          }
        ]

        this.recentActivities = [
          {
            id: 1,
            type: 'user',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>',
            text: 'New user registered',
            time: new Date(Date.now() - 1000 * 60 * 15)
          },
          {
            id: 2,
            type: 'challenge',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.88,9.88L3.24,13.53L4.65,14.94L8.29,11.29L12,12.3L18,6.3L19.5,7.8V9H21M7,19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V12H15V19H9V12H7V19Z" /></svg>',
            text: 'Challenge completed by user',
            time: new Date(Date.now() - 1000 * 60 * 30)
          },
          {
            id: 3,
            type: 'content',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>',
            text: 'New educational content published',
            time: new Date(Date.now() - 1000 * 60 * 45)
          }
        ]
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      }
    },

    async loadUsers() {
      try {
        const data = await adminService.getUsers({
          page: 1,
          limit: 20,
          search: this.userSearch
        })
        
        this.users = data.users.filter(user => {
          const adminRoles = ['admin', 'administrator', 'super_admin']
          return !adminRoles.includes(user.role?.toLowerCase())
        })
      } catch (error) {
        console.error('Error loading users:', error)
      }
    },

    async loadChallenges() {
      try {
        const data = await adminService.getChallenges({
          page: 1,
          limit: 20
        })
        this.challenges = data.challenges
      } catch (error) {
        console.error('Error loading challenges:', error)
      }
    },

    async loadEduContent() {
      try {
        const data = await adminService.getEduContent({
          page: 1,
          limit: 20
        })
        this.eduContent = data.eduContent
      } catch (error) {
        console.error('Error loading educational content:', error)
      }
    },

    async loadSubmissions(reset = false) {
      if (reset) {
        this.submissions = [];
        this.pagination.currentPage = 0;
        this.pagination.hasMore = true;
      }

      this.loading.submissions = true;

      try {
        console.log('🔄 Loading submissions...', {
          page: 1,
          filters: this.filters,
        });

        const response = await this.$api.get('/submissions/admin', {
          params: {
            page: 1,
            limit: this.pagination.limit,
            status: this.filters.status || '',
            sort: this.filters.sort || '-submittedAt',
          },
        });

        let submissions = [];
        let stats = { pending: 0, approved: 0, rejected: 0 };
        let paginationInfo = {};

        if (response.data) {
          if (response.data.data) {
            submissions = response.data.data.submissions || response.data.data || [];
            stats = response.data.data.stats || stats;
            paginationInfo = response.data.data.pagination || {};
          } else if (Array.isArray(response.data)) {
            submissions = response.data;
          } else if (response.data.submissions) {
            submissions = response.data.submissions;
            stats = response.data.stats || stats;
            paginationInfo = response.data.pagination || {};
          } else {
            console.log('🔍 Unexpected response structure:', response.data);
            submissions = [];
          }
        }

        // Tambahkan penanganan untuk submission.challenge yang null
        submissions = submissions.map((submission) => ({
          ...submission,
          challenge: submission.challenge || { title: 'Unknown Challenge', category: 'Uncategorized', points: 0 },
        }));

        this.submissions = submissions;
        this.submissionStats = stats;

        this.pagination.currentPage = paginationInfo.page || 1;
        this.pagination.total = paginationInfo.total || submissions.length;
        this.pagination.totalPages = paginationInfo.pages || 1;
        this.pagination.hasMore = paginationInfo.page < paginationInfo.pages || false;

        console.log(`📊 Loaded ${this.submissions.length} submissions`);
      } catch (error) {
        console.error('❌ Error loading submissions:', error);
        console.error('❌ Error response:', error.response?.data);

        let errorMessage = 'Gagal memuat data submissions';

        if (error.response?.status === 401) {
          errorMessage = 'Sesi telah berakhir, silakan login ulang';
          this.$router.push('/login');
        } else if (error.response?.status === 403) {
          errorMessage = 'Akses ditolak. Anda tidak memiliki izin admin';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        this.$notify({
          type: 'error',
          title: 'Error!',
          message: errorMessage,
        });
      } finally {
        this.loading.submissions = false;
      }
    },

    async loadMoreSubmissions() {
      if (this.loading.submissions || !this.pagination.hasMore) {
        console.log('⏹️ Skip loading more - loading:', this.loading.submissions, 'hasMore:', this.pagination.hasMore);
        return;
      }

      this.loading.submissions = true;

      try {
        const nextPage = this.pagination.currentPage + 1;
        console.log('📄 Loading more submissions, page:', nextPage);

        const response = await this.$api.get('/submissions/admin', {
          params: {
            page: nextPage,
            limit: this.pagination.limit,
            status: this.filters.status,
            sort: this.filters.sort,
          },
        });

        let newSubmissions = [];
        let paginationInfo = {};

        if (response.data) {
          if (response.data.data) {
            newSubmissions = response.data.data.submissions || response.data.data || [];
            paginationInfo = response.data.data.pagination || {};

            if (response.data.data.stats) {
              this.submissionStats = response.data.data.stats;
            }
          } else if (Array.isArray(response.data)) {
            newSubmissions = response.data;
          } else if (response.data.submissions) {
            newSubmissions = response.data.submissions;
            paginationInfo = response.data.pagination || {};
          }
        }

        // Tambahkan penanganan untuk submission.challenge yang null
        newSubmissions = newSubmissions.map((submission) => ({
          ...submission,
          challenge: submission.challenge || { title: 'Unknown Challenge', category: 'Uncategorized', points: 0 },
        }));

        this.submissions.push(...newSubmissions);

        this.pagination.currentPage = paginationInfo.page || nextPage;
        this.pagination.total = paginationInfo.total || this.pagination.total;
        this.pagination.totalPages = paginationInfo.pages || this.pagination.totalPages;
        this.pagination.hasMore = this.pagination.currentPage < this.pagination.totalPages;

        console.log(`📋 Loaded ${newSubmissions.length} more submissions. Total: ${this.submissions.length}`);
        console.log('📊 Updated pagination:', this.pagination);
      } catch (error) {
        console.error('❌ Error loading more submissions:', error);

        let errorMessage = 'Gagal memuat data submissions';

        if (error.response?.status === 401) {
          errorMessage = 'Sesi telah berakhir, silakan login ulang';
          this.$router.push('/login');
        } else if (error.response?.status === 403) {
          errorMessage = 'Akses ditolak. Anda tidak memiliki izin admin';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        this.$notify({
          type: 'error',
          title: 'Error!',
          message: errorMessage,
        });
      } finally {
        this.loading.submissions = false;
      }
    },

    openReviewModal(submission, action) {
      this.currentSubmission = submission;
      this.reviewAction = action;
      this.reviewForm = {
        comment: '',
        rating: action === 'approve' ? 5 : null,
      };
      this.showReviewModal = true;
    },

    closeReviewModal() {
      this.showReviewModal = false;
      this.currentSubmission = null;
      this.reviewForm = {
        comment: '',
        rating: 5,
      };
    },

    async submitReview() {
      if (this.reviewAction === 'reject' && !this.reviewForm.comment.trim()) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Rejection reason is required',
          timeout: 3000,
        });
        return;
      }

      this.reviewLoading = true;

      try {
        await this.$store.dispatch('submissions/reviewSubmission', {
          submissionId: this.currentSubmission._id,
          status: this.reviewAction === 'approve' ? 'approved' : 'rejected',
          comment: this.reviewForm.comment.trim(),
          rating: this.reviewForm.rating,
        });

        this.$store.dispatch('addNotification', {
          type: 'success',
          message: `Submission ${this.reviewAction === 'approve' ? 'approved' : 'rejected'} successfully`,
          timeout: 3000,
        });

        this.closeReviewModal();
        await this.loadSubmissions();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to review submission',
          timeout: 5000,
        });
      } finally {
        this.reviewLoading = false;
      }
    },

    openImageModal(images, index = 0) {
      this.currentImages = images;
      this.currentImageIndex = index;
      this.showImageModal = true;
    },

    closeImageModal() {
      this.showImageModal = false;
      this.currentImages = [];
      this.currentImageIndex = 0;
    },

    previousImage() {
      this.currentImageIndex = this.currentImageIndex > 0
        ? this.currentImageIndex - 1
        : this.currentImages.length - 1;
    },

    nextImage() {
      this.currentImageIndex = this.currentImageIndex < this.currentImages.length - 1
        ? this.currentImageIndex + 1
        : 0;
    },

    getImageUrl(path) {
      if (!path) return '/api/placeholder/300/200';

      if (path.startsWith('http')) return path;

      const cleanPath = path.startsWith('/') ? path.substring(1) : path;

      return `${this.apiBaseUrl}/${cleanPath}`;
    },

    viewSubmissionDetail(submission) {
      console.log('View submission detail:', submission);
    },

    async changeUserRole(userId, newRole) {
      try {
        await adminService.updateUserRole(userId, newRole);
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: `User role updated to ${newRole}`,
          timeout: 3000,
        });
        await this.loadUsers();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to update user role',
          timeout: 5000,
        });
      }
    },

    async deleteUser(userId) {
      if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
      }

      try {
        await adminService.deleteUser(userId);
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'User deleted successfully',
          timeout: 3000,
        });
        await this.loadUsers();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to delete user',
          timeout: 5000,
        });
      }
    },

    searchUsers() {
      clearTimeout(this.userSearchTimeout);
      this.userSearchTimeout = setTimeout(() => {
        this.loadUsers();
      }, 500);
    },

    editChallenge(challenge) {
      this.editingChallenge = challenge;
      this.challengeForm = {
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: challenge.points,
        status: challenge.status,
        requirements: [...challenge.requirements],
      };
      this.showCreateChallenge = true;
    },

    async saveChallenge() {
      try {
        if (this.editingChallenge) {
          await adminService.updateChallenge(this.editingChallenge._id, this.challengeForm);
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Challenge updated successfully',
            timeout: 3000,
          });
        } else {
          await adminService.createChallenge(this.challengeForm);
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Challenge created successfully',
            timeout: 3000,
          });
        }

        this.showCreateChallenge = false;
        this.resetChallengeForm();
        await this.loadChallenges();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to save challenge',
          timeout: 5000,
        });
      }
    },

    async deleteChallenge(challengeId) {
      if (!confirm('Are you sure you want to delete this challenge?')) {
        return;
      }

      try {
        await adminService.deleteChallenge(challengeId);
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Challenge deleted successfully',
          timeout: 3000,
        });
        await this.loadChallenges();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to delete challenge',
          timeout: 5000,
        });
      }
    },

    addRequirement() {
      this.challengeForm.requirements.push('');
    },

    removeRequirement(index) {
      this.challengeForm.requirements.splice(index, 1);
    },

    resetChallengeForm() {
      this.editingChallenge = null;
      this.challengeForm = {
        title: '',
        description: '',
        category: '',
        difficulty: '',
        points: 50,
        status: 'active',
        requirements: [''],
      };
    },

    editContent(content) {
      this.editingContent = content;
      this.contentForm = {
        title: content.title,
        description: content.description,
        fullContent: content.fullContent,
        type: content.type,
        category: content.category,
        difficulty: content.difficulty,
        thumbnail: content.thumbnail || '',
        videoUrl: content.videoUrl || '',
        readTime: content.readTime || 5,
        author: {
          name: content.author?.name || '',
          role: content.author?.role || '',
          avatar: content.author?.avatar || '',
        },
      };
      this.showCreateContent = true;
    },

    async saveContent() {
      try {
        if (this.editingContent) {
          await adminService.updateEduContent(this.editingContent._id, this.contentForm);
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Content updated successfully',
            timeout: 3000,
          });
        } else {
          await adminService.createEduContent(this.contentForm);
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Content created successfully',
            timeout: 3000,
          });
        }

        this.showCreateContent = false;
        this.resetContentForm();
        await this.loadEduContent();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to save content',
          timeout: 5000,
        });
      }
    },

    async deleteContent(contentId) {
      if (!confirm('Are you sure you want to delete this content?')) {
        return;
      }

      try {
        await adminService.deleteEduContent(contentId);
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Content deleted successfully',
          timeout: 3000,
        });
        await this.loadEduContent();
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Failed to delete content',
          timeout: 5000,
        });
      }
    },

    resetContentForm() {
      this.editingContent = null;
      this.contentForm = {
        title: '',
        description: '',
        fullContent: '',
        type: '',
        category: '',
        difficulty: 'beginner',
        thumbnail: '',
        videoUrl: '',
        readTime: 5,
        author: {
          name: '',
          role: '',
          avatar: '',
        },
      };
    },

    formatNumber(num) {
      return new Intl.NumberFormat().format(num);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },

    formatTime(date) {
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      return `${minutes}m ago`;
    },
  },

  watch: {
    activeTab(newTab, oldTab) {
      if (newTab !== oldTab) {
        this.loadDashboardData();
      }
    },
  },
};
</script>

<style scoped>



nav-badge {
  background: #ff4757;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
}

/* Submissions Styles */
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.submission-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.stat-badge.approved {
  background: #d4edda;
  color: #155724;
}

.stat-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.submissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.submission-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  overflow: hidden;
  transition: all 0.3s ease;
}

.submission-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px 0;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.submission-meta .user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar-tiny {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.username {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.submission-date {
  font-size: 12px;
  color: #888;
}

.submission-status {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.submission-status.pending {
  background: #fff3cd;
  color: #856404;
}

.submission-status.approved {
  background: #d4edda;
  color: #155724;
}

.submission-status.rejected {
  background: #f8d7da;
  color: #721c24;
}

.submission-challenge {
  padding: 0 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.submission-challenge h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.challenge-category {
  background: #f0f8ff;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 8px;
}

.challenge-points {
  color: #1976d2;
  font-weight: 600;
  font-size: 12px;
}

.submission-content {
  padding: 16px 20px;
}

.submission-text {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.submission-images {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.image-count {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.image-preview {
  display: flex;
  gap: 4px;
  position: relative;
}

.image-preview img {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-preview img:hover {
  transform: scale(1.1);
}

.more-images {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.submission-review {
  padding: 12px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e1e8ed;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reviewer {
  font-size: 12px;
  font-weight: 600;
  color: #1976d2;
}

.review-date {
  font-size: 11px;
  color: #888;
}

.review-comment {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.submission-actions {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.btn-action.approve {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.btn-action.approve:hover {
  background: #c3e6cb;
}

.btn-action.reject {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.btn-action.reject:hover {
  background: #f5c6cb;
}

.btn-action.view {
  background: #e3f2fd;
  border-color: #bbdefb;
  color: #1976d2;
}

.btn-action.view:hover {
  background: #bbdefb;
}

/* Review Modal */
.review-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
}

.submission-summary {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e1e8ed;
  margin-bottom: 20px;
}

.challenge-info h4 {
  margin: 0 0 12px;
  color: #1976d2;
}

.challenge-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.submission-summary .user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e1e8ed;
}

.submission-summary .user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-level {
  font-size: 12px;
  color: #888;
}

/* Image Modal */
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
  text-align: center;
}

.image-name {
  color: white;
  font-size: 14px;
}

.load-more-section {
  text-align: center;
  padding: 32px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .submissions-grid {
    grid-template-columns: 1fr;
  }
  
  .submission-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .section-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .image-modal {
    width: 95vw;
    height: 95vh;
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
  .submission-actions {
    flex-direction: column;
  }
  
  .submission-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .image-preview {
    gap: 2px;
  }
  
  .image-preview img, .more-images {
    width: 32px;
    height: 32px;
  }
}

.admin-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.admin-container {
  max-width: 1510px;
  margin: 0 auto;
  padding: 0;
  transform: translateY(-60px);
}

/* Header */
.admin-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.brand-text span {
  font-size: 0.875rem;
  color: #6b7280;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  text-align: right;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  display: block;
}

.user-role {
  font-size: 0.875rem;
  color: #6b7280;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

/* Navigation */
.admin-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 2rem;
}

.nav-tabs {
  display: flex;
  gap: 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-tab:hover {
  color: #10b981;
  background: #f0fdf4;
}

.nav-tab.active {
  color: #10b981;
  border-bottom-color: #10b981;
}

.tab-icon {
  display: flex;
  align-items: center;
}

/* Main Content */
.admin-main {
  padding: 2rem;
}

.tab-content {
  max-width: 100%;
}

/* Overview */
.overview-header {
  margin-bottom: 2rem;
}

.overview-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.overview-header p {
  color: #6b7280;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  display: block;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

/* Activities */
.activity-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.user {
  background: #dbeafe;
  color: #2563eb;
}

.activity-icon.challenge {
  background: #fef3c7;
  color: #d97706;
}

.activity-icon.content {
  background: #f3e8ff;
  color: #7c3aed;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: #1f2937;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  z-index: 1;
}

.search-box input {
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 300px;
  transition: border-color 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action.edit {
  background: #dbeafe;
  color: #2563eb;
}

.btn-action.edit:hover {
  background: #bfdbfe;
}

.btn-action.delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-action.delete:hover {
  background: #fecaca;
}

.btn-action.promote {
  background: #d1fae5;
  color: #065f46;
}

.btn-action.demote {
  background: #fef3c7;
  color: #92400e;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Data Table */
.data-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr 1.5fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.table-header .table-row {
  font-weight: 600;
  color: #374151;
}

.table-body .table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.table-body .table-row:hover {
  background: #f9fafb;
}

.table-body .table-row:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-level {
  font-size: 0.75rem;
  color: #6b7280;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.user {
  background: #dbeafe;
  color: #1e40af;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Grids */
.challenges-grid,
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.challenge-card,
.content-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.challenge-card:hover,
.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.challenge-meta {
  display: flex;
  gap: 0.5rem;
}

.challenge-category {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
}

.challenge-difficulty {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.challenge-difficulty.easy {
  background: #d1fae5;
  color: #065f46;
}

.challenge-difficulty.medium {
  background: #fef3c7;
  color: #92400e;
}

.challenge-difficulty.hard {
  background: #fee2e2;
  color: #991b1b;
}

.challenge-status {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.challenge-status.active {
  background: #d1fae5;
  color: #065f46;
}

.challenge-status.draft {
  background: #f3f4f6;
  color: #6b7280;
}

.challenge-content {
  padding: 1rem;
}

.challenge-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.challenge-content p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.challenge-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  display: block;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.challenge-actions,
.content-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
}

/* Content Cards */
.content-thumbnail {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.content-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-type {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
}

.content-type.article {
  background: #2563eb;
}

.content-type.video {
  background: #dc2626;
}

.content-type.infographic {
  background: #7c3aed;
}

.content-info {
  padding: 1rem;
}

.content-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.content-info p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-category {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
}

.content-stats {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Modals */
.modal-overlay {
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
  padding: 2rem;
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

/* Forms */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirement-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.requirement-item input {
  flex: 1;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-add {
  padding: 0.5rem 1rem;
  border: 1px dashed #d1d5db;
  background: none;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-add:hover {
  border-color: #10b981;
  color: #10b981;
}

.author-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.author-form input {
  margin-bottom: 0;
}

/* Loading States */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .admin-container {
    padding: 0 1rem;
  }
  
  .admin-header,
  .admin-nav {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .admin-main {
    padding: 1.5rem 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .admin-user {
    align-self: flex-end;
  }
  
  .nav-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .nav-tabs::-webkit-scrollbar {
    display: none;
  }
  
  .nav-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-box input {
    width: 250px;
  }
  
  .table-row {
    grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .challenges-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-header {
    padding: 1rem;
  }
  
  .admin-nav {
    padding: 0 1rem;
  }
  
  .admin-main {
    padding: 1rem;
  }
  
  .brand-text h1 {
    font-size: 1.25rem;
  }
  
  .nav-tab {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
  
  .overview-header h2 {
    font-size: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .search-box input {
    width: 200px;
  }
  
  .table-row {
    font-size: 0.875rem;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 0.25rem;
    padding: 0.5rem;
  }
  
  .table-row .table-cell:nth-child(n+4) {
    display: none;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .activity-item {
    padding: 0.5rem;
  }
  
  .challenge-card,
  .content-card {
    margin: 0;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .admin-dashboard {
    background: #0f172a;
  }
  
  .admin-header,
  .admin-nav {
    background: #1e293b;
    border-color: #334155;
  }
  
  .brand-text h1,
  .user-name,
  .overview-header h2,
  .section-header h2 {
    color: #f1f5f9;
  }
  
  .brand-text span,
  .user-role,
  .overview-header p {
    color: #94a3b8;
  }
  
  .nav-tab {
    color: #94a3b8;
  }
  
  .nav-tab:hover,
  .nav-tab.active {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
  
  .stat-card,
  .activity-section,
  .data-table,
  .challenge-card,
  .content-card,
  .modal {
    background: #1e293b;
    border-color: #334155;
  }
  
  .table-header {
    background: #334155;
  }
  
  .search-box input,
  .form-group input,
  .form-group select,
  .form-group textarea {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
  }
  
  .search-box input::placeholder,
  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: #94a3b8;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for accessibility */
.nav-tab:focus,
.btn:focus,
.btn-action:focus,
.modal-close:focus,
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .stat-card,
  .challenge-card,
  .content-card {
    border: 2px solid currentColor;
  }
  
  .btn-primary {
    border: 2px solid #10b981;
  }
  
  .btn-secondary {
    border: 2px solid #6b7280;
  }
}
</style>