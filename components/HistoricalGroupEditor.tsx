import React, { useState } from 'react';
import { HistoricalGroup } from '../types';
import { X, Save, FolderTree } from 'lucide-react';

interface HistoricalGroupEditorProps {
  group: HistoricalGroup;
  onSave: (updatedGroup: HistoricalGroup) => void;
  onCancel: () => void;
}

const HistoricalGroupEditor: React.FC<HistoricalGroupEditorProps> = ({
  group,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<HistoricalGroup>({ ...group });

  const handleChange = (field: keyof HistoricalGroup, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600/20 p-2 rounded-lg text-indigo-500">
                <FolderTree size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-100">Edit Historical Group</h2>
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
                <label className="block text-xs font-medium text-gray-400 mb-1">Group Name</label>
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    autoFocus
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                    value={formData.description || ''} 
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none min-h-[80px]"
                    placeholder="Describe this historical context..."
                />
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
                className="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-colors"
            >
                <Save size={16} /> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalGroupEditor;