<template>
  <v-container fluid>
    <v-toolbar flat class="mb-4" rounded>
      <v-toolbar-title>إدارة المستخدمين</v-toolbar-title>

      <v-spacer />

      <v-btn variant="text" @click="createUserModel = true">إضافة مستخدم</v-btn>
    </v-toolbar>

    <v-row>
      <v-col v-for="user in users" :key="user.id" cols="12" md="6" lg="4">
        <v-card elevation="2" class="pa-3">
          <v-card-title class="text-primary font-weight-bold">
            {{ user.username }}
          </v-card-title>
          <v-divider />
          <v-card-subtitle class="my-5">
            {{ user.role }}
          </v-card-subtitle>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" variant="text" @click="editUser(user)"> تعديل </v-btn>
            <v-btn
              color="error"
              variant="text"
              :disabled="user.role !== 'ADMIN'"
              @click="deleteUser(user.id)"
            >
              حذف
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="createUserModel" max-width="500px">
      <v-card>
        <v-card-title class="py-3">إضافة مستخدم جديد</v-card-title>
        <v-divider />
        <v-card-text>
          <v-form
            ref="createUserFormRef"
            v-model="createUserForm"
            validate-on="submit"
            @submit.prevent="createUser"
          >
            <v-text-field v-model="newUser.username" label="اسم المستخدم" variant="outlined" />
            <v-text-field
              v-model="newUser.password"
              label="كلمة المرور"
              type="password"
              variant="outlined"
              :rules="[rules.required]"
            />
            <v-select
              v-model="newUser.role"
              label="الدور"
              :items="roles"
              variant="outlined"
              :rules="[rules.required]"
            />
            <v-card-actions>
              <v-btn color="primary" type="submit">إضافة</v-btn>
              <v-spacer />
              <v-btn text color="error" @click="createUserModel = false">إلغاء</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const createUserForm = ref(false)
const createUserFormRef = ref(null)
const createUserModel = ref(false)
const newUser = ref({ username: '', password: '', role: '' })
import { userService } from '../services/api'

const rules = {
  required: (value) => !!value || 'هذا الحقل مطلوب'
}

const roles = ref(['ADMIN', 'EMPLOYEE']) // يجب أن يتم تحميل الأدوار من الخدمة

const editUser = (user) => {
  // منطق تعديل المستخدم
  console.log('Edit user:', user)
}

const loadUsers = async () => {
  try {
    const response = await userService.getUsers()
    users.value = response.data.users
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const createUser = async () => {
  if (createUserFormRef.value.validate()) {
    try {
      await userService.createUser({
        username: newUser.value.username,
        password: newUser.value.password,
        role: newUser.value.role
      })

      loadUsers() // إعادة تحميل المستخدمين بعد الإضافة
      newUser.value = { username: '', password: '', role: '' } // إعادة تعيين النموذج
      createUserModel.value = false // إغلاق النموذج
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }
}

const deleteUser = async (userId) => {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

  try {
    await userService.deleteUser(userId)
    loadUsers() // إعادة تحميل المستخدمين بعد الحذف
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

onMounted(() => {
  loadUsers()
})
</script>
