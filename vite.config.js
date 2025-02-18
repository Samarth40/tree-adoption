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
          'animation-vendor': ['framer-motion'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
        },
        format: 'es'
      }
    },
    chunkSizeWarningLimit: 2000,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV !== 'production'
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'framer-motion',
      '@stripe/stripe-js',
      '@stripe/react-stripe-js'
    ],
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
    target: 'esnext',
    legalComments: 'none'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});