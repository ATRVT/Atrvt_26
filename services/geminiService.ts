import { GoogleGenAI } from "@google/genai";
import { SessionData } from "../types";

// Helper to safe-guard against missing API keys in development
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const generateSessionSummary = async (sessionData: SessionData): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Error: API Key no configurada. Por favor configura process.env.API_KEY.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Actúa como un supervisor clínico experto en análisis de conducta aplicado (ABA).
    Analiza los siguientes datos crudos de una sesión de terapia y genera un "Resumen de Sesión" profesional y conciso para la historia clínica.
    
    Datos de la Sesión:
    Terapeuta: ${sessionData.therapistName}
    Estudiante: ${sessionData.studentName}
    Fecha: ${sessionData.date} (Inicio: ${sessionData.startTime})
    
    Programas Trabajados:
    ${sessionData.programs.map(p => `
      - Programa: ${p.name}
        Conjunto/Nivel: ${p.level}
        Elementos: ${p.elements}
        Aciertos: ${p.correctCount}
        Errores: ${p.incorrectCount}
        Total Ensayos: ${p.correctCount + p.incorrectCount}
        Porcentaje Aciertos: ${((p.correctCount / (p.correctCount + p.incorrectCount || 1)) * 100).toFixed(1)}%
        Ayudas: ${p.selectedHelp.join(', ') || 'Ninguna'}
        Reforzadores: ${p.selectedReinforcer.join(', ') || 'Ninguno'}
        Programa de Reforzamiento: ${p.reinforcementSchedule || 'No especificado'}${p.reinforcementScheduleTime ? ` (Intervalo: ${p.reinforcementScheduleTime}s)` : ''}
    `).join('\n')}
    
    Observaciones Crudas del Terapeuta: "${sessionData.generalObservations}"

    Instrucciones de Salida:
    1. Escribe un párrafo narrativo resumiendo el desempeño general.
    2. Destaca qué programas tuvieron mejor desempeño (>80%) y cuáles necesitan atención (<50%).
    3. Sugiere una recomendación breve para la próxima sesión basada en los datos.
    4. Mantén un tono clínico y objetivo.
    5. Respuesta en Español.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error al conectar con el asistente inteligente. Por favor intente más tarde.";
  }
};