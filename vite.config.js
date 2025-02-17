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
    minify: 'esbuild',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  esbuild: {
    target: 'esnext'
  }
});