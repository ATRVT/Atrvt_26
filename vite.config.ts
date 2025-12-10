import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: './', // Importante para que funcione en subcarpetas de GitHub Pages
    define: {
      // Vital for using process.env.API_KEY in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env to prevent crashes if other env vars are accessed
      'process.env': JSON.stringify({ API_KEY: env.API_KEY }),
    },
    build: {
      outDir: 'dist',
    }
  };
});
