<template>
  <v-card class="pa-6 rounded-lg">
    <v-card-subtitle class="pa-3">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold mb-2">طباعة عقود البيع</h1>
          <p class="text-lg">عقود البيع و الشراء - مكتب النخيل</p>
        </div>

        <div>
          <v-chip>
            <span>رقم العقد: {{ useCounter.count }}</span>
          </v-chip>
        </div>
      </div>
    </v-card-subtitle>
  </v-card>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="printContract">
    <v-card class="pa-6 rounded-lg mt-3">
      <v-card-subtitle class="pa-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">تفاصيل العقد</h1>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider class="my-4" />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contract.seller.name"
              label="اسم البائع"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
            <v-text-field
              v-model="contract.seller.id"
              label="رقم هوية البائع"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
            <v-text-field
              v-model="contract.seller.phone"
              label="رقم هاتف البائع"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
            <v-text-field
              v-model="contract.seller.address"
              label="عنوان البائع"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>

          <v-divider vertical />

          <v-col cols="12" md="6">
            <v-text-field
              v-model="contract.buyer.name"
              label="اسم المشتري"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
            <v-text-field
              v-model="contract.buyer.id"
              label="رقم هوية المشتري"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
            <v-text-field
              v-model="contract.buyer.phone"
              label="رقم هاتف المشتري"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
            <v-text-field
              v-model="contract.buyer.address"
              label="عنوان المشتري"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="pa-6 rounded-lg mt-3">
      <v-card-subtitle class="pa-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">تفاصيل العقار</h1>
            <p></p>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider class="my-4" />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.property.type"
              label="نوع الملك"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.property.district"
              label="رقم المقاطعة"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.property.mahalla"
              label="المحله"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="contract.property.landnumber"
              label="رقم القطعة"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="contract.property.area"
              label="المساحة"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="contract.property.face"
              label="الواجهة"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="contract.property.depth"
              label="العمق"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- الامور المالية (المبلغ و المدفوع و المتبقي و العربون و التضمينات) -->
    <v-card class="pa-6 rounded-lg mt-3">
      <v-card-subtitle class="pa-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">الامور المالية</h1>
            <p></p>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider class="my-4" />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.price.priceNumber"
              label="المبلغ"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.price.paid"
              label="المدفوع"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.price.priceWords"
              label="المبلغ كتابة"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.price.remaining"
              label="المتبقي"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.price.downPayment"
              label="العربون"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="contract.price.inclusions"
              label="التضمينات"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- فقرات اضافية داينميكيه -->
    <v-card class="pa-6 rounded-lg mt-3">
      <v-card-subtitle class="pa-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">فقرات اضافية</h1>
            <p></p>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider class="my-4" />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contract.additional.clause1"
              label="فقرة 1"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contract.additional.clause2"
              label="فقرة 2"
              variant="outlined"
              class="mb-4"
              :rules="[(v) => !!v || 'هذا الحقل مطلوب']"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="pa-6 rounded-lg mt-3">
      <v-card-actions>
        <v-btn color="primary" type="submit">طباعة العقد</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-form>

  <!-- print button -->
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCounterStore } from '../stores/contract'
import { emitter } from '../plugins/event-bus'
import { useRouter } from 'vue-router'
import tafqeet from '../plugins/tafqeet'

const useCounter = useCounterStore()
const router = useRouter()

const convertToWords = ref('')

const valid = ref(false)
const form = ref(null)

const contract = ref({
  number: useCounter.count || '00001',
  seller: { name: '', id: '', phone: '', address: '' },
  buyer: { name: '', id: '', phone: '', address: '' },
  property: {
    type: '',
    area: '',
    district: '',
    mahalla: '',
    landnumber: '',
    face: '',
    depth: ''
  },
  price: {
    priceWords: '',
    priceNumber: '',
    paid: '',
    remaining: '',
    inclusions: '',
    downPayment: ''
  },
  additional: { clause1: '', clause2: '' }
})

// دالة الطباعة والتنقل
const printContract = async () => {
  const res = await form.value?.validate()
  const isValid = typeof res === 'boolean' ? res : res.valid // v2: boolean, v3: { valid }
  if (!isValid) return

  // من هنا فقط إذا التحقق ناجح
  console.log('Contract to print:', contract.value)

  emitter.emit('print-contract', contract.value)
  useCounter.increment()
  contract.value.number = useCounter.count || '00001'
  router.push({
    name: 'PrintContract',
    query: { contract: JSON.stringify(contract.value) }
  })
}

// ووتش للتحديث التلقائي عند تغيير السعر
watch(
  () => contract.value.price.priceNumber,
  (newValue) => {
    if (!newValue || isNaN(newValue)) {
      contract.value.price.priceWords = ''
    } else {
      const words = tafqeet(Number(newValue))
      contract.value.price.priceWords = words
      convertToWords.value = words
    }
  }
)
</script>

<style>
@page {
  size: A4;
  margin: 20mm;
}

@media print {
  body {
    background: white;
  }
  .contract {
    box-shadow: none;
    margin: 0;
  }
}
</style>
