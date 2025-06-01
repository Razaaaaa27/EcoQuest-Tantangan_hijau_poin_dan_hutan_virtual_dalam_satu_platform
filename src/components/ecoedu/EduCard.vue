<template>
  <div class="edu-card" @click="goToContent">
    <div class="edu-card-image">
      <img :src="content.thumbnail || '/default-thumbnail.jpg'" :alt="content.title" />
      <div class="content-type" :class="content.type">
        <svg v-if="content.type === 'article'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
        </svg>
        <svg v-else-if="content.type === 'video'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
        </svg>
        <svg v-else-if="content.type === 'infographic'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M7,7V9H9V7H7M11,7V9H13V7H11M15,7V9H17V7H15M7,11V13H9V11H7M11,11V13H13V11H11M15,11V13H17V11H15M7,15V17H9V15H7M11,15V17H13V15H11M15,15V17H17V15H15Z" />
        </svg>
        <span>{{ formatType(content.type) }}</span>
      </div>
      
      <div v-if="content.difficulty" class="content-difficulty">
        {{ formatDifficulty(content.difficulty) }}
      </div>
      
      <div v-if="content.readTime" class="read-time">
        {{ content.readTime }} min baca
      </div>
    </div>
    
    <div class="edu-card-content">
      <div class="edu-category">{{ content.category }}</div>
      <h3 class="edu-title">{{ content.title }}</h3>
      <p class="edu-description">{{ content.description }}</p>
      
      <div class="edu-meta">
        <div class="edu-author">
          <img 
            :src="content.author?.avatar || '/default-avatar.png'" 
            :alt="content.author?.name || 'Author'" 
            class="author-avatar" 
          />
          <span>{{ content.author?.name || 'Unknown Author' }}</span>
        </div>
        <div class="edu-date">{{ formatDate(content.createdAt) }}</div>
      </div>
      
      <div class="edu-stats">
        <div class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
          </svg>
          {{ content.views || 0 }}
        </div>
        <div class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
          {{ content.likeCount || 0 }}
        </div>
        <div class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
          </svg>
          {{ content.commentCount || 0 }}
        </div>
      </div>
      
      <div class="edu-actions" @click.stop>
        <button 
          class="action-btn like-btn" 
          :class="{ active: content.isLiked }"
          @click="handleLike"
          :title="content.isLiked ? 'Batalkan suka' : 'Suka'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
          </svg>
        </button>
        
        <button 
          class="action-btn bookmark-btn" 
          :class="{ active: content.isBookmarked }"
          @click="handleBookmark"
          :title="content.isBookmarked ? 'Hapus dari simpan' : 'Simpan'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
          </svg>
        </button>
        
        <button class="action-btn share-btn" @click="handleShare" title="Bagikan">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="content.tags && content.tags.length > 0" class="edu-tags">
      <span v-for="tag in content.tags.slice(0, 3)" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EduCard',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  methods: {
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
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    goToContent() {
      this.$emit('view', this.content._id)
    },
    
    handleLike() {
      this.$emit('like', this.content._id)
    },
    
    handleBookmark() {
      this.$emit('bookmark', this.content._id)
    },
    
    handleShare() {
      if (navigator.share) {
        navigator.share({
          title: this.content.title,
          text: this.content.description,
          url: window.location.origin + `/ecoedu/${this.content._id}`
        }).catch(err => console.log('Error sharing:', err))
      } else {
        // Fallback to clipboard
        const url = window.location.origin + `/ecoedu/${this.content._id}`
        navigator.clipboard.writeText(url).then(() => {
          this.$toast.success('Link berhasil disalin!')
        }).catch(err => {
          console.log('Error copying to clipboard:', err)
          this.$toast.error('Gagal menyalin link')
        })
      }
    }
  }
}
</script>


<style scoped>
/* ===== EDU CARD RESPONSIVE & MODERN STYLES ===== */

.edu-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.edu-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.edu-card:active {
  transform: translateY(-4px) scale(1.01);
}

/* ===== IMAGE SECTION ===== */
.edu-card-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.edu-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.9) contrast(1.1);
}

.edu-card:hover .edu-card-image img {
  transform: scale(1.1);
  filter: brightness(1) contrast(1.2);
}

