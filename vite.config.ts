import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Serve files from the existing /images folder as static root
  // so cover.png (etc) is reachable at /cover.png
  publicDir: 'images',
  server: { port: 5173, open: true }
});
