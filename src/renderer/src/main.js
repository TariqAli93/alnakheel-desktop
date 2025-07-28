import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Toast from 'vue-toastification'
import router from './router'
import { createPinia } from 'pinia'
import 'vue-toastification/dist/index.css'
import './main.scss'
import './app.css'

createApp(App).use(vuetify).use(createPinia()).use(router).use(Toast).mount('#app')
