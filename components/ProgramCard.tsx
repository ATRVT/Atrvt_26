import React from 'react';
import { ProgramData } from '../types';
import { HELP_OPTIONS, REINFORCER_OPTIONS, REINFORCEMENT_SCHEDULES } from '../constants';
import { ChevronDown, ChevronUp, X, Clock } from 'lucide-react';

interface ProgramCardProps {
  program: ProgramData;
  onUpdate: (id: string, updates: Partial<ProgramData>) => void;
  onRemove: (id: string) => void;
}

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

  const handleMultiSelect = (field: 'selectedHelp' | 'selectedReinforcer', value: string) => {
    const current = program[field];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onUpdate(program.id, { [field]: updated });
  };

  const isIntervalSchedule = ['IF', 'IV'].includes(program.reinforcementSchedule);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 ${program.isCollapsed ? 'opacity-80' : 'opacity-100 ring-4 ring-slate-50 border-slate-300'}`}>

      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 border-b border-slate-100 rounded-t-2xl transition-colors"
        onClick={() => onUpdate(program.id, { isCollapsed: !program.isCollapsed })}
      >
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 w-8 h-8 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100">
            <div className="w-2.5 h-2.5 bg-current rounded-sm transform rotate-45"></div>
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-800">{program.name}</h3>
            {program.isCollapsed && (
              <p className="text-xs text-slate-500">
                {program.correctCount} Aciertos | {program.incorrectCount} Errores
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(program.id); }}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            {program.isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {!program.isCollapsed && (
        <div className="p-5 space-y-8 animate-fadeIn">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OCP</label>
                  <input
                    type="text"
                    value={program.level}
                    onChange={(e) => onUpdate(program.id, { level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                    placeholder="Ej. A1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elementos</label>
                  <input
                    type="text"
                    value={program.elements}
                    onChange={(e) => onUpdate(program.id, { elements: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                    placeholder="Ej. Manzana"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Programa de Ref.</label>
                  <div className="relative">
                    <select
                      value={program.reinforcementSchedule}
                      onChange={(e) => onUpdate(program.id, { reinforcementSchedule: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 cursor-pointer"
                    >
                      <option value="" disabled className="text-slate-400">Seleccionar...</option>
                      {REINFORCEMENT_SCHEDULES.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                </div>

                {isIntervalSchedule && (
                  <div className="space-y-1.5 w-full animate-fadeIn">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      Tiempo <span className="text-slate-300">(seg)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={program.reinforcementScheduleTime}
                        onChange={(e) => onUpdate(program.id, { reinforcementScheduleTime: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800"
                        placeholder="30"
                      />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <CounterInput
                label="Aciertos"
                value={program.correctCount}
                onChange={(val) => onUpdate(program.id, { correctCount: val })}
                colorClass="text-emerald-600"
              />
              <div className="h-12 w-px bg-slate-100 flex-shrink-0"></div>
              <CounterInput
                label="Errores"
                value={program.incorrectCount}
                onChange={(val) => onUpdate(program.id, { incorrectCount: val })}
                colorClass="text-rose-500"
              />
            </div>

          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                Ayudas <span className="text-slate-400 font-normal normal-case">(Múltiple)</span>
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

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notas del Programa</label>
            <textarea
              value={program.notes || ''}
              onChange={(e) => onUpdate(program.id, { notes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 text-slate-800 min-h-[80px]"
              placeholder="Ej. Se distrajo con un juguete, requirió más tiempo..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
