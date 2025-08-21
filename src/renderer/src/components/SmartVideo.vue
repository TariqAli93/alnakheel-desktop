<!-- SmartVideo.vue -->
<template>
  <div class="sv-wrap">
    <!-- حالة بدون رابط -->
    <div v-if="!url" class="sv-muted">ضع رابط فيديو لبدء المعاينة.</div>

    <!-- المعاينة قبل التشغيل -->
    <div v-else-if="!isPlaying" class="sv-thumb aspect-video">
      <img
        v-if="thumbnailUrl"
        :src="thumbnailUrl"
        alt="Thumbnail"
        class="sv-thumb-img"
        @error="thumbnailUrl = ''"
      />
      <div v-else class="sv-thumb-fallback">لا توجد معاينة متاحة</div>

      <!-- زر التشغيل -->
      <button aria-label="تشغيل" class="sv-play-btn" :title="'تشغيل'" @click="start">
        <span>▶</span>
      </button>

      <!-- delete button -->
      <v-btn
        class="sv-delete-btn"
        density="compact"
        color="error"
        variant="flat"
        icon
        @click="emitDeleteVideo(video.id)"
      >
        <v-icon size="small">mdi-delete</v-icon>
      </v-btn>
    </div>

    <!-- المشغّل بعد الضغط -->
    <div v-else class="aspect-video">
      <!-- فيديو مباشر -->
      <video
        v-if="player.kind === 'direct'"
        :src="player.src"
        :poster="thumbnailUrl || poster || undefined"
        class="sv-player"
        :controls="controls"
        :muted="muted"
        :loop="loop"
        playsinline
        autoplay
        @play="$emit('play')"
        @pause="$emit('pause')"
        @ended="$emit('ended')"
      ></video>

      <!-- YouTube / Vimeo / روابط embed -->
      <iframe
        v-else
        :src="player.src"
        class="sv-player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { emitter } from '../plugins/event-bus'

const props = defineProps({
  video: { type: Object, default: () => ({}) },
  poster: { type: String, default: '' },
  controls: { type: Boolean, default: true },
  muted: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  /** لو true، يفتح داخل لايت بوكس بدل التشغيل داخل نفس الكومبونينت */
  openInLightbox: { type: Boolean, default: false }
})

const url = ref(null)

const emit = defineEmits(['play', 'pause', 'ended', 'ready', 'open-lightbox'])

const isPlaying = ref(false)
const thumbnailUrl = ref('')
const player = ref({ kind: 'none', src: '' })

watch(
  () => props.video?.url,
  (v) => {
    reset()
    prepareFromUrl(v)
  },
  { immediate: true }
)

onMounted(() => {
  // إذا كان عندنا رابط فيديو، حضّر المعاينة
  if (props.video) {
    url.value = props.video.url || ''
  }

  emit('ready')
})

function reset() {
  isPlaying.value = false
  player.value = { kind: 'none', src: '' }
  thumbnailUrl.value = ''
}

async function start() {
  // لو مطلوب لايت بوكس: نبعث الحدث ونوقف هنا
  if (props.openInLightbox) {
    emit('open-lightbox', props.video?.url)
    return
  }

  const url = (props.video?.url || '').trim()
  const yt = parseYouTube(url)
  if (yt) {
    const t = yt.start ? `&start=${yt.start}` : ''
    player.value = { kind: 'youtube', src: `https://www.youtube.com/embed/${yt.id}?autoplay=1${t}` }
    isPlaying.value = true
    return
  }
  const vm = parseVimeo(url)
  if (vm) {
    player.value = { kind: 'vimeo', src: `https://player.vimeo.com/video/${vm.id}?autoplay=1` }
    isPlaying.value = true
    return
  }
  if (isDirectVideo(url)) {
    player.value = { kind: 'direct', src: url }
    isPlaying.value = true
    return
  }
  if (isEmbedUrl(url)) {
    player.value = { kind: 'embed', src: ensureAutoplay(url) }
    isPlaying.value = true
    return
  }
}

function prepareFromUrl(url) {
  // يوتيوب: صورة مصغّرة جاهزة
  const yt = parseYouTube(url)
  if (yt) {
    thumbnailUrl.value = `https://img.youtube.com/vi/${yt.id}/hqdefault.jpg`
    return
  }

  // فيميو: via oEmbed
  const vm = parseVimeo(url)
  if (vm) {
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vm.id}`)
      .then((r) => r.json())
      .then((d) => {
        thumbnailUrl.value = d.thumbnail_url || ''
      })
      .catch(() => {
        thumbnailUrl.value = ''
      })
    return
  }

  // روابط مباشرة: عادة لا يوجد thumbnail بدون خادم وسيط
  if (isDirectVideo(url) || isEmbedUrl(url)) {
    thumbnailUrl.value = props.poster || ''
  }
}

/* ===================== Helpers ===================== */
function parseYouTube(url) {
  try {
    const u = new URL(url)

    // watch?v=ID
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      const start = parseYouTubeStart(u)
      if (id) return { id, start }
    }

    // youtu.be/ID
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '').split('/')[0]
      const start = parseYouTubeStart(u)
      if (id) return { id, start }
    }

    // shorts
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
  // start=90 أو t=1m30s
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

function emitDeleteVideo(videoId) {
  emitter.emit('delete', videoId)
}
</script>

<style scoped lang="scss">
.sv-wrap {
  width: 100%;

  .aspect-video {
    aspect-ratio: 16 / 9;
  }

  .sv-player {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 12px;
    overflow: hidden;
  }

  .sv-thumb {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #e9e9e9;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    // زر التشغيل
    .sv-play-btn {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      // مخفي افتراضياً على الأجهزة التي تدعم hover
      visibility: hidden;
      opacity: 0;
      transition:
        opacity 0.18s ease,
        visibility 0.18s ease;

      > span {
        width: 45px;
        height: 45px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
    }

    .sv-delete-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      visibility: hidden;
      opacity: 0;
      transition-delay: 0.3s;
    }

    // أظهر الزر عند التحويم
    &:hover {
      .sv-play-btn,
      .sv-play-btn:focus-visible {
        visibility: visible;
        opacity: 1;
      }

      .sv-delete-btn {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .sv-muted {
    color: #666;
    font-size: 13px;
  }
}

/* على الأجهزة بدون hover (مثل الجوال)، خليه ظاهر دائماً */
@media (hover: none) {
  .sv-wrap .sv-thumb .sv-play-btn {
    visibility: visible;
    opacity: 1;
  }
}
</style>
