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
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'petra-plugin-wallet-adapter',
            '@firebase/firestore',
            '@firebase/auth',
            '@firebase/storage'
          ]
        }
      }
    }
  },
  server: {
    port: 3000
  }
}); 