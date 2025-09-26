<template>
  <v-card class="pa-6 rounded-lg">
    <v-card-subtitle class="pa-3">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold mb-2">البحث و الفرز</h1>
          <p class="text-lg">معلومات شاملة عن العقار المحدد</p>
        </div>
      </div>
    </v-card-subtitle>

    <v-divider class="my-4" />
    <v-row>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="search"
          variant="solo-filled"
          label="ابحث عن اسم، نوع أو محافظة"
          prepend-inner-icon="mdi-filter"
          hide-details
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-select
          v-model="filters.status"
          :items="propertyStatus"
          item-title="title"
          item-value="value"
          label="حالة العقار"
          prepend-inner-icon="mdi-filter"
          variant="solo-filled"
          hide-details
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-select
          v-model="filters.taboType"
          :items="tabo"
          label="جنس العقار"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-select
          v-model="filters.proprtiesType"
          :items="proprtiesType"
          label="نوع العقار"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-combobox
          v-model="filters.province"
          :items="Array.from(new Set(properties.map((p) => p.province))).filter(Boolean)"
          label="المحافظة"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-combobox
          v-model="filters.district"
          :items="Array.from(new Set(properties.map((p) => p.district))).filter(Boolean)"
          label="المنطقة"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-combobox
          v-model="filters.neighborhood"
          :items="Array.from(new Set(properties.map((p) => p.neighborhood))).filter(Boolean)"
          label="الحي"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-combobox
          v-model="filters.street"
          :items="Array.from(new Set(properties.map((p) => p.street))).filter(Boolean)"
          label="الشارع"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-text-field
          v-model.number="filters.priceFrom"
          type="number"
          label="السعر من"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-text-field
          v-model.number="filters.priceTo"
          type="number"
          label="السعر إلى"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-text-field
          v-model.number="filters.areaFrom"
          type="number"
          label="المساحة من (م²)"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-text-field
          v-model.number="filters.areaTo"
          type="number"
          label="المساحة إلى (م²)"
          variant="solo-filled"
          hide-details
          class="mb-2"
          prepend-inner-icon="mdi-filter"
          clearable
        />
      </v-col>
    </v-row>
  </v-card>

  <v-card class="pa-6 rounded-lg mt-3">
    <v-card-subtitle class="pa-3">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold mb-2">قائمة العقارات</h1>
          <p class="text-lg">معلومات شاملة عن العقارات المحفوظة</p>
        </div>

        <div>
          <v-btn icon variant="text" @click="exportProperties">
            <Download />
          </v-btn>
        </div>
      </div>
    </v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="filteredProperties"
      class="elevation-0 bordered-table"
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
          <v-btn
            icon
            variant="text"
            color="error"
            :disabled="loginState.user.role !== 'ADMIN'"
            @click="delete_property(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-btn-group>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.alley="{ item }">
        <span>{{ item.alley || 'غير محدد' }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.block="{ item }">
        <span>{{ item.block || 'غير محدد' }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.floors="{ item }">
        <span>{{ item.floors || 'غير محدد' }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.shops="{ item }">
        <span>{{ item.shops || 'غير محدد' }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.elevator="{ item }">
        <v-icon :color="item.elevator === 'yes' ? 'green' : 'red'" class="ma-1">
          {{ item.elevator === 'yes' ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.status="{ item }">
        <v-chip :color="statusColors[item.status] || 'grey'" class="ma-1" dark>
          {{ propertyStatus.find((status) => status.value === item.status)?.title || 'غير محدد' }}
        </v-chip>
      </template>

      <!-- description -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.description="{ item }">
        <span class="cell-text">
          {{
            item.description && item.description.length > 25
              ? item.description.substring(0, 25) + '...'
              : item.description || ''
          }}
        </span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.name="{ item }">
        <span class="cell-text">{{ item.name }}</span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.phone="{ item }">
        <span class="cell-text">{{ item.phone }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import taboType from '../plugins/taboType'
import { propertyService } from '../services/api'
import { useToast } from 'vue-toastification'
import { useLoginState } from '../stores/login'
import { Download } from 'lucide-vue-next'

const toast = useToast()
const loginState = useLoginState()

const properties = ref([])
const search = ref('')
const tabo = Object.keys(taboType).map((key) => key)

const propertyStatus = [
  {
    value: 'available',
    title: 'متاح'
  },
  {
    value: 'sold',
    title: 'مباع'
  },
  {
    value: 'reserved',
    title: 'محجوز'
  },
  {
    value: 'underConstruction',
    title: 'تحت الإنشاء'
  },
  {
    value: 'notAvailable',
    title: 'غير متاح'
  }
]

const statusColors = {
  available: 'green',
  sold: 'red',
  reserved: 'yellow',
  underConstruction: 'orange'
}

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
    const sorted = res.data.data.sort((a, b) => b.id - a.id)
    properties.value = sorted
  } catch (error) {
    console.log(error)
    toast.error('خطأ في جلب البيانات', 'تعذر جلب البيانات من الخادم')
  }
}

const delete_property = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
    try {
      await propertyService.delete(id)
      get_proprties()
      toast.success('تم حذف العقار بنجاح', 'تم حذف العقار بنجاح من القائمة')
    } catch (error) {
      console.log(error)
      toast.error('خطأ في حذف العقار', 'تعذر حذف العقار من القائمة')
    }
  } else {
    alert('تم إلغاء عملية الحذف')
  }
}

const filters = reactive({
  taboType: null,
  proprtiesType: null,
  priceFrom: null,
  priceTo: null,
  status: null,
  province: null,
  district: null,
  neighborhood: null,
  street: null,
  areaFrom: null,
  areaTo: null
})

const proprtiesType = computed(() => {
  return taboType[filters.taboType] || []
})

const filteredProperties = computed(() => {
  return properties.value.filter((property) => {
    return (
      (!filters.taboType || property.kind === filters.taboType) &&
      (!filters.proprtiesType || property.type === filters.proprtiesType) &&
      (!filters.status || property.status === filters.status) &&
      (!filters.province || property.province?.includes(filters.province)) &&
      (!filters.district || property.district?.includes(filters.district)) &&
      (!filters.neighborhood || property.neighborhood?.includes(filters.neighborhood)) &&
      (!filters.street || property.street?.includes(filters.street)) &&
      (!filters.priceFrom || property.price >= filters.priceFrom) &&
      (!filters.priceTo || property.price <= filters.priceTo) &&
      (!filters.areaFrom || property.area >= filters.areaFrom) &&
      (!filters.areaTo || property.area <= filters.areaTo)
    )
  })
})

const exportProperties = async () => {
  try {
    const res = await propertyService.exportPropertiesToExcel(filteredProperties.value)
    const buffer = res.data
    const defaultName = `properties-${filters.taboType || 'all'}-${new Date().toISOString().slice(0, 10)}.xlsx`
    await window.api.saveExcel({ defaultName, buffer })
    toast.success('تم تصدير العقارات بنجاح', 'تم تصدير العقارات إلى Excel')
  } catch (error) {
    console.log(error)
    toast.error('خطأ في تصدير العقارات', 'تعذر تصدير العقارات إلى Excel')
  }
}

onMounted(() => {
  get_proprties()
})
</script>

<style lang="scss" scoped>
.cell-text {
  min-width: 200px !important;
  display: block;
}
</style>
