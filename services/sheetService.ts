import { SessionData } from '../types';
import { GOOGLE_SCRIPT_URL, PREDEFINED_PROGRAMS, PREDEFINED_STUDENTS, PREDEFINED_THERAPISTS } from '../constants';

export interface SheetConfigData {
  programs: string[];
  students: string[];
  therapists: string[];
  isFallback?: boolean;
}

// ----------------------------------------------------------------------
// FUNCIÓN 1: OBTENER DATOS (Configuración)
// ----------------------------------------------------------------------
export const fetchSheetConfig = async (): Promise<SheetConfigData> => {
  // Datos por defecto (Respaldo)
  const defaults = { 
    programs: PREDEFINED_PROGRAMS, 
    students: PREDEFINED_STUDENTS, 
    therapists: PREDEFINED_THERAPISTS,
    isFallback: true 
  };

  // Verificación de URL
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('TU_URL')) {
    console.warn('URL de Google Script no configurada correctamente');
    return defaults;
  }

  try {
    console.log("Intentando conectar con Apps Script...");
    
    // Hacemos la petición GET
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${Date.now()}`, {
      method: 'GET',
      credentials: 'omit', 
      redirect: 'follow'
    });
    
    // Verificamos que sea JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
      console.warn("La respuesta no es JSON. Usando datos de respaldo.");
      return defaults;
    }

    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
    
    const data = await response.json();
    
    // Validamos si llegaron datos reales
    const hasData = (data.programs?.length > 0) || (data.students?.length > 0) || (data.therapists?.length > 0);

    if (!hasData) {
      console.warn("Se conectó al Script pero las listas llegaron vacías.");
    }

    return {
      programs: data.programs || [],
      students: data.students || [],
      therapists: data.therapists || [],
      isFallback: false
    };

  } catch (error) {
    console.error('Error obteniendo configuración (usando respaldo offline):', error);
    return defaults;
  }
};

// ----------------------------------------------------------------------
// FUNCIÓN 2: GUARDAR SESIÓN (Corregida para tu Script)
// ----------------------------------------------------------------------
export const saveSessionToSheet = async (sessionData: SessionData): Promise<{ success: boolean; message?: string }> => {
  
  // 1. Verificación básica de URL
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('TU_URL')) {
    return { success: false, message: 'Falta configurar la URL del Script' };
  }

  try {
    // 2. PREPARAR EL PAQUETE DE DATOS
    // Tu script Code.gs espera "requestType" y "payload".
    // Esto es crucial para que funcione el guardado.
    const dataToSend = {
      requestType: 'SAVE_SESSION', 
      payload: sessionData
    };

    // 3. ENVIAR AL SERVIDOR (Apps Script)
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      credentials: 'omit',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
    });

    // 4. VERIFICAR ERRORES DE PERMISOS (HTML)
    // A veces Google devuelve una página de login si los permisos están mal
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
        return { 
            success: false, 
            message: 'Error de Permisos: El Script devolvió HTML. Asegúrate de desplegar como "Cualquier persona" (Anyone).' 
        };
    }

    // 5. VERIFICAR ERRORES DE RED
    if (!response.ok) {
        return { success: false, message: `Error del servidor: ${response.status}` };
    }

    // 6. PROCESAR RESPUESTA DEL SCRIPT
    const result = await response.json();
    
    // Tu script devuelve { "success": true }
    if (result.success === true) {
        return { success: true };
    } else {
        return { success: false, message: result.message || 'Error desconocido en el script' };
    }

  } catch (error) {
    console.error('Error saving to sheet:', error);
    return { success: false, message: 'Error de conexión. Revisa tu internet.' };
  }
};