/* Content Type Badge */
.content-type {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 8px 12px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.content-type.article {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.content-type.video {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #991b1b;
}

.content-type.infographic {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.content-type svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.edu-card:hover .content-type svg {
  transform: rotate(5deg) scale(1.1);
}

/* Difficulty Badge */
.content-difficulty {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
}

/* Read Time */
.read-time {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #374151;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ===== CONTENT SECTION ===== */
.edu-card-content {
  padding: 24px;
  position: relative;
}

.edu-category {
  color: #059669;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 50px;
  display: inline-block;
  border: 1px solid rgba(5, 150, 105, 0.2);
}

.edu-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.edu-card:hover .edu-title {
  color: #3b82f6;
}

.edu-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== META SECTION ===== */
.edu-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.edu-author {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.edu-card:hover .author-avatar {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.edu-date {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
}

/* ===== STATS SECTION ===== */
.edu-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.stat:hover {
  color: #3b82f6;
}

.stat svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.stat:hover svg {
  transform: scale(1.1);
}

/* ===== ACTIONS SECTION ===== */
.edu-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

.like-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.like-btn.active {
  border-color: #ef4444;
  color: white;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.bookmark-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.bookmark-btn.active {
  border-color: #f59e0b;
  color: white;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.share-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.action-btn svg {
  transition: transform 0.3s ease;
}

.action-btn:hover svg {
  transform: scale(1.1) rotate(5deg);
}

.action-btn.active svg {
  transform: scale(1.2);
}

/* ===== TAGS SECTION ===== */
.edu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 600;
  text-transform: lowercase;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.tag:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transform: translateY(-1px);
}

/* ===== RESPONSIVE DESIGN ===== */

/* Large screens */
@media (min-width: 1200px) {
  .edu-card {
    max-width: 380px;
  }
  
  .edu-card-image {
    height: 240px;
  }
  
  .edu-title {
    font-size: 20px;
  }
  
  .edu-description {
    font-size: 15px;
  }
}

/* Medium screens */
@media (max-width: 1024px) {
  .edu-card {
    max-width: 350px;
  }
  
  .edu-card-image {
    height: 200px;
  }
  
  .edu-card-content {
    padding: 20px;
  }
}

/* Small screens */
@media (max-width: 768px) {
  .edu-card {
    max-width: 100%;
    margin: 0;
    border-radius: 20px;
  }
  
  .edu-card-image {
    height: 180px;
  }
  
  .edu-card-content {
    padding: 18px;
  }
  
  .edu-title {
    font-size: 16px;
  }
  
  .edu-description {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
  
  .edu-stats {
    gap: 16px;
  }
  
  .stat {
    font-size: 12px;
  }
  
  .action-btn {
    padding: 10px;
  }
  
  .edu-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .edu-card {
    border-radius: 16px;
  }
  
  .edu-card-image {
    height: 160px;
  }
  
  .edu-card-content {
    padding: 16px;
  }
  
  .edu-title {
    font-size: 15px;
    margin-bottom: 8px;
  }
  
  .edu-description {
    font-size: 12px;
    margin-bottom: 16px;
  }
  
  .edu-stats {
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .stat svg {
    width: 14px;
    height: 14px;
  }
  
  .action-btn {
    padding: 8px;
    border-radius: 12px;
  }
  
  .action-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .content-type {
    padding: 6px 10px;
    font-size: 10px;
  }
  
  .content-type svg {
    width: 12px;
    height: 12px;
  }
  
  .content-difficulty,
  .read-time {
    padding: 4px 8px;
    font-size: 10px;
  }
  
  .author-avatar {
    width: 28px;
    height: 28px;
  }
  
  .edu-author {
    font-size: 12px;
  }
  
  .edu-date {
    font-size: 11px;
  }
  
  .tag {
    padding: 4px 8px;
    font-size: 10px;
  }
}

/* ===== GRID LAYOUT FOR MULTIPLE CARDS ===== */
.edu-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  padding: 20px;
}

@media (max-width: 768px) {
  .edu-cards-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .edu-cards-grid {
    gap: 16px;
    padding: 12px;
  }
}

/* ===== LOADING STATES ===== */
.edu-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.edu-card.loading .edu-card-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ===== ACCESSIBILITY ===== */
.edu-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}

.action-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .edu-card,
  .edu-card-image img,
  .action-btn,
  .stat,
  .tag {
    transition: none;
  }
  
  .edu-card:hover {
    transform: none;
  }
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  .edu-card {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-color: rgba(75, 85, 99, 0.3);
  }
  
  .edu-card:hover {
    border-color: rgba(59, 130, 246, 0.4);
  }
  
  .edu-title {
    color: #f9fafb;
  }
  
  .edu-card:hover .edu-title {
    color: #60a5fa;
  }
  
  .edu-description {
    color: #d1d5db;
  }
  
  .edu-meta {
    border-bottom-color: #374151;
  }
  
  .edu-stats {
    border-bottom-color: #374151;
  }
  
  .stat {
    color: #9ca3af;
  }
  
  .action-btn {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
    border-color: #4b5563;
    color: #d1d5db;
  }
}

</style>
