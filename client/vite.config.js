import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import sassDts from 'vite-plugin-sass-dts'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sassDts({
      enabledMode: ['development', 'production'],
    }),
  ],
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src'),
      '@@': path.resolve(__dirname, './'),
      '~': path.resolve(__dirname, './src'),
      '~~': path.resolve(__dirname, './') 
    },
  },
  server : {
    port: 8001,
  }
})
