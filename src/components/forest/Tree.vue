<template>
  <div class="tree" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
    <svg class="tree-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <!-- Tree trunk -->
      <rect x="45" y="80" width="10" height="35" fill="#8B4513" />
      
      <!-- Tree foliage based on tree type -->
      <g v-if="type === 'pine'">
        <polygon points="50,10 30,50 40,50 20,80 80,80 60,50 70,50" fill="#2E8B57" />
      </g>
      <g v-else-if="type === 'oak'">
        <circle cx="50" cy="50" r="35" fill="#228B22" />
      </g>
      <g v-else-if="type === 'maple'">
        <path d="M50,15 C25,25 25,60 50,80 C75,60 75,25 50,15" fill="#2E8B57" />
      </g>
      <g v-else>
        <!-- Default tree -->
        <polygon points="50,10 25,60 75,60" fill="#228B22" />
      </g>
    </svg>
    
    <div v-if="showTooltip" class="tree-tooltip">
      <div class="tooltip-header">
        <span class="tree-label">{{ label || 'Pohon #' + id }}</span>
        <span class="tree-date">{{ formattedDate }}</span>
      </div>
      <div class="tooltip-body">
        <p v-if="description">{{ description }}</p>
        <p v-else>Ditanam pada {{ formattedDate }}</p>
        <div class="tree-challenge">
          Tantangan: {{ challenge }}
        </div>
      </div>
      <div class="tooltip-footer">
        <span class="tree-type">{{ typeLabel }}</span>
        <span class="tree-age">Usia: {{ age }} hari</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {
      type: String,
      default: 'pine', // pine, oak, maple
    },
    plantedDate: {
      type: String,
      required: true
    },
    challenge: {
      type: String,
      default: 'Tantangan Tanam Pohon'
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showTooltip: false
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.plantedDate)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    },
    age() {
      const plantedDate = new Date(this.plantedDate)
      const today = new Date()
      const diffTime = Math.abs(today - plantedDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    },
    typeLabel() {
      switch(this.type) {
        case 'pine':
          return 'Pohon Pinus'
        case 'oak':
          return 'Pohon Ek'
        case 'maple':
          return 'Pohon Maple'
        default:
          return 'Pohon'
      }
    }
  }
}
</script>

<style scoped>
.tree {
  position: relative;
  cursor: pointer;
  transition: transform var(--transition-normal);
}

.tree:hover {
  transform: scale(1.1);
}

.tree-svg {
  width: 60px;
  height: 90px;
}

.tree-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  z-index: 10;
  text-align: left;
  margin-bottom: 0.5rem;
  animation: fadeIn 0.2s ease-in-out;
}

.tree-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -8px;
  border-width: 8px;
  border-style: solid;
  border-color: var(--bg-primary) transparent transparent transparent;
}

.tooltip-header {
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.tree-label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.tree-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.tooltip-body {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.tooltip-body p {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.tree-challenge {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md);
  display: inline-block;
}

.tooltip-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>