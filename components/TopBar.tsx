import React from 'react';
import { ZoomIn, ZoomOut, Eye, Grid, Heart, GitMerge, Clock } from 'lucide-react';
import { ViewSettings } from '../types';
import { LABELS } from '../constants';

interface TopBarProps {
  settings: ViewSettings;
  updateSetting: (key: keyof ViewSettings, value: any) => void;
}

const TopBar: React.FC<TopBarProps> = ({ settings, updateSetting }) => {
  
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

  return (
    <div className="h-14 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40 ml-12 lg:ml-0 transition-all">
      
      {/* Spacer for when sidebar is open (handled by ml on mobile, logic elsewhere for desktop) */}
      <div className="lg:pl-80"></div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-md p-1 border border-gray-700">
          <button 
            onClick={() => updateSetting('zoom', Math.max(2, settings.zoom - 2))}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono w-12 text-center text-gray-400">{settings.zoom}px/y</span>
          <button 
            onClick={() => updateSetting('zoom', Math.min(50, settings.zoom + 2))}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-800 mx-2"></div>

        {/* Toggles */}
        <ToggleBtn 
          active={settings.showLifespans} 
          onClick={() => updateSetting('showLifespans', !settings.showLifespans)}
          icon={Clock}
          label={LABELS.en.lifespan}
        />
        <ToggleBtn 
          active={settings.showSecondary} 
          onClick={() => updateSetting('showSecondary', !settings.showSecondary)}
          icon={Eye}
          label={LABELS.en.secondary}
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