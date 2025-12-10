import React, { useState, useMemo } from 'react';
import { ProgramData } from '../types';
import { ProgramCard } from './ProgramCard';
import { Plus, Search, Save, X, Loader2 } from 'lucide-react';

interface ProgramListProps {
  programs: ProgramData[];
  availablePrograms: string[];
  onUpdateProgram: (id: string, updates: Partial<ProgramData>) => void;
  onAddProgram: (name: string) => void;
  onRemoveProgram: (id: string) => void;
  onSaveSession: () => void;
  isSaving: boolean;
  isLoading?: boolean;
}

export const ProgramList: React.FC<ProgramListProps> = ({ 
  programs, 
  availablePrograms,
  onUpdateProgram, 
  onAddProgram, 
  onRemoveProgram,
  onSaveSession,
  isSaving,
  isLoading = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = (name: string) => {
    if (!name.trim()) return;
    onAddProgram(name);
    setSearchTerm('');
    setIsModalOpen(false);
  };

  // Filter available programs based on search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return availablePrograms;
    return availablePrograms.filter(p => 
      p.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availablePrograms, searchTerm]);

  // Check if the exact term exists to toggle "Create New" button
  const exactMatchExists = filteredOptions.some(
    p => p.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <main className="flex-1 p-4 lg:p-10 overflow-y-auto h-screen relative scroll-smooth bg-[#F8F7FF]">
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        
        {/* Header / Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sesión Activa</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                {programs.length} {programs.length === 1 ? 'programa' : 'programas'} en curso
              </p>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all font-semibold flex items-center gap-2 text-sm"
             >
               <Plus size={18} className="text-indigo-500" />
               Agregar Programa
             </button>
          </div>
        </div>

        {/* Cards Stack */}
        <div className="space-y-6">
          {programs.map(program => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              onUpdate={onUpdateProgram}
              onRemove={onRemoveProgram}
            />
          ))}
        </div>

        {/* Finish Session Section (Bottom of list) */}
        {programs.length > 0 && (
          <div className="flex justify-end pt-8 pb-20 lg:pb-0">
             <button 
                onClick={onSaveSession}
                disabled={isSaving}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-8 rounded-xl sm:rounded-full shadow-lg shadow-emerald-600/20 active:transform active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Guardando...' : 'Guardar Sesión'}
              </button>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus size={28} />
      </button>

      {/* Add Program Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          {/* Modal Container */}
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slideUp">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <h3 className="font-bold text-slate-800 text-lg">Seleccionar Programa</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-2">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center text-slate-400 gap-2">
                   <Loader2 className="animate-spin" size={24}/>
                   <span className="text-sm">Cargando catálogo...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Create New Option */}
                  {searchTerm && !exactMatchExists && (
                    <button
                      onClick={() => handleAdd(searchTerm)}
                      className="w-full text-left p-3.5 rounded-xl flex items-center gap-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors mb-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center shrink-0">
                        <Plus size={16} className="text-indigo-700" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold block">Crear "{searchTerm}"</span>
                        <span className="text-xs opacity-80">Agregar como nuevo programa</span>
                      </div>
                    </button>
                  )}

                  {/* Existing Options */}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((prog) => (
                      <button
                        key={prog}
                        onClick={() => handleAdd(prog)}
                        className="w-full text-left p-3.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100 transition-all group"
                      >
                        <span className="font-medium text-sm sm:text-base">{prog}</span>
                        <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-300 group-hover:bg-indigo-50">
                           <Plus size={12} className="text-slate-300 group-hover:text-indigo-500"/>
                        </div>
                      </button>
                    ))
                  ) : (
                    !searchTerm && (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        Escribe para buscar o crear un programa
                      </div>
                    )
                  )}
                  
                  {/* No results message */}
                  {searchTerm && filteredOptions.length === 0 && !isLoading && (
                     <div className="px-4 py-2 text-xs text-slate-400 uppercase font-semibold tracking-wider">
                       Resultados de búsqueda
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
};