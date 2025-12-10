export enum HelpType {
  VERBAL = 'verbal',
  GESTURAL = 'gestual',
  PHYSICAL_TOTAL = 'física total',
  PHYSICAL_PARTIAL = 'física parcial',
  PHYSICAL_SHADOW = 'física sombra',
  NONE = 'ninguna'
}

export enum ReinforcerType {
  EDIBLE = 'comestible',
  SOCIAL = 'social',
  SENSORY = 'sensorial',
  TANGIBLE = 'tangible',
  ACTIVITY = 'actividad',
  ECONOMY = 'economía',
  NONE = 'ninguno'
}

export interface ProgramData {
  id: string;
  name: string;
  // Metrics
  level: string; // Conj/Nivel
  elements: string; // Elementos
  correctCount: number; // UA C
  incorrectCount: number; // UA I
  // Multi-select options
  selectedHelp: string[]; 
  selectedReinforcer: string[];
  // Dropdown
  reinforcementSchedule: string;
  reinforcementScheduleTime: string; // New field for Interval time (seconds)
  
  isCollapsed: boolean;
  notes: string;
}

export interface SessionData {
  studentName: string;
  therapistName: string;
  date: string;
  startTime: string; // Auto-generated
  endTime: string;   // Auto-generated
  generalObservations: string;
  programs: ProgramData[];
}