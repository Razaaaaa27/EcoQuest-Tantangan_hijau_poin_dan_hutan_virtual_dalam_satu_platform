// import store from '@/store';

// export const requireAuth = (to, from, next) => {
//   if (store.getters['user/isAuthenticated']) {
//     next();
//   } else {
//     next('/login');
//   }
// };

// export const requireGuest = (to, from, next) => {
//   if (!store.getters['user/isAuthenticated']) {
//     next();
//   } else {
//     next('/');
//   }
// };

// export const requireAdmin = (to, from, next) => {
//   const user = store.getters['user/getCurrentUser'];
//   if (user && user.role === 'admin') {
//     next();
//   } else {
//     next('/');
//   }
// };

// File: router/guards.js

import store from '../store';

export const requireAuth = (to, from, next) => {
  // Cek token di localStorage terlebih dahulu
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('No token found, redirecting to login');
    store.dispatch('addNotification', {
      type: 'info',
      message: 'Silakan login untuk mengakses fitur ini',
      timeout: 3000
    });
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Cek status autentikasi di store
  const isAuthenticated = store.getters['user/isAuthenticated'];
  
  if (isAuthenticated) {
    next();
  } else {
    // Jika ada token tapi store belum terinisialisasi, coba inisialisasi ulang
    store.dispatch('user/initializeAuth').then(() => {
      const isAuthenticatedAfterInit = store.getters['user/isAuthenticated'];
      if (isAuthenticatedAfterInit) {
        next();
      } else {
        // Token invalid, hapus dan redirect ke login
        localStorage.removeItem('token');
        store.dispatch('addNotification', {
          type: 'warning',
          message: 'Session expired. Silakan login kembali.',
          timeout: 3000
        });
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      }
    }).catch(() => {
      // Error saat inisialisasi, redirect ke login
      localStorage.removeItem('token');
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    });
  }
};

export const requireGuest = (to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const token = localStorage.getItem('token');
  
  if (isAuthenticated || token) {
    // User sudah login, redirect ke home atau halaman yang sesuai
    const userRole = store.getters['user/userRole'];
    if (userRole === 'admin') {
      next('/admin');
    } else {
      next('/');
    }
  } else {
    next();
  }
};

export const requireAdmin = (to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const isAdmin = store.getters['user/isAdmin'];
  const token = localStorage.getItem('token');
  
  if (!token) {
    store.dispatch('addNotification', {
      type: 'error',
      message: 'Silakan login terlebih dahulu',
      timeout: 3000
    });
    next('/login');
    return;
  }
  
  if (isAuthenticated && isAdmin) {
    next();
  } else {
    store.dispatch('addNotification', {
      type: 'error',
      message: 'Akses ditolak: Hanya admin yang dapat mengakses halaman ini',
      timeout: 3000
    });
    next('/');
  }
};