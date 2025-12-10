import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // Vital para GitHub Pages
    define: {
      // Inyección segura de la API KEY. Si no existe, usamos una cadena vacía para que no rompa el build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill simple para process.env
      'process.env': JSON.stringify({ API_KEY: env.API_KEY || '' }),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});
