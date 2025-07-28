// نظام التحقق من صحة البيانات

export const validators = {
  // التحقق من وجود القيمة
  required: (value, fieldName = 'الحقل') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} مطلوب`
    }
    return null
  },

  // التحقق من الحد الأدنى لطول النص
  minLength: (value, min, fieldName = 'الحقل') => {
    if (value && value.length < min) {
      return `${fieldName} يجب أن يكون ${min} أحرف على الأقل`
    }
    return null
  },

  // التحقق من الحد الأقصى لطول النص
  maxLength: (value, max, fieldName = 'الحقل') => {
    if (value && value.length > max) {
      return `${fieldName} يجب ألا يزيد عن ${max} حرف`
    }
    return null
  },

  // التحقق من صحة رقم الهاتف
  phone: (value, fieldName = 'رقم الهاتف') => {
    if (!value) return null
    const phonePattern = /^[0-9+\-\s()]+$/
    if (!phonePattern.test(value)) {
      return `${fieldName} غير صحيح`
    }
    return null
  },

  // التحقق من الأرقام الموجبة
  positiveNumber: (value, fieldName = 'الرقم') => {
    if (value !== null && value !== undefined && value !== '') {
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        return `${fieldName} يجب أن يكون رقم موجب`
      }
    }
    return null
  },

  // التحقق من الأرقام الصحيحة الموجبة
  positiveInteger: (value, fieldName = 'الرقم') => {
    if (value !== null && value !== undefined && value !== '') {
      const num = parseInt(value)
      if (isNaN(num) || num < 0 || !Number.isInteger(parseFloat(value))) {
        return `${fieldName} يجب أن يكون رقم صحيح موجب`
      }
    }
    return null
  }
}

// التحقق من صحة بيانات العقار
export function validateProperty(property) {
  const errors = {}

  // التحقق من الحقول المطلوبة
  const nameError = validators.required(property.name, 'اسم العقار')
  if (nameError) errors.name = nameError

  const typeError = validators.required(property.type, 'نوع العقار')
  if (typeError) errors.type = typeError

  const ownerError = validators.required(property.owner, 'اسم المالك')
  if (ownerError) errors.owner = ownerError

  // التحقق من رقم الهاتف
  const phoneError = validators.phone(property.phone, 'رقم الهاتف')
  if (phoneError) errors.phone = phoneError

  // التحقق من الأرقام
  const priceError = validators.positiveNumber(property.price, 'السعر')
  if (priceError) errors.price = priceError

  const areaError = validators.positiveNumber(property.area, 'المساحة')
  if (areaError) errors.area = areaError

  const widthError = validators.positiveNumber(property.width, 'العرض')
  if (widthError) errors.width = widthError

  const depthError = validators.positiveNumber(property.depth, 'العمق')
  if (depthError) errors.depth = depthError

  const floorsError = validators.positiveInteger(property.floors, 'عدد الطوابق')
  if (floorsError) errors.floors = floorsError

  const roomsError = validators.positiveInteger(property.rooms, 'عدد الغرف')
  if (roomsError) errors.rooms = roomsError

  const bathroomsError = validators.positiveInteger(property.bathrooms, 'عدد الحمامات')
  if (bathroomsError) errors.bathrooms = bathroomsError

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// التحقق من صحة بيانات تسجيل الدخول
export function validateLogin(credentials) {
  const errors = {}

  const usernameError = validators.required(credentials.username, 'اسم المستخدم')
  if (usernameError) errors.username = usernameError

  const passwordError = validators.required(credentials.password, 'كلمة المرور')
  if (passwordError) errors.password = passwordError

  const passwordLengthError = validators.minLength(credentials.password, 4, 'كلمة المرور')
  if (passwordLengthError) errors.password = passwordLengthError

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// التحقق من صحة بيانات التسجيل
export function validateRegister(userData) {
  const errors = {}

  const usernameError = validators.required(userData.username, 'اسم المستخدم')
  if (usernameError) errors.username = usernameError
  else {
    const usernameLengthError = validators.minLength(userData.username, 3, 'اسم المستخدم')
    if (usernameLengthError) errors.username = usernameLengthError
  }

  const passwordError = validators.required(userData.password, 'كلمة المرور')
  if (passwordError) errors.password = passwordError
  else {
    const passwordLengthError = validators.minLength(userData.password, 6, 'كلمة المرور')
    if (passwordLengthError) errors.password = passwordLengthError
  }

  if (userData.confirmPassword !== userData.password) {
    errors.confirmPassword = 'تأكيد كلمة المرور غير متطابق'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
