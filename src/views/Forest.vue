<template>
  <div class="forest-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Hutan Virtualmu</h1>
        <div class="page-actions">
          <button class="btn btn-primary" @click="showPlantModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,15A1,1 0 0,0 21,14V12A1,1 0 0,0 20,11H18.83C18.42,9.83 17.55,8.96 16.38,8.55V7A1,1 0 0,0 15,6H13A1,1 0 0,0 12,7V8.55C10.82,8.97 9.95,9.83 9.55,11H8A1,1 0 0,0 7,12V14A1,1 0 0,0 8,15H9.55C9.95,16.17 10.82,17.04 12,17.45V19A1,1 0 0,0 13,20H15A1,1 0 0,0 16,19V17.45C17.17,17.05 18.05,16.17 18.45,15H20M14,13A1,1 0 0,1 13,14A1,1 0 0,1 12,13A1,1 0 0,1 13,12A1,1 0 0,1 14,13M13,4A2,2 0 0,1 15,6A2,2 0 0,1 13,8A2,2 0 0,1 11,6A2,2 0 0,1 13,4M17,14L19,17H16.25L14.88,14.88L16,13A2,2 0 0,0 14,11A2,2 0 0,0 12,13C12,13.5 12.19,13.97 12.5,14.31L11.12,17H8.38L10.38,14L9.32,12.32L10.5,11.67L9.27,9.97L10.16,9.09L12,10L13.82,9.09L14.72,9.97L13.5,11.67L14.68,12.32L13.62,14L15.64,17H16.56C17,17.03 17.32,16.83 17,14M6,19H9V20H6V19Z" />
            </svg>
            Tanam Pohon Baru
          </button>
          <select v-model="viewMode" class="view-selector">
            <option value="grid">Tampilan Grid</option>
            <option value="list">Tampilan Daftar</option>
          </select>
        </div>
      </div>
      
      <div class="forest-layout">
        <aside class="forest-sidebar">
          <ForestStats :stats="forestStats" />
        </aside>
        
        <main class="forest-main">
          <div class="forest-filters">
            <div class="filter-group">
              <label for="tree-type">Jenis Pohon:</label>
              <select id="tree-type" v-model="filters.treeType">
                <option value="">Semua</option>
                <option value="pine">Pinus</option>
                <option value="oak">Ek</option>
                <option value="maple">Maple</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="sort-by">Urutkan:</label>
              <select id="sort-by" v-model="filters.sortBy">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>
          
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat hutan...</p>
          </div>
          
          <div v-else-if="filteredTrees.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.87,11.81L10.09,14.59L8.68,13.18L8,13.86L10.09,16L13.55,12.54L12.87,11.81M15.19,17H8.81V11H5V21H19V11H15.19V17M8,3C9.1,3 10,3.9 10,5C10,5.8 9.5,6.42 8.83,6.78C8.84,6.85 8.84,6.93 8.84,7H11.11C11.12,6.93 11.12,6.85 11.13,6.78C10.46,6.42 10,5.8 10,5C10,3.9 10.9,3 12,3C13.1,3 14,3.9 14,5C14,5.8 13.5,6.42 12.83,6.78C12.84,6.85 12.84,6.93 12.84,7H15.11C15.12,6.93 15.12,6.85 15.13,6.78C14.46,6.42 14,5.8 14,5C14,3.9 14.9,3 16,3C17.1,3 18,3.9 18,5C18,5.8 17.5,6.42 16.83,6.78C16.84,6.85 16.84,6.93 16.84,7H19V9.41L17.59,11H14.5V9L15.39,7.56L13.94,6.5L12,9L10.06,6.5L8.61,7.56L9.5,9V11H6.5L4.96,9.34L6.81,7.5L4.81,5.5L6.33,4.1L8.25,6.17C8.38,6.08 8.5,6 8.63,5.92C8.06,5.63 7.66,5.08 7.58,4.42C7.25,4.07 7,3.58 7,3C7,1.9 7.9,1 9,1S11,1.9 11,3C11,3.29 10.92,3.56 10.79,3.79C11.2,3.5 11.7,3.35 12.22,3.33C12.09,3.14 12,2.88 12,2.61C11.4,2.33 11,1.72 11,1C11,0.45 11.45,0 12,0C12.55,0 13,0.45 13,1C13,1.72 12.6,2.33 12,2.61C12,2.95 12.13,3.25 12.32,3.5C12.88,3.66 13.37,3.95 13.76,4.35C13.71,5 13.34,5.53 12.81,5.82C12.94,5.9 13.06,5.97 13.17,6.07L14.93,4.17L16.67,5.76L14.25,8.27L13.65,7.42L13.47,7.5L12,9L13.5,11H16.59L20.14,7.17L22,9.17V7H19.83C19.75,6.42 19.38,5.94 18.9,5.69C18.97,5.47 19,5.24 19,5C19,3.9 18.1,3 17,3C15.9,3 15,3.9 15,5C15,5.39 15.18,5.72 15.32,6.03C14.84,6.25 14.44,6.59 14.17,7H11.83C11.42,6.3 10.76,5.79 10,5.6C9.09,4.76 7.64,4.66 6.58,5.42C6.17,5.75 5.96,6.23 6,6.5C6.04,6.77 6.13,6.94 6.5,7L5,8.5L5.5,9.04L4.5,10.5L5,11H11.17C11.42,11.3 11.71,11.55 12.03,11.78L10.09,14.59C9.68,14.18 9.35,13.68 9.14,13.12C8.18,12.55 7.57,11.5 7.5,10.35L5,12.85V17H8.05L8,17.5C7.91,18.4 8.16,19.4 6.5,19.5C4.35,19.65 4.23,17.28 4.82,16C2,16 4.33,17 2,16V21H16V17H15.5C16.5,16.5 17,15 15.5,15C14,15 13.5,16.5 13.5,17H9.5C9.2,15.8 9.95,14.55 10.5,14.5L12.2,12.2C12.54,12.27 12.73,12.4 13.25,12.22C13.25,12.22 13.4,12.5 13,12.7C12.87,12.91 12.7,13.16 13.09,13.23C13.77,12.89 14.36,12.26 14.92,11.5L15.19,11H16.5L17.3,10.38C17.37,10.97 17.03,11.47 16.69,11.97C16.46,12.97 16.82,13.27 17.32,13.27C17.82,13.27 18.67,12.97 18.67,11.97C18.67,10.97 18.27,10.97 18.13,10.38H19V11H17.5L15.92,12.84C14.83,13.04 13.59,12.32 13.5,11.64L13.58,12.05L12.78,13.03L12.2,13.24C11.76,14.13 10.71,14.33 10.19,14.95L9.5,15.95C9.5,16.44 9.22,16.5 9.5,16.5C9.78,16.5 9.83,17.11 10,17H8.81V11H5V21H19V11H15.19V17H14.44L16.37,15.5L17.62,16.5L15.69,18H13.94L13.94,18.03L13.94,18H9.5C9.5,17.5 9.8,17.5 10,17H8.81V11H5V21H19V11H15.19V17Z" />
            </svg>
            <h3>Belum Ada Pohon</h3>
            <p>Mulai tanam pohon untuk memulai hutan virtualmu!</p>
            <button class="btn btn-primary" @click="showPlantModal = true">Tanam Pohon Pertama</button>
          </div>
          
          <template v-else>
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="forest-grid">
              <Tree 
                v-for="tree in filteredTrees" 
                :key="tree.id"
                :id="tree.id"
                :type="tree.type"
                :plantedDate="tree.plantedDate"
                :challenge="tree.challenge"
                :label="tree.label"
                :description="tree.description"
              />
            </div>
            
            <!-- List View -->
            <div v-else class="forest-list">
              <div v-for="tree in filteredTrees" :key="tree.id" class="tree-list-item">
                <div class="tree-list-icon">
                  <Tree :type="tree.type" :id="tree.id" :plantedDate="tree.plantedDate" />
                </div>
                <div class="tree-list-info">
                  <div class="tree-list-header">
                    <h3 class="tree-list-title">{{ tree.label || 'Pohon #' + tree.id }}</h3>
                    <div class="tree-list-date">Ditanam pada {{ formatDate(tree.plantedDate) }}</div>
                  </div>
                  <p class="tree-list-description">{{ tree.description || 'Tidak ada deskripsi' }}</p>
                  <div class="tree-list-meta">
                    <div class="tree-list-type">{{ getTreeTypeLabel(tree.type) }}</div>
                    <div class="tree-list-challenge">{{ tree.challenge }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </main>
      </div>
    </div>
    
    <!-- Plant New Tree Modal -->
    <div v-if="showPlantModal" class="modal-overlay" @click="showPlantModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Tanam Pohon Baru</h3>
          <button class="modal-close" @click="showPlantModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="tree-name" class="form-label">Nama Pohon (opsional)</label>
            <input id="tree-name" type="text" class="form-control" v-model="newTree.label" placeholder="contoh: Pohon Kebersamaan">
          </div>
          
          <div class="form-group">
            <label for="tree-description" class="form-label">Deskripsi (opsional)</label>
            <textarea id="tree-description" class="form-control" v-model="newTree.description" rows="3" placeholder="Ceritakan kenapa kamu menanam pohon ini..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Jenis Pohon</label>
            <div class="tree-type-selector">
              <div 
                class="tree-type-option" 
                :class="{ 'selected': newTree.type === 'pine' }"
                @click="newTree.type = 'pine'"
              >
                <Tree type="pine" id="preview-pine" plantedDate="2023-06-01" />
                <div class="tree-type-label">Pinus</div>
              </div>
              
              <div 
                class="tree-type-option" 
                :class="{ 'selected': newTree.type === 'oak' }"
                @click="newTree.type = 'oak'"
              >
                <Tree type="oak" id="preview-oak" plantedDate="2023-06-01" />
                <div class="tree-type-label">Ek</div>
              </div>
              
              <div 
                class="tree-type-option" 
                :class="{ 'selected': newTree.type === 'maple' }"
                @click="newTree.type = 'maple'"
              >
                <Tree type="maple" id="preview-maple" plantedDate="2023-06-01" />
                <div class="tree-type-label">Maple</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="tree-challenge" class="form-label">Untuk Tantangan</label>
            <select id="tree-challenge" class="form-control" v-model="newTree.challenge">
              <option value="Tantangan Tanam Pohon">Tantangan Tanam Pohon</option>
              <option value="Tanam 5 Pohon">Tanam 5 Pohon</option>
              <option value="Penghijauan Kota">Penghijauan Kota</option>
              <option value="Hutan Mini">Hutan Mini</option>
              <option value="Inisiatif Pribadi">Inisiatif Pribadi</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showPlantModal = false">Batal</button>
          <button class="btn btn-primary" @click="plantTree">Tanam Pohon</button>
        </div>
      </div>
    </div>
    
    <!-- Animation for newly planted tree -->
    <div v-if="showPlantAnimation" class="plant-animation">
      <div class="animation-content">
        <div class="growing-tree">
          <Tree :type="plantedTree.type" :id="'animation-tree'" :plantedDate="plantedTree.plantedDate" />
        </div>
        <div class="animation-message">
          <h3>Pohon Baru Ditanam!</h3>
          <p>{{ plantedTree.label || 'Pohon #' + plantedTree.id }} telah ditambahkan ke hutan virtualmu.</p>
          <p class="animation-points">+50 poin</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tree from '@/components/forest/Tree.vue'
import ForestStats from '@/components/forest/ForestStats.vue'

export default {
  name: 'ForestView',
  components: {
    Tree,
    ForestStats
  },
  data() {
    return {
      loading: false,
      trees: [],
      viewMode: 'grid',
      filters: {
        treeType: '',
        sortBy: 'newest'
      },
      showPlantModal: false,
      showPlantAnimation: false,
      newTree: {
        type: 'pine',
        label: '',
        description: '',
        challenge: 'Tantangan Tanam Pohon'
      },
      plantedTree: null
    }
  },
  computed: {
    ...mapGetters({
      userStatistics: 'user/getUserStatistics'
    }),
    forestStats() {
      return {
        treeCount: this.trees.length,
        carbonOffset: this.trees.length * 21, // Approximate kg of CO2 per tree per year
        forestLevel: Math.floor(this.trees.length / 5) + 1,
        lastTreeDate: this.trees.length > 0 ? this.formatDate(this.trees[0].plantedDate) : '-',
        nextLevelProgress: ((this.trees.length % 5) / 5) * 100,
        treesToNextLevel: 5 - (this.trees.length % 5),
        achievements: [
          {
            name: 'Penemu Hutan',
            description: 'Tanam pohon pertamamu',
            achieved: this.trees.length >= 1
          },
          {
            name: 'Kebun Mini',
            description: 'Tanam 5 pohon',
            achieved: this.trees.length >= 5
          },
          {
            name: 'Tukang Kebun',
            description: 'Tanam 10 pohon',
            achieved: this.trees.length >= 10
          },
          {
            name: 'Kolektor Pohon',
            description: 'Tanam setiap jenis pohon',
            achieved: this.hasAllTreeTypes()
          },
          {
            name: 'Penghijauan',
            description: 'Tanam 25 pohon',
            achieved: this.trees.length >= 25
          }
        ]
      }
    },
    filteredTrees() {
      let filtered = [...this.trees]
      
      // Apply tree type filter
      if (this.filters.treeType) {
        filtered = filtered.filter(tree => tree.type === this.filters.treeType)
      }
      
      // Apply sorting
      if (this.filters.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.plantedDate) - new Date(a.plantedDate))
      } else {
        filtered.sort((a, b) => new Date(a.plantedDate) - new Date(b.plantedDate))
      }
      
      return filtered
    }
  },
  created() {
    this.loadTrees()
  },
  methods: {
    async loadTrees() {
      this.loading = true
      
      try {
        // Simulate API request with mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        this.trees = [
          {
            id: 1,
            type: 'pine',
            plantedDate: '2023-06-01',
            challenge: 'Tantangan Tanam Pohon',
            label: 'Pohon Harapan',
            description: 'Pohon pertama di hutan virtualku. Ditanam untuk menandai awal perjalanan hijau.'
          },
          {
            id: 2,
            type: 'oak',
            plantedDate: '2023-06-03',
            challenge: 'Tanam 5 Pohon',
            label: 'Pohon Kekuatan',
            description: 'Pohon ek yang kuat sebagai simbol ketahanan melawan perubahan iklim.'
          },
          {
            id: 3,
            type: 'maple',
            plantedDate: '2023-06-05',
            challenge: 'Tanam 5 Pohon',
            label: 'Pohon Perubahan',
            description: 'Seperti daun maple yang berubah warna, kita juga harus berubah untuk Bumi yang lebih baik.'
          },
          {
            id: 4,
            type: 'pine',
            plantedDate: '2023-06-08',
            challenge: 'Tanam 5 Pohon',
            label: '',
            description: ''
          },
          {
            id: 5,
            type: 'oak',
            plantedDate: '2023-06-10',
            challenge: 'Tanam 5 Pohon',
            label: 'Pohon Persahabatan',
            description: 'Ditanam bersama teman-teman sebagai simbol persahabatan yang abadi.'
          }
        ]
      } catch (error) {
        console.error('Error loading trees:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    },
    getTreeTypeLabel(type) {
      switch(type) {
        case 'pine':
          return 'Pohon Pinus'
        case 'oak':
          return 'Pohon Ek'
        case 'maple':
          return 'Pohon Maple'
        default:
          return 'Pohon'
      }
    },
    hasAllTreeTypes() {
      const types = this.trees.map(tree => tree.type)
      return ['pine', 'oak', 'maple'].every(type => types.includes(type))
    },
    plantTree() {
      // Create a new tree
      const now = new Date()
      const newTreeId = this.trees.length > 0 ? Math.max(...this.trees.map(t => t.id)) + 1 : 1
      
      const tree = {
        id: newTreeId,
        type: this.newTree.type,
        plantedDate: now.toISOString().split('T')[0],
        challenge: this.newTree.challenge,
        label: this.newTree.label,
        description: this.newTree.description
      }
      
      // Add to trees array
      this.trees.unshift(tree)
      
      // Update planted tree for animation
      this.plantedTree = tree
      
      // Show animation
      this.showPlantModal = false
      this.showPlantAnimation = true
      
      // Update user statistics
      this.$store.dispatch('user/updateStatistics', {
        treesPlanted: this.userStatistics.treesPlanted + 1
      })
      
      // Add points for planting a tree
      this.$store.dispatch('user/updateUserPoints', 50)
      
      // Show notification
      this.$store.dispatch('addNotification', {
        type: 'success',
        message: 'Pohon baru berhasil ditanam! +50 poin',
        timeout: 5000
      })
      
      // Reset new tree form
      this.newTree = {
        type: 'pine',
        label: '',
        description: '',
        challenge: 'Tantangan Tanam Pohon'
      }
      
      // Hide animation after delay
      setTimeout(() => {
        this.showPlantAnimation = false
      }, 3000)
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

.page-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-selector {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
}

.forest-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .forest-layout {
    grid-template-columns: 350px 1fr;
  }
}

.forest-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

/* Grid View */
.forest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background-color: rgba(76, 175, 80, 0.05);
  border-radius: var(--radius-lg);
  border: 1px dashed rgba(76, 175, 80, 0.3);
}

/* List View */
.forest-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tree-list-item {
  display: flex;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform var(--transition-fast);
}

.tree-list-item:hover {
  transform: translateY(-5px);
}

.tree-list-icon {
  padding: 1rem;
  background-color: rgba(76, 175, 80, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tree-list-info {
  flex: 1;
  padding: 1rem;
}

.tree-list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.tree-list-title {
  font-size: 1.125rem;
  margin-bottom: 0;
}

.tree-list-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.tree-list-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.tree-list-meta {
  display: flex;
  gap: 1rem;
}

.tree-list-type {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background-color: var(--bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
}

.tree-list-challenge {
  font-size: 0.75rem;
  color: var(--color-primary);
  background-color: rgba(76, 175, 80, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
}

/* Loading and Empty State */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
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
  max-width: 500px;
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

/* Tree Type Selector */
.tree-type-selector {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.tree-type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tree-type-option:hover {
  border-color: var(--color-primary-light);
}

.tree-type-option.selected {
  border-color: var(--color-primary);
  background-color: rgba(76, 175, 80, 0.05);
}

.tree-type-label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Plant Animation */
.plant-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  animation: fadeIn 0.3s ease;
}

.animation-content {
  text-align: center;
  padding: 2rem;
}

.growing-tree {
  margin-bottom: 1.5rem;
  animation: growTree 2s ease;
}

.animation-message h3 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.animation-points {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-top: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes growTree {
  from {
    transform: scale(0.2);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>