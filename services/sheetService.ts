import { SessionData } from '../types';
import { GOOGLE_SCRIPT_URL, PREDEFINED_PROGRAMS, PREDEFINED_STUDENTS, PREDEFINED_THERAPISTS } from '../constants';

export interface SheetConfigData {
  programs: string[];
  students: string[];
  therapists: string[];
  isFallback?: boolean;
}

export const fetchSheetConfig = async (): Promise<SheetConfigData> => {
  // Default data structure
  const defaults = { 
    programs: PREDEFINED_PROGRAMS, 
    students: PREDEFINED_STUDENTS, 
    therapists: PREDEFINED_THERAPISTS,
    isFallback: true 
  };

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('TU_URL')) {
    console.warn('URL de Google Script no configurada correctamente');
    return defaults;
  }

  try {
    console.log("Intentando conectar con Apps Script...");
    // Simplificamos la URL quitando parámetros extra que podrían confundir a scripts simples
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${Date.now()}`, {
      method: 'GET',
      credentials: 'omit', 
      redirect: 'follow'
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
      console.warn("La respuesta no es JSON. Usando datos de respaldo. Verifica 'Nueva Implementación' en Apps Script.");
      return defaults;
    }

    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
    
    const data = await response.json();
    
    console.log("Datos recibidos de Sheets:", {
      programas: data.programs?.length || 0,
      estudiantes: data.students?.length || 0,
      terapeutas: data.therapists?.length || 0
    });

    // Validamos que al menos uno de los arrays tenga datos reales antes de quitar el fallback
    const hasData = (data.programs?.length > 0) || (data.students?.length > 0) || (data.therapists?.length > 0);

    if (!hasData) {
      console.warn("Se conectó al Script pero las listas llegaron vacías. Verifica los nombres de las pestañas en el Script.");
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

export const saveSessionToSheet = async (sessionData: SessionData): Promise<{ success: boolean; message?: string }> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('TU_URL')) {
    return { success: false, message: 'Falta configurar la URL del Script' };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ session: sessionData }),
      credentials: 'omit',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
        return { 
            success: false, 
            message: 'Error de Permisos: El Script devolvió HTML (Login). Revisa que el acceso sea "Cualquier persona".' 
        };
    }

    if (!response.ok) {
        return { success: false, message: `Error del servidor: ${response.status}` };
    }

    const result = await response.json();
    
    if (result.result === 'success') {
        return { success: true };
    } else {
        return { success: false, message: result.error || 'Error desconocido en el script' };
    }

  } catch (error) {
    console.error('Error saving to sheet:', error);
    return { success: false, message: 'Error de conexión. Revisa tu internet.' };
  }
};