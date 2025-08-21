<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8 mt-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Building2 class="h-8 w-8 text-blue-600" />
            لوحة التحكم العقارية
          </h1>
          <p>إدارة وتتبع العقارات بسهولة وفعالية</p>
        </div>
        <div class="flex gap-2"></div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg"
      >
        <div class="pa-3">
          <div class="flex items-center justify-between p-2">
            <div>
              <p class="text-blue-100 text-sm font-medium">إجمالي العقارات</p>
              <p class="text-3xl font-bold">{{ animatedStats.total }}</p>
            </div>
            <Building2
              class="h-12 w-12 text-blue-200 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <div
        class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg"
      >
        <div class="pa-3">
          <div class="flex items-center justify-between p-2">
            <div>
              <p class="text-green-100 text-sm font-medium">العقارات المتاحة</p>
              <p class="text-3xl font-bold">{{ animatedStats.available }}</p>
            </div>
            <Home
              class="h-12 w-12 text-green-200 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <div
        class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg"
      >
        <div class="pa-3">
          <div class="flex items-center justify-between p-2">
            <div>
              <p class="text-red-100 text-sm font-medium">العقارات المباعة</p>
              <p class="text-3xl font-bold">{{ animatedStats.sold }}</p>
            </div>
            <TrendingUp
              class="h-12 w-12 text-red-200 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <div
        class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg"
      >
        <div class="pa-3">
          <div class="flex items-center justify-between p-2">
            <div>
              <p class="text-yellow-100 text-sm font-medium">محجوز</p>
              <p class="text-3xl font-bold">{{ animatedStats.reserved }}</p>
            </div>
            <Eye
              class="h-12 w-12 text-yellow-200 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <v-card class="pa-4">
        <div class="transition-shadow duration-300">
          <h3 class="flex items-center gap-2 mb-4 text-lg font-semibold">
            <PieChartIcon class="h-5 w-5 text-blue-600" />
            توزيع العقارات حسب الحالة
          </h3>
          <div class="h-80">
            <PieChart :chart-data="statusChartData" />
          </div>
        </div>
      </v-card>

      <v-card class="pa-4">
        <div class="transition-shadow duration-300">
          <h3 class="flex items-center gap-2 mb-4 text-lg font-semibold">
            <BarChart3 class="h-5 w-5 text-blue-600" />
            العقارات حسب المحافظة
          </h3>
          <div class="h-80">
            <BarChart :chart-data="provinceChartData" />
          </div>
        </div>
      </v-card>
    </div>

    <!-- Price Range Chart -->
    <v-card class="pa-4 mb-8">
      <div class="transition-shadow duration-300">
        <h3 class="flex items-center gap-2 mb-4 text-lg font-semibold">
          <DollarSign class="h-5 w-5 text-blue-600" />
          توزيع العقارات حسب الأسعار
        </h3>
        <div class="h-80">
          <BarChart :chart-data="priceRangeChartData" />
        </div>
      </div>
    </v-card>

    <!-- Properties Table -->
    <!-- <v-card class="pa-4 mb-8">
      <v-data-table
        :items="properties"
        :items-per-page="10"
        :headers="headers"
        item-value="id"
        class="w-full"
      >
        <template #top>
          <v-container>
            <v-toolbar class="px-3" rounded="lg">
              <h3 class="flex items-center gap-2 text-lg font-semibold">
                <Building2 class="h-5 w-5 text-blue-600" />
                قائمة العقارات المضافة حديثا
              </h3>
            </v-toolbar>
          </v-container>
        </template>
      </v-data-table>
    </v-card> -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import {
  Building2,
  Home,
  TrendingUp,
  Eye,
  DollarSign,
  BarChart3,
  PieChartIcon as PieChartIcon
} from 'lucide-vue-next'
import PieChart from '../components/PieChart.vue'
import BarChart from '../components/BarChart.vue'
import { propertyService } from '../services/api'

const properties = ref([])

const propertyStatus = [
  { value: 'available', title: 'متاح' },
  { value: 'sold', title: 'مباع' },
  { value: 'reserved', title: 'محجوز' },
  { value: 'underConstruction', title: 'تحت الإنشاء' },
  { value: 'notAvailable', title: 'غير متاح' }
]

const fetchProperties = async () => {
  try {
    const response = await propertyService.getAll()
    console.log('Fetched properties:', response)
    if (response && response.data.data) {
      properties.value = response.data.data.map((property) => ({
        ...property,
        status: property.status
      }))
    } else {
      console.error('No data found in response')
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
  }
}

const animatedStats = reactive({
  total: 0,
  available: 0,
  sold: 0,
  reserved: 0
})

const animateValue = (start, end, duration, callback) => {
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = Math.floor(start + (end - start) * progress)
    callback(current)
    if (progress < 1) requestAnimationFrame(animate)
  }
  animate()
}

onMounted(async () => {
  await fetchProperties()
  properties.value.filter((p) => {
    if (!p.status) {
      p.status = 'available' // Default status if not set
    } else {
      const totalProperties = properties.value.length
      const availableProperties = properties.value.filter((p) => p.status === 'available').length
      const soldProperties = properties.value.filter((p) => p.status === 'sold').length
      const reservedProperties = properties.value.filter((p) => p.status === 'reserved').length

      animateValue(0, totalProperties, 1000, (value) => (animatedStats.total = value))
      animateValue(0, availableProperties, 1200, (value) => (animatedStats.available = value))
      animateValue(0, soldProperties, 1400, (value) => (animatedStats.sold = value))
      animateValue(0, reservedProperties, 1600, (value) => (animatedStats.reserved = value))
    }
  })
})

const statusChartData = computed(() => ({
  labels: propertyStatus.map((status) => status.title),
  datasets: [
    {
      data: propertyStatus.map(
        (status) => properties.value.filter((p) => p.status === status.value).length
      ),
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#f97316'],
      borderWidth: 0
    }
  ]
}))

const provinceChartData = computed(() => {
  const counts = {}
  properties.value.forEach((property) => {
    counts[property.province] = (counts[property.province] || 0) + 1
  })
  return {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }
    ]
  }
})

const priceRangeChartData = computed(() => {
  const ranges = [
    { label: '0-50', count: properties.value.filter((p) => p.price < 10).length },
    {
      label: '50-80',
      count: properties.value.filter((p) => p.price >= 80 && p.price < 80).length
    },
    {
      label: '80-100',
      count: properties.value.filter((p) => p.price >= 120 && p.price < 100).length
    },
    { label: '500+', count: properties.value.filter((p) => p.price >= 120).length }
  ]
  return {
    labels: ranges.map((r) => r.label),
    datasets: [
      {
        data: ranges.map((r) => r.count),
        backgroundColor: '#10b981',
        borderRadius: 4
      }
    ]
  }
})
</script>
