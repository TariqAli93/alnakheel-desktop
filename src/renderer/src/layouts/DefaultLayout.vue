<template>
  <div class="default-layout" dir="rtl">
    <v-app dir="rtl">
      <v-main>
        <v-container>
          <v-app-bar app dark>
            <v-container class="d-flex align-center">
              <v-toolbar-title>نظام إدارة العقارات</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn text to="/">الرئيسية</v-btn>
              <v-btn text to="/properties">العقارات</v-btn>
              <v-btn text to="/add-property">إضافة عقار</v-btn>
              <v-btn text to="/users" :disabled="!hasRole">المستخدمين</v-btn>

              <!-- add username -->
              <v-chip class="mx-4" color="primary" text-color="white">
                <span>مرحبا بكـ {{ user?.username }}</span>
              </v-chip>

              <!-- change them dark/light -->
              <v-btn-group>
                <v-btn icon class="mr-4" @click="toggleTheme">
                  <v-icon>{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
                </v-btn>

                <v-btn icon @click="logout">
                  <v-icon>mdi-logout</v-icon>
                </v-btn>
              </v-btn-group>
            </v-container>
          </v-app-bar>
          <router-view />
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
import { checkRoles } from '../utils/checkRoles'

const theme = useTheme()

const router = useRouter()

const loginStore = useLoginState()

// Check if the user has the required roles from roles array
const hasRole = checkRoles(loginStore.user, 'ADMIN')

const token = ref(localStorage.getItem('authToken') || '')
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

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

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  } else {
    theme.global.name.value = 'light' // Default theme
  }
})
</script>
