import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // 1. Configuración de GitHub Pages (la ruta correcta)
    base: '/', 
    
    define: {
      // Definición segura para evitar errores de librerías que busquen process.env
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        API_KEY: JSON.stringify(env.API_KEY || '')
      }
    },
    
    // 2. Si quieres especificar la carpeta de salida (opcional, por defecto es 'dist')
    build: {
      outDir: 'dist',
    }
  };
});
