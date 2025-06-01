<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal" :class="[size, { 'full-screen': fullScreen }]" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button @click="$emit('close')" class="modal-close">×</button>
        </div>
        <div class="modal-body" :class="{ 'scrollable': scrollable }">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: '' },
    size: { type: String, default: 'medium' }, // small, medium, large
    fullScreen: { type: Boolean, default: false },
    scrollable: { type: Boolean, default: true },
    closeOnOverlay: { type: Boolean, default: true }
  },
  emits: ['close'],
  methods: {
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.$emit('close')
      }
    }
  },
  mounted() {
    if (this.show) {
      document.body.style.overflow = 'hidden'
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
  watch: {
    show(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : ''
    }
  }
}
</script>
