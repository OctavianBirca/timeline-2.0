
import React, { useState } from 'react';
import { Dynasty } from '../types';
import { X, Save, Layers, Palette, Trash2 } from 'lucide-react';

interface DynastyEditorProps {
  dynasty: Dynasty;
  onSave: (updatedDynasty: Dynasty) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const DynastyEditor: React.FC<DynastyEditorProps> = ({
  dynasty,
  onSave,
  onDelete,
  onCancel
}) => {
  const [formData, setFormData] = useState<Dynasty>({ ...dynasty });

  const handleChange = (field: keyof Dynasty, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-600/20 p-2 rounded-lg text-emerald-500">
                <Layers size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-100">Edit Dynasty</h2>
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
                <label className="block text-xs font-medium text-gray-400 mb-1">Dynasty Name</label>
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    autoFocus
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Palette size={12} /> Color Identifier
                </label>
                <div className="flex gap-2 items-center">
                    <input 
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="bg-transparent border-0 w-10 h-10 p-0 cursor-pointer"
                    />
                    <input 
                        type="text" 
                        value={formData.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white font-mono uppercase"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description (Optional)</label>
                <textarea 
                    value={formData.description || ''} 
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none min-h-[80px]"
                    placeholder="Historical notes..."
                />
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
                    className="px-6 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-colors"
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DynastyEditor;
