<template>
  <div class="challenge-filter">
    <div class="filter-header">
      <h3 class="filter-title">Filter Tantangan</h3>
      <button class="filter-reset" @click="resetFilters">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 0 1-9 9"></path>
          <path d="M3 12a9 9 0 0 1 9-9"></path>
          <path d="M21 12H3"></path>
          <path d="M12 3v9"></path>
        </svg>
        Reset
      </button>
    </div>
    
    <div class="filter-section">
      <div class="filter-section-title">Kategori</div>
      <div class="filter-options">
        <label v-for="category in categories" :key="category.value" class="filter-checkbox">
          <input 
            type="checkbox" 
            :value="category.value" 
            v-model="selectedCategories"
            @change="applyFilters"
            class="checkbox-input"
          />
          <span class="checkbox-custom"></span>
          <span class="option-label">{{ category.label }}</span>
          <span class="option-count">{{ category.count }}</span>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <div class="filter-section-title">Tingkat Kesulitan</div>
      <div class="difficulty-options">
        <label v-for="difficulty in difficulties" :key="difficulty.value" 
               class="difficulty-option" 
               :class="{ 'active': selectedDifficulties.includes(difficulty.value) }">
          <input 
            type="checkbox" 
            :value="difficulty.value" 
            v-model="selectedDifficulties"
            @change="applyFilters"
            class="sr-only"
          />
          <div class="difficulty-content">
            <span class="difficulty-indicator" :class="'difficulty-' + difficulty.value"></span>
            <span>{{ difficulty.label }}</span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <div class="filter-section-title">Poin</div>
      <div class="range-slider">
        <div class="slider-track">
          <input 
            type="range" 
            class="point-slider" 
            min="0" 
            max="500" 
            step="25" 
            v-model.number="minPoints"
            @input="applyFilters"
          />
          <div class="slider-progress" :style="{ width: (minPoints / 500 * 100) + '%' }"></div>
        </div>
        <div class="range-values">
          <span class="current-value">{{ minPoints }} poin</span>
          <span>500 poin</span>
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <div class="filter-section-title">Status</div>
      <div class="status-options">
        <label class="status-tag" :class="{ 'active': selectedStatuses.includes('active') }">
          <input 
            type="checkbox" 
            value="active" 
            v-model="selectedStatuses"
            @change="applyFilters"
            class="sr-only"
          />
          <span>Aktif</span>
        </label>
        <label class="status-tag" :class="{ 'active': selectedStatuses.includes('upcoming') }">
          <input 
            type="checkbox" 
            value="upcoming" 
            v-model="selectedStatuses"
            @change="applyFilters"
            class="sr-only"
          />
          <span>Mendatang</span>
        </label>
        <label class="status-tag" :class="{ 'active': selectedStatuses.includes('completed') }">
          <input 
            type="checkbox" 
            value="completed" 
            v-model="selectedStatuses"
            @change="applyFilters"
            class="sr-only"
          />
          <span>Selesai</span>
        </label>
      </div>
    </div>
    
    <button class="btn-apply" @click="applyFilters">
      Terapkan Filter
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChallengeFilter',
  data() {
    return {
      selectedCategories: [],
      selectedDifficulties: [],
      selectedStatuses: ['active'],
      minPoints: 0,
      categories: [
        { value: 'recycle', label: 'Daur Ulang', count: 12 },
        { value: 'plantation', label: 'Penanaman', count: 8 },
        { value: 'conservation', label: 'Konservasi', count: 6 },
        { value: 'water', label: 'Penghematan Air', count: 5 },
        { value: 'energy', label: 'Energi Hijau', count: 7 },
        { value: 'education', label: 'Edukasi', count: 4 }
      ],
      difficulties: [
        { value: 'easy', label: 'Mudah' },
        { value: 'medium', label: 'Sedang' },
        { value: 'hard', label: 'Sulit' }
      ]
    }
  },
  methods: {
    applyFilters() {
      const filters = {
        categories: this.selectedCategories,
        difficulties: this.selectedDifficulties,
        statuses: this.selectedStatuses,
        minPoints: this.minPoints
      }
      
      this.$emit('filter-changed', filters)
    },
    resetFilters() {
      this.selectedCategories = []
      this.selectedDifficulties = []
      this.selectedStatuses = ['active']
      this.minPoints = 0
      
      this.applyFilters()
    }
  }
}
</script>

