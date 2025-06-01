<template>
  <div class="data-table-container">
    <div class="table-controls" v-if="showControls">
      <div class="bulk-actions" v-if="selectedItems.length > 0">
        <span class="selected-count">{{ selectedItems.length }} dipilih</span>
        <button v-for="action in bulkActions" :key="action.key" 
                @click="$emit('bulk-action', action.key, selectedItems)"
                :class="['btn-bulk', action.type]">
          {{ action.label }}
        </button>
      </div>
      <div class="table-search" v-if="searchable">
        <input type="text" 
               :placeholder="`Cari ${entityName}...`"
               :value="searchQuery"
               @input="$emit('search', $event.target.value)" />
      </div>
    </div>

    <div class="data-table">
      <div class="table-header">
        <div class="table-row">
          <div class="table-cell" v-if="selectable">
            <input type="checkbox" 
                   :checked="allSelected" 
                   @change="toggleAll"
                   :indeterminate="someSelected" />
          </div>
          <div v-for="column in columns" :key="column.key" 
               class="table-cell" 
               :style="{ width: column.width }"
               @click="column.sortable ? $emit('sort', column.key) : null">
            {{ column.label }}
            <svg v-if="column.sortable && sortColumn === column.key" 
                 width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="sortDirection === 'asc'" d="M7,14L12,9L17,14H7Z" />
              <path v-else d="M7,10L12,15L17,10H7Z" />
            </svg>
          </div>
          <div class="table-cell" v-if="hasActions">Actions</div>
        </div>
      </div>
      <div class="table-body">
        <div v-for="item in items" :key="item._id || item.id" class="table-row">
          <div class="table-cell" v-if="selectable">
            <input type="checkbox" 
                   :value="item._id || item.id"
                   v-model="selectedItems" />
          </div>
          <div v-for="column in columns" :key="column.key" class="table-cell">
            <slot :name="column.key" :item="item" :value="getNestedValue(item, column.key)">
              {{ formatValue(getNestedValue(item, column.key), column.type) }}
            </slot>
          </div>
          <div class="table-cell" v-if="hasActions">
            <div class="action-buttons">
              <button v-for="action in actions" :key="action.key"
                      @click="$emit('action', action.key, item)"
                      :class="['btn-action', action.type]">
                {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-pagination" v-if="pagination">
      <div class="pagination-info">
        Menampilkan {{ startItem }}-{{ endItem }} dari {{ pagination.total }} {{ entityName }}
      </div>
      <div class="pagination-controls">
        <button @click="$emit('page-change', pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="btn-page">
          Previous
        </button>
        <span class="page-info">{{ pagination.page }} / {{ pagination.pages }}</span>
        <button @click="$emit('page-change', pagination.page + 1)"
                :disabled="pagination.page >= pagination.pages"
                class="btn-page">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    items: { type: Array, default: () => [] },
    columns: { type: Array, required: true },
    actions: { type: Array, default: () => [] },
    bulkActions: { type: Array, default: () => [] },
    pagination: { type: Object, default: null },
    selectable: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    searchQuery: { type: String, default: '' },
    sortColumn: { type: String, default: '' },
    sortDirection: { type: String, default: 'desc' },
    entityName: { type: String, default: 'items' },
    showControls: { type: Boolean, default: true }
  },
  data() {
    return {
      selectedItems: []
    }
  },
  computed: {
    hasActions() {
      return this.actions.length > 0
    },
    allSelected() {
      return this.items.length > 0 && this.selectedItems.length === this.items.length
    },
    someSelected() {
      return this.selectedItems.length > 0 && this.selectedItems.length < this.items.length
    },
    startItem() {
      if (!this.pagination) return 1
      return (this.pagination.page - 1) * this.pagination.limit + 1
    },
    endItem() {
      if (!this.pagination) return this.items.length
      return Math.min(this.pagination.page * this.pagination.limit, this.pagination.total)
    }
  },
  methods: {
    toggleAll() {
      if (this.allSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = this.items.map(item => item._id || item.id)
      }
    },
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj)
    },
    formatValue(value, type) {
      if (value == null) return '-'
      
      switch (type) {
        case 'date':
          return new Date(value).toLocaleDateString('id-ID')
        case 'datetime':
          return new Date(value).toLocaleString('id-ID')
        case 'number':
          return new Intl.NumberFormat().format(value)
        case 'boolean':
          return value ? 'Yes' : 'No'
        default:
          return value
      }
    }
  },
  watch: {
    items() {
      this.selectedItems = []
    }
  }
}
</script>
