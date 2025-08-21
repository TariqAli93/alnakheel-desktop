<template>
  <div class="default-layout" dir="rtl">
    <v-app dir="rtl">
      <v-navigation-drawer v-model="navigationDrawer" permanent location="right" app>
        <template #prepend>
          <v-list-item
            lines="two"
            title="مرحبا بكـ"
            :subtitle="loginStore?.user?.username"
          ></v-list-item>
        </template>
        <v-divider></v-divider>
        <v-list nav density="comfortable">
          <v-list-item title="الرئيسية" to="/">
            <template #prepend>
              <home class="ml-3" />
            </template>
          </v-list-item>

          <v-list-item title="العقارات" to="/properties">
            <template #prepend>
              <building2 class="ml-3" />
            </template>
          </v-list-item>

          <v-list-item title="اضافة عقار" to="/add-property">
            <template #prepend>
              <plus class="ml-3" />
            </template>
          </v-list-item>

          <v-list-item title="المستخدمين" to="/users">
            <template #prepend>
              <users2 class="ml-3" />
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-3" />
        <v-list nav density="comfortable">
          <v-list-item title="العقود" to="/contracts">
            <template #prepend>
              <Paperclip class="ml-3" />
            </template>
          </v-list-item>

          <v-list-item title="الايجارات" to="/rentals">
            <template #prepend>
              <Receipt class="ml-3" />
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app dark>
        <v-container class="d-flex align-center">
          <v-btn class="ml-3" icon @click="navigationDrawer = !navigationDrawer">
            <Menu />
          </v-btn>
          <v-toolbar-title>نظام إدارة العقارات</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- change them dark/light -->

          <v-btn icon to="/messages">
            <v-badge
              v-if="messageCount > 0"
              color="red"
              :content="messageCount"
              floating
              offset-y="-10"
              offset-x="10"
            >
            </v-badge>
            <bell />
          </v-btn>

          <v-btn icon @click="toggleTheme">
            <v-icon>{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
          </v-btn>

          <v-btn icon color="error" @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-container>
      </v-app-bar>
      <v-main>
        <v-container>
          <router-view @vue:updated="countTheMessages" />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { useLoginState } from '../stores/login'
import $axios from '../plugins/vueAxios'
import { checkRoles } from '../utils/checkRoles'
import { emitter } from '../plugins/event-bus'
import { Home, Building2, Users2, Plus, Bell, Menu, Paperclip, Receipt } from 'lucide-vue-next'

const theme = useTheme()

const router = useRouter()

const loginStore = useLoginState()

const navigationDrawer = ref(true)

// Check if the user has the required roles from roles array
const hasRole = checkRoles(loginStore.user, 'ADMIN')

const token = ref(localStorage.getItem('authToken') || '')
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

const messageCount = ref(0)

if (token.value) {
  user.value = jwtDecode(token.value)
}

const logout = () => {
  loginStore.logout()
  router.push('/login')
  user.value = null
}

const isDarkTheme = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}

async function countTheMessages() {
  try {
    const response = await $axios.get('web/webMessages')
    messageCount.value = response.data.messages.filter((m) => !m.is_read).length
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  countTheMessages()
  emitter.on('messageRead', countTheMessages)

  if (savedTheme) {
    theme.global.name.value = savedTheme
  } else {
    theme.global.name.value = 'light' // Default theme
  }
})
</script>
