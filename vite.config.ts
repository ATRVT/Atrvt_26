import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // ESTA LÍNEA DEBE ESTAR ASÍ:
    base: '/Atrvt_26/',
    
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        // Esto mantiene la configuración de tu API Key
        API_KEY: JSON.stringify(env.API_KEY || '') 
      }
    },
    // ... cualquier otra configuración que tuvieras
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
