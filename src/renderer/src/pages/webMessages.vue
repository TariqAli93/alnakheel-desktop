<template>
  <v-card class="pa-6 rounded-lg">
    <!-- Header Section -->
    <v-card-subtitle class="pa-3">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold mb-2">رسائل الزوار</h1>
          <p class="text-lg">الرسائل المرسلة من قبل زوار الموقع</p>
        </div>

        <v-btn icon variant="text" @click="$router.back()">
          <ArrowLeft />
        </v-btn>
      </div>
    </v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="messages"
      class="elevation-0 bordered-table"
      item-value="id"
      items-per-page-text="عدد الرسائل في الصفحة"
      bordered="1"
      no-data-text="لا توجد بيانات"
    >
      <template #item.createdAt="{ item }">
        {{ moment(item.created_at).format('LL') }}
      </template>
      <template #item.is_read="{ item }">
        <v-sheet>
          {{ item.is_read ? 'مقروءة' : 'غير مقروءة' }}
        </v-sheet>
      </template>
      <template #item.actions="{ item }">
        <v-btn variant="text" icon @click="markAsRead(item)">
          <v-icon v-if="!item.is_read" color="green">mdi-email</v-icon>
          <v-icon v-else color="grey">mdi-email-open</v-icon>
        </v-btn>
        <v-btn variant="text" icon @click="deleteMessage(item.id)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>

  <!-- dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="headline flex justify-space-between items-center">
        <span>تفاصيل الرسالة</span>
        <v-spacer></v-spacer>
        <v-btn density="compact" variant="text" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-list density="compact">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>الاسم:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedMessage.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>رقم الهاتف:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedMessage.phone }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>تاريخ الإرسال:</v-list-item-title>
              <v-list-item-subtitle>{{
                moment(selectedMessage.created_at).format('LL')
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2" />

          <v-textarea
            v-model="selectedMessage.message"
            label="الرسالة"
            rows="3"
            outlined
            readonly
          ></v-textarea>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $axios from '../plugins/vueAxios'
import moment from 'moment'
import { emitter } from '../plugins/event-bus'

const messages = ref([])
const headers = [
  { title: 'الاسم', value: 'name' },
  { title: 'رقم الهاتف', value: 'phone' },
  { title: 'الرسالة', value: 'message' },
  { title: 'تاريخ الإرسال', value: 'createdAt' },
  { title: 'قراءة', value: 'is_read', sortable: false },
  { title: 'الإجراءات', value: 'actions', sortable: false }
]

const dialog = ref(false)
const selectedMessage = ref({})

async function fetchMessages() {
  const response = await $axios.get('web/webMessages')
  console.log(response.data.messages)
  messages.value = response.data.messages
}

async function markAsRead(item) {
  item.is_read = true
  await $axios.get(`web/webMessages/read/${item.id}`)
  selectedMessage.value = item
  dialog.value = true

  emitter.emit('messageRead', item)
}

async function deleteMessage(id) {
  messages.value = messages.value.filter((m) => m.id !== id)
  await $axios.delete(`web/webMessages/${id}`)
  emitter.emit('messageRead')
}

onMounted(fetchMessages)
</script>
