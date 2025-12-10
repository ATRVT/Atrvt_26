import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // CRUCIAL: Permite que la app funcione en subcarpetas (GitHub Pages)
    define: {
      // Definimos un objeto process.env global seguro
      'process.env': JSON.stringify({
        API_KEY: env.API_KEY || '',
        NODE_ENV: mode
      }),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Aseguramos que no queden referencias colgantes
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  };
});
