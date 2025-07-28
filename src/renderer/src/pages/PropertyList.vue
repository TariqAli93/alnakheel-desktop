<template>
  <v-container fluid class="py-10 px-4 md:px-10 min-h-screen">
    <v-card class="pa-3 mb-5">
      <v-row>
        <v-col cols="12" md="12" lg="12">
          <v-card class="w-full d-block" elevation="0">
            <!-- العنوان والزر -->
            <div class="d-flex items-center justify-between pa-4">
              <h1 class="text-3xl font-bold d-flex align-center justify-center">
                <v-icon size="24" class="ml-2">mdi-home</v-icon>
                الفرز و البحث عن العقارات
              </h1>
            </div>

            <v-divider />

            <v-text-field
              v-model="search"
              variant="solo-filled"
              label="ابحث عن اسم، نوع أو محافظة"
              prepend-inner-icon="mdi-magnify"
              hide-details
              class="mt-3"
              clearable
            />
          </v-card>
        </v-col>

        <v-divider />

        <v-col cols="12" md="12" lg="12" class="flex justify-center items-center flex-column">
          <v-card class="w-full bg-transparent" elevation="0">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedTaboType"
                  :items="tabo"
                  label="جنس العقار"
                  variant="solo-filled"
                  hide-details
                  class="mb-2"
                  prepend-inner-icon="mdi-filter"
                  clearable
                  @update:model-value="onChangeTaboType"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedProprtiesType"
                  :items="proprtiesType"
                  label="نوع العقار"
                  variant="solo-filled"
                  hide-details
                  class="mb-2"
                  prepend-inner-icon="mdi-filter"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="3">
      <v-card-title class="py-4">
        <v-toolbar rounded>
          <v-toolbar-title> قائمة العقارات </v-toolbar-title>
        </v-toolbar>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredProperties"
        class="elevation-1 bordered-table"
        item-value="id"
        items-per-page-text="عدد العقارات في الصفحة"
        bordered="1"
        no-data-text="لا توجد بيانات"
        :search="search"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-btn-group class="d-flex justify-center bg-background opacity-60" density="comfortable">
            <v-btn
              icon
              variant="text"
              color="primary"
              @click="$router.push(`/property-details/${item.id}`)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="secondary"
              @click="$router.push(`/update-property/${item.id}`)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" @click="delete_property(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-btn-group>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.alley="{ item }">
          <span>{{ item.alley === null || item.alley === '' ? 'غير محدد' : item.alley }}</span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.block="{ item }">
          <span>{{ item.block === null || item.block === '' ? 'غير محدد' : item.block }}</span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.floors="{ item }">
          <span>{{ item.floors === null || item.floors === '' ? 'غير محدد' : item.floors }}</span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.shops="{ item }">
          <span>{{ item.shops === null || item.shops === '' ? 'غير محدد' : item.shops }}</span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.elevator="{ item }">
          <v-icon :color="item.elevator === 'yes' ? 'green' : 'red'" class="ma-1">
            {{ item.elevator === 'yes' ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.status="{ item }">
          <v-chip
            :color="
              item.status === 'available'
                ? 'green'
                : item.status === 'sold'
                  ? 'red'
                  : item.status === 'reserved'
                    ? 'yellow'
                    : item.status === 'underConstruction'
                      ? 'orange'
                      : 'grey'
            "
            class="ma-1"
          >
            {{ propertyStatus[item.status] }}
          </v-chip>
        </template>

        <!-- description -->

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.description="{ item }">
          <!-- sub string  -->
          <span
            v-if="item.description && item.description.length > 25"
            style="min-width: 200px !important; display: block"
          >
            {{ item.description.substring(0, 25) }}...
          </span>
          <span
            v-else-if="item.description && item.description.length <= 25"
            style="min-width: 200px !important; display: block"
          >
            {{ item.description }}
          </span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.name="{ item }">
          <span style="min-width: 200px !important; display: block">
            {{ item.name }}
          </span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.phone="{ item }">
          <span style="min-width: 200px !important; display: block">
            {{ item.phone }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import taboType from '../plugins/taboType'
import { propertyService } from '../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const properties = ref([])
const search = ref('')
const tabo = Object.keys(taboType).map((key) => key)
const proprtiesType = computed(() => {
  return taboType[selectedTaboType.value] || []
})

const propertyStatus = reactive({
  available: 'متاح',
  sold: 'مباع',
  reserved: 'محجوز',
  underConstruction: 'تحت الإنشاء',
  notAvailable: 'غير متاح'
})

const headers = [
  { title: 'الرقم', value: 'id', align: 'start', width: '200px' },
  { title: 'الاسم', value: 'name', align: 'start', width: '200px' },
  { title: 'النوع', value: 'type', width: '200px' },
  { title: 'النوع الفرعي', value: 'kind', width: '200px' },
  { title: 'المساحة (م²)', value: 'area', width: '200px' },
  { title: 'العرض (م)', value: 'width', width: '200px' },
  { title: 'العمق (م)', value: 'depth', width: '200px' },
  { title: 'المحافظة', value: 'province', width: '200px' },
  { title: 'المنطقة', value: 'district', width: '200px' },
  { title: 'الحي', value: 'neighborhood', width: '200px' },
  { title: 'الشارع', value: 'street', width: '200px' },
  { title: 'المحلة', value: 'block', width: '200px' },
  { title: 'الزقاق', value: 'alley', width: '200px' },
  { title: 'رقم الارض', value: 'landNumber', width: '200px' },
  { title: 'سعر البيع', value: 'salePrice', width: '200px' },
  { title: 'السعر', value: 'price', width: '200px' },
  { title: 'الطابق', value: 'floors', width: '200px' },
  { title: 'عدد المحلات', value: 'shops', width: '200px' },
  { title: 'المالك', value: 'owner', width: '200px' },
  { title: 'الهاتف', value: 'phone', width: '200px' },
  { title: 'مصعد', value: 'elevator', width: '200px' },
  { title: 'الوصف', value: 'description', width: '200px' },
  { title: 'الحالة', value: 'status', width: '200px' },
  { title: 'الإجراءات', value: 'actions', sortable: false, align: 'start' }
]

const get_proprties = async () => {
  try {
    const res = await propertyService.getAll()
    console.log(res)
    properties.value = res.data.data // Assuming res is an array of properties
  } catch (error) {
    console.log(error)
    toast.error('خطأ في جلب البيانات', 'تعذر جلب البيانات من الخادم')
  }
}

const delete_property = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
    try {
      await propertyService.delete(id)

      get_proprties() // Refresh the properties list
      toast.success('تم حذف العقار بنجاح', 'تم حذف العقار بنجاح من القائمة')
    } catch (error) {
      console.log(error)
      toast.error('خطأ في حذف العقار', 'تعذر حذف العقار من القائمة')
    }
  } else {
    alert('تم إلغاء عملية الحذف')
  }
}

const filteredProperties = computed(() => {
  return properties.value.filter((property) => {
    const matchesTaboType = !selectedTaboType.value || property.kind === selectedTaboType.value
    const matchesProprtiesType =
      !selectedProprtiesType.value || property.type === selectedProprtiesType.value
    return matchesTaboType && matchesProprtiesType
  })
})

// model variables
let selectedTaboType = ref(null)
let selectedProprtiesType = ref(null)

let onChangeTaboType = (t) => {
  proprtiesType.value = taboType[t] || []
}

onMounted(() => {
  get_proprties()
})
</script>

<style lang="scss" scoped>
:deep(.bordered-table.v-theme--light) {
  --v-border-color: #15151533 !important;
}

:deep(.bordered-table.v-theme--dark) {
  --v-border-color: rgba(128, 128, 128, 0.4);
}

:deep(.bordered-table thead tr th),
:deep(.bordered-table tbody tr td) {
  border-top: 1px solid var(--v-border-color) !important;
  border-bottom: 1px solid var(--v-border-color) !important;
  border-right: 1px solid var(--v-border-color) !important; /* الخط العامودي */
  white-space: nowrap;
}

:deep(.bordered-table thead tr th:first-child),
:deep(.bordered-table tbody tr td:first-child) {
  border-right: none !important;
}
</style>
