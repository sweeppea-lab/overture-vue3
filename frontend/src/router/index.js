// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/:pathMatch(.*)*', name: 'catchAll', component: () => import('../views/Login.vue') },
    { path: '/login', name: 'Login', component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue'), props: true },
    { path: '/dashboard', name: 'Dashboard', component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/Dashboard.vue'), props: true },
    // { path: '/admin-dashboard', name: 'Admin-Dashboard', component: () => import(/* webpackChunkName: "Admin-Dashboard" */ '../views/AdminDashboard.vue'), props: true },
    { path: '/prospects', name: 'Prospects', component: () => import(/* webpackChunkName: "Prospects" */ '@/views/Prospects.vue'), props: true },
    { path: '/proposals', name: 'Proposals', component: () => import(/* webpackChunkName: "Proposals" */ '@/views/Proposals.vue'), props: true },
    { path: '/library', name: 'Library', component: () => import(/* webpackChunkName: "Library" */ '@/views/Library.vue'), props: true },
    { path: '/forgot', name: 'Forgot', component: () => import(/* webpackChunkName: "Forgot" */ '@/views/Forgot.vue'), props: true },
    { path: '/profile', name: 'Profile', component: () => import(/* webpackChunkName: "Profile" */ '@/views/Profile.vue'), props: true },
    { path: '/settings', name: 'Settings', component: () => import(/* webpackChunkName: "Settings" */ '@/views/Settings.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
