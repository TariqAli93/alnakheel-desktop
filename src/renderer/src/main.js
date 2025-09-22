import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Toast from 'vue-toastification'
import router from './router'
import { createPinia } from 'pinia'
import 'vue-toastification/dist/index.css'
import './main.scss'
import './app.css'
const app = createApp(App).use(vuetify).use(createPinia()).use(router).use(Toast)

app.config.globalProperties.$isOffline = !navigator.onLine

window.addEventListener('online', () => {
  app.config.globalProperties.$isOffline = false
  console.log('Went online')
})

window.addEventListener('offline', () => {
  app.config.globalProperties.$isOffline = true
  console.log('Went offline')
})

app.mount('#app')
