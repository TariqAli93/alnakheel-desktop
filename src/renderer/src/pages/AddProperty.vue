<template>
  <v-container class="pa-4">
    <v-overlay :model-value="loading" class="align-center justify-center" persistent>
      <v-progress-circular size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <v-toolbar rounded="lg" class="mb-4">
      <v-toolbar-title>إضافة عقار</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submitForm">
          <v-row dense>
            <!-- اسم العقار -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.name"
                variant="outlined"
                label="اسم العقار"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- نوع العقار -->
            <v-col cols="12" md="4">
              <v-select
                v-model="form.kind"
                variant="outlined"
                :items="tabo"
                label="جنس العقار"
                required
                :rules="[rules.required]"
                @change="onChangeTaboType()"
              />
            </v-col>

            <!-- نوع العقار -->
            <v-col cols="12" md="4">
              <v-select
                v-model="form.type"
                variant="outlined"
                :items="proprtiesType"
                label="نوع العقار"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- المحافظة -->
            <v-col cols="12" md="4">
              <v-select
                v-model="form.province"
                variant="outlined"
                :items="provinces"
                label="المحافظة"
                required
                :rules="[rules.required]"
                @change="updateDistricts"
              />
            </v-col>

            <!-- المنطقة -->
            <v-col cols="12" md="4">
              <v-select
                v-model="form.district"
                variant="outlined"
                :items="districts[form.province] || []"
                label="المدينة"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- الحالة -->
            <v-col cols="12" md="4">
              <v-select
                v-model="form.status"
                variant="outlined"
                :items="propertyStatus"
                label="حالة العقار"
                required
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <v-row>
            <template v-for="field in dynamicFields" :key="field.model">
              <v-col v-if="!field.if || field.if(form)" :cols="12" :md="field.md(form) || 6">
                <v-text-field
                  v-model="form[field.model]"
                  :variant="field.variant || 'outlined'"
                  :label="field.label"
                />
              </v-col>
            </template>
          </v-row>

          <v-row>
            <!-- الأسعار -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.price"
                variant="outlined"
                label="سعر العقار (د.ع)"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.salePrice"
                variant="outlined"
                label="سعر البيع (د.ع)"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
          <v-row>
            <!-- صاحب العقار ورقم الهاتف -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.owner"
                variant="outlined"
                label="صاحب العقار"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                variant="outlined"
                label="رقم الهاتف"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <v-row>
            <!-- مساحة الأرض، العرض، العمق -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.area"
                variant="outlined"
                label="مساحة الأرض (م²)"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.width"
                variant="outlined"
                label="عرض الأرض (م)"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.depth"
                variant="outlined"
                label="عمق الأرض (النزال)"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <v-row v-if="form.type === 'بيت' || form.type?.includes('بناية')">
            <!-- الطوابق، الغرف، الحمامات -->
            <v-col v-if="form.type === 'بيت' || form.type?.includes('بناية')" cols="12" md="4">
              <v-text-field
                v-model="form.floors"
                variant="outlined"
                label="عدد الطوابق"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col v-if="form.type === 'بيت' || form.type?.includes('بناية')" cols="12" md="4">
              <v-text-field
                v-model="form.rooms"
                variant="outlined"
                label="عدد الغرف"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col v-if="form.type === 'بيت' || form.type?.includes('بناية')" cols="12" md="4">
              <v-text-field
                v-model="form.bathrooms"
                variant="outlined"
                label="عدد الحمامات"
                type="number"
                :rules="[rules.required]"
              />
            </v-col>

            <!-- عدد المحلات التجارية -->
            <v-col v-if="form.type?.includes('بناية')" cols="12" md="12">
              <v-text-field
                v-model="form.shops"
                variant="outlined"
                label="عدد المحلات التجارية"
                type="number"
              />
            </v-col>
          </v-row>

          <v-row>
            <!-- وصف العقار -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                variant="outlined"
                label="وصف العقار"
                rows="4"
                :rules="[rules.required]"
              />
            </v-col>

            <v-row class="mt-4 d-flex justify-space-between align-center">
              <!-- مصعد -->
              <v-col v-if="form.type?.includes('بناية')" cols="6" md="6">
                <v-switch
                  v-model="form.elevator"
                  label="يوجد مصعد؟"
                  :color="form.elevator ? 'green' : 'red'"
                />
              </v-col>

              <v-spacer></v-spacer>
              <!-- زر الإرسال -->
              <v-col cols="6" class="text-end">
                <v-btn color="primary" type="submit">حفظ</v-btn>
              </v-col>
            </v-row>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import iraqAreas from '../plugins/iraqAreas'
