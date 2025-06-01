

<!-- AdminAnalyticsChart.vue - Chart component for analytics -->
<template>
  <div class="analytics-chart">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedPeriod" @change="$emit('period-changed', selectedPeriod)">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAnalyticsChart',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'line'
    }
  },
  data() {
    return {
      selectedPeriod: '30d',
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      // Chart.js implementation would go here
      // For now, showing a placeholder
      const ctx = this.$refs.chartCanvas.getContext('2d')
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = '#64748b'
      ctx.font = '16px Inter'
      ctx.textAlign = 'center'
      ctx.fillText ('Chart placeholder - integrate Chart.js', ctx.canvas.width / 2, ctx.canvas.height / 2)
    },
    updateChart() {
      // Update chart with new data
      this.initChart()
    }
  }
}
</script>
