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
              @input="filterContent"
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
          @click="activeTab = tab.value"
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
          <label for="sort-by">Urutkan:</label>
          <select id="sort-by" v-model="filters.sortBy" @change="filterContent">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="popular">Paling Populer</option>
          </select>
        </div>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Memuat materi edukasi...</p>
      </div>
      
      <div v-else-if="filteredContent.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3C7.79,3 3.7,4.41 0.38,7C4.41,12.06 7.89,16.37 12,21.5C16.08,16.42 20.24,11.24 23.65,7C20.32,4.41 16.22,3 12,3M12,5C15.07,5 18.09,5.86 20.71,7.45L20.27,7.93C18.28,10.27 15.39,13.54 12,17.3C8.6,13.53 5.71,10.25 3.72,7.93L3.29,7.45C5.91,5.86 8.93,5 12,5Z" />
        </svg>
        <h3>Tidak ada materi edukasi</h3>
        <p>Coba ubah filter atau cari dengan kata kunci berbeda</p>
        <button class="btn btn-primary" @click="resetFilters">Reset Filter</button>
      </div>
      
      <div v-else class="ecoedu-grid">
        <EduCard 
          v-for="item in filteredContent" 
          :key="item.id"
          :content="item"
          @view="viewContent"
        />
      </div>
      
      <div class="load-more" v-if="hasMoreContent && !loading">
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
          </div>
          
          <div v-if="selectedContent.type === 'video'" class="content-video">
            <div class="video-placeholder">
              <img :src="selectedContent.thumbnail" :alt="selectedContent.title" />
              <div class="play-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div v-else-if="selectedContent.type === 'infographic'" class="content-infographic">
            <img :src="selectedContent.thumbnail" :alt="selectedContent.title" class="infographic-image" />
          </div>
          
          <div class="content-details">
            <p class="content-description">{{ selectedContent.fullDescription || selectedContent.description }}</p>
            
            <div class="content-meta">
              <div class="content-author">
                <img :src="selectedContent.authorAvatar" :alt="selectedContent.author" class="author-avatar" />
                <div class="author-info">
                  <div class="author-name">{{ selectedContent.author }}</div>
                  <div class="author-role">{{ selectedContent.authorRole }}</div>
                </div>
              </div>
              <div class="content-date">
                Diterbitkan pada {{ selectedContent.date }}
              </div>
            </div>
            
            <div class="content-actions">
              <button class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
                </svg>
                Berguna
              </button>
              <button class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
                </svg>
                Bagikan
              </button>
              <button class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
                Simpan
              </button>
            </div>
          </div>
          
          <div class="related-content" v-if="relatedContent.length > 0">
            <h4>Materi Terkait</h4>
            <div class="related-items">
              <div 
                v-for="item in relatedContent" 
                :key="item.id"
                class="related-item"
                @click="viewContent(item.id)"
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

