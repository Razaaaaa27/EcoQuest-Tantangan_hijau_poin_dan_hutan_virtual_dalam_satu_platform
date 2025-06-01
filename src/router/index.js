import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; // Assuming you have a Vuex store
import { requireAuth, requireGuest } from './guards';

// Komponen views
import Home from '../views/Home.vue';
import Challenges from '../views/Challenges.vue';
import Leaderboard from '../views/Leaderboard.vue';
import Forest from '../views/Forest.vue';
import Community from '../views/Community.vue';
import EcoEdu from '../views/EcoEdu.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Admin from '../views/Admin.vue';
import ForgotPassword from '@/views/ForgotPassword.vue'



// Definisikan guard requireAdmin
const requireAdmin = (to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const isAdmin = store.getters['user/isAdmin']; // Sesuaikan dengan struktur store Anda
  if (isAuthenticated && isAdmin) {
    next();
  } else {
    store.dispatch('addNotification', {
      type: 'error',
      message: 'Akses ditolak: Hanya admin yang dapat mengakses halaman ini',
      timeout: 3000,
    });
    next('/');
  }
};

// Definisikan rute
const routes = [
  // Add new route
  {
    path: '/my-submissions',
    name: 'MySubmissions',
    component: () => import('../views/MySubmissions.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'My Submissions - EcoQuest', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: requireGuest,
    meta: { title: 'Login - EcoQuest' },
  },
   {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    beforeEnter: requireGuest,
    meta: { title: 'Register - EcoQuest' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    beforeEnter: requireAdmin,
    meta: { title: 'Admin Dashboard - EcoQuest', requiresAuth: true },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Beranda - EcoQuest', requiresAuth: true },
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: Challenges,
    meta: { title: 'Tantangan Hijau - EcoQuest', requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
    meta: { title: 'Papan Skor - EcoQuest', requiresAuth: true },
  },
  {
    path: '/forest',
    name: 'Forest',
    component: Forest,
    meta: { title: 'Hutan Virtual - EcoQuest', requiresAuth: true },
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
    meta: { title: 'Komunitas - EcoQuest', requiresAuth: true },
  },
  {
    path: '/ecoedu',
    name: 'EcoEdu',
    component: EcoEdu,
    meta: { title: 'EcoEdu - EcoQuest' }, // EcoEdu tetap aksesibel untuk guest
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Profil - EcoQuest', requiresAuth: true },
  },
];

// Inisialisasi router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'];

  // Set document title
  document.title = to.meta.title || 'EcoQuest';

  // Jika pengguna belum autentikasi, arahkan ke login kecuali untuk /login, /register, atau /ecoedu
  if (!isAuthenticated && to.path !== '/login' && to.path !== '/register' && to.path !== '/ecoedu') {
    store.dispatch('addNotification', {
      type: 'info',
      message: 'Silakan login untuk mengakses fitur ini',
      timeout: 3000,
    });
    next('/login');
  } 
  // Jika pengguna autentikasi dan mencoba akses halaman yang memerlukan autentikasi
  else if (isAuthenticated && to.meta.requiresAuth && !store.getters['user/isAdmin'] && to.path === '/admin') {
    next('/'); // Arahkan user biasa ke Home jika mencoba akses admin
  }
  // Jika admin, pastikan hanya ke /admin jika memang dituju
  else if (isAuthenticated && store.getters['user/isAdmin'] && to.path === '/' && from.path !== '/admin') {
    next('/admin'); // Arahkan admin ke dashboard saat pertama kali masuk
  }
  else {
    next();
  }
});

export default router;