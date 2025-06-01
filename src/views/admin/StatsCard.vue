<template>
  <div class="stats-card">
    <div class="stat-icon" :style="{ background: iconBg }">
      <div v-html="icon"></div>
    </div>
    <div class="stat-content">
      <div class="stat-value">{{ formatNumber(value) }}</div>
      <div class="stat-label">{{ label }}</div>
      <div class="stat-change" :class="changeType">
        <svg v-if="changeType === 'positive'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7,14L12,9L17,14H7Z" />
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7,10L12,15L17,10H7Z" />
        </svg>
        {{ change }}% dari minggu lalu
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    change: { type: Number, default: 0 },
    icon: { type: String, required: true },
    iconBg: { type: String, default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  },
  computed: {
    changeType() {
      return this.change >= 0 ? 'positive' : 'negative'
    }
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>
