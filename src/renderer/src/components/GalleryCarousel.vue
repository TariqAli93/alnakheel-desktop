<!-- src/components/GalleryCarousel.vue -->
<template>
  <div class="p-4">
    <lightbox
      ref="viewer"
      :images="
        images.map((img) => ({
          src: fullUrl(img.url)
        }))
      "
    />
    <Swiper
      :slides-per-view="4"
      :space-between="12"
      :loop="true"
      :pagination="false"
      :navigation="false"
      class="max-w-4xl mx-auto"
    >
      <SwiperSlide v-for="(img, i) in images" :key="img.url">
        <figure
          class="rounded-lg overflow-hidden border cursor-zoom-in image-figure"
          @click="viewer?.open(i)"
        >
          <img
            :src="fullUrl(img.url)"
            :alt="img.name"
            class="w-full h-50 object-cover slider-image"
            crossorigin="anonymous"
          />

          <v-btn
            class="delete-button"
            color="error"
            density="compact"
            icon
            @click.stop="deleteImage(i)"
          >
            <v-icon size="14">mdi-delete</v-icon>
          </v-btn>
        </figure>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { propertyService } from '../services/api'
import { emitter } from '../plugins/event-bus'
import lightbox from './lightbox.vue'

// CSS الخاص بـ Swiper (لا تتركه)
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

// بدّل هذا على حسب بيئتك (proxy في Vite أو دومين الإنتاج)
const BASE = import.meta.env.VITE_API_BASE_URL || ''
const fullUrl = (p) => (BASE ? `${BASE}${p}` : p)

const deleteImage = async (i) => {
  const image = props.images[i]
  await propertyService.deletePropertyImage(image.id, image.propertyId)
  emitter.emit('image-deleted')
}

const viewer = ref(null)
</script>

<!-- تسجيل مكوّن اللايتبوكس محليًا -->

<style lang="scss">
.vel-modal {
  background-color: rgba(0, 0, 0, 1) !important; /* أسود صافي */
  opacity: 1 !important;
  isolation: isolate !important;
  z-index: 999999 !important;
}

/* ألغي أي تأثيرات شفافية أو فلتر على الصور */
.vel-modal * {
  opacity: 1 !important;
  filter: none !important;
  mix-blend-mode: normal !important;
}

.vel-img-wrap {
  background-color: #fff !important; /* أو أي لون يناسبك */
}

.slider-image {
  object-fit: cover;
  width: 100% !important;
  height: 150px !important;
}

.image-figure {
  position: relative;

  .delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  }

  &:hover {
    .delete-button {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
