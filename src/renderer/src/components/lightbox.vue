<template>
  <VueEasyLightbox
    :visible="visible"
    :imgs="largeImages"
    :index="index"
    teleport="body"
    @prev="onPrev"
    @next="onNext"
    @hide="close"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'

const props = defineProps({
  /** مصفوفة صور (روابط مباشرة) */
  images: {
    type: Array,
    default: () => []
  }
})

const visible = ref(false)
const index = ref(0)

// لو عندك تحويلات أو أحجام مختلفة، عدّلها هنا
const largeImages = computed(() => props.images)

// تنقّل
const onPrev = () => {
  if (!largeImages.value.length) return
  index.value = (index.value - 1 + largeImages.value.length) % largeImages.value.length
}

const onNext = () => {
  if (!largeImages.value.length) return
  index.value = (index.value + 1) % largeImages.value.length
}

// تحكم
function open(i = 0) {
  if (!largeImages.value.length) return
  index.value = Math.min(Math.max(0, i), largeImages.value.length - 1)
  visible.value = true
}

function close() {
  visible.value = false
}

// كشف للدوال للأب
defineExpose({ open, close })
</script>
