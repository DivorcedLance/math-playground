import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  base: '/math-playground/',
  server: {
    hmr: false,
  },
})
