import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1600,
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  },
  server: {
    port: 3000,
    open: true
  }
});