<template>
  <v-card class="pa-6 rounded-lg">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <v-card-subtitle class="pa-3">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-4xl font-bold mb-2">تفاصيل العقار</h1>
            <p class="text-lg">معلومات شاملة عن العقار المحدد</p>
          </div>
        </div>
      </v-card-subtitle>

      <v-divider class="my-4" />

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Property Details Card -->
        <div class="lg:col-span-2">
          <v-card class="pa-6 bg-background shadow-lg rounded-lg opacity-60">
            <!-- Property Header -->
            <div class="">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold mb-1">{{ property.name || 'اسم العقار' }}</h2>
                  <p class="text-lg">
                    {{ property.type || 'نوع العقار' }} - {{ property.kind || 'النوع الفرعي' }}
                  </p>
                </div>
                <div class="text-left">
                  <div class="text-3xl font-bold">{{ formatPrice(property.price) }}</div>
                  <div class="">
                    {{ property.salePrice ? 'سعر البيع: ' + formatPrice(property.salePrice) : '' }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="my-8" />

            <!-- Property Details Grid -->
            <div class="pa-5">
              <div class="d-flex flex-col lg:flex-row gap-4 justify-space-around">
                <!-- Basic Information -->
                <div class="w-auto space-y-4">
                  <h3 class="text-lg font-semibold border-b border-gray-200 pb-2">
                    المعلومات الأساسية
                  </h3>

                  <div
                    v-for="field in basicFields"
                    :key="field.value"
                    class="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0"
                  >
                    <span class="text-sm font-medium">{{ field.title }}</span>
                    <span class="text-sm font-semibold">{{
                      formatValue(property[field.value])
                    }}</span>
                  </div>
                </div>

                <v-divider vertical />

                <!-- Location Information -->
                <div class="w-auto space-y-4">
                  <h3 class="text-lg font-semibold border-b border-gray-200 pb-2">
                    معلومات الموقع
                  </h3>

                  <div
                    v-for="field in locationFields"
                    :key="field.value"
                    class="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0"
                  >
                    <span class="text-sm font-medium">{{ field.title }}</span>
                    <span class="text-sm font-semibold">{{
                      formatValue(property[field.value])
                    }}</span>
                  </div>
                </div>

                <v-divider vertical />

                <!-- Property Features -->
                <div class="w-auto space-y-4">
                  <h3 class="text-lg font-semibold border-b border-gray-200 pb-2">
                    مواصفات العقار
                  </h3>

                  <div
                    v-for="field in featureFields"
                    :key="field.value"
                    class="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0"
                  >
                    <span class="text-sm font-medium">{{ field.title }}</span>
                    <span class="text-sm font-semibold">{{
                      formatValue(property[field.value])
                    }}</span>
                  </div>
                </div>
              </div>

              <v-divider class="my-6" />

              <!-- Description Section -->
              <div v-if="property.description">
                <h3 class="text-lg font-semibold">الوصف:</h3>
                <v-divider class="my-4" />
                <p class="leading-relaxed bg-surface opacity-60 pa-5 rounded-lg">
                  {{ property.description }}
                </p>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact Card -->
          <v-card class="bg-background opacity-60 mb-5 rounded-lg">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-white">
              <h3 class="text-xl font-bold">معلومات الاتصال</h3>
            </div>
            <div class="pa-6 space-y-4">
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <div class="ml-5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm">المالك</p>
                  <p class="font-semibold">{{ formatValue(property.owner) }}</p>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <div class="ml-5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm">الهاتف</p>
                  <p class="font-semibold">{{ formatValue(property.phone) }}</p>
                </div>
              </div>
            </div>
          </v-card>

          <!-- Property Status -->
          <v-card class="bg-background opacity-60 mb-5 rounded-lg">
            <div class="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 text-white">
              <h3 class="text-xl font-bold">حالة العقار</h3>
            </div>

            <div class="pa-6">
              <!-- Status -->
              <div class="flex items-center justify-between mb-4">
                <!-- text -->
                <span class="text-sm">الحالة</span>
                <span class="px-4 py-2 rounded-full text-sm font-semibold">
                  {{ propertyStatus[property.status] }}
                </span>
              </div>

              <v-divider class="my-4" />

              <!-- Additional Features -->
              <div class="space-y-4">
                <!-- Elevator -->
                <div class="flex items-center justify-between">
                  <span class="text-sm">مصعد</span>
                  <span
                    :class="property.elevator === true ? 'text-green-600' : 'text-red-600'"
                    class="text-sm font-semibold"
                  >
                    {{ property.elevator === true ? 'متوفر' : 'غير متوفر' }}
                  </span>
                </div>
              </div>
            </div>
          </v-card>

          <!-- Quick Stats -->
          <!-- <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            <h3 class="text-lg font-semibold mb-4">إحصائيات سريعة</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ property.area || '—' }}</div>
                <div class="text-xs">المساحة (م²)</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ property.id || '—' }}</div>
                <div class="text-xs">رقم العقار</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { propertyService } from '../services/api'

const route = useRoute()
const property = ref({})

const propertyStatus = reactive({
  available: 'متاح',
  sold: 'مباع',
  reserved: 'محجوز',
  underConstruction: 'تحت الإنشاء',
  notAvailable: 'غير متاح'
})

// Field groupings for better organization
const basicFields = [
  { title: 'الرقم', value: 'id' },
  { title: 'الاسم', value: 'name' },
  { title: 'النوع', value: 'type' },
  { title: 'النوع الفرعي', value: 'kind' },
  { title: 'المساحة (م²)', value: 'area' },
  { title: 'العرض (م)', value: 'width' },
  { title: 'العمق (م)', value: 'depth' }
]

const locationFields = [
  { title: 'المحافظة', value: 'province' },
  { title: 'المنطقة', value: 'district' },
  { title: 'الحي', value: 'neighborhood' },
  { title: 'الشارع', value: 'street' },
  { title: 'المحلة', value: 'block' },
  { title: 'الزقاق', value: 'alley' },
  { title: 'رقم الأرض', value: 'landNumber' }
]

const featureFields = [
  { title: 'سعر البيع', value: 'salePrice' },
  { title: 'السعر', value: 'price' },
  { title: 'الطابق', value: 'floors' },
  { title: 'عدد المحلات', value: 'shops' },
  { title: 'مصعد', value: 'elevator' }
]

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا'
  return value === 0 ? '0' : value
}

function formatPrice(price) {
  if (!price || price === 0) return '—'
  return new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: 'IQD',
    minimumFractionDigits: 0
  }).format(price)
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await propertyService.getById(id)
    console.log('✅ تم تحميل بيانات العقار:', res)
    property.value = res.data.data
  } catch (error) {
    console.error('❌ فشل في تحميل بيانات العقار:', error)
  }
})
</script>

<style scoped>
/* Custom RTL support and additional styling */
.rtl\:space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Smooth transitions for interactive elements */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Enhanced focus states for accessibility */
button:focus,
input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }
}
</style>
