import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    port: 4000,
    strictPort: false,
    host: true,
    watch: {
      usePolling: true,
    },

  },
  define: {
    'process.env': {

    API_BASE_URL: process.env.API_BASE_URL ?? 'https://tweetdev-back-c06023c6bfdd.herokuapp.com',
    FRONT_BASE_URL: process.env.FRONT_BASE_URL ?? 'https://tweetdev-front-2be782a7954b.herokuapp.com',
  }
  }
});
