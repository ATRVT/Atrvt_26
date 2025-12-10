import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // Vital para que funcione en subdirectorios de GitHub Pages
    define: {
      // Definimos process.env para que no rompa en el navegador
      'process.env': JSON.stringify({
        API_KEY: env.API_KEY || ''
      }),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});
