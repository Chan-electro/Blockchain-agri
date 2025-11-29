import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "gsap": path.resolve(__dirname, "./src/lib/gsapStub"),
      "@gsap/react": path.resolve(__dirname, "./src/lib/gsapReactStub"),
    },
  },
})
