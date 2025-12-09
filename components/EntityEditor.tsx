
import React, { useState } from 'react';
import { PoliticalEntity, EntityPeriod, CharacterRole, HistoricalGroup, EntityContextRole, EntityVassalage } from '../types';
import { X, Plus, Trash2, Save, Flag, Layers, Palette, FolderTree, Anchor } from 'lucide-react';

interface EntityEditorProps {
  entity: PoliticalEntity;
  allEntities: PoliticalEntity[];
  groups: HistoricalGroup[];
  onSave: (updatedEntity: PoliticalEntity) => void;
  onCancel: () => void;
}

// Helpers for Color Conversion
const rgbaToHex = (rgba: string) => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return "#000000";
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

const getAlpha = (rgba: string) => {
   const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
   if (!match || !match[4]) return 1;
   return parseFloat(match[4]);
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const EntityEditor: React.FC<EntityEditorProps> = ({
  entity,
  allEntities,
  groups,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<PoliticalEntity>({ ...entity });

  const handleChange = (field: keyof PoliticalEntity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- PERIODS MANAGEMENT ---

  const addPeriod = () => {
    const newPeriod: EntityPeriod = {
        id: `ep_${Date.now()}`,
        startYear: 500,
        endYear: 600,
        color: 'rgba(100, 100, 100, 0.5)',
        contexts: [],
        vassalage: []
    };
    setFormData(prev => ({ ...prev, periods: [...prev.periods, newPeriod] }));
  };

  const removePeriod = (index: number) => {
    setFormData(prev => ({
        ...prev,
        periods: prev.periods.filter((_, i) => i !== index)
    }));
  };

  const updatePeriod = (index: number, field: keyof EntityPeriod, value: any) => {
      setFormData(prev => {
          const newPeriods = [...prev.periods];
          newPeriods[index] = { ...newPeriods[index], [field]: value };
          return { ...prev, periods: newPeriods };
      });
  };

  // --- CONTEXTS MANAGEMENT (Inside Period) ---

  const addContext = (pIdx: number) => {
     if(groups.length === 0) return;
     const newContext: EntityContextRole = {
         groupId: groups[0].id,
         role: CharacterRole.SECONDARY,
         heightIndex: 0,
         rowSpan: 1
     };
     setFormData(prev => {
         const newPeriods = [...prev.periods];
         newPeriods[pIdx] = { 
             ...newPeriods[pIdx], 
             contexts: [...newPeriods[pIdx].contexts, newContext] 
         };
         return { ...prev, periods: newPeriods };
     });
  };

  const removeContext = (pIdx: number, cIdx: number) => {
     setFormData(prev => {
         const newPeriods = [...prev.periods];
         const newContexts = newPeriods[pIdx].contexts.filter((_, i) => i !== cIdx);
         newPeriods[pIdx] = { ...newPeriods[pIdx], contexts: newContexts };
         return { ...prev, periods: newPeriods };
     });
  };

  const updateContext = (pIdx: number, cIdx: number, field: keyof EntityContextRole, value: any) => {
      setFormData(prev => {
         const newPeriods = [...prev.periods];
         const newContexts = [...newPeriods[pIdx].contexts];
         newContexts[cIdx] = { ...newContexts[cIdx], [field]: value };
         newPeriods[pIdx] = { ...newPeriods[pIdx], contexts: newContexts };
         return { ...prev, periods: newPeriods };
      });
  };

  // --- VASSALAGE MANAGEMENT (Inside Period) ---

  const addVassalage = (pIdx: number) => {
      setFormData(prev => {
          const newPeriods = [...prev.periods];
          const period = newPeriods[pIdx];
          const newVassal: EntityVassalage = {
              startYear: period.startYear,
              endYear: period.endYear,
              liegeId: allEntities[0]?.id || ""
          };
          newPeriods[pIdx] = { 
              ...period, 
              vassalage: [...period.vassalage, newVassal] 
          };
          return { ...prev, periods: newPeriods };
      });
  };

  const removeVassalage = (pIdx: number, vIdx: number) => {
       setFormData(prev => {
         const newPeriods = [...prev.periods];
         const newVassals = newPeriods[pIdx].vassalage.filter((_, i) => i !== vIdx);
         newPeriods[pIdx] = { ...newPeriods[pIdx], vassalage: newVassals };
         return { ...prev, periods: newPeriods };
     });
  };

  const updateVassalage = (pIdx: number, vIdx: number, field: keyof EntityVassalage, value: any) => {
      setFormData(prev => {
         const newPeriods = [...prev.periods];
         const newVassals = [...newPeriods[pIdx].vassalage];
         newVassals[vIdx] = { ...newVassals[vIdx], [field]: value };
         newPeriods[pIdx] = { ...newPeriods[pIdx], vassalage: newVassals };
         return { ...prev, periods: newPeriods };
      });
  };


  const roleOptions = [
    { value: CharacterRole.NUCLEUS, label: "Nucleus (Main)" },
    { value: CharacterRole.SECONDARY, label: "Secondary" },
    { value: CharacterRole.TERTIARY, label: "Tertiary (Minor)" }
  ];

  const entityOptions = [
    { value: "", label: "- None -" },
    ...allEntities
      .filter(e => e.id !== entity.id)
      .map(e => ({ value: e.id, label: e.name }))
  ];
  
  const groupOptions = groups.map(g => ({ value: g.id, label: g.name }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500">
                <Flag size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-100">Edit Entity</h2>
                <div className="text-xs text-gray-500 font-mono">{formData.id}</div>
             </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900 custom-scrollbar space-y-6">
            
            {/* General Info */}
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
                <label className="block text-xs font-medium text-gray-400 mb-1">Entity Name</label>
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Periods */}
            <div>
                 <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider">Existence Periods</h3>
                    <button onClick={addPeriod} className="text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">
                        <Plus size={14} /> Add Period
                    </button>
                </div>
                
                <div className="space-y-6">
                    {formData.periods.map((period, idx) => {
                        const currentHex = rgbaToHex(period.color);
                        const currentAlpha = getAlpha(period.color);
                        
                        return (
                        <div key={idx} className="bg-gray-800/20 p-4 rounded-lg border border-gray-700 relative">
                             <button 
                                onClick={() => removePeriod(idx)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1"
                                title="Remove Period"
                            >
                                <Trash2 size={16} />
                            </button>

                            {/* Period Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Start Year</label>
                                        <input 
                                            type="number" 
                                            value={period.startYear}
                                            onChange={(e) => updatePeriod(idx, 'startYear', parseInt(e.target.value))}
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">End Year</label>
                                        <input 
                                            type="number" 
                                            value={period.endYear}
                                            onChange={(e) => updatePeriod(idx, 'endYear', parseInt(e.target.value))}
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Period Color */}
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                                         <Palette size={10} /> Color
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <input 
                                            type="color" 
                                            value={currentHex} 
                                            onChange={e => updatePeriod(idx, 'color', hexToRgba(e.target.value, currentAlpha))}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <div className="flex-1">
                                            <input 
                                                type="range" 
                                                min="0" max="1" step="0.05"
                                                value={currentAlpha}
                                                onChange={e => updatePeriod(idx, 'color', hexToRgba(currentHex, parseFloat(e.target.value)))}
                                                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Context Roles */}
                            <div className="mb-4 bg-gray-900/50 p-3 rounded border border-gray-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] uppercase text-gray-400 font-bold flex items-center gap-1">
                                        <FolderTree size={10} /> Historical Contexts
                                    </label>
                                    <button onClick={() => addContext(idx)} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        <Plus size={10} /> Add Context
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {period.contexts.map((ctx, cIdx) => (
                                        <div key={cIdx} className="grid grid-cols-12 gap-2 items-end">
                                             <div className="col-span-4">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">Group</label>
                                                <select
                                                    value={ctx.groupId}
                                                    onChange={(e) => updateContext(idx, cIdx, 'groupId', e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                >
                                                    {groupOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                                </select>
                                             </div>
                                             <div className="col-span-3">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">Role</label>
                                                <select
                                                    value={ctx.role}
                                                    onChange={(e) => updateContext(idx, cIdx, 'role', e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                >
                                                    {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                                </select>
                                             </div>
                                             <div className="col-span-2">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">Height</label>
                                                <input 
                                                    type="number" value={ctx.heightIndex}
                                                    onChange={(e) => updateContext(idx, cIdx, 'heightIndex', parseInt(e.target.value))}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                />
                                             </div>
                                             <div className="col-span-2">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">RowSpan</label>
                                                <input 
                                                    type="number" min={1} value={ctx.rowSpan}
                                                    onChange={(e) => updateContext(idx, cIdx, 'rowSpan', parseInt(e.target.value))}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                />
                                             </div>
                                             <div className="col-span-1 flex justify-center pb-1">
                                                 <button onClick={() => removeContext(idx, cIdx)} className="text-gray-600 hover:text-red-400">
                                                     <X size={12} />
                                                 </button>
                                             </div>
                                        </div>
                                    ))}
                                    {period.contexts.length === 0 && <div className="text-xs text-gray-600 italic">No contexts defined. Will not appear on timeline.</div>}
                                </div>
                            </div>

                            {/* Vassalage */}
                             <div className="bg-gray-900/50 p-3 rounded border border-gray-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] uppercase text-gray-400 font-bold flex items-center gap-1">
                                        <Anchor size={10} /> Vassalage
                                    </label>
                                    <button onClick={() => addVassalage(idx)} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        <Plus size={10} /> Add Vassal
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {period.vassalage.map((vassal, vIdx) => (
                                        <div key={vIdx} className="grid grid-cols-12 gap-2 items-end">
                                             <div className="col-span-2">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">Start</label>
                                                <input 
                                                    type="number" value={vassal.startYear}
                                                    onChange={(e) => updateVassalage(idx, vIdx, 'startYear', parseInt(e.target.value))}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                />
                                             </div>
                                             <div className="col-span-2">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">End</label>
                                                <input 
                                                    type="number" value={vassal.endYear}
                                                    onChange={(e) => updateVassalage(idx, vIdx, 'endYear', parseInt(e.target.value))}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                />
                                             </div>
                                             <div className="col-span-7">
                                                <label className="text-[9px] text-gray-500 block mb-0.5">Liege Lord</label>
                                                <select
                                                    value={vassal.liegeId}
                                                    onChange={(e) => updateVassalage(idx, vIdx, 'liegeId', e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white"
                                                >
                                                    {entityOptions.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                                </select>
                                             </div>
                                             <div className="col-span-1 flex justify-center pb-1">
                                                 <button onClick={() => removeVassalage(idx, vIdx)} className="text-gray-600 hover:text-red-400">
                                                     <X size={12} />
                                                 </button>
                                             </div>
                                        </div>
                                    ))}
                                    {period.vassalage.length === 0 && <div className="text-xs text-gray-600 italic">No vassalage. Independent.</div>}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex justify-end gap-3">
            <button 
                onClick={onCancel}
                className="px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={() => onSave(formData)}
                className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-colors"
            >
                <Save size={16} /> Save Changes
            </button>
        </div>

      </div>
    </div>
  );
};

export default EntityEditor;
