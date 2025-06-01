
<!-- AdminBulkActions.vue - Bulk actions component -->
<template>
  <div class="bulk-actions" v-if="selectedItems.length > 0">
    <div class="bulk-actions-bar">
      <div class="selected-count">
        {{ selectedItems.length }} item(s) selected
      </div>
      <div class="bulk-buttons">
        <button 
          @click="$emit('bulk-action', 'delete')" 
          class="btn btn-danger btn-sm"
          :disabled="loading"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete Selected
        </button>
        <button 
          v-if="type === 'challenges'"
          @click="$emit('bulk-action', 'activate')" 
          class="btn btn-primary btn-sm"
          :disabled="loading"
        >
          Activate
        </button>
        <button 
          v-if="type === 'challenges'"
          @click="$emit('bulk-action', 'deactivate')" 
          class="btn btn-secondary btn-sm"
          :disabled="loading"
        >
          Deactivate
        </button>
        <button 
          @click="$emit('clear-selection')" 
          class="btn btn-outline btn-sm"
        >
          Clear Selection
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminBulkActions',
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'general'
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>