export default {
  name: 'EcoEduView',
  components: {
    EduCard
  },
  data() {
    return {
      content: [],
      loading: false,
      searchQuery: '',
      activeTab: 'all',
      filters: {
        category: '',
        sortBy: 'newest'
      },
      hasMoreContent: true,
      page: 1,
      selectedContent: null,
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
      ],
      relatedContent: []
    }
  },
  computed: {
    filteredContent() {
      let filtered = [...this.content]
      
      // Apply tab filter
      if (this.activeTab !== 'all') {
        filtered = filtered.filter(item => item.type === this.activeTab)
      }
      
      // Apply category filter
      if (this.filters.category) {
        filtered = filtered.filter(item => item.category === this.filters.category)
      }
      
      // Apply search filter
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        )
      }
      
      // Apply sorting
      switch (this.filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
          break
        case 'oldest':
          filtered.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate))
          break
        case 'popular':
          filtered.sort((a, b) => b.views - a.views)
          break
      }
      
      return filtered
    }
  },
  created() {
    this.loadContent()
  },
  methods: {
    async loadContent() {
      this.loading = true
      
      try {
        // Simulate API request with mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const newContent = [
          {
            id: 1,
            title: 'Mengapa Kita Harus Peduli Tentang Perubahan Iklim?',
            description: 'Artikel ini menjelaskan dampak perubahan iklim pada ekosistem dan kehidupan manusia secara global dan di Indonesia.',
            fullDescription: 'Perubahan iklim adalah perubahan jangka panjang dalam pola cuaca yang menjadi ciri khas dari lokasi tertentu. Hal ini disebabkan oleh peningkatan gas rumah kaca di atmosfer yang sebagian besar dihasilkan dari aktivitas manusia. Artikel ini menjelaskan dampak perubahan iklim pada ekosistem dan kehidupan manusia secara global dan di Indonesia.\n\nDampak perubahan iklim sudah mulai dirasakan di seluruh dunia, termasuk di Indonesia. Sebagai negara kepulauan, Indonesia sangat rentan terhadap kenaikan permukaan laut. Selain itu, perubahan pola cuaca dapat menyebabkan kekeringan, kebakaran hutan, dan banjir yang lebih parah.\n\nPenting bagi kita semua untuk memahami dan peduli tentang perubahan iklim karena akan mempengaruhi generasi saat ini dan masa depan. Dengan bertindak sekarang, kita dapat mengurangi dampak negatif dan menciptakan masa depan yang lebih berkelanjutan.',
            type: 'article',
            category: 'Perubahan Iklim',
            thumbnail: '/src/assets/images/6.jpg',
            author: 'Dr. Budi Setiawan',
            authorRole: 'Peneliti Perubahan Iklim',
            authorAvatar: '/src/assets/images/avatars/author1.jpg',
            date: '15 Mei 2023',
            publishedDate: '2023-05-15',
            views: 1250,
            likes: 345,
            comments: 42
          },
          {
            id: 2,
            title: 'Teknik Daur Ulang Sampah Plastik di Rumah',
            description: 'Video tutorial cara mendaur ulang berbagai jenis sampah plastik menjadi barang berguna dengan alat sederhana.',
            fullDescription: 'Plastik adalah salah satu material yang paling banyak digunakan di dunia. Namun, plastik juga salah satu penyebab utama pencemaran lingkungan karena sulit terurai secara alami. Daur ulang adalah salah satu cara terbaik untuk mengatasi masalah sampah plastik.\n\nDalam video tutorial ini, Anda akan belajar cara mendaur ulang berbagai jenis sampah plastik menjadi barang-barang berguna dengan alat sederhana yang ada di rumah. Mulai dari botol plastik, kemasan makanan, hingga kantong plastik, semuanya dapat diubah menjadi pot tanaman, tempat pensil, tas, dan bahkan perhiasan unik.\n\nDengan mendaur ulang di rumah, Anda tidak hanya mengurangi sampah yang berakhir di tempat pembuangan, tetapi juga menghemat uang dan mengembangkan kreativitas. Mari mulai hidup lebih berkelanjutan dengan cara yang menyenangkan!',
            type: 'video',
            category: 'Pengelolaan Sampah',
            thumbnail: '/src/assets/images/5.jpg',
            author: 'Siti Nurhaliza',
            authorRole: 'Aktivis Lingkungan',
            authorAvatar: '/src/assets/images/avatars/author2.jpg',
            date: '2 Juni 2023',
            publishedDate: '2023-06-02',
            views: 2840,
            likes: 567,
            comments: 89
          },
          {
            id: 3,
            title: 'Pentingnya Konservasi Air di Era Perubahan Iklim',
            description: 'Infografis tentang pentingnya konservasi air dan berbagai metode sederhana untuk menghemat air dalam kehidupan sehari-hari.',
            fullDescription: 'Air adalah sumber daya yang terbatas dan berharga. Meskipun 71% permukaan Bumi tertutup air, hanya 2.5% yang merupakan air tawar, dan hanya sebagian kecil dari itu yang dapat diakses untuk kebutuhan manusia. Dengan perubahan iklim dan populasi yang terus bertambah, konservasi air menjadi semakin penting.\n\nInfografis ini menjelaskan pentingnya konservasi air di era perubahan iklim dan memberikan berbagai metode sederhana untuk menghemat air dalam kehidupan sehari-hari. Dari perbaikan kebocoran, penggunaan air bekas untuk menyiram tanaman, hingga instalasi pemanen air hujan, setiap tindakan kecil dapat membuat perbedaan besar.\n\nMari kita jadikan konservasi air sebagai bagian dari gaya hidup kita untuk memastikan keberlanjutan sumber daya berharga ini bagi generasi mendatang.',
            type: 'infographic',
            category: 'Konservasi Air',
            thumbnail: '/src/assets/images/4.jpg',
            author: 'Hasan Hidayat',
            authorRole: 'Konsultan Lingkungan',
            authorAvatar: '/src/assets/images/avatars/author3.jpg',
            date: '20 Juni 2023',
            publishedDate: '2023-06-20',
            views: 1680,
            likes: 420,
            comments: 35
          },
          {
            id: 4,
            title: 'Energi Terbarukan: Solusi untuk Masa Depan',
            description: 'Artikel mendalam tentang berbagai jenis energi terbarukan dan potensinya untuk mengurangi ketergantungan pada bahan bakar fosil.',
            fullDescription: 'Energi terbarukan adalah energi yang berasal dari sumber daya alam yang dapat diperbarui, seperti sinar matahari, angin, air, panas bumi, dan biomassa. Berbeda dengan bahan bakar fosil yang jumlahnya terbatas dan menghasilkan emisi karbon yang tinggi, energi terbarukan menawarkan solusi yang lebih berkelanjutan dan ramah lingkungan.\n\nDalam artikel ini, kita akan menjelajahi berbagai jenis energi terbarukan dan potensinya untuk mengurangi ketergantungan kita pada bahan bakar fosil. Indonesia, dengan lokasi geografisnya yang strategis di garis khatulistiwa, memiliki potensi besar untuk mengembangkan energi surya. Selain itu, sebagai negara kepulauan, Indonesia juga memiliki potensi untuk mengembangkan energi angin, arus laut, dan panas bumi.\n\nTransisi menuju energi terbarukan bukan hanya tentang mengurangi emisi karbon, tetapi juga tentang menciptakan ekonomi yang lebih berkelanjutan dan ketahanan energi yang lebih baik. Mari bergabung dalam perjalanan menuju masa depan yang lebih hijau dan berkelanjutan.',
            type: 'article',
            category: 'Energi Terbarukan',
            thumbnail: '/src/assets/images/3.jpg',
            author: 'Ir. Ahmad Fauzi',
            authorRole: 'Pakar Energi Terbarukan',
            authorAvatar: '/src/assets/images/avatars/author4.jpg',
            date: '5 Juli 2023',
            publishedDate: '2023-07-05',
            views: 980,
            likes: 210,
            comments: 28
          },
          {
            id: 5,
            title: 'Cara Membuat Komposter Sederhana di Rumah',
            description: 'Video tutorial lengkap untuk membuat komposter dari bahan bekas dan cara mengelolanya untuk menghasilkan pupuk organik berkualitas.',
            fullDescription: 'Link video: https://www.youtube.com/watch?v=j0TFvT0mRlE \n\Kompos adalah pupuk organik yang dihasilkan dari proses penguraian bahan-bahan organik seperti sisa makanan, daun kering, dan limbah taman oleh mikroorganisme. Selain mengurangi jumlah sampah yang berakhir di tempat pembuangan, kompos juga dapat memperbaiki struktur tanah, meningkatkan retensi air, dan menyediakan nutrisi bagi tanaman.\n\nDalam video tutorial ini, Anda akan belajar cara membuat komposter sederhana dari bahan bekas yang mudah ditemukan di sekitar rumah. Mulai dari pemilihan wadah, penyiapan bahan kompos, hingga pemantauan dan pemeliharaan komposter, semua langkah akan dijelaskan secara detail dan mudah diikuti.\n\nDengan membuat dan mengelola komposter sendiri, Anda dapat mengurangi jejak karbon, menghemat uang untuk membeli pupuk, dan berkontribusi pada siklus nutrisi yang berkelanjutan. Mari mulai mengompos hari ini untuk Bumi yang lebih sehat besok!',
            type: 'video',
            category: 'Pertanian Berkelanjutan',
            thumbnail: '/src/assets/images/2.jpg',
            author: 'Dewi Lestari',
            authorRole: 'Urban Farmer',
            authorAvatar: '/src/assets/images/avatars/author5.jpg',
            date: '18 Juli 2023',
            publishedDate: '2023-07-18',
            views: 1520,
            likes: 380,
            comments: 45
          },
          {
            id: 6,
            title: 'Keragaman Hayati Indonesia: Harta Karun yang Perlu Dilindungi',
            description: 'Infografis komprehensif tentang kekayaan biodiversitas Indonesia, ancaman yang dihadapi, dan upaya konservasinya.',
            fullDescription: 'Indonesia dikenal sebagai salah satu negara megabiodiversitas di dunia, yang berarti memiliki keanekaragaman hayati yang sangat tinggi. Dengan hanya sekitar 1,3% dari luas daratan dunia, Indonesia memiliki sekitar 17% dari total spesies yang ada di planet ini. Keragaman hayati ini mencakup beragam ekosistem, dari hutan hujan tropis hingga terumbu karang.\n\nInfografis ini menyajikan informasi komprehensif tentang kekayaan biodiversitas Indonesia, mulai dari jumlah spesies flora dan fauna, spesies endemik, hingga ekosistem unik yang dimiliki. Selain itu, infografis ini juga menggambarkan berbagai ancaman yang dihadapi oleh biodiversitas Indonesia, seperti deforestasi, perburuan liar, polusi, dan perubahan iklim.\n\nYang tak kalah penting, infografis ini juga menyoroti berbagai upaya konservasi yang dilakukan di Indonesia, baik oleh pemerintah, LSM, maupun masyarakat. Dengan memahami nilai dan tantangan biodiversitas Indonesia, kita dapat lebih termotivasi untuk melindungi harta karun alam ini.',
            type: 'infographic',
            category: 'Biodiversitas',
            thumbnail: '/src/assets/images/1.jpg',
            author: 'Dr. Ratna Sari',
            authorRole: 'Ahli Biologi Konservasi',
            authorAvatar: '/src/assets/images/avatars/author6.jpg',
            date: '30 Juli 2023',
            publishedDate: '2023-07-30',
            views: 890,
            likes: 195,
            comments: 22
          }
        ]
        
        // If it's a new page, append the content, otherwise replace it
        if (this.page === 1) {
          this.content = newContent
        } else {
          this.content = [...this.content, ...newContent]
        }
        
        // Check if we've reached the end of available content
        if (this.page >= 3) { // Simulate only having 3 pages
          this.hasMoreContent = false
        }
        
        this.page++
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        this.loading = false
      }
    },
    loadMoreContent() {
      this.loadContent()
    },
    filterContent() {
      // Reset pagination when filters change
      this.page = 1
      this.hasMoreContent = true
      this.loadContent()
    },
    resetFilters() {
      this.searchQuery = ''
      this.activeTab = 'all'
      this.filters = {
        category: '',
        sortBy: 'newest'
      }
      this.filterContent()
    },
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
    viewContent(contentId) {
      const content = this.content.find(item => item.id === contentId)
      if (content) {
        this.selectedContent = content
        
        // Find related content (same category or type)
        this.relatedContent = this.content
          .filter(item => 
            item.id !== contentId && 
            (item.category === content.category || item.type === content.type)
          )
          .slice(0, 3) // Limit to 3 related items
      }
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
  background: none;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
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

