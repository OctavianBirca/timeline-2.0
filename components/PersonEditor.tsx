import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Person, Dynasty, PoliticalEntity, Title, RankLevel, CharacterRole, TitlePeriod } from '../types';
import { X, Plus, Trash2, Save, User, Crown, Heart, Palette, ChevronDown, Search, Calendar } from 'lucide-react';
import { PREDEFINED_TITLES, MONTHS } from '../constants';

interface PersonEditorProps {
  person: Person;
  allPeople: Person[];
  dynasties: Dynasty[];
  entities: PoliticalEntity[];
  onSave: (updatedPerson: Person) => void;
  onCancel: () => void;
}

interface Option {
  label: string;
  value: string | number;
}

// --- Reusable Searchable Select Component (With Portal) ---
const SearchableSelect: React.FC<{
  label: string;
  value: string | number | undefined;
  options: Option[];
  onChange: (val: any) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}> = ({ label, value, options, onChange, placeholder = "Select...", className, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      // Auto focus search
      setTimeout(() => {
         if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    }
    if (!isOpen) {
        setSearchTerm("");
    }
  }, [isOpen]);

  // Close on scroll/resize to avoid detached dropdowns, BUT ignore scrolling inside the dropdown itself
  useEffect(() => {
    const handleScroll = (e: Event) => { 
        if(isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <div 
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white flex justify-between items-center h-[38px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer focus:ring-1 focus:ring-amber-500 hover:border-gray-500 transition-colors'}`}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {!disabled && <ChevronDown size={14} className="text-gray-500 shrink-0 ml-2" />}
      </div>

      {isOpen && !disabled && ReactDOM.createPortal(
        <>
          {/* Transparent backdrop to handle click-outside */}
          <div className="fixed inset-0 z-[70]" onClick={() => setIsOpen(false)}></div>
          
          <div 
            ref={dropdownRef}
            className="absolute z-[70] bg-gray-800 border border-gray-600 rounded-md shadow-2xl flex flex-col overflow-hidden"
            style={{ 
                top: coords.top, 
                left: coords.left, 
                width: coords.width,
                maxHeight: '300px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 border-b border-gray-700 bg-gray-800 sticky top-0">
               <div className="relative">
                 <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                 <input 
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter..."
                    className="w-full bg-gray-900 border border-gray-700 rounded pl-7 pr-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                 />
               </div>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {filteredOptions.length === 0 ? (
                    <div className="p-2 text-xs text-gray-500 text-center">No results found</div>
                ) : (
                    filteredOptions.map((opt) => (
                        <div 
                            key={String(opt.value)}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 flex items-center justify-between border-b border-gray-800/50 last:border-0 ${opt.value === value ? 'bg-amber-900/20 text-amber-500' : 'text-gray-200'}`}
                        >
                            {opt.label}
                            {opt.value === value && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                        </div>
                    ))
                )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};


// --- Reusable Date Input Group ---
const DateGroup: React.FC<{
  label: string;
  year: number;
  month?: number;
  day?: number;
  onYearChange: (v: number) => void;
  onMonthChange: (v: number) => void;
  onDayChange: (v: number) => void;
}> = ({ label, year, month, day, onYearChange, onMonthChange, onDayChange }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
        <Calendar size={12}/> {label}
      </label>
      <div className="flex gap-1">
        {/* Day */}
        <input 
          type="number" 
          placeholder="DD"
          min={1} max={31}
          value={day || ''}
          onChange={(e) => onDayChange(parseInt(e.target.value) || 0)}
          className="w-12 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-center focus:ring-1 focus:ring-amber-500"
        />
        {/* Month */}
        <div className="flex-1 min-w-[70px]">
           <select 
              value={month || ''}
              onChange={(e) => onMonthChange(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:ring-1 focus:ring-amber-500 h-[38px]"
           >
              <option value="">Month</option>
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
           </select>
        </div>
        {/* Year */}
        <input 
          type="number" 
          placeholder="YYYY"
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value) || 0)}
          className="w-20 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-center focus:ring-1 focus:ring-amber-500 font-bold"
        />
      </div>
    </div>
  );
};


const PersonEditor: React.FC<PersonEditorProps> = ({
  person,
  allPeople,
  dynasties,
  entities,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Person>({ ...person });
  const [activeTab, setActiveTab] = useState<'general' | 'relations' | 'titles'>('general');

  // Helper to update simple fields
  const handleChange = (field: keyof Person, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to handle Title property updates
  const handleTitlePropertyChange = (index: number, field: keyof Title, value: any) => {
    setFormData(prev => {
        const newTitles = [...prev.titles];
        newTitles[index] = { ...newTitles[index], [field]: value };
        return { ...prev, titles: newTitles };
    });
  };

  // Helper to manage Title Periods
  const handlePeriodChange = (titleIndex: number, periodIndex: number, field: keyof TitlePeriod, value: number) => {
     setFormData(prev => {
         const newTitles = [...prev.titles];
         const newPeriods = [...newTitles[titleIndex].periods];
         // Ensure value is stored as number or undefined if 0
         const val = value === 0 ? undefined : value;
         
         // Special handling: Year can be 0 theoretically but usually not in this app, 
         // but month/day being 0 means undefined/empty.
         if (field === 'startYear' || field === 'endYear') {
             newPeriods[periodIndex] = { ...newPeriods[periodIndex], [field]: value };
         } else {
            // For optional fields
            const newP = { ...newPeriods[periodIndex] };
            if (val) {
                (newP as any)[field] = val;
            } else {
                delete (newP as any)[field];
            }
            newPeriods[periodIndex] = newP;
         }
         
         newTitles[titleIndex] = { ...newTitles[titleIndex], periods: newPeriods };
         return { ...prev, titles: newTitles };
     });
  };

  const addPeriod = (titleIndex: number) => {
      setFormData(prev => {
          const newTitles = [...prev.titles];
          const newPeriods = [...newTitles[titleIndex].periods, { startYear: formData.birthYear, endYear: formData.deathYear }];
          newTitles[titleIndex] = { ...newTitles[titleIndex], periods: newPeriods };
          return { ...prev, titles: newTitles };
      });
  };

  const removePeriod = (titleIndex: number, periodIndex: number) => {
      setFormData(prev => {
          const newTitles = [...prev.titles];
          const newPeriods = newTitles[titleIndex].periods.filter((_, i) => i !== periodIndex);
          newTitles[titleIndex] = { ...newTitles[titleIndex], periods: newPeriods };
          return { ...prev, titles: newTitles };
      });
  };


  // Handle changing the predefined Title Type
  const handleTitleTypeSelect = (index: number, defId: string) => {
      const def = PREDEFINED_TITLES.find(t => t.id === defId);
      if (!def) return;
      
      setFormData(prev => {
          const newTitles = [...prev.titles];
          const currentTitle = newTitles[index];
          
          // Find domain name from current Entity ID
          const entity = entities.find(e => e.id === currentTitle.entityId);
          const domain = entity ? entity.name : "Unknown";
          
          // Construct new name
          const newName = `${def.label} : ${domain}`;
          
          newTitles[index] = {
              ...currentTitle,
              rank: def.rank,
              name: newName
          };
          
          return { ...prev, titles: newTitles };
      });
  };

  // Handle changing the Entity for a title
  const handleEntitySelect = (index: number, entityId: string) => {
      setFormData(prev => {
          const newTitles = [...prev.titles];
          const currentTitle = newTitles[index];
          
          // Try to preserve the Title Type (Label)
          let label = "Title";
          
          // 1. Try splitting existing name
          if (currentTitle.name.includes(' : ')) {
              label = currentTitle.name.split(' : ')[0];
          } else {
              // 2. Try matching against predefined list
              const match = PREDEFINED_TITLES.find(t => currentTitle.name.includes(t.label));
              if (match) label = match.label;
              else label = currentTitle.name;
          }

          // Find new domain name
          const entity = entities.find(e => e.id === entityId);
          const domain = entity ? entity.name : "Unknown";

          const newName = `${label} : ${domain}`;

          newTitles[index] = {
              ...currentTitle,
              entityId: entityId,
              name: newName
          };
          
          return { ...prev, titles: newTitles };
      });
  };

  const handleTitleNameChange = (index: number, val: string) => {
    setFormData(prev => {
        const newTitles = [...prev.titles];
        newTitles[index] = { ...newTitles[index], name: val };
        return { ...prev, titles: newTitles };
    });
  };

  const handleTitleRankChange = (index: number, val: number) => {
    setFormData(prev => {
        const newTitles = [...prev.titles];
        newTitles[index] = { ...newTitles[index], rank: val };
        return { ...prev, titles: newTitles };
    });
  };

  const addTitle = () => {
    const newTitle: Title = {
      id: `t_${Date.now()}`,
      name: 'Title : Entity',
      entityId: entities[0]?.id || '',
      rank: RankLevel.KING,
      role: CharacterRole.NUCLEUS,
      periods: [{ startYear: formData.birthYear + 20, endYear: formData.deathYear }],
      positionIndex: 1
    };
    setFormData(prev => ({ ...prev, titles: [...prev.titles, newTitle] }));
  };

  const removeTitle = (index: number) => {
    const newTitles = formData.titles.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, titles: newTitles }));
  };

  // Helper to handle Spouses (Multiselect)
  const toggleSpouse = (spouseId: string) => {
    const currentSpouses = formData.spouseIds;
    if (currentSpouses.includes(spouseId)) {
        setFormData(prev => ({ ...prev, spouseIds: currentSpouses.filter(id => id !== spouseId) }));
    } else {
        setFormData(prev => ({ ...prev, spouseIds: [...currentSpouses, spouseId] }));
    }
  };

  // --- Options Preparation ---
  const personOptions = [
      { value: "", label: "- None -" },
      ...allPeople
        .filter(p => p.id !== person.id)
        .map(p => ({ value: p.id, label: `${p.officialName} (${p.birthYear}-${p.deathYear})` }))
  ];

  const dynastyOptions = dynasties.map(d => ({ value: d.id, label: d.name }));
  
  const entityOptions = entities.map(e => ({ value: e.id, label: e.name }));

  const roleOptions = [
      { value: CharacterRole.NUCLEUS, label: "Nucleus (Main)" },
      { value: CharacterRole.SECONDARY, label: "Secondary" }
  ];

  const titleTypeOptions = PREDEFINED_TITLES.map(t => ({ value: t.id, label: t.label }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3">
             <div className="bg-amber-600/20 p-2 rounded-lg text-amber-500">
                <User size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-100">Edit Person</h2>
                <div className="text-xs text-gray-500 font-mono">{formData.id}</div>
             </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-900/50">
            <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'general' ? 'text-amber-400 border-b-2 border-amber-400 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
                <User size={16} /> General
            </button>
            <button 
                onClick={() => setActiveTab('relations')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'relations' ? 'text-amber-400 border-b-2 border-amber-400 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
                <Heart size={16} /> Relationships
            </button>
            <button 
                onClick={() => setActiveTab('titles')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'titles' ? 'text-amber-400 border-b-2 border-amber-400 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
                <Crown size={16} /> Titles
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900 custom-scrollbar">
            
            {/* --- GENERAL TAB --- */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Official Name</label>
                            <input 
                                type="text" 
                                value={formData.officialName} 
                                onChange={e => handleChange('officialName', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Real Name / Birth Name</label>
                            <input 
                                type="text" 
                                value={formData.realName || ''} 
                                onChange={e => handleChange('realName', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <SearchableSelect
                                label="Dynasty"
                                value={formData.dynastyId}
                                onChange={(val) => handleChange('dynastyId', val)}
                                options={dynastyOptions}
                            />
                        </div>
                        
                        {/* Dates Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-3 rounded-lg border border-gray-800">
                             <DateGroup 
                                label="Birth Date"
                                year={formData.birthYear}
                                month={formData.birthMonth}
                                day={formData.birthDay}
                                onYearChange={(v) => handleChange('birthYear', v)}
                                onMonthChange={(v) => handleChange('birthMonth', v)}
                                onDayChange={(v) => handleChange('birthDay', v)}
                             />
                             <DateGroup 
                                label="Death Date"
                                year={formData.deathYear}
                                month={formData.deathMonth}
                                day={formData.deathDay}
                                onYearChange={(v) => handleChange('deathYear', v)}
                                onMonthChange={(v) => handleChange('deathMonth', v)}
                                onDayChange={(v) => handleChange('deathDay', v)}
                             />
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div>
                            <SearchableSelect
                                label="Default Role (if no titles)"
                                value={formData.role}
                                onChange={(val) => handleChange('role', val)}
                                options={roleOptions}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Image URL</label>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-600 overflow-hidden shrink-0">
                                    {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" /> : null}
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.imageUrl || ''} 
                                    onChange={e => handleChange('imageUrl', e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none h-10"
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-2">
                                <Palette size={12} /> Override Color (Optional)
                            </label>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    value={formData.color || '#ffffff'} 
                                    onChange={e => handleChange('color', e.target.value)}
                                    className="bg-transparent border-0 w-8 h-8 p-0 cursor-pointer"
                                />
                                <span className="text-xs text-gray-500">Overrides dynasty color if set</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- RELATIONS TAB --- */}
            {activeTab === 'relations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider border-b border-gray-800 pb-2">Parents</h3>
                        
                        <SearchableSelect
                            label="Father"
                            value={formData.fatherId || ""}
                            onChange={(val) => handleChange('fatherId', val || undefined)}
                            options={personOptions}
                            placeholder="- None -"
                        />
                        
                        <SearchableSelect
                            label="Mother"
                            value={formData.motherId || ""}
                            onChange={(val) => handleChange('motherId', val || undefined)}
                            options={personOptions}
                            placeholder="- None -"
                        />

                        <SearchableSelect
                            label="Adopted Parent"
                            value={formData.adoptedParentId || ""}
                            onChange={(val) => handleChange('adoptedParentId', val || undefined)}
                            options={personOptions}
                            placeholder="- None -"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-pink-500 uppercase tracking-wider border-b border-gray-800 pb-2">Spouses</h3>
                        <div className="max-h-[300px] overflow-y-auto border border-gray-800 rounded bg-gray-950 p-2 space-y-1">
                             <div className="relative mb-2">
                                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" placeholder="Filter spouses..." className="w-full bg-gray-800 border border-gray-700 rounded pl-7 py-1 text-xs" />
                             </div>
                             {allPeople.filter(p => p.id !== person.id).map(p => (
                                 <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                                     <input 
                                        type="checkbox" 
                                        checked={formData.spouseIds.includes(p.id)}
                                        onChange={() => toggleSpouse(p.id)}
                                        className="rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500/50"
                                     />
                                     <div className="flex-1">
                                         <span className="text-sm text-gray-300">{p.officialName}</span>
                                         <span className="text-xs text-gray-600 ml-2">({p.birthYear}-{p.deathYear})</span>
                                     </div>
                                 </label>
                             ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- TITLES TAB --- */}
            {activeTab === 'titles' && (
                <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Titles & Positions</h3>
                        <button onClick={addTitle} className="text-xs flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded transition-colors">
                            <Plus size={14} /> Add Title
                        </button>
                    </div>

                    {formData.titles.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 italic">No titles assigned.</div>
                    ) : (
                        <div className="space-y-3 pb-8">
                            {formData.titles.map((title, idx) => {
                                // Robustly determine current def ID for dropdown
                                let currentDefId = "";
                                const exactMatch = PREDEFINED_TITLES.find(t => title.name.startsWith(t.label));
                                if (exactMatch) currentDefId = exactMatch.id;
                                else {
                                    const partialMatch = PREDEFINED_TITLES.find(t => title.name.includes(t.label));
                                    if (partialMatch) currentDefId = partialMatch.id;
                                }

                                return (
                                <div key={title.id} className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg relative group">
                                    <button 
                                        onClick={() => removeTitle(idx)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1"
                                        title="Remove Title"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pr-8">
                                        <div>
                                            <SearchableSelect
                                                label="Title Type"
                                                value={currentDefId}
                                                onChange={(val) => handleTitleTypeSelect(idx, val)}
                                                options={titleTypeOptions}
                                                placeholder="Select Title..."
                                            />
                                        </div>
                                        <div>
                                            <SearchableSelect
                                                label="Political Entity (Domain)"
                                                value={title.entityId}
                                                onChange={(val) => handleEntitySelect(idx, val)}
                                                options={entityOptions}
                                                className="mb-0"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Editable Name and Rank */}
                                    <div className="mb-3">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Title Name</label>
                                                <input 
                                                    type="text" 
                                                    value={title.name}
                                                    onChange={(e) => handleTitleNameChange(idx, e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Rank Level</label>
                                                <select
                                                    value={title.rank}
                                                    onChange={(e) => handleTitleRankChange(idx, parseInt(e.target.value))}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 h-[38px]"
                                                >
                                                    {Object.keys(RankLevel)
                                                        .filter(k => isNaN(Number(k)))
                                                        .map(key => (
                                                            <option key={key} value={RankLevel[key as keyof typeof RankLevel]}>
                                                                {key} ({RankLevel[key as keyof typeof RankLevel]})
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role and Position Index */}
                                    <div className="mb-3 grid grid-cols-2 gap-4">
                                         <div>
                                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Role in Entity</label>
                                            <select
                                                value={title.role}
                                                onChange={(e) => handleTitlePropertyChange(idx, 'role', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 h-[38px]"
                                            >
                                                {roleOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                         </div>
                                         <div>
                                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Position Index</label>
                                            <input 
                                                type="number"
                                                value={title.positionIndex}
                                                onChange={e => handleTitlePropertyChange(idx, 'positionIndex', parseInt(e.target.value))}
                                                className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-sm h-[38px]"
                                                title="Determines vertical stacking order"
                                            />
                                         </div>
                                    </div>

                                    {/* Active Periods Management - Vertically Stacked per Period */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-[10px] uppercase text-gray-500 font-bold">Active Periods</label>
                                            <button onClick={() => addPeriod(idx)} className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1">
                                                <Plus size={10} /> Add Period
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {title.periods.map((period, pIdx) => (
                                                <div key={pIdx} className="bg-gray-900/50 p-2 rounded border border-gray-700/50 relative">
                                                    {title.periods.length > 1 && (
                                                        <button 
                                                            onClick={() => removePeriod(idx, pIdx)} 
                                                            className="absolute top-2 right-2 text-gray-600 hover:text-red-400 p-1"
                                                            title="Remove Period"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                    
                                                    {/* Vertical stack of dates */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                                                        <DateGroup 
                                                            label="Start Date"
                                                            year={period.startYear}
                                                            month={period.startMonth}
                                                            day={period.startDay}
                                                            onYearChange={(v) => handlePeriodChange(idx, pIdx, 'startYear', v)}
                                                            onMonthChange={(v) => handlePeriodChange(idx, pIdx, 'startMonth', v)}
                                                            onDayChange={(v) => handlePeriodChange(idx, pIdx, 'startDay', v)}
                                                        />
                                                        <DateGroup 
                                                            label="End Date"
                                                            year={period.endYear}
                                                            month={period.endMonth}
                                                            day={period.endDay}
                                                            onYearChange={(v) => handlePeriodChange(idx, pIdx, 'endYear', v)}
                                                            onMonthChange={(v) => handlePeriodChange(idx, pIdx, 'endMonth', v)}
                                                            onDayChange={(v) => handlePeriodChange(idx, pIdx, 'endDay', v)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            )}

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
                className="px-6 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-900/20 flex items-center gap-2 transition-colors"
            >
                <Save size={16} /> Save Changes
            </button>
        </div>

      </div>
    </div>
  );
};

export default PersonEditor;