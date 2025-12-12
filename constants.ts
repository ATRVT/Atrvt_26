import { HelpType, ReinforcerType } from './types';

// ¡IMPORTANTE! Reemplaza esto con la URL NUEVA que obtengas al hacer "Nueva Implementación"
// Asegúrate de que el acceso sea "Cualquier persona" (Anyone)
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxuRanzdOQ2NVkbfMHz0q2En00gG-_oYnHWeak3omCgFuuSntJXN6191zNjKkShdLBWQ/exec';

export const HELP_OPTIONS = [
  { label: 'verbal', value: HelpType.VERBAL },
  { label: 'gestual', value: HelpType.GESTURAL },
  { label: 'física total', value: HelpType.PHYSICAL_TOTAL },
  { label: 'física parcial', value: HelpType.PHYSICAL_PARTIAL },
  { label: 'física sombra', value: HelpType.PHYSICAL_SHADOW },
  { label: 'ninguna', value: HelpType.NONE },
];

export const REINFORCER_OPTIONS = [
  { label: 'comestible', value: ReinforcerType.EDIBLE },
  { label: 'social', value: ReinforcerType.SOCIAL },
  { label: 'sensorial', value: ReinforcerType.SENSORY },
  { label: 'tangible', value: ReinforcerType.TANGIBLE },
  { label: 'actividad', value: ReinforcerType.ACTIVITY },
  { label: 'economía', value: ReinforcerType.ECONOMY },
  { label: 'ninguno', value: ReinforcerType.NONE },
];

export const REINFORCEMENT_SCHEDULES = [
  "RF", // Razón Fija
  "RV", // Razón Variable
  "IF", // Intervalo Fijo
  "IV"  // Intervalo Variable
];

// Fallback inicial por si falla la carga
export const PREDEFINED_PROGRAMS = [
  "Identificación de Colores",
  "Seguimiento de Instrucciones",
  "Imitación Motora",
  "Emparejamiento",
  "Tacto (Nombrar)",
  "Intraverbales",
  "Ecoicas"
];

export const PREDEFINED_STUDENTS = [
  "Estudiante Prueba",
  "Alessandra G"
];

export const PREDEFINED_THERAPISTS = [
  "Terapeuta Prueba",
  "Celeste M"
];