import { useToast } from 'vue-toastification'
import taboType from '../plugins/taboType'
import { propertyService } from '../services/api'

const formRef = ref(null)

const toast = useToast()

const loading = ref(false)

const tabo = Object.keys(taboType).map((key) => key)
const proprtiesType = computed(() => {
  return taboType[form.kind] || []
})

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

const form = reactive({
  name: '',
  type: '',
  kind: '',
  province: '',
  district: '',
  street: '',
  block: '',
  alley: '',
  price: '',
  salePrice: '',
  owner: '',
  phone: '',
  area: '',
  width: '',
  depth: '',
  floors: '',
  rooms: '',
  bathrooms: '',
  elevator: false,
  shops: null,
  description: '',
  landNumber: '',
  neighborhood: '',
  status: 'available' // Default status
})

const provinces = Object.keys(iraqAreas)

const districts = iraqAreas

const updateDistricts = () => {
  form.district = ''
}

const onChangeTaboType = (t) => {
  proprtiesType.value = taboType[t] || []
}

const dynamicFields = [
  {
    model: 'neighborhood',
    label: 'الحي',
    variant: 'outlined',
    if: (form) => form.kind.includes('زراعي'),
    md: (form) => (form.kind.includes('زراعي') ? 4 : 4)
  },
  {
    model: 'street',
    label: 'الشارع',
    variant: 'outlined',
    md: (form) => (form.kind.includes('زراعي') ? 4 : 6)
  },

  {
    model: 'block',
    label: 'المحلة',
    variant: 'outlined',
    if: (form) => form.kind === 'طابو صرف',
    md: (form) => (form.kind === 'طابو صرف' ? 6 : 6)
  },
  {
    model: 'alley',
    label: 'الزقاق',
    variant: 'outlined',
    if: (form) => form.kind === 'طابو صرف',
    md: (form) => (form.kind === 'طابو صرف' ? 6 : 6)
  },
  {
    model: 'landNumber',
    label: 'رقم الارض',
    variant: 'outlined',
    md: (form) => {
      if (form.kind === 'طابو صرف') {
        return 6
      } else if (form.kind.includes('زراعي')) {
        return 4
      } else {
        return 6
      }
    }
  }
]

const rules = {
  required: (v) => !!v || 'هذا الحقل مطلوب.',
  minLength: (v) => (v && v.length >= 3) || 'يجب ألا يقل عن 3 أحرف.',
  maxLength: (v) => (v && v.length <= 10) || 'يجب ألا يزيد عن 10 أحرف.',
  isNumber: (v) => !v || /^\d+$/.test(v) || 'يجب إدخال أرقام فقط.',
  email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'صيغة البريد الإلكتروني غير صحيحة.'
}

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  loading.value = true

  const modefiedForm = { ...form, elevator: form.elevator ? 1 : 0 }

  console.log('Submitting form:', modefiedForm)

  if (!valid) {
    toast.error('يرجى ادخال جميع البيانات المطلوبة')
    loading.value = false
    return
  }

  try {
    const res = await propertyService.create(modefiedForm)

    if (res.data.success) {
      toast.success('تم اضافة العقار بنجاح')

      setTimeout(() => {
        loading.value = false
      }, 1000)
    } else {
      toast.error('حدث خطأ أثناء إضافة العقار')
    }
  } catch (error) {
    toast.error('حدث خطأ أثناء إضافة العقار')
    console.error(error)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}
</script>
