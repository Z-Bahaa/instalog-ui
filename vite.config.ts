import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import analyzer from 'vite-plugin-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // analyzer({
    //   summaryOnly: true,
    // }),
  ],
})
