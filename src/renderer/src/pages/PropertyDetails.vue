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

          <v-btn icon variant="text" @click="$router.back()">
            <ArrowLeft />
          </v-btn>
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

          <!-- add media -->
          <v-card class="bg-background opacity-60 mb-5 rounded-lg">
            <div
              class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white flex items-center justify-between"
            >
              <h3 class="text-xl font-bold">الوسائط</h3>
              <v-spacer />
              <v-btn
                icon
                variant="plain"
                color="white"
                class="text-white opacity-100"
                @click="propertyImagesDialog = true"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <div
              v-if="property.PropertyImages && property.PropertyImages.length === 0"
              class="pa-6"
            >
              <p class="text-sm">لا توجد وسائط متاحة لهذا العقار.</p>
            </div>

            <GalleryCarousel :images="propertyImages" />
            <v-dialog v-model="propertyImagesDialog" max-width="500px">
              <v-card>
                <v-card-title class="flex items-center justify-between">
                  <span class="text-[13px]">إضافة صورة جديدة</span>
                  <v-spacer />
                  <v-btn variant="flat" density="compact" icon @click="closePropertyImagesDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider />
                <div class="p-4">
                  <v-file-input
                    v-model="newImage"
                    label="اختر صورة"
                    accept="image/*"
                    variant="outlined"
                    append-icon=""
                    density="compact"
                    append-inner-icon=""
                    hide-details
                    prepend-icon=""
                    @change="onImageChange"
                  />

                  <v-divider class="my-4" />
                  <v-btn
                    :disabled="!newImage"
                    color="primary"
                    density="default"
                    block
                    @click="uploadImage"
                  >
                    رفع الصورة
                  </v-btn>
                </div>
              </v-card>
            </v-dialog>
          </v-card>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Property Details Card -->
        <div class="lg:col-span-2">
          <v-card class="bg-background opacity-60 mt-5 rounded-lg">
            <div
              class="bg-gradient-to-r from-yellow-500 to-amber-800 px-6 py-4 text-white flex items-center justify-between"
            >
              <h3 class="text-xl font-bold">مقاطع الفيديو</h3>
              <v-spacer />
              <v-btn
                icon
                variant="plain"
                color="white"
                class="text-white opacity-100"
                @click="propertyVideosDialog = true"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>

            <div
              v-if="property.PropertyVideos && property.PropertyVideos.length === 0"
              class="pa-6"
            >
              <p class="text-sm">لا توجد مقاطع فيديو متاحة لهذا العقار.</p>
            </div>

            <div
              v-if="propertyVideos.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pa-3"
            >
              <SmartVideo
                v-for="v in propertyVideos"
                :key="v.id"
                :video="v"
                :open-in-lightbox="true"
                @open-lightbox="openVideoInLightbox"
              />
            </div>

            <!-- اللايت بوكس -->
            <VideoLightbox ref="videoLb" />

            <v-dialog v-model="propertyVideosDialog" max-width="500px">
              <v-card>
                <v-card-title class="flex items-center justify-between">
                  <span class="text-[13px]">إضافة فيديو جديد</span>
                  <v-spacer />
                  <v-btn variant="flat" density="compact" icon @click="closePropertyVideosDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider />
                <div class="p-4">
                  <v-text-field
                    v-model="newVideoUrl"
                    label="رابط الفيديو"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />

                  <v-divider class="my-4" />
                  <v-select
                    v-model="videoPlatform"
                    :items="videoPlatforms"
                    label="منصة الفيديو"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                  <v-divider class="my-4" />
                  <v-btn
                    :disabled="!newVideoUrl"
                    color="primary"
                    density="default"
                    block
                    @click="addVideo"
                  >
                    اضافة الفيديو
                  </v-btn>
                </div>
              </v-card>
            </v-dialog>
          </v-card>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { propertyService } from '../services/api'
import $axios from '../plugins/vueAxios'
import GalleryCarousel from '../components/GalleryCarousel.vue'
import { emitter } from '../plugins/event-bus'
import SmartVideo from '../components/SmartVideo.vue'
import VideoLightbox from '../components/VideoLightbox.vue'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const property = ref({})

const propertyImages = ref([])
const propertyVideos = ref([])
const videoLb = ref()

const propertyImagesDialog = ref(false)
const propertyVideosDialog = ref(false)

const newVideoUrl = ref('')
const videoPlatform = ref(null)
const videoPlatforms = ref([
  { value: 'YOUTUBE', title: 'يوتيوب' },
  { value: 'VIMEO', title: 'فيميو' },
  { value: 'DAILYMOTION', title: 'ديلي موشن' }
])

const newImage = ref(null)

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

function onImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    newImage.value = file
  }

  console.log('📸 تم اختيار صورة جديدة:', newImage.value)
}

const closePropertyImagesDialog = () => {
  propertyImagesDialog.value = false
  newImage.value = null
}

const closePropertyVideosDialog = () => {
  propertyVideosDialog.value = false
  newVideoUrl.value = ''
  videoPlatform.value = null
}

function openVideoInLightbox(url) {
  videoLb.value?.open(url)
}

const uploadImage = async () => {
  if (!newImage.value) return

  console.log(newImage.value)

  const formData = new FormData()
  formData.append('image', newImage.value)
  formData.append('propertyId', property.value.id)

  try {
    await propertyService.createPropertyImage(formData)

    propertyImagesDialog.value = false
    await fetchPropertyDetails() // Refresh property details to include new image
    newImage.value = null
  } catch (error) {
    console.error('❌ فشل في رفع الصورة:', error)
  }
}

const addVideo = async () => {
  if (!newVideoUrl.value || !videoPlatform.value) return

  const videoData = {
    url: newVideoUrl.value,
    platform: videoPlatform.value,
    propertyId: property.value.id
  }

  try {
    await propertyService.createPropertyVideo(videoData)
    propertyVideosDialog.value = false
    newVideoUrl.value = ''
    videoPlatform.value = null
    fetchPropertyDetails()
  } catch (error) {
    console.error('❌ فشل في إضافة الفيديو:', error)
  }
}

emitter.on('delete', async (videoId) => {
  await propertyService.deletePropertyVideo(parseInt(videoId, 10))
  await fetchPropertyDetails()
})

const fetchPropertyDetails = async () => {
  const id = route.params.id
  try {
    const res = await propertyService.getById(id)
    property.value = res.data.data
    propertyImages.value = res.data.data.PropertyImages.map((image) => image) || []

    propertyImages.value = propertyImages.value.map((image) => {
      return {
        id: image.id,
        imageId: image.image.id,
        propertyId: image.propertyId,
        url: `${$axios.defaults.baseURL}public/images/${image.image.filename}`
      }
    })

    propertyVideos.value = res.data.data.PropertyVideos.map((video) => video) || []

    console.log('📄 تم تحميل تفاصيل العقار:', property.value)
  } catch (error) {
    console.error('❌ فشل في تحميل بيانات العقار:', error)
  }
}

onMounted(async () => {
  await fetchPropertyDetails()
  emitter.on('image-deleted', fetchPropertyDetails)
})
</script>
