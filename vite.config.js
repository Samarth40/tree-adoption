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
        },
        format: 'es'
      },
      external: [
        '@rollup/rollup-linux-x64-gnu'
      ]
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
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/health': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  esbuild: {
    target: 'esnext'
  }
});