import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Serve files from the existing /images folder as static root
  // so cover.png (etc) is reachable at /cover.png
  publicDir: 'images',
  server: { port: 5173, open: true },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          lenis: ['lenis']
        }
      }
    }
  }
});
