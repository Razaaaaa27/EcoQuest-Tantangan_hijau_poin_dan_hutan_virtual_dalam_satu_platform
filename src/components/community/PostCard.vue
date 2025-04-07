<template>
  <div class="post-card">
    <div class="post-header">
      <div class="post-author">
        <img :src="post.authorAvatar" :alt="post.author" class="author-avatar" />
        <div class="author-info">
          <div class="author-name">{{ post.author }}</div>
          <div class="post-date">{{ post.date }}</div>
        </div>
      </div>
      <div class="post-menu" v-if="isOwnPost">
        <button class="post-menu-btn" @click="showMenu = !showMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
          </svg>
        </button>
        <div class="post-menu-dropdown" v-if="showMenu">
          <button class="menu-item" @click="editPost">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
            Edit
          </button>
          <button class="menu-item delete" @click="deletePost">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
            Hapus
          </button>
        </div>
      </div>
    </div>
    
    <div class="post-content">
      <p v-if="post.content" class="post-text">{{ post.content }}</p>
      <img v-if="post.image" :src="post.image" :alt="'Post by ' + post.author" class="post-image" />
      
      <div v-if="post.challenge" class="post-challenge">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
        </svg>
        <div class="challenge-label">
          <span>{{ post.challenge }}</span>
          <span class="challenge-status" :class="{ 'completed': post.challengeCompleted }">
            {{ post.challengeCompleted ? 'Selesai' : 'Sedang Berlangsung' }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="post-actions">
      <button class="post-action" :class="{ 'active': post.liked }" @click="toggleLike">
        <svg v-if="post.liked" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C3.42,3 0,6.42 0,10.5C0,15.23 4.75,19.31 9.94,24.12L12,26L14.06,24.12C19.25,19.31 24,15.23 24,10.5C24,6.42 20.58,3 16.5,3Z" />
        </svg>
        <span>{{ post.likes }} {{ post.likes === 1 ? 'Suka' : 'Suka' }}</span>
      </button>
      
      <button class="post-action" @click="toggleComments">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
        </svg>
        <span>{{ post.comments.length }} {{ post.comments.length === 1 ? 'Komentar' : 'Komentar' }}</span>
      </button>
      
      <button class="post-action">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
        </svg>
        <span>Bagikan</span>
      </button>
    </div>
    
    <div v-if="showComments" class="post-comments">
      <div class="comments-header">
        <h4>Komentar ({{ post.comments.length }})</h4>
      </div>
      
      <div class="comments-list">
        <div v-for="(comment, index) in post.comments" :key="index" class="comment">
          <img :src="comment.authorAvatar" :alt="comment.author" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-author">{{ comment.author }}</div>
            <div class="comment-text">{{ comment.text }}</div>
            <div class="comment-date">{{ comment.date }}</div>
          </div>
        </div>
      </div>
      
      <div class="comment-form">
        <img :src="currentUserAvatar" :alt="currentUsername" class="comment-avatar" />
        <div class="comment-input-container">
          <textarea 
            class="comment-input" 
            placeholder="Tulis komentar..." 
            v-model="newComment"
            @keyup.enter="addComment"
          ></textarea>
          <button 
            class="comment-submit" 
            :disabled="!newComment.trim()" 
            @click="addComment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showMenu: false,
      showComments: false,
      newComment: ''
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser'
    }),
    isOwnPost() {
      return this.post.authorId === this.currentUser.id
    },
    currentUsername() {
      return this.currentUser.username
    },
    currentUserAvatar() {
      return this.currentUser.avatar
    }
  },
  methods: {
    toggleLike() {
      this.$emit('toggle-like', this.post.id)
    },
    toggleComments() {
      this.showComments = !this.showComments
    },
    editPost() {
      this.showMenu = false
      this.$emit('edit-post', this.post)
    },
    deletePost() {
      this.showMenu = false
      if (confirm('Anda yakin ingin menghapus postingan ini?')) {
        this.$emit('delete-post', this.post.id)
      }
    },
    addComment() {
      if (this.newComment.trim()) {
        const comment = {
          author: this.currentUsername,
          authorAvatar: this.currentUserAvatar,
          text: this.newComment.trim(),
          date: 'Baru saja'
        }
        
        this.$emit('add-comment', {
          postId: this.post.id,
          comment
        })
        
        this.newComment = ''
      }
    }
  },
  watch: {
    // Close menu dropdown when clicking outside
    showMenu(newValue) {
      if (newValue) {
        const handleClickOutside = (e) => {
          if (!this.$el.contains(e.target)) {
            this.showMenu = false
            document.removeEventListener('click', handleClickOutside)
          }
        }
        
        // Need to use a timeout to avoid the current click triggering the handler
        setTimeout(() => {
          document.addEventListener('click', handleClickOutside)
        }, 0)
      }
    }
  }
}
</script>

<style scoped>
.post-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.post-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.post-menu {
  position: relative;
}

.post-menu-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.post-menu-btn:hover {
  background-color: var(--bg-tertiary);
}

.post-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  min-width: 150px;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--text-primary);
}

.menu-item:hover {
  background-color: var(--bg-secondary);
}

.menu-item.delete {
  color: var(--color-danger);
}

.menu-item.delete:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.post-content {
  padding: 1rem;
}

.post-text {
  margin-bottom: 1rem;
  white-space: pre-line;
}

.post-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.post-challenge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin-top: 0.5rem;
}

.challenge-label {
  display: flex;
  flex-direction: column;
}

.challenge-status {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--text-secondary);
}

.challenge-status.completed {
  color: var(--color-success);
  font-weight: 600;
}

.post-actions {
  display: flex;
  border-top: 1px solid var(--border-color);
}

.post-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--text-secondary);
}

.post-action:hover {
  background-color: var(--bg-secondary);
}

.post-action.active {
  color: var(--color-primary);
}

.post-comments {
  border-top: 1px solid var(--border-color);
  padding: 1rem;
  background-color: var(--bg-secondary);
}

.comments-header h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.comments-list {
  margin-bottom: 1rem;
}

.comment {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.comment:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-author {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.comment-text {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.comment-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.comment-form {
  display: flex;
  gap: 0.75rem;
}

.comment-input-container {
  position: relative;
  flex: 1;
}

.comment-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  background-color: var(--bg-primary);
  resize: none;
  min-height: 40px;
  max-height: 120px;
  outline: none;
  transition: border-color var(--transition-fast);
}

.comment-input:focus {
  border-color: var(--color-primary);
}

.comment-submit {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.comment-submit:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.comment-submit:disabled {
  color: var(--text-tertiary);
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>