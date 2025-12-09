import React, { useState, useMemo } from 'react';
import { Menu, X, Settings, Users, BookOpen, Crown, Flag, Layers, Search, FolderTree } from 'lucide-react';
import { PoliticalEntity, Person, Dynasty, RankLevel } from '../types';
import { LABELS, PREDEFINED_TITLES } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  entities: PoliticalEntity[];
  people: Person[];
  dynasties: Dynasty[];
  onSelectEntity: (id: string) => void;
  onEditPerson: (id: string) => void;
  onEditEntity: (id: string) => void;
  onAddNew: (type: string) => void;
}

type AdminTab = 'people' | 'entities' | 'titles' | 'dynasties' | 'groups';

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  entities, 
  people, 
  dynasties,
  onSelectEntity,
  onEditPerson,
  onEditEntity,
  onAddNew
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'admin'>('history');
  const [adminTab, setAdminTab] = useState<AdminTab>('people');
  const [filterText, setFilterText] = useState('');

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    const lowerFilter = filterText.toLowerCase();
    
    switch (adminTab) {
      case 'people':
        return people.filter(p => 
          p.officialName.toLowerCase().includes(lowerFilter) || 
          p.id.toLowerCase().includes(lowerFilter)
        );
      case 'entities':
        return entities.filter(e => 
          e.name.toLowerCase().includes(lowerFilter) || 
          e.id.toLowerCase().includes(lowerFilter)
        );
      case 'dynasties':
        return dynasties.filter(d => 
          d.name.toLowerCase().includes(lowerFilter)
        );
      case 'titles':
        // Show defined Titles (Types), not instances
        return PREDEFINED_TITLES.filter(t => 
           t.label.toLowerCase().includes(lowerFilter)
        );
      case 'groups':
        // Mock groups
        const groups = [
            { id: 'g1', name: 'History of France' },
            { id: 'g2', name: 'History of Rome' },
            { id: 'g3', name: 'Holy Roman Empire' }
        ];
        return groups.filter(g => g.name.toLowerCase().includes(lowerFilter));
      default:
        return [];
    }
  }, [adminTab, filterText, people, entities, dynasties]);

  return (
    <div 
      className={`fixed left-0 top-0 bottom-0 bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-80' : 'w-12'}`}
    >
        {/* Header / Toggle */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-gray-800 shrink-0">
            {isOpen && <span className="font-bold text-lg bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">Chronos</span>}
            <button onClick={toggleSidebar} className="p-1 hover:bg-gray-800 rounded">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>

        {isOpen ? (
            <div className="flex flex-col h-full overflow-hidden">
                {/* Main Tabs */}
                <div className="flex border-b border-gray-800 shrink-0">
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'history' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        <BookOpen size={16} /> {LABELS.en.historyGroup}
                    </button>
                    <button 
                         onClick={() => setActiveTab('admin')}
                         className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Settings size={16} /> {LABELS.en.admin}
                    </button>
                </div>

                {activeTab === 'history' ? (
                    // History Tab Content
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 tracking-wider">Select Context</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded border border-gray-700 text-sm flex items-center gap-2">
                                <Flag size={14} className="text-blue-400" /> History of France
                            </button>
                            <button className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded border border-transparent text-sm text-gray-400 flex items-center gap-2">
                                <Flag size={14} /> Roman Empire
                            </button>
                        </div>
                    </div>
                ) : (
                    // Admin Tab Content
                    <div className="flex flex-col h-full">
                        {/* Admin Sub-Tabs */}
                        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-800 bg-gray-900/50 shrink-0 p-1 gap-1">
                             {[
                                { id: 'people', icon: Users, label: LABELS.en.adminTabs.people },
                                { id: 'entities', icon: Flag, label: LABELS.en.adminTabs.entities },
                                { id: 'titles', icon: Crown, label: LABELS.en.adminTabs.titles },
                                { id: 'dynasties', icon: Layers, label: LABELS.en.adminTabs.dynasties },
                                { id: 'groups', icon: FolderTree, label: LABELS.en.adminTabs.groups }
                             ].map((tab) => (
                                 <button
                                    key={tab.id}
                                    onClick={() => setAdminTab(tab.id as AdminTab)}
                                    title={tab.label}
                                    className={`p-2 rounded flex-1 flex justify-center items-center transition-colors ${adminTab === tab.id ? 'bg-amber-900/40 text-amber-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
                                 >
                                    <tab.icon size={18} />
                                 </button>
                             ))}
                        </div>

                        {/* Search Bar */}
                        <div className="p-3 border-b border-gray-800 shrink-0">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder={`Filter ${adminTab}...`}
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    className="w-full bg-gray-800 text-sm text-gray-200 rounded pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500/50 border border-gray-700"
                                />
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            <div className="space-y-1">
                                {filteredData.length === 0 && (
                                    <div className="text-center text-gray-500 text-xs py-4">No results found.</div>
                                )}
                                
                                {adminTab === 'people' && filteredData.map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer group">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0 border border-gray-600">
                                            {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover"/> : null}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{p.officialName}</div>
                                            <div className="text-xs text-gray-500 truncate">{p.birthYear} - {p.deathYear}</div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onEditPerson(p.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}

                                {adminTab === 'entities' && filteredData.map((e: any) => (
                                    <div key={e.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer group">
                                        <div className="w-4 h-4 rounded-full shrink-0 border border-white/10" style={{ backgroundColor: e.color }}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{e.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{e.id}</div>
                                        </div>
                                         <button 
                                            onClick={(evt) => { evt.stopPropagation(); onEditEntity(e.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity"
                                         >
                                            Edit
                                         </button>
                                    </div>
                                ))}
                                
                                {adminTab === 'dynasties' && filteredData.map((d: any) => (
                                    <div key={d.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer group">
                                        <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{d.name}</div>
                                        </div>
                                         <button className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity">Edit</button>
                                    </div>
                                ))}
                                
                                {adminTab === 'titles' && filteredData.map((t: any) => (
                                    <div key={t.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer group">
                                        <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-800 border border-gray-700 text-amber-500 font-mono text-xs shrink-0">
                                            {t.rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{t.label}</div>
                                            <div className="text-xs text-gray-500 truncate">Rank Level: {t.rank}</div>
                                        </div>
                                         <button className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity">Edit</button>
                                    </div>
                                ))}

                                {adminTab === 'groups' && filteredData.map((g: any) => (
                                    <div key={g.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer group">
                                        <FolderTree size={16} className="text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{g.name}</div>
                                        </div>
                                         <button className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity">Edit</button>
                                    </div>
                                ))}

                                <button 
                                    onClick={() => onAddNew(adminTab)}
                                    className="w-full mt-4 py-2 border border-dashed border-gray-700 text-gray-500 text-xs hover:border-gray-500 hover:text-gray-300 rounded transition-colors uppercase font-bold tracking-wider"
                                >
                                    + Add New
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
             <div className="flex flex-col items-center gap-4 mt-4">
                 <button className="p-2 text-gray-400 hover:text-white" title="History"><BookOpen size={20}/></button>
                 <button className="p-2 text-gray-400 hover:text-white" title="Admin Panel"><Settings size={20}/></button>
             </div>
        )}
    </div>
  );
};

export default Sidebar;