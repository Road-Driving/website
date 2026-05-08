import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Log from '../views/Log.vue'
import Vehicles from '../views/Vehicles.vue'
import Schedule from '../views/Schedule.vue'
import Story from '../views/Story.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/log', name: 'Log', component: Log },
  { path: '/vehicles', name: 'Vehicles', component: Vehicles },
  { path: '/schedule', name: 'Schedule', component: Schedule },
  { path: '/story', name: 'Story', component: Story },
  { path: '/about', name: 'About', component: About },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router