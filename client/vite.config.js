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
      '~~': path.resolve(__dirname, './'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@views': path.resolve(__dirname, './src/views'),
      '@components': path.resolve(__dirname, './src/components')
    },
  },
  server : {
    port: 8001,
  }
})
