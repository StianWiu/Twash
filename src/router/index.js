import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VideosView from '../views/VideosView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/videos',
    name: 'videos',
    component: VideosView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
