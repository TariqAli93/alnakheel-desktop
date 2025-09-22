// plugins/offlineSync.js
import Dexie from 'dexie'

// إنشاء قاعدة بيانات باسم offlineDB
const db = new Dexie('offlineDB')
db.version(1).stores({
  pending: '++id, collection, timestamp'
})

/**
 * حفظ عملية بالـ queue إذا النت مقطوع
 * @param {string} collection - اسم التجميع (مثلاً: "properties")
 * @param {object} data - البيانات اللي تريد تخزنها
 * @param {function} apiCall - دالة ترجع Promise لإرسال البيانات للسيرفر
 */
async function save(collection, data, apiCall) {
  if (navigator.onLine) {
    // إذا النت موجود نجرب نرسل مباشرة
    try {
      return await apiCall(data)
    } catch (err) {
      // إذا صار خطأ نرجع نخزن بالـ queue
      await db.pending.add({ collection, data, timestamp: Date.now() })
      console.error('فشل الإرسال، تم تخزين العملية محلياً', err)
    }
  } else {
    // إذا النت مقطوع نخزن مباشرة
    await db.pending.add({ collection, data, timestamp: Date.now() })
    console.log('الانترنت مقطوع، العملية مخزنة محلياً')
  }
}

/**
 * مزامنة جميع العمليات المعلقة
 */
async function sync() {
  const pending = await db.pending.toArray()
  for (const item of pending) {
    try {
      // لازم تعرف شلون ترسل بناءً على collection
      if (item.collection === 'properties') {
        const { propertyService } = await import('../services/api')
        await propertyService.create(item.data)
      }
      await db.pending.delete(item.id)
      console.log('تمت مزامنة العملية:', item)
    } catch (err) {
      console.error('فشل المزامنة، راح نجرب مرة ثانية لاحقاً', err)
      return
    }
  }
}

// Listen على رجوع الانترنت
window.addEventListener('online', sync)

export const offlineSync = { save, sync }
