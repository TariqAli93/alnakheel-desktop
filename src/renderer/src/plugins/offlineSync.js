import Dexie from 'dexie'
import { propertyService } from '../services/api'

const db = new Dexie('offlineDB')
db.version(1).stores({ pending: '++id,collection,timestamp' })

const handlers = {
  properties: async (data) => {
    return propertyService.create(data) // call network-only
  }
}

async function save(collection, data, apiCall) {
  if (typeof apiCall === 'function') {
    try {
      const res = await apiCall(data)
      if (res && res.status >= 200 && res.status < 300) {
        return {
          success: true,
          offline: false,
          data: res.data,
          message: 'تمت العملية اونلاين'
        }
      }
      return {
        success: false,
        offline: false,
        data,
        message: `خطأ من السيرفر: ${res?.status}`
      }
    } catch (err) {
      // إذا error بدون response → انقطاع شبكة
      if (!err.response) {
        console.warn('انقطاع الشبكة، نخزن محلياً')
        await db.pending.add({ collection, data, timestamp: Date.now() })
        return {
          success: true,
          offline: true,
          data,
          message: 'تم حفظ العملية محلياً (offline)، وسيتم رفعها عند عودة الانترنت'
        }
      }
      // error بس من السيرفر (status 400/500)
      return {
        success: false,
        offline: false,
        data: err.response?.data || data,
        message: `خطأ من السيرفر: ${err.response?.status}`
      }
    }
  }

  // fallback إذا apiCall مفقود
  await db.pending.add({ collection, data, timestamp: Date.now() })
  return {
    success: true,
    offline: true,
    data,
    message: 'تم التخزين محلياً (بدون apiCall)'
  }
}

let syncing = false
async function sync() {
  if (!navigator.onLine || syncing) return
  syncing = true
  console.log('تشغيل sync()', db.pending.length, 'pending items')
  try {
    const pending = await db.pending.orderBy('timestamp').toArray()
    for (const item of pending) {
      try {
        const handler = handlers[item.collection]
        if (!handler) throw new Error(`No handler for collection "${item.collection}"`)
        const res = await handler(item.data)
        if (res && res.status >= 200 && res.status < 300) {
          await db.pending.delete(item.id)
          console.log('تمت مزامنة العملية:', item)
        } else {
          console.error('فشل المزامنة، السيرفر رجع خطأ', res)
        }
      } catch (err) {
        console.error('فشل المزامنة لعنصر واحد، سيعاد لاحقاً:', err, item)
      }
    }
  } finally {
    syncing = false
  }
}

async function init() {
  await sync() // run once at startup
  window.addEventListener('online', sync)
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') await sync()
  })
}

export const offlineSync = { save, sync, init }
