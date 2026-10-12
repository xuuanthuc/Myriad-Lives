import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets keep the static build portable across hosting providers.
  base: './',
  plugins: [react()],
})
