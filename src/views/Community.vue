<template>
  <div class="community-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Komunitas EcoQuest</h1>
        <div class="page-actions">
          <button class="btn btn-primary" @click="showCreatePostModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20" />
            </svg>
            Buat Postingan
          </button>
        </div>
      </div>
      
      <div class="community-layout">
        <main class="community-main">
          <div class="create-post-card">
            <button class="create-post-btn" @click="showCreatePostModal = true">
              Bagikan pengalaman hijau Anda...
            </button>
            <div class="post-actions">
              <button class="post-action" @click="showPhotoUploader">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
                </svg>
                Foto
              </button>
              <button class="post-action" @click="showCreatePostModal = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                </svg>
                Tantangan
              </button>
            </div>
          </div>
          
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat postingan komunitas...</p>
          </div>
          
          <div v-else-if="filteredPosts.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2M12.19,5.5C11.3,5.5 10.59,5.68 10.05,6.04C9.5,6.4 9.22,7 9.27,7.69H11.24C11.24,7.41 11.34,7.2 11.5,7.06C11.7,6.92 11.92,6.85 12.19,6.85C12.5,6.85 12.77,6.93 12.95,7.11C13.13,7.28 13.22,7.5 13.22,7.8C13.22,8.08 13.14,8.33 13,8.54C12.83,8.76 12.62,8.94 12.36,9.08C11.84,9.4 11.5,9.68 11.29,9.92C11.1,10.16 11,10.5 11,11H13C13,10.72 13.05,10.5 13.14,10.32C13.23,10.15 13.4,10 13.66,9.85C14.12,9.64 14.5,9.36 14.79,9C15.08,8.63 15.23,8.24 15.23,7.8C15.23,7.1 14.96,6.54 14.42,6.12C13.88,5.71 13.13,5.5 12.19,5.5M11,12V14H13V12H11Z" />
            </svg>
            <h3>Belum Ada Postingan</h3>
            <p>Jadilah yang pertama berbagi pengalaman hijau Anda dengan komunitas!</p>
            <button class="btn btn-primary" @click="showCreatePostModal = true">Buat Postingan Pertama</button>
          </div>
          
          <div v-else class="posts-list">
            <PostCard 
              v-for="post in filteredPosts" 
              :key="post.id"
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
                />
                <span>Semua Postingan</span>
              </label>
              <label class="filter-option">
                <input 
                  type="radio" 
                  name="filter" 
                  value="challenges" 
                  v-model="filter"
                />
                <span>Tantangan</span>
              </label>
              <label class="filter-option">
                <input 
                  type="radio" 
                  name="filter" 
                  value="following" 
                  v-model="filter"
                />
                <span>Mengikuti</span>
              </label>
              <label class="filter-option">
                <input 
                  type="radio" 
                  name="filter" 
                  value="mine" 
                  v-model="filter"
                />
                <span>Postingan Saya</span>
              </label>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3 class="sidebar-title">Tantangan Populer</h3>
            <div class="popular-challenges">
              <div v-for="challenge in popularChallenges" :key="challenge.id" class="challenge-badge" @click="setFilter('challenges', challenge.name)">
                <span class="challenge-name">{{ challenge.name }}</span>
                <span class="challenge-count">{{ challenge.postCount }} postingan</span>
              </div>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3 class="sidebar-title">Pengguna Aktif</h3>
            <div class="active-users">
              <div v-for="user in activeUsers" :key="user.id" class="active-user">
                <img :src="user.avatar" :alt="user.username" class="user-avatar" />
                <div class="user-info">
                  <div class="username">{{ user.username }}</div>
                  <div class="post-count">{{ user.postCount }} postingan</div>
                </div>
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
              <select v-model="newPost.privacy" class="privacy-selector">
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
          
          <div class="form-group" v-if="newPost.image">
            <div class="image-preview">
              <img :src="newPost.image" alt="Preview" class="preview-image" />
              <button class="remove-image" @click="removeImage">×</button>
            </div>
          </div>
          
          <div class="form-group" v-if="newPost.challenge">
            <div class="challenge-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
              </svg>
              <span>{{ newPost.challenge }}</span>
              <button class="remove-challenge" @click="removeChallenge">×</button>
            </div>
          </div>
          
          <div class="post-options">
            <div class="option-label">Tambahkan ke postingan Anda:</div>
            <div class="option-buttons">
              <button class="option-btn" @click="showPhotoUploader">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
                </svg>
                Foto
              </button>
              <button class="option-btn" @click="showChallengeSelector = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                </svg>
                Tantangan
              </button>
            </div>
          </div>
          
          <!-- Challenge Selector -->
          <div v-if="showChallengeSelector" class="challenge-selector">
            <div class="challenge-selector-header">
              <h4>Pilih Tantangan</h4>
              <button class="close-selector" @click="showChallengeSelector = false">×</button>
            </div>
            <div class="challenge-list">
              <div 
                v-for="challenge in availableChallenges" 
                :key="challenge.id"
                class="challenge-item"
                @click="selectChallenge(challenge)"
              >
                <div class="challenge-info">
                  <div class="challenge-name">{{ challenge.name }}</div>
                  <div class="challenge-description">{{ challenge.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showCreatePostModal = false">Batal</button>
          <button 
            class="btn btn-primary" 
            :disabled="!newPost.content && !newPost.image" 
            @click="submitPost"
          >
            {{ editingPost ? 'Perbarui' : 'Kirim' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Hidden file input for photo uploads -->
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept="image/*" 
      @change="handleFileUpload" 
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      showCreatePostModal: false,
      showChallengeSelector: false,
      newPost: {
        content: '',
        image: null,
        challenge: null,
        privacy: 'public'
      },
      editingPost: null,
      popularChallenges: [
        { id: 1, name: 'Tantangan Tanam Pohon', postCount: 42 },
        { id: 2, name: 'Hemat Daya Listrik', postCount: 28 },
        { id: 3, name: 'Belanja Tanpa Plastik', postCount: 23 },
        { id: 4, name: 'Diet Plastik Sebulan', postCount: 19 },
        { id: 5, name: 'Car Free Day', postCount: 15 }
      ],
      activeUsers: [
        { id: 'user1', username: 'RazaWarrior', avatar: 'https://ui-avatars.com/api/?name=Raza+Warrior&background=random', postCount: 24 },
        { id: 'user2', username: 'greenThumb', avatar: 'https://ui-avatars.com/api/?name=green+Thumb&background=random', postCount: 18 },
        { id: 'user5', username: 'earthHero', avatar: 'https://ui-avatars.com/api/?name=earth+Hero&background=random', postCount: 10 }
      ],
      availableChallenges: [
        { id: 'ch001', name: 'Tantangan Tanam Pohon', description: 'Tanam minimal 1 pohon dan dokumentasikan prosesnya.' },
        { id: 'ch002', name: 'Hemat Daya Listrik', description: 'Kurangi konsumsi listrik rumah selama sepekan dan dokumentasikan hasilnya!' },
        { id: 'ch003', name: 'Belanja Tanpa Plastik', description: 'Gunakan tas belanja sendiri dan hindari kemasan plastik sekali pakai.' },
        { id: 'ch004', name: 'Tanam 5 Pohon', description: 'Ajak 4 temanmu untuk menanam pohon di lingkungan sekitar.' },
        { id: 'ch005', name: 'Hemat Air 7 Hari', description: 'Lakukan penghematan air di rumah selama seminggu.' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCurrentUser'
    }),
    currentUsername() {
      return this.currentUser.username
    },
    currentUserAvatar() {
      return this.currentUser.avatar
    },
    filteredPosts() {
      let filtered = [...this.posts]
      
      switch (this.filter) {
        case 'challenges':
          filtered = filtered.filter(post => post.challenge)
          break
        case 'following':
          // In a real app, this would filter for posts from users that the current user follows
          filtered = filtered.filter(post => post.author !== this.currentUsername)
          break
        case 'mine':
          filtered = filtered.filter(post => post.authorId === this.currentUser.id)
          break
      }
      
      return filtered
    }
  },
  created() {
    this.loadPosts()
  },
  methods: {
    async loadPosts() {
      this.loading = true
      
      try {
        // Simulate API request with mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const newPosts = [
          {
            id: 1,
            author: 'RazaWarior',
            authorId: 'user1',
            authorAvatar:  'https://ui-avatars.com/api/?name=Raza+Warrior&background=random',
            content: 'Baru selesai tantangan Sapu Bersih Pantai! Kami mengumpulkan lebih dari 20 kantong sampah plastik. Bangga dengan tim kami!',
            image: '/src/assets/images/clean.jpg',
            date: '2 jam lalu',
            likes: 42,
            liked: false,
            comments: [
              {
                author: 'ecoNinja',
                authorAvatar: '/src/assets/images/avatars/user2.jpg',
                text: 'Luar biasa! Pantai mana ini?',
                date: '1 jam lalu'
              },
              {
                author: 'planetProtector',
                authorAvatar: '/src/assets/images/avatars/user3.jpg',
                text: 'Ini baru semangat! Kapan kegiatan berikutnya? Saya mau ikut.',
                date: '45 menit lalu'
              }
            ],
            challenge: 'Sapu Bersih Pantai',
            challengeCompleted: true
          },
          {
            id: 2,
            author: 'bobon santoso',
            authorId: 'user2',
            authorAvatar: 'https://ui-avatars.com/api/?name=bobon+santoso&background=random',
            content: 'Hari ketiga tantangan Belanja Tanpa Plastik. Ternyata lebih mudah dari yang kukira! Cukup siapkan tas belanja dan wadah sendiri. Kalian juga bisa!',
            image: null,
            date: '5 jam lalu',
            likes: 35,
            liked: true,
            comments: [
              {
                author: 'earthHero',
                authorAvatar: '/src/assets/images/avatars/user5.jpg',
                text: 'Tips apa yang bisa kamu bagikan untuk pemula?',
                date: '3 jam lalu'
              }
            ],
            challenge: 'Belanja Tanpa Plastik',
            challengeCompleted: false
          },
          {
            id: 3,
            author: 'tarizrizkii',
            authorId: 'user4',
            authorAvatar: 'https://ui-avatars.com/api/?name=tarizrizkii&background=random',
            content: 'Kemarin aku dan beberapa teman menanam 10 pohon mangrove di pesisir pantai. Pohon mangrove sangat penting untuk menjaga ekosistem pesisir dan mencegah erosi pantai. Semoga pohon-pohon ini tumbuh dengan baik!',
         
            date: '1 hari lalu',
            likes: 56,
            liked: false,
            comments: [
              {
                author: 'greenWarrior',
                authorAvatar: '/src/assets/images/avatars/user1.jpg',
                text: 'Keren banget! Mangrove memang punya banyak manfaat ekologis.',
                date: '20 jam lalu'
              }
            ],
            challenge: 'Tanam 5 Pohon',
            challengeCompleted: true
          },
          {
            id: 4,
            author: 'oceanGuardian',
            authorId: 'user3',
            authorAvatar: 'https://ui-avatars.com/api/?name=ocean+Guardian&background=random',
            content: 'Panen perdana dari kebun vertikal di balkon apartemenku! Selain menghemat uang belanja, juga mengurangi jejak karbon dari transportasi makanan. Win-win!',
            date: '2 hari lalu',
            likes: 48,
            liked: false,
            comments: [],
            challenge: null,
            challengeCompleted: false
          },
          {
            id: 5,
            author: 'earthHero',
            authorId: 'user5',
            authorAvatar: 'https://ui-avatars.com/api/?name=earth+Hero&background=random',
            content: 'Baru mulai menggunakan botol minum yang bisa dipakai ulang. Selama sebulan terakhir, sudah menghemat sekitar 30 botol plastik sekali pakai! Perubahan kecil, dampak besar.',
            image: null,
            date: '3 hari lalu',
            likes: 29,
            liked: false,
            comments: [],
            challenge: 'Diet Plastik Sebulan',
            challengeCompleted: false
          }
        ]
        
        // If it's a new page, append the posts, otherwise replace them
        if (this.page === 1) {
          this.posts = newPosts
        } else {
          this.posts = [...this.posts, ...newPosts]
        }
        
        // Check if we've reached the end of available posts
        if (this.page >= 3) { // Simulate only having 3 pages
          this.hasMorePosts = false
        }
        
        this.page++
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        this.loading = false
      }
    },
    loadMorePosts() {
      this.loadPosts()
    },
    setFilter(filter, challenge = null) {
      this.filter = filter
      
      if (challenge) {
        // Implementation for filtering by specific challenge
        console.log(`Filtering by challenge: ${challenge}`)
      }
    },
    showPhotoUploader() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // In a real app, you'd upload the file to a server
        // For now, we'll create a local URL for preview
        this.newPost.image = URL.createObjectURL(file)
        
        // Show the post modal after selecting an image
        this.showCreatePostModal = true
      }
    },
    removeImage() {
      this.newPost.image = null
    },
    selectChallenge(challenge) {
      this.newPost.challenge = challenge.name
      this.showChallengeSelector = false
    },
    removeChallenge() {
      this.newPost.challenge = null
    },
    submitPost() {
      if (!this.newPost.content && !this.newPost.image) return
      
      if (this.editingPost) {
        // Update existing post
        const postIndex = this.posts.findIndex(post => post.id === this.editingPost.id)
        if (postIndex !== -1) {
          const updatedPost = {
            ...this.posts[postIndex],
            content: this.newPost.content,
            image: this.newPost.image,
            challenge: this.newPost.challenge,
            editedAt: new Date().toISOString()
          }
          
          this.posts.splice(postIndex, 1, updatedPost)
          
          this.$store.dispatch('addNotification', {
            type: 'success',
            message: 'Postingan berhasil diperbarui!',
            timeout: 3000
          })
        }
      } else {
        // Create new post
        const newPost = {
          id: this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1,
          author: this.currentUsername,
          authorId: this.currentUser.id,
          authorAvatar: this.currentUserAvatar,
          content: this.newPost.content,
          image: this.newPost.image,
          date: 'Baru saja',
          likes: 0,
          liked: false,
          comments: [],
          challenge: this.newPost.challenge,
          challengeCompleted: false
        }
        
        this.posts.unshift(newPost)
        
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Postingan berhasil dibuat!',
          timeout: 3000
        })
      }
      
      // Reset form and close modal
      this.resetPostForm()
      this.showCreatePostModal = false
    },
    resetPostForm() {
      this.newPost = {
        content: '',
        image: null,
        challenge: null,
        privacy: 'public'
      }
      this.editingPost = null
      this.showChallengeSelector = false
    },
    toggleLike(postId) {
      const postIndex = this.posts.findIndex(post => post.id === postId)
      if (postIndex !== -1) {
        const post = this.posts[postIndex]
        const updatedPost = { ...post }
        
        if (updatedPost.liked) {
          updatedPost.likes--
          updatedPost.liked = false
        } else {
          updatedPost.likes++
          updatedPost.liked = true
        }
        
        this.posts.splice(postIndex, 1, updatedPost)
      }
    },
    addComment({ postId, comment }) {
      const postIndex = this.posts.findIndex(post => post.id === postId)
      if (postIndex !== -1) {
        const post = this.posts[postIndex]
        const updatedPost = { ...post }
        
        updatedPost.comments.push(comment)
        this.posts.splice(postIndex, 1, updatedPost)
      }
    },
    editPost(post) {
      this.editingPost = post
      this.newPost = {
        content: post.content,
        image: post.image,
        challenge: post.challenge,
        privacy: 'public' // Assume public by default
      }
      this.showCreatePostModal = true
    },
    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId)
      
      this.$store.dispatch('addNotification', {
        type: 'success',
        message: 'Postingan berhasil dihapus!',
        timeout: 3000
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

.post-actions {
  display: flex;
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
}

.post-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: background-color var(--transition-fast);
  border-radius: var(--radius-md);
}

.post-action:hover {
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

/* Popular Challenges */
.popular-challenges {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.challenge-badge {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.challenge-badge:hover {
  background-color: rgba(76, 175, 80, 0.2);
}

.challenge-name {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.challenge-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Active Users */
.active-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.active-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.post-count {
  font-size: 0.75rem;
  color: var(--text-tertiary);
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

.image-preview {
  position: relative;
  margin-top: 1rem;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
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

.post-options {
  margin-top: 1.5rem;
}

.option-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.option-buttons {
  display: flex;
  gap: 1rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.option-btn:hover {
  background-color: var(--bg-secondary);
  border-color: var(--text-tertiary);
}

/* Challenge Selector */
.challenge-selector {
  margin-top: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.challenge-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.challenge-selector-header h4 {
  margin: 0;
  font-size: 1rem;
}

.close-selector {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-tertiary);
}

.challenge-list {
  max-height: 200px;
  overflow-y: auto;
}

.challenge-item {
  padding: 1rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border-bottom: 1px solid var(--border-color);
}

.challenge-item:last-child {
  border-bottom: none;
}

.challenge-item:hover {
  background-color: var(--bg-secondary);
}

.challenge-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.challenge-description {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>