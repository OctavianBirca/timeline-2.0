
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Menu, X, Settings, Users, BookOpen, Crown, Flag, Layers, Search, FolderTree, ChevronDown, Check, Eye, EyeOff } from 'lucide-react';
import { PoliticalEntity, Person, Dynasty, TitleDefinition, HistoricalGroup, CharacterRole } from '../types';
import { LABELS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  entities: PoliticalEntity[];
  people: Person[];
  dynasties: Dynasty[];
  titleDefinitions: TitleDefinition[];
  groups: HistoricalGroup[];
  activeGroupIds: string[];
  hiddenEntityIds: string[];
  onUpdateActiveGroups: (ids: string[]) => void;
  onToggleEntityVisibility: (id: string) => void;
  onSelectEntity: (id: string) => void;
  onEditPerson: (id: string) => void;
  onEditEntity: (id: string) => void;
  onEditTitle: (id: string) => void;
  onEditDynasty: (id: string) => void;
  onEditGroup: (id: string) => void;
  onAddNew: (type: string) => void;
}

type AdminTab = 'people' | 'entities' | 'titles' | 'dynasties' | 'groups';

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  entities, 
  people, 
  dynasties,
  titleDefinitions,
  groups,
  activeGroupIds,
  hiddenEntityIds,
  onUpdateActiveGroups,
  onToggleEntityVisibility,
  onSelectEntity,
  onEditPerson,
  onEditEntity,
  onEditTitle,
  onEditDynasty,
  onEditGroup,
  onAddNew
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'admin'>('history');
  const [adminTab, setAdminTab] = useState<AdminTab>('people');
  const [filterText, setFilterText] = useState('');
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target as Node)) {
        setIsGroupDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        return titleDefinitions.filter(t => 
           t.label.toLowerCase().includes(lowerFilter)
        );
      case 'groups':
        return groups.filter(g => 
          g.name.toLowerCase().includes(lowerFilter)
        );
      default:
        return [];
    }
  }, [adminTab, filterText, people, entities, dynasties, titleDefinitions, groups]);

  // --- Entity Categorization for History Tab ---
  const { nucleusEntities, secondaryEntities } = useMemo(() => {
      const nucleus: PoliticalEntity[] = [];
      const secondary: PoliticalEntity[] = [];

      entities.forEach(entity => {
          let role: CharacterRole | null = null;
          
          // Check periods to see if this entity is active in any of the selected groups
          entity.periods.forEach(period => {
              period.contexts.forEach(ctx => {
                  if (activeGroupIds.includes(ctx.groupId)) {
                      // If it's Nucleus in ANY selected context, it upgrades to Nucleus
                      if (ctx.role === CharacterRole.NUCLEUS) {
                          role = CharacterRole.NUCLEUS;
                      } else if (role !== CharacterRole.NUCLEUS) {
                          role = CharacterRole.SECONDARY;
                      }
                  }
              });
          });

          if (role === CharacterRole.NUCLEUS) nucleus.push(entity);
          else if (role === CharacterRole.SECONDARY) secondary.push(entity);
      });

      return { nucleusEntities: nucleus, secondaryEntities: secondary };
  }, [entities, activeGroupIds]);

  const toggleGroupSelection = (id: string) => {
      if (activeGroupIds.includes(id)) {
          // Prevent deselecting the last one if you want to enforce at least one, 
          // but allowing 0 is also fine to clear view. Let's allow 0.
          onUpdateActiveGroups(activeGroupIds.filter(gid => gid !== id));
      } else {
          onUpdateActiveGroups([...activeGroupIds, id]);
      }
  };

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
                        
                        {/* Multi-Context Selector */}
                        <div className="mb-6 relative" ref={groupDropdownRef}>
                            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">Historical Contexts</h3>
                            <button 
                                onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white flex justify-between items-center hover:border-gray-600 transition-colors"
                            >
                                <span className="truncate">
                                    {activeGroupIds.length === 0 
                                        ? "Select contexts..." 
                                        : `${activeGroupIds.length} context${activeGroupIds.length > 1 ? 's' : ''} active`}
                                </span>
                                <ChevronDown size={14} className="text-gray-500" />
                            </button>

                            {isGroupDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar">
                                    {groups.map(g => (
                                        <div 
                                            key={g.id}
                                            onClick={() => toggleGroupSelection(g.id)}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700/50 last:border-0"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${activeGroupIds.includes(g.id) ? 'bg-amber-600 border-amber-600' : 'border-gray-500 bg-gray-900'}`}>
                                                {activeGroupIds.includes(g.id) && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className={`text-sm ${activeGroupIds.includes(g.id) ? 'text-white' : 'text-gray-400'}`}>
                                                {g.name}
                                            </span>
                                        </div>
                                    ))}
                                    {groups.length === 0 && <div className="p-3 text-xs text-gray-500 text-center">No groups defined.</div>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Nucleus Entities */}
                            {nucleusEntities.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] uppercase text-amber-500 font-bold mb-2 flex items-center gap-1 border-b border-amber-900/30 pb-1">
                                        <Flag size={10} /> Nucleus Entities
                                    </h4>
                                    <div className="space-y-1">
                                        {nucleusEntities.map(e => (
                                            <div key={e.id} className="flex items-center justify-between p-2 rounded bg-gray-800/30 border border-gray-800">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.periods[0]?.color || '#444' }}></div>
                                                    <span className={`text-sm truncate ${hiddenEntityIds.includes(e.id) ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                                        {e.name}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => onToggleEntityVisibility(e.id)}
                                                    className="text-gray-500 hover:text-white"
                                                    title={hiddenEntityIds.includes(e.id) ? "Show" : "Hide"}
                                                >
                                                    {hiddenEntityIds.includes(e.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Secondary Entities */}
                            {secondaryEntities.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] uppercase text-blue-400 font-bold mb-2 flex items-center gap-1 border-b border-blue-900/30 pb-1">
                                        <Layers size={10} /> Secondary Entities
                                    </h4>
                                    <div className="space-y-1">
                                        {secondaryEntities.map(e => (
                                            <div key={e.id} className="flex items-center justify-between p-2 rounded bg-gray-800/30 border border-gray-800">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.periods[0]?.color || '#444' }}></div>
                                                    <span className={`text-sm truncate ${hiddenEntityIds.includes(e.id) ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                                        {e.name}
                                                    </span>
                                                </div>
                                                 <button 
                                                    onClick={() => onToggleEntityVisibility(e.id)}
                                                    className="text-gray-500 hover:text-white"
                                                    title={hiddenEntityIds.includes(e.id) ? "Show" : "Hide"}
                                                >
                                                    {hiddenEntityIds.includes(e.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {activeGroupIds.length > 0 && nucleusEntities.length === 0 && secondaryEntities.length === 0 && (
                                <div className="text-center text-xs text-gray-500 py-4 italic">
                                    No entities defined for the selected contexts.
                                </div>
                            )}
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
                                        <div className="w-4 h-4 rounded shrink-0 border border-white/10 flex items-center justify-center text-[8px] font-mono text-gray-500">
                                            {e.periods.length}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{e.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{e.periods.length} period(s)</div>
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
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); onEditDynasty(d.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity"
                                         >
                                            Edit
                                         </button>
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
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); onEditTitle(t.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity"
                                         >
                                            Edit
                                         </button>
                                    </div>
                                ))}

                                {adminTab === 'groups' && filteredData.map((g: any) => (
                                    <div key={g.id} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer group">
                                        <FolderTree size={16} className="text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{g.name}</div>
                                        </div>
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); onEditGroup(g.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-xs text-amber-500 px-2 py-1 hover:bg-amber-900/30 rounded transition-opacity"
                                         >
                                            Edit
                                         </button>
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
