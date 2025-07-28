<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

// تسجيل الملحقات الضرورية
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

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
    type: 'bar',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
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
