<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'

// تسجيل الملحقات الضرورية
Chart.register(PieController, ArcElement, Tooltip, Legend)

// تعريف الخصائص (Props)
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const canvas = ref(null)
let myChart = null

const renderChart = () => {
  if (myChart) {
    myChart.destroy()
  }
  myChart = new Chart(canvas.value, {
    type: 'pie',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

onMounted(() => {
  renderChart()
})

watch(
  () => props.chartData,
  () => {
    renderChart()
  }
)
</script>

<style scoped>
canvas {
  max-height: 300px;
}
</style>
