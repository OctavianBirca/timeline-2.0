
import React, { useState } from 'react';
import { TitleDefinition, RankLevel } from '../types';
import { X, Save, Crown, Trash2 } from 'lucide-react';

interface TitleDefinitionEditorProps {
  titleDef: TitleDefinition;
  onSave: (updatedDef: TitleDefinition) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const TitleDefinitionEditor: React.FC<TitleDefinitionEditorProps> = ({
  titleDef,
  onSave,
  onDelete,
  onCancel
}) => {
  const [formData, setFormData] = useState<TitleDefinition>({ ...titleDef });

  const handleChange = (field: keyof TitleDefinition, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3">
             <div className="bg-amber-600/20 p-2 rounded-lg text-amber-500">
                <Crown size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-100">Edit Title Definition</h2>
                <div className="text-xs text-gray-500 font-mono">{formData.id}</div>
             </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Title Label (e.g. "King")</label>
                <input 
                    type="text" 
                    value={formData.label} 
                    onChange={e => handleChange('label', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    autoFocus
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Default Rank Level</label>
                <input
                    type="number"
                    value={formData.rank}
                    onChange={(e) => handleChange('rank', parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                    Lower number = Higher importance (0 is Pope/Patriarch).
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex justify-between gap-3">
            <button 
                onClick={() => onDelete(formData.id)}
                className="px-4 py-2 rounded text-red-500 hover:bg-red-900/20 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-1"
            >
                <Trash2 size={16} /> Delete
            </button>
            <div className="flex gap-3">
                <button 
                    onClick={onCancel}
                    className="px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => onSave(formData)}
                    className="px-6 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-900/20 flex items-center gap-2 transition-colors"
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TitleDefinitionEditor;
