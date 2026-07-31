import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages deployment uses base '/<repo>/'; Cloudflare Pages uses '/'
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
});
