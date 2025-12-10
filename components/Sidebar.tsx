import React from 'react';
import { SessionData } from '../types';
import { User, Calendar, FileText, Clock, ChevronDown, Loader2, WifiOff } from 'lucide-react';

interface SidebarProps {
  data: SessionData;
  onUpdate: (field: keyof SessionData, value: string) => void;
  studentOptions: string[];
  therapistOptions: string[];
  isLoading?: boolean;
  isOfflineMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  data, 
  onUpdate,
  studentOptions,
  therapistOptions,
  isLoading = false,
  isOfflineMode = false
}) => {

  const InputField = ({ 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    type = "text", 
    placeholder,
    extra,
    options = []
  }: any) => {
    // Show select if we have options OR if we are waiting for data
    const showSelect = options.length > 0 || isLoading;

    return (
      <div className="group">
        <label className="text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-2 uppercase tracking-wide group-focus-within:text-indigo-500 transition-colors">
          <Icon size={12} /> {label} {extra}
        </label>
        
        <div className="relative">
          {showSelect ? (
            <div className="relative">
              <select
                value={value}
                onChange={onChange}
                disabled={isLoading}
                className={`w-full bg-slate-50 border border-slate-200 focus:border-indigo-500/50 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm appearance-none cursor-pointer ${isLoading ? 'text-slate-500 cursor-wait' : 'hover:bg-slate-100'}`}
              >
                <option value="" disabled>{isLoading ? "Cargando opciones..." : placeholder}</option>
                {options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {isLoading ? (
                 <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 animate-spin" size={14} />
              ) : (
                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              )}
            </div>
          ) : (
            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-indigo-500/50 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-white lg:h-screen lg:sticky lg:top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 border-r border-slate-100">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-600/20">
              AT
            </div>
            <span className="text-slate-700">Registros</span>
          </div>
          {isOfflineMode && (
            <div title="Sin conexión con Sheets. Usando datos de respaldo." className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-100 text-[10px] font-bold uppercase tracking-wide cursor-help">
              <WifiOff size={12} />
              <span>Offline</span>
            </div>
          )}
        </h1>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        
        {/* Context Group */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contexto</span>
          </div>
          
          <InputField 
            icon={User} 
            label="Estudiante" 
            value={data.studentName} 
            onChange={(e: any) => onUpdate('studentName', e.target.value)}
            placeholder="Seleccionar alumno..."
            options={studentOptions}
          />

          <InputField 
            icon={User} 
            label="Terapeuta" 
            value={data.therapistName} 
            onChange={(e: any) => onUpdate('therapistName', e.target.value)}
            placeholder="Seleccionar terapeuta..."
            options={therapistOptions}
          />

          <InputField 
            icon={Calendar} 
            label="Fecha" 
            type="date"
            value={data.date} 
            onChange={(e: any) => onUpdate('date', e.target.value)}
            extra={
              <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md font-medium">
                <Clock size={10} /> {data.startTime}
              </span>
            }
          />
        </div>
      </div>

      {/* Observations Sticky Footer */}
      <div className="p-5 bg-white border-t border-slate-100 space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-1">
             <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
              <FileText size={12} /> Notas / Resumen
            </label>
        </div>
       
        <textarea
          value={data.generalObservations}
          onChange={(e) => onUpdate('generalObservations', e.target.value)}
          placeholder="Escribe notas rápidas aquí..."
          className="w-full h-32 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-indigo-500/50 rounded-lg px-3 py-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder-slate-400 shadow-inner"
        />
      </div>
    </aside>
  );
};