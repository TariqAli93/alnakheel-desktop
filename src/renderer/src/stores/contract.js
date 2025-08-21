import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// تعريف الـ Store باسم 'counter'
export const useCounterStore = defineStore('counter', () => {
  // 1. الحالة (State)
  // نقوم بقراءة القيمة الأولية من localStorage.
  // إذا لم تكن موجودة، نبدأ من 0.
  // `parseInt` تضمن أننا نتعامل مع رقم.
  const count = ref(localStorage.getItem('counterValue') || '00001')

  // 2. الإجراءات (Actions)
  // دالة لزيادة قيمة العداد
  function increment() {
    count.value = String(Number(count.value) + 1).padStart(5, '0')
  }

  // 3. المراقبة والحفظ في localStorage
  // نستخدم `watch` لمراقبة أي تغيير يحدث في `count`.
  // عند كل تغيير، يتم حفظ القيمة الجديدة في localStorage.
  watch(count, (newValue) => {
    localStorage.setItem('counterValue', newValue)
  })

  // 4. إرجاع الحالة والإجراءات لجعلها متاحة للمكونات
  return { count, increment }
})
