<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="justify-center"> Login </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="usernameRules"
                required
                prepend-icon="mdi-account"
                type="text"
                variant="outlined"
              />
              <v-text-field
                v-model="password"
                label="Password"
                :rules="passwordRules"
                required
                prepend-icon="mdi-lock"
                type="password"
                variant="outlined"
              />
              <v-btn :disabled="!valid" color="primary" type="submit" class="mt-4" block>
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginState } from '../stores/login'
import $axios from '../plugins/vueAxios'

const router = useRouter()
const loginStore = useLoginState()

const username = ref('')
const password = ref('')
const valid = ref(false)
const form = ref(null)

const usernameRules = [(v) => !!v || 'Username is required']

const passwordRules = [(v) => !!v || 'Password is required']

const login = async () => {
  if (form.value.validate()) {
    try {
      const response = await $axios.post('/api/users/login', {
        username: username.value,
        password: password.value
      })

      if (response.data.success) {
        const userData = loginStore.decodeToken(response.data.token)

        loginStore.login(response.data.token, userData)

        router.push({ name: 'Home' })
      } else {
        console.error('Login failed:', response.data.message)
      }
    } catch (error) {
      console.error('Login failed:', error)

      return
    }
  }
}
</script>
