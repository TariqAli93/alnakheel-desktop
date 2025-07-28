// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ar } from 'vuetify/locale'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  locale: {
    locale: 'ar',
    fallback: 'en',
    messages: { ar }
  },
  rtl: true, // ✅ هذا يفعّل الاتجاه من اليمين لليسار
  theme: {
    defaultTheme: 'dark', // Set the default theme to dark
    dark: true, // Enable dark mode by default
    themes: {
      dark: {
        background: '#121212',
        surface: '#1D1D1D',
        primary: '#BB86FC',
        secondary: '#03DAC6',
        error: '#CF6679',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
      light: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        primary: '#6200EE',
        secondary: '#03DAC6',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      }
    }
  }
})

export default vuetify
