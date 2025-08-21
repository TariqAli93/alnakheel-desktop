import { createRouter, createWebHistory } from 'vue-router'

import AddProperty from '../pages/AddProperty.vue'
import PropertyList from '../pages/PropertyList.vue'
import HomePage from '../pages/HomePage.vue'
import UpdateProperty from '../pages/updateProperty.vue'
import PropertyDetails from '../pages/PropertyDetails.vue'
import Login from '../pages/Login.vue'
import Users from '../pages/Users.vue'
import { useLoginState } from '../stores/login'

const routes = [
  {
    path: '/add-property',
    name: 'AddProperty',
    component: AddProperty,
    meta: { requiresAuth: true, title: 'إضافة عقار' }
  },
  {
    path: '/properties',
    name: 'PropertyList',
    component: PropertyList,
    meta: { requiresAuth: true, title: 'قائمة العقارات' }
  },
  {
    path: '/update-property/:id',
    name: 'UpdateProperty',
    component: UpdateProperty,
    meta: { requiresAuth: true, title: 'تعديل عقار' }
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true, title: 'الصفحة الرئيسية' }
  },
  {
    path: '/property-details/:id',
    name: 'PropertyDetails',
    component: PropertyDetails,
    meta: { title: 'تفاصيل العقار' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'تسجيل الدخول' }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, title: 'المستخدمين' }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../pages/webMessages.vue'),
    meta: { requiresAuth: true, title: 'الرسائل' }
  },
  {
    path: '/contracts',
    name: 'Contracts',
    component: () => import('../pages/Contract.vue'),
    meta: { requiresAuth: true, title: 'العقود' }
  },
  {
    path: '/print-contract',
    name: 'PrintContract',
    component: () => import('../components/PrintContract.vue'),
    meta: { requiresAuth: true, title: 'طباعة العقد' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// حارس المسار المحسن
router.beforeEach((to, from, next) => {
  const loginStore = useLoginState()

  // تعيين عنوان الصفحة
  if (to.meta.title) {
    document.title = `نظام إدارة العقارات - ${to.meta.title}`
  } else {
    document.title = 'نظام إدارة العقارات'
  }

  // التحقق من المسارات التي تحتاج تصريح
  if (to.meta.requiresAuth) {
    // التحقق من تسجيل الدخول وصحة الـ token
    if (!loginStore.isLoggedIn || !loginStore.checkTokenValidity()) {
      console.log('🔐 إعادة توجيه إلى صفحة تسجيل الدخول')
      next({
        name: 'Login',
        query: { redirect: to.fullPath } // حفظ المسار للعودة إليه بعد تسجيل الدخول
      })
      return
    }
  }

  // إذا كان المستخدم مسجل دخوله ويحاول الوصول لصفحة تسجيل الدخول
  if (to.name === 'Login' && loginStore.isLoggedIn && loginStore.checkTokenValidity()) {
    // إعادة توجيه إلى الصفحة المطلوبة أو الصفحة الرئيسية
    const redirectPath = to.query.redirect || '/'
    next(redirectPath)
    return
  }

  next()
})

export default router
