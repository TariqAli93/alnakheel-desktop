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
      <v-col cols="12" lg="12">
        <v-text-field
          v-model="search"
          variant="solo-filled"
          label="ابحث عن اسم، نوع أو محافظة"
          prepend-inner-icon="mdi-magnify"
          hide-details
          class="mt-3"
          clearable
        />
      </v-col>

      <!-- add filter by price -->
      <!-- <v-col cols="12" lg="6">
        <v-slider
          v-model="priceRange"
          class="mt-3"
          label="نطاق السعر"
          ticks
          min="0"
          max="2000"
          step="100"
          thumb-label="always"
          range
          prepend-icon="mdi-currency-usd"
          track-color="blue lighten-3"
          color="blue"
          @change="onPriceRangeChange"
        />
      </v-col> -->
    </v-row>

    <v-row class="mt-3">
      <v-col cols="12" lg="6">
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

      <v-col cols="12" lg="6">
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
const priceRange = ref([0, 1000000])

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
    // sort last added first
    const sorted = res.data.data.sort((a, b) => b.id - a.id)
    properties.value = sorted // Assuming res is an array of properties
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

const exportProperties = async () => {
  try {
    const res = await propertyService.exportPropertiesToExcel(filteredProperties.value)
    const buffer = res.data // ✅ هذا Buffer/ArrayBuffer
    const defaultName = `properties-${new Date().toISOString().slice(0, 10)}.xlsx`
    await window.api.saveExcel({ defaultName, buffer })
    toast.success('تم تصدير العقارات بنجاح', 'تم تصدير العقارات إلى Excel')
  } catch (error) {
    console.log(error)
    toast.error('خطأ في تصدير العقارات', 'تعذر تصدير العقارات إلى Excel')
  }
}

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

<style lang="scss" scoped></style>
