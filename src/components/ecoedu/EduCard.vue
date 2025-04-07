<template>
  <div class="edu-card" @click="goToContent">
    <div class="edu-card-image">
      <img :src="content.thumbnail" :alt="content.title" />
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
    </div>
    
    <div class="edu-card-content">
      <div class="edu-category">{{ content.category }}</div>
      <h3 class="edu-title">{{ content.title }}</h3>
      <p class="edu-description">{{ content.description }}</p>
      
      <div class="edu-meta">
        <div class="edu-author">
          <img :src="content.authorAvatar" :alt="content.author" class="author-avatar" />
          <span>{{ content.author }}</span>
        </div>
        <div class="edu-date">{{ content.date }}</div>
      </div>
      
      <div class="edu-stats">
        <div class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
          </svg>
          {{ content.views }}
        </div>
        <div class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
          {{ content.likes }}
        </div>
        <div class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
          </svg>
          {{ content.comments }}
        </div>
      </div>
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
      switch(type) {
        case 'article':
          return 'Artikel'
        case 'video':
          return 'Video'
        case 'infographic':
          return 'Infografis'
        default:
          return type
      }
    },
    goToContent() {
      // In a real app, this would navigate to the content detail page
      this.$emit('view', this.content.id)
    }
  }
}
</script>

<style scoped>
.edu-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  height: 100%;
  cursor: pointer;
}

.edu-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.edu-card-image {
  position: relative;
  height: 180px;
}

.edu-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-type {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.content-type.article {
  background-color: rgba(33, 150, 243, 0.8);
  color: white;
}

.content-type.video {
  background-color: rgba(244, 67, 54, 0.8);
  color: white;
}

.content-type.infographic {
  background-color: rgba(76, 175, 80, 0.8);
  color: white;
}

.edu-card-content {
  padding: 1.5rem;
}

.edu-category {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.edu-title {
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.7rem;
}

.edu-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3.75rem;
}

.edu-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.edu-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.edu-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.edu-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
</style>