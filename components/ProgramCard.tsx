import React from 'react';
import { ProgramData } from '../types';
import { HELP_OPTIONS, REINFORCER_OPTIONS, REINFORCEMENT_SCHEDULES } from '../constants';
import { ChevronDown, ChevronUp, X, Clock } from 'lucide-react';

interface ProgramCardProps {
  program: ProgramData;
  onUpdate: (id: string, updates: Partial<ProgramData>) => void;
  onRemove: (id: string) => void;
}

// Sub-componente extraído para evitar re-renderizados que causan pérdida de foco
const CounterInput = ({ 
  label, 
  value, 
  onChange, 
  colorClass 
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void, 
  colorClass: string 
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">{label}</label>
    <div className="relative">
      <input
        type="number"
        inputMode="numeric" // <<-- MODIFICADO: Teclado numérico
        pattern="[0-9]*"    // <<-- MODIFICADO: Fuerza la entrada de números
        min="0"
        value={value === 0 ? '' : value} 
        placeholder="0"
        onChange={(e) => {
          const valStr = e.target.value;
          const val = valStr === '' ? 0 : parseInt(valStr, 10);
          if (!isNaN(val)) {
            onChange(val);
          }
        }}
        onFocus={(e) => e.target.select()}
        className={`
          w-full h-14 text-2xl font-bold text-center rounded-xl border-2 transition-all outline-none focus:ring-4
          ${colorClass}
          border-slate-100 bg-slate-50 focus:bg-white focus:border-transparent focus:ring-indigo-500/10
          placeholder-slate-300
        `}
      />
    </div>
  </div>
);


export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onUpdate, onRemove }) => {
  const handleToggleCollapse = () => {
    onUpdate(program.id, { isCollapsed: !program.isCollapsed });
  };

  const handleMultiSelect = (field: 'selectedHelp' | 'selectedReinforcer', value: string) => {
    const currentArray = program[field];
    if (currentArray.includes(value)) {
      onUpdate(program.id, { [field]: currentArray.filter((v) => v !== value) });
    } else {
      onUpdate(program.id, { [field]: [...currentArray, value] });
    }
  };

  // Calcula el porcentaje de acierto
  const totalEnsayos = program.correctCount + program.incorrectCount;
  const porcentaje = totalEnsayos > 0 ? (program.correctCount / totalEnsayos) * 100 : 0;
  
  let resultColorClass = 'text-slate-500'; // Gris por defecto
  let resultBgClass = 'bg-slate-100';
  if (totalEnsayos > 0) {
    if (porcentaje >= 80) {
      resultColorClass = 'text-emerald-700';
      resultBgClass = 'bg-emerald-100';
    } else if (porcentaje >= 50) {
      resultColorClass = 'text-amber-700';
      resultBgClass = 'bg-amber-100';
    } else {
      resultColorClass = 'text-rose-700';
      resultBgClass = 'bg-rose-100';
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-100 transition-all ${!program.isCollapsed ? 'ring-2 ring-indigo-500/10' : ''}`}>
      {/* HEADER (Visible siempre) */}
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-50 rounded-t-xl"
        onClick={handleToggleCollapse}
      >
        {/* Name and Totals */}
        <div className="flex items-center gap-3 w-full pr-4">
          <div className="flex-shrink-0">
             <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${resultColorClass} ${resultBgClass}`}>
                {totalEnsayos > 0 ? `${Math.round(porcentaje)}%` : '—'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 truncate flex-grow">
            {program.name}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(program.id); }}
            className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
            title="Eliminar programa"
          >
            <X size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggleCollapse(); }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
            title={program.isCollapsed ? 'Expandir' : 'Colapsar'}
          >
            {program.isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* BODY (Colapsable) */}
      {!program.isCollapsed && (
        <div className="p-5 pt-3 border-t border-slate-100 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Counter Inputs (Aciertos / Errores) */}
              <div className="flex gap-4">
                <CounterInput 
                  label="Aciertos (UA C)"
                  value={program.correctCount}
                  onChange={(val) => onUpdate(program.id, { correctCount: val })}
                  colorClass="focus:ring-emerald-500/10"
                />
                <CounterInput 
                  label="Errores (UA I)"
                  value={program.incorrectCount}
                  onChange={(val) => onUpdate(program.id, { incorrectCount: val })}
                  colorClass="focus:ring-rose-500/10"
                />
              </div>

              {/* Reinforcement Schedule */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Programa Ref.</label>
                <div className="flex gap-2">
                  <select
                    value={program.reinforcementSchedule}
                    onChange={(e) => onUpdate(program.id, { reinforcementSchedule: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                  >
                    <option value="">Selecciona</option>
                    {REINFORCEMENT_SCHEDULES.map(schedule => (
                      <option key={schedule} value={schedule}>{schedule}</option>
                    ))}
                  </select>
                  
                  {/* Interval Time Input (Solo para IF/IV) */}
                  {(program.reinforcementSchedule === 'IF' || program.reinforcementSchedule === 'IV') && (
                    <div className="relative w-28">
                      <input 
                        type="number" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={program.reinforcementScheduleTime}
                        onChange={(e) => onUpdate(program.id, { reinforcementScheduleTime: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                        placeholder="Tiempo"
                      />
                      <Clock size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400"/>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notas del Programa</label>
                <textarea
                  value={program.notes}
                  onChange={(e) => onUpdate(program.id, { notes: e.target.value })}
                  placeholder="Observaciones específicas del programa..."
                  className="w-full h-16 bg-slate-50 border border-slate-200 focus:border-indigo-500/50 rounded-lg px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-4">

              {/* Left: Text Inputs - MODIFICADO A NUMÉRICO */}
              <div className="lg:col-span-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conj/Nivel</label>
                    <input 
                      type="number" // <<-- MODIFICADO: Solo números
                      inputMode="numeric" // <<-- MODIFICADO: Teclado numérico
                      pattern="[0-9]*"    // <<-- MODIFICADO: Fuerza la entrada de números
                      value={program.level}
                      onChange={(e) => onUpdate(program.id, { level: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                      placeholder="Ej. 1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elementos</label>
                    <input 
                      type="number" // <<-- MODIFICADO: Solo números
                      inputMode="numeric" // <<-- MODIFICADO: Teclado numérico
                      pattern="[0-9]*"    // <<-- MODIFICADO: Fuerza la entrada de números
                      value={program.elements}
                      onChange={(e) => onUpdate(program.id, { elements: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                      placeholder="Ej. 5"
                    />
                  </div>
                </div>
              </div>

              {/* Help Type */}
              <div className="space-y-3 pt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Tipo de Ayuda <span className="text-slate-400 font-normal normal-case">(Múltiple)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {HELP_OPTIONS.map((option) => {
                    const isSelected = program.selectedHelp.includes(option.value);
                    return (
                      <button 
                        key={option.value} 
                        onClick={() => handleMultiSelect('selectedHelp', option.value)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                          ${isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reinforcer Type */}
               <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Reforzadores <span className="text-slate-400 font-normal normal-case">(Múltiple)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {REINFORCER_OPTIONS.map((option) => {
                    const isSelected = program.selectedReinforcer.includes(option.value);
                    return (
                      <button 
                        key={option.value} 
                        onClick={() => handleMultiSelect('selectedReinforcer', option.value)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                          ${isSelected 
                            ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};
