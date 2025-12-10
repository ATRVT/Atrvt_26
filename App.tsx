import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProgramList } from './components/ProgramList';
import { SessionData, ProgramData } from './types';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { fetchSheetConfig, saveSessionToSheet, SheetConfigData } from './services/sheetService';

// Helper to get local date string YYYY-MM-DD
// This fixes the issue where evening sessions showed the next day's date due to UTC conversion
const getLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const App: React.FC = () => {
  // Initial State Setup
  const [sessionData, setSessionData] = useState<SessionData>({
    studentName: '',
    therapistName: '',
    date: getLocalDate(), // Changed from toISOString() to fix timezone offset
    startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    endTime: '',
    generalObservations: '',
    programs: []
  });

  const [config, setConfig] = useState<SheetConfigData>({ programs: [], students: [], therapists: [] });
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load config from Sheets on mount
  useEffect(() => {
    const loadConfig = async () => {
      setIsConfigLoading(true);
      const data = await fetchSheetConfig();
      setConfig(data);
      setIsConfigLoading(false);
    };
    loadConfig();
  }, []);

  // Handlers
  const handleUpdateSession = (field: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProgram = (name: string) => {
    const newProgram: ProgramData = {
      id: crypto.randomUUID(),
      name,
      level: '',
      elements: '',
      correctCount: 0,
      incorrectCount: 0,
      selectedHelp: [],
      selectedReinforcer: [],
      reinforcementSchedule: '',
      reinforcementScheduleTime: '',
      isCollapsed: false,
      notes: ''
    };
    setSessionData(prev => ({
      ...prev,
      // Add to END of list so they appear and save in chronological creation order
      programs: [...prev.programs, newProgram] 
    }));
  };

  const handleUpdateProgram = (id: string, updates: Partial<ProgramData>) => {
    setSessionData(prev => ({
      ...prev,
      programs: prev.programs.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const handleRemoveProgram = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este programa? Se perderán los datos contados.')) {
      setSessionData(prev => ({
        ...prev,
        programs: prev.programs.filter(p => p.id !== id)
      }));
    }
  };

  const handleSaveSession = async () => {
    // Basic Validation
    if (!sessionData.studentName || !sessionData.therapistName) {
      alert("Por favor selecciona un estudiante y un terapeuta.");
      return;
    }

    if (sessionData.programs.length === 0) {
      alert("Debes agregar al menos un programa para guardar.");
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);
    setErrorMessage('');

    const endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const finalData = { ...sessionData, endTime };
    
    // Send to Sheet
    const result = await saveSessionToSheet(finalData);
    
    setIsSaving(false);
    
    if (result.success) {
      setSaveStatus('success');
      
      // REVERTIDO: Limpiamos la lista de programas al guardar, como era originalmente.
      setSessionData(prev => ({
        ...prev,
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: '',
        generalObservations: '',
        programs: [] 
      }));

      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus('error');
      setErrorMessage(result.message || 'Error desconocido');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8F7FF] text-slate-900 font-sans overflow-hidden selection:bg-indigo-100">
      
      <Sidebar 
        data={sessionData} 
        onUpdate={handleUpdateSession} 
        studentOptions={config.students}
        therapistOptions={config.therapists}
        isLoading={isConfigLoading}
        isOfflineMode={config.isFallback}
      />

      <ProgramList 
        programs={sessionData.programs}
        availablePrograms={config.programs}
        onAddProgram={handleAddProgram}
        onUpdateProgram={handleUpdateProgram}
        onRemoveProgram={handleRemoveProgram}
        onSaveSession={handleSaveSession}
        isSaving={isSaving}
        isLoading={isConfigLoading}
      />

      {/* Toast Notification Success */}
      {saveStatus === 'success' && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce z-50">
          <CheckCircle size={24} />
          <div>
            <h4 className="font-bold">¡Sesión Guardada!</h4>
            <p className="text-sm opacity-90">Listo para el siguiente registro.</p>
          </div>
        </div>
      )}

      {/* Toast Notification Error */}
      {saveStatus === 'error' && (
        <div className="fixed bottom-6 right-6 bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-start gap-3 animate-fadeIn z-50 max-w-sm">
          <AlertCircle size={24} className="mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Error al Guardar</h4>
            <p className="text-sm opacity-90 leading-tight mt-1">{errorMessage}</p>
          </div>
          <button onClick={() => setSaveStatus(null)} className="ml-2 text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>
      )}

    </div>
  );
};

export default App;