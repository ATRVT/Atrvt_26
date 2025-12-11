import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

// Manejador de errores global para capturar fallos antes de que React monte
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && (root.innerText.includes('Cargando') || root.innerText === '')) {
    // Si sigue cargando y ocurre un error, mostrarlo
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: #ef4444; padding: 20px; font-family: sans-serif; background: #fff; text-align: center;';
    errorDiv.innerHTML = `
      <h3 style="margin-bottom: 8px;">Ocurrió un error al iniciar:</h3>
      <pre style="background: #f1f5f9; padding: 10px; border-radius: 8px; overflow: auto; text-align: left;">${event.message}</pre>
      <p style="margin-top: 10px; font-size: 14px; color: #64748b;">Intenta recargar la página.</p>
    `;
    // No borramos el spinner inmediatamente, lo agregamos abajo
    root.appendChild(errorDiv);
  }
});

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error mounting React app:", error);
  rootElement.innerHTML = `
    <div style="color: #ef4444; padding: 20px; text-align: center; font-family: sans-serif;">
      <h3>Error crítico de renderizado</h3>
      <p>${error instanceof Error ? error.message : String(error)}</p>
    </div>
  `;
}
