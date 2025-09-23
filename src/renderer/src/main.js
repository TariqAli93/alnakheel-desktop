import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Toast from 'vue-toastification'
import router from './router'
import { createPinia } from 'pinia'
import 'vue-toastification/dist/index.css'
import './main.scss'
import './app.css'
import { offlineSync } from './plugins/offlineSync'

const app = createApp(App).use(vuetify).use(createPinia()).use(router).use(Toast)

offlineSync.init()
setTimeout(() => {
  console.log('تشغيل sync بعد 1 ثانية...')
  offlineSync.sync()
}, 1000)

app.mount('#app')

// جرّب المزامنة مرّة بعد ما يركب التطبيق
