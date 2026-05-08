import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/HomeView.vue'
import Story from '../views/Story.vue'
import Bus from '../views/Bus.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/story',
    name: 'Story',
    component: Story,
  },
  {
    path: '/bus',
    name: 'Bus',
    component: Bus,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router