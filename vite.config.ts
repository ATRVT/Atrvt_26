import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // CRUCIAL para GitHub Pages:
    // Esta es la ruta de tu repositorio
    base: '/Atrvt_26/',
    
    define: {
      // Definición segura para evitar errores de librerías que busquen process.env
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        API_KEY: JSON.stringify(env.API_KEY || '')
      }
    },
    // Si tienes más configuración debajo (como 'build'), déjala tal cual.
  };
});
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  };
});
