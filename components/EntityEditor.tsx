import React, { useState } from 'react';
import { PoliticalEntity, EntityPeriod, CharacterRole } from '../types';
import { X, Plus, Trash2, Save, Flag, Layers } from 'lucide-react';

interface EntityEditorProps {
  entity: PoliticalEntity;
  allEntities: PoliticalEntity[];
  onSave: (updatedEntity: PoliticalEntity) => void;
  onCancel: () => void;
}

const EntityEditor: React.FC<EntityEditorProps> = ({
  entity,
  allEntities,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<PoliticalEntity>({ ...entity });

  const handleChange = (field: keyof PoliticalEntity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePeriodChange = (index: number, field: keyof EntityPeriod, value: any) => {
    setFormData(prev => {
      const newPeriods = [...prev.periods];
      // If setting vassal to empty string, undefined it
      if (field === 'isVassalTo' && value === "") {
        const { isVassalTo, ...rest } = newPeriods[index];
        newPeriods[index] = { ...rest, [field]: undefined } as EntityPeriod;
      } else {
        newPeriods[index] = { ...newPeriods[index], [field]: value };
      }
      return { ...prev, periods: newPeriods };
    });
  };

  const addPeriod = () => {
    setFormData(prev => ({
      ...prev,
      periods: [...prev.periods, { startYear: 500, endYear: 600 }]
    }));
  };

  const removePeriod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      periods: prev.periods.filter((_, i) => i !== index)
    }));
  };

  const roleOptions = [
    { value: CharacterRole.NUCLEUS, label: "Nucleus (Main)" },
    { value: CharacterRole.SECONDARY, label: "Secondary" }
  ];

  const entityOptions = [
    { value: "", label: "- None (Independent) -" },
    ...allEntities
      .filter(e => e.id !== entity.id)
      .map(e => ({ value: e.id, label: e.name }))
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Entity Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Color (RGBA)</label>
                        <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded border border-gray-600 shrink-0" style={{ backgroundColor: formData.color }}></div>
                            <input 
                                type="text" 
                                value={formData.color} 
                                onChange={e => handleChange('color', e.target.value)}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 font-mono"
                                placeholder="rgba(0,0,0,0.5)"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 h-[38px]"
                        >
                            {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                             <Layers size={12} /> Height Index (Vertical Layer)
                        </label>
                        <input 
                            type="number" 
                            value={formData.heightIndex} 
                            onChange={e => handleChange('heightIndex', parseInt(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Periods */}
            <div>
                 <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider">Existence Periods</h3>
                    <button onClick={addPeriod} className="text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">
                        <Plus size={14} /> Add Period
                    </button>
                </div>
                
                <div className="space-y-3">
                    {formData.periods.map((period, idx) => (
                        <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 relative">
                             <button 
                                onClick={() => removePeriod(idx)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Start Year</label>
                                    <input 
                                        type="number" 
                                        value={period.startYear}
                                        onChange={(e) => handlePeriodChange(idx, 'startYear', parseInt(e.target.value))}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">End Year</label>
                                    <input 
                                        type="number" 
                                        value={period.endYear}
                                        onChange={(e) => handlePeriodChange(idx, 'endYear', parseInt(e.target.value))}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Vassal To (Liege)</label>
                                    <select
                                        value={period.isVassalTo || ""}
                                        onChange={(e) => handlePeriodChange(idx, 'isVassalTo', e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 h-[38px]"
                                    >
                                        {entityOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
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