import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Challenges from '../views/Challenges.vue'
import Leaderboard from '../views/Leaderboard.vue'
import Forest from '../views/Forest.vue'
import Community from '../views/Community.vue'
import EcoEdu from '../views/EcoEdu.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Beranda - EcoQuest' }
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: Challenges,
    meta: { title: 'Tantangan Hijau - EcoQuest' }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
    meta: { title: 'Papan Skor - EcoQuest' }
  },
  {
    path: '/forest',
    name: 'Forest',
    component: Forest,
    meta: { title: 'Hutan Virtual - EcoQuest' }
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
    meta: { title: 'Komunitas - EcoQuest' }
  },
  {
    path: '/ecoedu',
    name: 'EcoEdu',
    component: EcoEdu,
    meta: { title: 'EcoEdu - EcoQuest' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Profil - EcoQuest' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'EcoQuest'
  next()
})

export default router
