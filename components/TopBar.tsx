
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ZoomIn, ZoomOut, Grid, Heart, GitMerge, Clock, Users, ChevronDown, Check, EyeOff, RotateCcw, Eye } from 'lucide-react';
import { ViewSettings, Person } from '../types';
import { LABELS } from '../constants';

interface TopBarProps {
  settings: ViewSettings;
  updateSetting: (key: keyof ViewSettings, value: any) => void;
  people: Person[];
  onUnhidePerson: (id: string) => void;
  onResetView: () => void;
}

// Simple Toggle Button
const ToggleBtn = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
      active 
        ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50' 
        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
    }`}
    title={label}
  >
    <Icon size={14} />
    <span className="hidden md:inline">{label}</span>
  </button>
);

// Portal-based Dropdown for Visibility settings
const VisibilityDropdown: React.FC<{
    settings: ViewSettings;
    updateSetting: (key: keyof ViewSettings, value: any) => void;
}> = ({ settings, updateSetting }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.left
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClose = () => setIsOpen(false);
        window.addEventListener('scroll', handleClose, true);
        window.addEventListener('resize', handleClose);
        return () => {
            window.removeEventListener('scroll', handleClose, true);
            window.removeEventListener('resize', handleClose);
        }
    }, []);

    const allSelected = settings.showSecondary && settings.showTertiary;

    const toggleAll = () => {
        const newState = !allSelected;
        updateSetting('showSecondary', newState);
        updateSetting('showTertiary', newState);
    };

    return (
        <>
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  (settings.showSecondary || settings.showTertiary)
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                }`}
            >
                <Users size={14} />
                <span className="hidden md:inline">Roles</span>
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && ReactDOM.createPortal(
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
                    <div 
                        className="fixed z-[70] bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2 w-48 flex flex-col gap-1"
                        style={{ top: coords.top, left: coords.left }}
                    >
                        <button 
                            onClick={toggleAll}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700 text-xs text-gray-200 w-full text-left"
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${allSelected ? 'bg-amber-600 border-amber-600' : 'border-gray-500'}`}>
                                {allSelected && <Check size={10} className="text-white" />}
                            </div>
                            All Levels
                        </button>
                        
                        <div className="h-px bg-gray-700 my-1"></div>

                        <button 
                            onClick={() => updateSetting('showSecondary', !settings.showSecondary)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700 text-xs text-gray-200 w-full text-left"
                        >
                             <div className={`w-4 h-4 rounded border flex items-center justify-center ${settings.showSecondary ? 'bg-amber-600 border-amber-600' : 'border-gray-500'}`}>
                                {settings.showSecondary && <Check size={10} className="text-white" />}
                            </div>
                            Secondary Characters
                        </button>

                        <button 
                            onClick={() => updateSetting('showTertiary', !settings.showTertiary)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700 text-xs text-gray-200 w-full text-left"
                        >
                             <div className={`w-4 h-4 rounded border flex items-center justify-center ${settings.showTertiary ? 'bg-amber-600 border-amber-600' : 'border-gray-500'}`}>
                                {settings.showTertiary && <Check size={10} className="text-white" />}
                            </div>
                            Tertiary Characters
                        </button>
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

// Portal-based Hidden Items Dropdown
const HiddenItemsDropdown: React.FC<{
    people: Person[];
    onUnhide: (id: string) => void;
}> = ({ people, onUnhide }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const hiddenPeople = people.filter(p => p.isHidden);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.left
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClose = () => setIsOpen(false);
        window.addEventListener('scroll', handleClose, true);
        window.addEventListener('resize', handleClose);
        return () => {
            window.removeEventListener('scroll', handleClose, true);
            window.removeEventListener('resize', handleClose);
        }
    }, []);

    if (hiddenPeople.length === 0) return null;

    return (
        <>
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40"
            >
                <EyeOff size={14} />
                <span className="hidden md:inline">Hidden ({hiddenPeople.length})</span>
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && ReactDOM.createPortal(
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
                    <div 
                        className="fixed z-[70] bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2 w-56 flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar"
                        style={{ top: coords.top, left: coords.left }}
                    >
                        <div className="text-[10px] uppercase text-gray-500 font-bold px-2 py-1">Hidden Characters</div>
                        {hiddenPeople.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => {
                                    onUnhide(p.id);
                                    // Don't close immediately so user can unhide multiple
                                }}
                                className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-700 text-xs text-gray-200 w-full text-left group"
                            >
                                <span>{p.officialName}</span>
                                <Eye size={12} className="text-gray-500 group-hover:text-amber-500" />
                            </button>
                        ))}
                    </div>
                </>,
                document.body
            )}
        </>
    );
};


const TopBar: React.FC<TopBarProps> = ({ settings, updateSetting, people, onUnhidePerson, onResetView }) => {
  return (
    <div className="h-14 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40 ml-12 lg:ml-0 transition-all">
      
      {/* Spacer for when sidebar is open */}
      <div className="lg:pl-80"></div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
        
        {/* Reset */}
        <button 
            onClick={onResetView}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white"
            title="Reset View"
        >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Reset</span>
        </button>

        <div className="w-px h-6 bg-gray-800 mx-2 shrink-0"></div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-md p-1 border border-gray-700 shrink-0">
          <button 
            onClick={() => updateSetting('zoom', Math.max(2, settings.zoom - 2))}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono w-12 text-center text-gray-400 select-none">{settings.zoom}px/y</span>
          <button 
            onClick={() => updateSetting('zoom', Math.min(50, settings.zoom + 2))}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-800 mx-2 shrink-0"></div>

        {/* Toggles */}
        <VisibilityDropdown settings={settings} updateSetting={updateSetting} />
        
        <HiddenItemsDropdown people={people} onUnhide={onUnhidePerson} />

        <div className="w-px h-6 bg-gray-800 mx-2 shrink-0"></div>

        <ToggleBtn 
          active={settings.showLifespans} 
          onClick={() => updateSetting('showLifespans', !settings.showLifespans)}
          icon={Clock}
          label={LABELS.en.lifespan}
        />
        <ToggleBtn 
          active={settings.showGrid} 
          onClick={() => updateSetting('showGrid', !settings.showGrid)}
          icon={Grid}
          label={LABELS.en.grid}
        />
        <ToggleBtn 
          active={settings.showMarriages} 
          onClick={() => updateSetting('showMarriages', !settings.showMarriages)}
          icon={Heart}
          label={LABELS.en.marriages}
        />
        <ToggleBtn 
          active={settings.showParentalConnections} 
          onClick={() => updateSetting('showParentalConnections', !settings.showParentalConnections)}
          icon={GitMerge}
          label={LABELS.en.connections}
        />
      </div>

      <div className="ml-auto">
        {/* Extra actions if needed */}
      </div>
    </div>
  );
};

export default TopBar;