<style scoped>
.challenge-filter {
  background-color: var(--bg-secondary, #ffffff);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #1F2937);
  margin: 0;
}

.filter-reset {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--color-primary, #34D399);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.filter-reset:hover {
  background-color: rgba(52, 211, 153, 0.1);
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--text-secondary, #4B5563);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

/* Custom Checkbox Styling */
.filter-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding: 0.25rem 0;
  font-size: 0.875rem;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 0.625rem;
  background-color: var(--bg-primary, #f9fafb);
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 4px;
  transition: all 0.2s;
}

.checkbox-input:checked ~ .checkbox-custom {
  background-color: var(--color-primary, #34D399);
  border-color: var(--color-primary, #34D399);
}

.checkbox-custom:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:checked ~ .checkbox-custom:after {
  display: block;
}

.option-label {
  flex: 1;
  color: var(--text-primary, #1F2937);
}

.option-count {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9CA3AF);
  background-color: var(--bg-tertiary, #F3F4F6);
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
}

/* Difficulty styling */
.difficulty-options {
  display: flex;
  gap: 0.625rem;
}

.difficulty-option {
  flex: 1;
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.difficulty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, #d1d5db);
  transition: all 0.2s;
  font-size: 0.875rem;
}

.difficulty-option:hover .difficulty-content {
  border-color: var(--color-primary, #34D399);
}

.difficulty-option.active .difficulty-content {
  background-color: rgba(52, 211, 153, 0.1);
  border-color: var(--color-primary, #34D399);
}

.difficulty-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.difficulty-easy {
  background-color: #10B981;
}

.difficulty-medium {
  background-color: #F59E0B;
}

.difficulty-hard {
  background-color: #EF4444;
}

/* Range Slider */
.range-slider {
  padding: 0.5rem 0;
}

.slider-track {
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
}

.point-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #E5E7EB;
  outline: none;
  margin: 0;
  position: relative;
  z-index: 2;
}

.slider-progress {
  position: absolute;
  height: 6px;
  background-color: var(--color-primary, #34D399);
  border-radius: 3px;
  top: 0.5rem;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.point-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary, #34D399);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3;
}

.point-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary, #34D399);
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 0.625rem;
  font-size: 0.75rem;
  color: var(--text-tertiary, #9CA3AF);
}

.current-value {
  font-weight: 600;
  color: var(--text-secondary, #6B7280);
}

/* Status tags */
.status-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.status-tag {
  cursor: pointer;
  padding: 0.5rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
   background-color: var(--bg-secondary, #ffffff);
  border: 1px solid transparent;
  transition: all 0.2s;
}

.status-tag:hover {
  background-color: #E5E7EB;
}

.status-tag.active {
  background-color: rgba(52, 211, 153, 0.1);
  color: var(--color-primary, #34D399);
  border-color: var(--color-primary, #34D399);
}

/* Apply button */
.btn-apply {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background-color: var(--color-primary, #34D399);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-apply:hover {
  background-color: #10B981;
}

@media (max-width: 768px) {
  .challenge-filter {
    background-color: var(--bg-primary, #ffffff);
    border-radius: 1rem 1rem 0 0;
    padding: 1.25rem;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .filter-header {
    position: sticky;
    top: 0;
    background-color: var(--bg-primary, #ffffff);
    z-index: 1;
    padding-top: 0.5rem;
  }
  
  .btn-apply {
    position: sticky;
    bottom: 0;
    background-color: var(--color-primary, #34D399);
    margin: 0 -1.25rem -1.25rem -1.25rem;
    width: calc(100% + 2.5rem);
    border-radius: 0;
    padding: 1rem;
    z-index: 1;
  }
}
</style>