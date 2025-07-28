// إدارة الأخطاء والإشعارات

export class ErrorHandler {
  static handleApiError(error, toast = null) {
    let message = 'حدث خطأ غير متوقع'

    if (error.response) {
      // الخادم أرجع استجابة بكود خطأ
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          message = data.message || data.error || 'بيانات غير صحيحة'
          break
        case 401:
          message = 'يرجى تسجيل الدخول أولاً'
          break
        case 403:
          message = 'ليس لديك صلاحية للوصول لهذا المورد'
          break
        case 404:
          message = 'المورد المطلوب غير موجود'
          break
        case 500:
          message = 'خطأ في الخادم، يرجى المحاولة لاحقاً'
          break
        default:
          message = data.message || data.error || `خطأ: ${status}`
      }
    } else if (error.request) {
      // لم يتم استلام رد من الخادم
      message = 'لا يمكن الاتصال بالخادم، تأكد من اتصال الإنترنت'
    } else {
      // خطأ في إعداد الطلب
      message = error.message || 'خطأ في إعداد الطلب'
    }

    console.error('API Error:', error)

    if (toast) {
      toast.error(message)
    }

    return {
      message,
      status: error.response?.status,
      originalError: error
    }
  }

  static handleValidationErrors(errors, toast = null) {
    const messages = Object.values(errors).filter(Boolean)
    const message = messages.join('\n')

    if (toast && messages.length > 0) {
      toast.error(message)
    }

    return {
      message,
      errors,
      count: messages.length
    }
  }

  static showSuccess(message, toast = null) {
    if (toast) {
      toast.success(message)
    }
    console.log('Success:', message)
  }

  static showInfo(message, toast = null) {
    if (toast) {
      toast.info(message)
    }
    console.log('Info:', message)
  }

  static showWarning(message, toast = null) {
    if (toast) {
      toast.warning(message)
    }
    console.warn('Warning:', message)
  }
}

// مساعدات إضافية للتعامل مع الأخطاء الشائعة
export const errorHelpers = {
  // التحقق من اتصال الشبكة
  isNetworkError: (error) => {
    return !error.response && error.request
  },

  // التحقق من خطأ التصريح
  isAuthError: (error) => {
    return error.response && (error.response.status === 401 || error.response.status === 403)
  },

  // التحقق من خطأ التحقق من البيانات
  isValidationError: (error) => {
    return error.response && error.response.status === 400
  },

  // التحقق من خطأ الخادم
  isServerError: (error) => {
    return error.response && error.response.status >= 500
  },

  // الحصول على رسالة خطأ مخصصة
  getErrorMessage: (error) => {
    if (errorHelpers.isNetworkError(error)) {
      return 'مشكلة في الاتصال بالشبكة'
    }

    if (errorHelpers.isAuthError(error)) {
      return 'مشكلة في التصريح'
    }

    if (errorHelpers.isValidationError(error)) {
      return 'بيانات غير صحيحة'
    }

    if (errorHelpers.isServerError(error)) {
      return 'خطأ في الخادم'
    }

    return 'خطأ غير محدد'
  }
}

export default ErrorHandler
