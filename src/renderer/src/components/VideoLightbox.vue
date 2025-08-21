<!-- VideoLightbox.vue -->
<template>
  <teleport to="body">
    <transition name="vlb-fade">
      <div v-if="visible" class="vlb-backdrop" @click.self="close">
        <div class="vlb-dialog">
          <button class="vlb-close" @click="close" aria-label="إغلاق">✕</button>

          <div class="vlb-frame aspect-video">
            <!-- direct video -->
            <video
              v-if="player.kind === 'direct'"
              :src="player.src"
              controls
              autoplay
              playsinline
              class="vlb-media"
            ></video>

            <!-- iframe (YT/Vimeo/embed) -->
            <iframe
              v-else
              :src="player.src"
              class="vlb-media"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const player = ref({ kind: 'none', src: '' })

function open(url) {
  const u = (url || '').trim()
  const yt = parseYouTube(u)
  if (yt) {
    const t = yt.start ? `&start=${yt.start}` : ''
    player.value = { kind: 'iframe', src: `https://www.youtube.com/embed/${yt.id}?autoplay=1${t}` }
    visible.value = true
    return
  }
  const vm = parseVimeo(u)
  if (vm) {
    player.value = { kind: 'iframe', src: `https://player.vimeo.com/video/${vm.id}?autoplay=1` }
    visible.value = true
    return
  }
  if (isDirectVideo(u)) {
    player.value = { kind: 'direct', src: u }
    visible.value = true
    return
  }
  if (isEmbedUrl(u)) {
    player.value = { kind: 'iframe', src: ensureAutoplay(u) }
    visible.value = true
  }
}

function close() {
  visible.value = false
  // مسح src لإيقاف التشغيل فورًا
  setTimeout(() => {
    player.value = { kind: 'none', src: '' }
  }, 200)
}

// ESC لإغلاق
function onKey(e) {
  if (e.key === 'Escape' && visible.value) close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// helpers (نفس اللي في SmartVideo تقريبًا)
function parseYouTube(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      const start = parseYouTubeStart(u)
      if (id) return { id, start }
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '').split('/')[0]
      const start = parseYouTubeStart(u)
      if (id) return { id, start }
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
      const id = u.pathname.split('/')[2]
      if (id) return { id, start: 0 }
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error)
  }
  return null
}
function parseYouTubeStart(u) {
  let s = u.searchParams.get('start')
  if (s && /^\d+$/.test(s)) return Number(s)
  const t = u.searchParams.get('t')
  if (t) {
    const secs = parseTimeToSeconds(t)
    if (!isNaN(secs)) return secs
  }
  return 0
}
function parseVimeo(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('vimeo.com')) {
      const parts = u.pathname.split('/').filter(Boolean)
      const last = parts.pop()
      if (/^\d+$/.test(last)) return { id: last }
    }
  } catch (error) {
    console.error('Error parsing Vimeo URL:', error)
  }
  return null
}
function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '')
}
function isEmbedUrl(url) {
  return /\/embed\/|player\.vimeo\.com/i.test(url || '')
}
function ensureAutoplay(url) {
  try {
    const u = new URL(url)
    u.searchParams.set('autoplay', '1')
    return u.toString()
  } catch {
    return url
  }
}
function parseTimeToSeconds(t) {
  if (/^\d+$/.test(t)) return Number(t)
  let total = 0
  const h = /(\d+)h/.exec(t)
  if (h) total += Number(h[1]) * 3600
  const m = /(\d+)m/.exec(t)
  if (m) total += Number(m[1]) * 60
  const s = /(\d+)s/.exec(t)
  if (s) total += Number(s[1])
  return total || 0
}

// نكشف الدوال للأب
defineExpose({ open, close })
</script>

<style scoped>
.vlb-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.vlb-dialog {
  width: min(1200px, 90vw);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.vlb-close {
  align-self: flex-end;
  background: transparent;
  border: 0;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.aspect-video {
  aspect-ratio: 16/9;
}
.vlb-frame {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}
.vlb-media {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.vlb-fade-enter-active,
.vlb-fade-leave-active {
  transition: opacity 0.2s;
}
.vlb-fade-enter-from,
.vlb-fade-leave-to {
  opacity: 0;
}
</style>
