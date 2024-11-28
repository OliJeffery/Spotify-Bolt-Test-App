import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isAuthenticated()) {
          next({ name: 'albums' });
        } else {
          next();
        }
      }
    },
    {
      path: '/albums',
      name: 'albums',
      component: () => import('@/views/AlbumsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('@/views/CallbackView.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Redirect to albums if authenticated and trying to access home
  if (to.name === 'home' && authStore.isAuthenticated()) {
    next({ name: 'albums' });
    return;
  }
  
  // Redirect to home if not authenticated and trying to access protected route
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next({ name: 'home' });
    return;
  }
  
  next();
});

export default router;