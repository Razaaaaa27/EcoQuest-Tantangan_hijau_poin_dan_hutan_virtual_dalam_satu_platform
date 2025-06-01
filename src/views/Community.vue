<template>
  <div class="community-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Komunitas EcoQuest</h1>
        <div class="page-actions" v-if="isAuthenticated">
          <button class="btn btn-primary" @click="showCreatePostModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20" />
            </svg>
            Buat Postingan
          </button>
        </div>
      </div>

      <!-- Guest Message -->
      <div v-if="!isAuthenticated" class="guest-message">
        <div class="guest-content">
          <h2>Bergabung dengan Komunitas EcoQuest!</h2>
          <p>Login untuk berbagi pengalaman, bertanya, dan terhubung dengan eco-warriors lainnya.</p>
          <div class="guest-actions">
            <router-link to="/login" class="btn btn-primary">Login</router-link>
            <router-link to="/register" class="btn btn-outline">Daftar</router-link>
          </div>
        </div>
      </div>
      
      <div class="community-layout">
        <main class="community-main">
          <!-- Create Post Card for authenticated users -->
          <div v-if="isAuthenticated" class="create-post-card">
            <button class="create-post-btn" @click="showCreatePostModal = true">
              Bagikan pengalaman hijau Anda...
            </button>
          </div>
          
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat postingan komunitas...</p>
          </div>
          
          <div v-else-if="posts.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2M12.19,5.5C11.3,5.5 10.59,5.68 10.05,6.04C9.5,6.4 9.22,7 9.27,7.69H11.24C11.24,7.41 11.34,7.2 11.5,7.06C11.7,6.92 11.92,6.85 12.19,6.85C12.5,6.85 12.77,6.93 12.95,7.11C13.13,7.28 13.22,7.5 13.22,7.8C13.22,8.08 13.14,8.33 13,8.54C12.83,8.76 12.62,8.94 12.36,9.08C11.84,9.4 11.5,9.68 11.29,9.92C11.1,10.16 11,10.5 11,11H13C13,10.72 13.05,10.5 13.14,10.32C13.23,10.15 13.4,10 13.66,9.85C14.12,9.64 14.5,9.36 14.79,9C15.08,8.63 15.23,8.24 15.23,7.8C15.23,7.1 14.96,6.54 14.42,6.12C13.88,5.71 13.13,5.5 12.19,5.5M11,12V14H13V12H11Z" />
            </svg>
            <h3>Belum Ada Postingan</h3>
            <p v-if="isAuthenticated">Jadilah yang pertama berbagi pengalaman hijau Anda dengan komunitas!</p>
            <p v-else>Login untuk melihat dan berpartisipasi dalam diskusi komunitas.</p>
            <button v-if="isAuthenticated" class="btn btn-primary" @click="showCreatePostModal = true">
              Buat Postingan Pertama
            </button>
          </div>
          
          <div v-else class="posts-list">
            <PostCard 
              v-for="post in posts" 
              :key="post._id || post.id"
              :post="post"
              @toggle-like="toggleLike"
              @add-comment="addComment"
              @edit-post="editPost"
              @delete-post="deletePost"
            />
          </div>
          
          <div class="load-more" v-if="hasMorePosts && !loading">
            <button class="btn btn-outline" @click="loadMorePosts">
              Muat Lebih Banyak
            </button>
          </div>
        </main>
        
        <aside class="community-sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-title">Filter</h3>
            <div class="filter-options">
              <label class="filter-option">
                <input 
                  type="radio" 
                  name="filter" 
                  value="all" 
                  v-model="filter"
                  @change="loadPosts"
                />
                <span>Semua Postingan</span>
              </label>
              <label class="filter-option">
                <input 
                  type="radio" 
                  name="filter" 
                  value="challenges" 
                  v-model="filter"
                  @change="loadPosts"
                />
                <span>Postingan Saya</span>
              </label>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3 class="sidebar-title">Statistik Komunitas</h3>
            <div class="community-stats">
              <div class="stat-item">
                <div class="stat-number">{{ totalPosts }}</div>
                <div class="stat-label">Total Postingan</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    
    <!-- Create Post Modal -->
    <div v-if="showCreatePostModal" class="modal-overlay" @click="showCreatePostModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ editingPost ? 'Edit Postingan' : 'Buat Postingan Baru' }}</h3>
          <button class="modal-close" @click="showCreatePostModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="create-post-header">
            <img :src="currentUserAvatar" :alt="currentUsername" class="user-avatar" />
            <div class="user-info">
              <div class="username">{{ currentUsername }}</div>
              <select v-model="newPost.visibility" class="privacy-selector">
                <option value="public">Publik</option>
                <option value="friends">Teman</option>
                <option value="private">Pribadi</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <textarea 
              class="post-content-input" 
              placeholder="Apa yang ingin Anda bagikan hari ini?" 
              v-model="newPost.content"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <input 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload" 
              class="image-upload-input" 
              multiple
            />
            <div class="image-preview" v-if="newPost.images.length > 0">
              <div v-for="(image, index) in newPost.images" :key="index" class="preview-image-container">
                <img :src="image" alt="Preview" class="preview-image" />
                <button @click="removeImage(index)" class="remove-image">×</button>
              </div>
            </div>
          </div>
          
          <div class="form-group" v-if="newPost.challenge">
            <div class="challenge-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
              </svg>
              <span>{{ newPost.challenge.title }}</span>
              <button type="button" class="remove-challenge" @click="removeChallenge">×</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showCreatePostModal = false">Batal</button>
          <button 
            class="btn btn-primary" 
            :disabled="(!newPost.content || newPost.content.trim() === '') || submittingPost" 
            @click="submitPost"
          >
            {{ submittingPost ? 'Memposting...' : (editingPost ? 'Perbarui' : 'Kirim') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PostCard from '@/components/community/PostCard.vue'

export default {
  name: 'CommunityView',
  components: {
    PostCard
  },
  data() {
    return {
      posts: [],
      loading: false,
      filter: 'all',
      hasMorePosts: true,
      page: 1,
      totalPosts: 0,
      activeUsers: 0,
      showCreatePostModal: false,
      submittingPost: false,
      newPost: {
        content: '',
        images: [],
        challenge: null,
        visibility: 'public'
      },
      editingPost: null
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser',
      isAuthenticated: 'user/isAuthenticated'
    }),
    currentUsername() {
      return this.currentUser?.username || 'User'
    },
    currentUserAvatar() {
      return this.currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'
    }
  },
  created() {
    this.loadPosts()
  },
  methods: {
    ...mapActions({
      fetchPosts: 'community/fetchPosts',
      createPostAction: 'community/createPost',
      updatePostAction: 'community/updatePost',
      deletePostAction: 'community/deletePost',
      toggleLikeAction: 'community/toggleLike',
      addCommentAction: 'community/addComment'
    }),

    async loadPosts() {
      this.loading = true
      try {
        const params = {
          page: 1,
          limit: 10,
          filter: this.filter,
          sort: '-createdAt'
        }

        const data = await this.fetchPosts(params)
        this.posts = data.posts || []
        this.hasMorePosts = data.pagination ? data.pagination.page < data.pagination.pages : false
        this.totalPosts = data.pagination ? data.pagination.total : this.posts.length
        this.activeUsers = Math.floor(this.totalPosts / 3) // Rough estimate

        this.page = 1
      } catch (error) {
        console.error('Error loading posts:', error)
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal memuat postingan',
          timeout: 5000
        })
      } finally {
        this.loading = false
      }
    },

    async loadMorePosts() {
      if (this.loading || !this.hasMorePosts) return

      this.loading = true
      try {
        this.page++
        const params = {
          page: this.page,
          limit: 10,
          filter: this.filter,
          sort: '-createdAt'
        }

        const data = await this.fetchPosts(params)
        this.posts.push(...(data.posts || []))
        this.hasMorePosts = data.pagination ? data.pagination.page < data.pagination.pages : false
      } catch (error) {
        console.error('Error loading more posts:', error)
      } finally {
        this.loading = false
      }
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.newPost.images.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    },

    removeImage(index) {
      this.newPost.images.splice(index, 1)
    },

    async submitPost() {
      if (!this.newPost.content || this.newPost.content.trim() === '') return

      this.submittingPost = true
      try {
        if (this.editingPost) {
          await this.updatePostAction({
            id: this.editingPost._id || this.editingPost.id,
            postData: {
              content: this.newPost.content.trim(),
              images: this.newPost.images,
              visibility: this.newPost.visibility
            }
          })
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Postingan berhasil diperbarui!',
            timeout: 3000
          })
        } else {
          await this.createPostAction({
            content: this.newPost.content.trim(),
            images: this.newPost.images,
            visibility: this.newPost.visibility,
            challenge: this.newPost.challenge?._id
          })
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Postingan berhasil dibuat!',
            timeout: 3000
          })
        }

        this.resetPostForm()
        this.showCreatePostModal = false
        await this.loadPosts()
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal memposting',
          timeout: 5000
        })
      } finally {
        this.submittingPost = false
      }
    },

    resetPostForm() {
      this.newPost = {
        content: '',
        images: [],
        challenge: null,
        visibility: 'public'
      }
      this.editingPost = null
    },

    async toggleLike(postId) {
      if (!this.isAuthenticated) {
        this.$store.dispatch('addNotification', {
          type: 'info',
          message: 'Silakan login untuk menyukai postingan',
          timeout: 3000
        })
        return
      }

      try {
        await this.toggleLikeAction(postId)
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal menyukai postingan',
          timeout: 3000
        })
      }
    },

    async addComment({ postId, comment }) {
      if (!this.isAuthenticated) {
        this.$store.dispatch('addNotification', {
          type: 'info',
          message: 'Silakan login untuk berkomentar',
          timeout: 3000
        })
        return
      }

      try {
        await this.addCommentAction({ postId, text: comment })
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Komentar berhasil ditambahkan!',
          timeout: 3000
        })
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal menambahkan komentar',
          timeout: 3000
        })
      }
    },

    editPost(post) {
      this.editingPost = post
      this.newPost = {
        content: post.content,
        images: post.images || [],
        challenge: post.challenge,
        visibility: post.visibility || 'public'
      }
      this.showCreatePostModal = true
    },

    async deletePost(postId) {
      if (!confirm('Anda yakin ingin menghapus postingan ini?')) return

      try {
        await this.deletePostAction(postId)
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Postingan berhasil dihapus!',
          timeout: 3000
        })
      } catch (error) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal menghapus postingan',
          timeout: 3000
        })
      }
    },

    removeChallenge() {
      this.newPost.challenge = null
    }
  }
}
</script>

<style scoped>
/* Add these new styles */
.image-upload-input {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.image-preview {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preview-image-container {
  position: relative;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.remove-image {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
}

/* Existing styles remain unchanged */
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

.community-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .community-layout {
    grid-template-columns: 2fr 1fr;
  }
}

/* Create Post Card */
.create-post-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.create-post-btn {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  text-align: left;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.create-post-btn:hover {
  background-color: var(--bg-tertiary);
}

/* Sidebar */
.community-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
}

.sidebar-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* Filter Options */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.filter-option span {
  font-size: 0.875rem;
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
  max-width: 600px;
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

.modal-footer {
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Create Post Form */
.create-post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.privacy-selector {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
}

.post-content-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  resize: vertical;
  min-height: 100px;
  font-size: 1rem;
  outline: none;
  transition: border-color var(--transition-fast);
}

.post-content-input:focus {
  border-color: var(--color-primary);
}

.challenge-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  margin-top: 1rem;
}

.remove-challenge {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  display: flex;
  align-items: center;
}
</style>