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
            '@aptos-labs/wallet-adapter-react',
            'cloudinary'
          ]
        }
      }
    }
  },
  server: {
    port: 3000
  }
}); 