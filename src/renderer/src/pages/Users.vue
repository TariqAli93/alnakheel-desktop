<template>
  <v-card class="pa-6 rounded-lg">
    <!-- Header Section -->
    <v-card-subtitle class="pa-3">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold mb-2">المستخدمين</h1>
          <p class="text-lg">جميع المستخدمين مع الادوار</p>
        </div>

        <v-btn
          icon
          variant="text"
          :disabled="loginState.user.role !== 'ADMIN'"
          @click="createUserModel = true"
        >
          <Plus />
        </v-btn>
      </div>
    </v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-0 bordered-table"
      item-value="id"
      items-per-page-text="عدد المستخدمين في الصفحة"
      bordered="1"
      no-data-text="لا توجد بيانات"
    >
      <template #item.role="{ item }">
        {{ rolesText(item.role) }}
      </template>

      <template #item.status="{ item }">
        <span :class="statusClass(item)">
          {{ translateStatus(item) }}
        </span>
      </template>
      <template #item.actions="{ item }">
        <!-- تعديل -->
        <v-btn
          icon
          variant="text"
          color="secondary"
          :disabled="!isAdmin || loading[item.id]"
          @click="openEditor(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <!-- حذف (نخفيه إذا محذوف بالفعل) -->
        <v-btn
          icon
          variant="text"
          color="error"
          :disabled="!isAdmin || loading[item.id]"
          @click="deleteUser(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <!-- استعادة (إذا محذوف) -->
        <v-btn
          v-if="isDeleted(item)"
          icon
          variant="text"
          color="primary"
          :disabled="!isAdmin || loading[item.id]"
          @click="restoreUser(item)"
        >
          <v-icon>mdi-undo</v-icon>
        </v-btn>

        <!-- تفعيل -->
        <v-btn
          v-if="!isDeleted(item) && !isActive(item)"
          icon
          variant="text"
          color="success"
          :disabled="!isAdmin || loading[item.id]"
          @click="activateUser(item)"
        >
          <v-icon>mdi-check-circle</v-icon>
        </v-btn>

        <!-- إلغاء التفعيل -->
        <v-btn
          v-if="!isDeleted(item) && isActive(item)"
          icon
          variant="text"
          color="warning"
          :disabled="!isAdmin || loading[item.id]"
          @click="deactivateUser(item)"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>

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

  <v-dialog v-model="updateUserModel" max-width="500px">
    <v-card>
      <v-card-title class="py-3">إضافة مستخدم جديد</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form
          ref="updateUserFormRef"
          v-model="updateUserForm"
          validate-on="submit"
          @submit.prevent="editUser"
        >
          <v-text-field v-model="updatedUser.username" label="اسم المستخدم" variant="outlined" />
          <v-text-field
            v-model="updatedUser.password"
            label="كلمة المرور"
            type="password"
            variant="outlined"
          />
          <v-select
            v-model="updatedUser.role"
            label="الدور"
            :items="roles"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-card-actions>
            <v-btn color="primary" type="submit">إضافة</v-btn>
            <v-spacer />
            <v-btn text color="error" @click="updateUserModel = false">إلغاء</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { userService } from '../services/api'
import { useLoginState } from '../stores/login'
import { Plus } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const loginState = useLoginState()
const toast = useToast()
const users = ref([])
const userId = ref(null)
const headers = [
  { title: '#', value: 'id' },
  { title: 'اسم المستخدم', value: 'username' },
  { title: 'الادوار', value: 'role' },
  { title: 'الحالة', value: 'status' },
  { title: 'الاجارائات', value: 'actions' }
]

const createUserForm = ref(false)
const createUserFormRef = ref(null)
const createUserModel = ref(false)
const newUser = ref({ username: '', password: '', role: '' })

const updateUserForm = ref(false)
const updateUserFormRef = ref(null)
const updateUserModel = ref(false)
const updatedUser = ref({ username: '', password: '', role: '' })

const rules = {
  required: (value) => !!value || 'هذا الحقل مطلوب'
}

const roles = ref(['ADMIN', 'EMPLOYEE']) // يجب أن يتم تحميل الأدوار من الخدمة

const rolesText = (role) => {
  const roleArr = {
    ADMIN: 'ادمن',
    EMPLOYEE: 'محرر'
  }

  return roleArr[role] || role
}

const translateStatus = (item) => {
  if (item.is_deleted) return 'محذوف'
  if (item.is_active) return 'نشط'
  return 'غير مفعل'
}

const statusClass = (item) => {
  if (item.is_deleted) return 'text-gray-500 font-semibold'
  if (item.is_active) return 'text-green-600 font-semibold'
  return 'text-red-600 font-semibold'
}

const openEditor = (user) => {
  userId.value = user.id
  updatedUser.value.username = user.username
  updatedUser.value.password = user?.password
  updatedUser.value.role = user.role

  updateUserModel.value = true
}

const editUser = async () => {
  try {
    await userService.updateUser(userId.value, updatedUser.value)
    toast.success('تم تحديث المستخدم بنجاح')
    updateUserModel.value = false
    updatedUser.value.username = ''
    updatedUser.value.password = ''
    updatedUser.value.role = ''
    userId.value = null
    loadUsers()
  } catch (error) {
    toast.error('فشل تحيدث المستخدم يرجى المحاوله لاحقا')
    console.log(error)
  }
}

const loadUsers = async () => {
  try {
    const response = await userService.getUsers()
    users.value = response.data.users
    toast.success('تم تحميل جميع المستخدمين')
    console.log(users.value)
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error('حدث خطأ في تحميل المستخدمين يرجى المحاولة لاحقا')
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
      toast.error('حدث خطأ في انشاء المستخدم يرجى المحاولة لاحقا')
    }
  }
}

const deleteUser = async (item) => {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

  try {
    if (item?.is_deleted) {
      await userService.deleteUserPermanently(item.id)
    } else {
      await userService.deleteUser(item.id)
    }
    toast.success('تم حذف المستخدم بنجاح')
    loadUsers() // إعادة تحميل المستخدمين بعد الحذف
  } catch (error) {
    toast.error('حدث خطاء اثناء حذف المستخدم يرجى المحاولة لاحقا')
    console.error('Error deleting user:', error)
  }
}

const isAdmin = computed(() => loginState.user?.role === 'ADMIN')
const loading = reactive({}) // loading لكل صف

// محوّلات تدعم 0/1 أو true/false
const isDeleted = (u) => u.is_deleted === 1 || u.is_deleted === true
const isActive = (u) => u.is_active === 1 || u.is_active === true

async function restoreUser(item) {
  try {
    loading[item.id] = true
    // API مثال: أعد ضبط الحذف
    await userService.restoreUser(item.id)
    await loadUsers()
  } finally {
    loading[item.id] = false
  }
}

async function activateUser(item) {
  try {
    loading[item.id] = true
    // API مثال: فعل المستخدم (وتأكد إنه مو محظور)
    await userService.activeUser(item.id)
    await loadUsers()
  } finally {
    loading[item.id] = false
  }
}

async function deactivateUser(item) {
  try {
    loading[item.id] = true
    // API مثال: إزالة الحظر + تفعيل
    await userService.disactiveUser(item.id)
    await loadUsers()
  } finally {
    loading[item.id] = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
