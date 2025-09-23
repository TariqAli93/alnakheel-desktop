<template>
  <div>
    <!-- Spinner -->
    <div v-if="isLoading" class="spinner-overlay">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>
    <LoginLayout v-if="!isLoggedIn" />
    <DefaultLayout v-else />
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { useLoginState } from './stores/login'
import DefaultLayout from './layouts/DefaultLayout.vue'
import LoginLayout from './layouts/LoginLayout.vue'
import { isLoading } from './plugins/vueAxios'
import { offlineSync } from './plugins/offlineSync'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'

const toast = useToast()

const route = useRoute()

const loginStore = useLoginState()
const isLoggedIn = computed(() => loginStore.isLoggedIn ?? false)

if (!loginStore.checkTokenValidity()) {
  loginStore.logout()
}

const isOnline = ref(navigator.onLine)

const updateStatus = () => {
  isOnline.value = navigator.onLine
}

watch(isOnline, (newStatus) => {
  if (newStatus) {
    toast.info('الاتصال بالإنترنت متاح، محاولة المزامنة...')
    offlineSync.sync()
  }
})

watch(route.fullPath, () => {
  offlineSync.sync()
})

onMounted(() => {
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)

  // جرّب المزامنة مرّة بعد ما يركب التطبيق
  setTimeout(() => {
    console.log('تشغيل sync بعد 1 ثانية...')
    toast.info('محاولة المزامنة مع الخادم...')
    offlineSync.sync()
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('online', updateStatus)
  window.removeEventListener('offline', updateStatus)
})
</script>

<style>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3); /* خلفية شفافة */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 60px;
  height: 60px;
  animation: rotate 2s linear infinite;
}

.path {
  stroke: #3498db;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
