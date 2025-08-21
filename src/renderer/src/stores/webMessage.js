import $axios from '../plugins/vueAxios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebMessageState = defineStore('webMessages', () => {
  const messages_count = ref(0)

  const getMessagesCount = async () => {
    try {
      const response = await $axios.get('web/webMessages')
      messages_count.value = response.data.messages.filter((message) => !message.is_read).length
    } catch (error) {
      console.error('Error fetching message count:', error)
    }
  }

  getMessagesCount()

  return {
    messages_count
  }
})
