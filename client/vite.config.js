import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sassDts from 'vite-plugin-sass-dts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        sassDts({
            enabledMode: ['development', 'production'],
        }),
        splitVendorChunkPlugin(),
        ViteRestart({
            reload: [
              '../api/src/**/*',
              '../api/config/**/*',
              '../api/templates/**/*',
            ]
          })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@@': path.resolve(__dirname, './'),
            '~': path.resolve(__dirname, './src'),
            '~~': path.resolve(__dirname, './'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // include the style.sccs file in every scss file
                additionalData: `@import "@/assets/style/style.scss";`,
            },
        },
    },
    server: {
        port: 8001,
    },
});
