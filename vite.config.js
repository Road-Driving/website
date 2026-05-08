import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => {
  return {
    plugins: [vue()],

    // 로컬 개발 시
    // npm run dev
    base: command === 'serve'
      ? '/'
      : '/website/',
  }
})