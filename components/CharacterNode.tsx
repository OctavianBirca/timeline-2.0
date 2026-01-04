
import React, { useState, useMemo, useEffect } from 'react';
import { Person, Dynasty, ViewSettings, PoliticalEntity, CharacterRole } from '../types';
import { MONTHS } from '../constants';
import { EyeOff, Heart, Plus, Info } from 'lucide-react';

interface CharacterNodeProps {
  person: Person;
  dynasty?: Dynasty;
  getEntity: (id: string) => PoliticalEntity | undefined;
  x: number;
  y: number;
  width: number;
  contentOffset?: number; // Distance in pixels from left edge (Birth Year) to center of Reign
  settings: ViewSettings;
  onToggleHide: (id: string) => void;
  onPositionChange: (id: string, deltaY: number) => void;
  onToggleFamily: (id: string, type: 'ancestors' | 'descendants' | 'spouses') => void;
  onViewInfo: (id: string) => void;
  scale?: number; // Dynamic scale factor for semantic zooming (default 1)
}

const CharacterNode: React.FC<CharacterNodeProps> = ({
  person,
  dynasty,
  getEntity,
  x,
  y,
  width,
  contentOffset = 0,
  settings,
  onToggleHide,
  onPositionChange,
  onToggleFamily,
  onViewInfo,
  scale = 1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragDy, setDragDy] = useState(0);

  // Highlighting State
  const isHighlighted = settings.highlightedDynastyId === person.dynastyId && !!settings.highlightedDynastyId;

  // Drag Logic
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
        setDragDy(prev => prev + e.movementY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        onPositionChange(person.id, dragDy);
        setDragDy(0); // Reset local visual offset after commit
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragDy, onPositionChange, person.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      e.stopPropagation(); // Prevent canvas panning if implemented
      setIsDragging(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onViewInfo(person.id);
  };

  // Determine Effective Role: Nucleus > Secondary > Tertiary
  const effectiveRole = useMemo(() => {
    if (person.titles.length > 0) {
        if (person.titles.some(t => t.role === CharacterRole.NUCLEUS)) return CharacterRole.NUCLEUS;
        if (person.titles.some(t => t.role === CharacterRole.SECONDARY)) return CharacterRole.SECONDARY;
        if (person.titles.some(t => t.role === CharacterRole.TERTIARY)) return CharacterRole.TERTIARY;
    }
    return person.role;
  }, [person]);

  // Use person's custom color if set, otherwise fallback to dynasty color
  const borderColor = person.color || dynasty?.color || '#9ca3af';
  
  // Sizing Logic: Nucleus 50 (was 40), Secondary 30, Tertiary 20 (all scaled)
  let baseSize = 30;
  if (effectiveRole === CharacterRole.NUCLEUS) baseSize = 50; // Increased to 50
  else if (effectiveRole === CharacterRole.TERTIARY) baseSize = 20;

  const imageSize = baseSize * scale;
  
  // Calculate specific width for the lifespan line
  const lifespanWidth = (person.deathYear - person.birthYear) * settings.zoom;
  
  // Helper to format full date string
  const formatDate = (year: number, month?: number, day?: number) => {
      let str = `${year}`;
      if (month) {
          const m = MONTHS.find(m => m.value === month);
          if (m) str = `${m.label} ${str}`;
          if (day) str = `${day} ${str}`;
      }
      return str;
  };

  // Calculate Age Duration
  const ageDisplay = useMemo(() => {
      let years = person.deathYear - person.birthYear;
      // Adjust for months if available
      if (person.birthMonth && person.deathMonth) {
          if (person.deathMonth < person.birthMonth) {
              years--;
          } else if (person.deathMonth === person.birthMonth && person.birthDay && person.deathDay) {
               if (person.deathDay < person.birthDay) {
                   years--;
               }
          }
      }
      return `${years} years`;
  }, [person]);

  // Sort titles by Rank (asc) then positionIndex for correct vertical stacking
  // Rank 0 (Pope) > Rank 2 (King) > Rank 3 (Duke)
  const sortedTitles = useMemo(() => {
      return [...person.titles].sort((a, b) => {
          const rankA = a.rank ?? 99;
          const rankB = b.rank ?? 99;
          
          if (rankA !== rankB) {
              return rankA - rankB; // Lower number = Higher rank = Higher in list
          }
          
          return (a.positionIndex || 0) - (b.positionIndex || 0);
      });
  }, [person.titles]);

  // Layout calculations based on scale
  const lifespanTopOffset = imageSize + (4 * scale);
  const namePlateWidth = 130 * scale;
  const fontSizeBase = Math.max(8, 11 * scale); 
  const fontSizeSmall = Math.max(7, 9 * scale);
  const titleTrackHeight = 20 * scale; // Increased from 14 to 20 for more padding

  // Toggle button style
  const sideBtnStyle = {
      width: `${16 * scale}px`,
      height: `${16 * scale}px`,
      top: '50%',
      marginTop: `-${8 * scale}px`,
      fontSize: `${10 * scale}px`
  };

  return (
    <div
      className={`absolute flex flex-col items-start group select-none transition-opacity duration-300 ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab hover:z-40'} ${settings.highlightedDynastyId && !isHighlighted ? 'opacity-30' : 'opacity-100'}`}
      style={{
        left: x,
        top: y + dragDy, // Apply drag offset visually
        width: width,
        transition: isDragging ? 'none' : 'top 0.3s ease-in-out, opacity 0.3s ease-in-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Lifespan Line (Strictly Birth to Death) */}
      {settings.showLifespans && (
         <div 
          className="absolute h-1 bg-gray-600 rounded z-10"
          style={{ 
              left: 0,
              width: `${Math.max(lifespanWidth, 2)}px`,
              top: `${lifespanTopOffset}px`,
              height: `${Math.max(2, 4 * scale)}px`
          }}
         />
      )}

      {/* Center Anchor for Image and Name (Shifted by contentOffset) */}
      <div 
        className="relative flex flex-col items-center z-20"
        style={{ 
            marginLeft: `${contentOffset}px`, 
            transform: 'translateX(-50%)', // Center the content on the offset point
            width: 'max-content' // Ensure it doesn't stretch
        }}
      >
        {/* Action Buttons Overlay (Visible on Hover) */}
        <div 
          className={`absolute flex gap-2 transition-opacity duration-200 ${isHovered && !isDragging ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: `-${24 * scale}px`, transform: `scale(${scale})` }}
        >
            <button 
                onClick={(e) => { e.stopPropagation(); onViewInfo(person.id); }}
                className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 text-blue-400"
                title="View Info"
            >
                <Info size={12} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleFamily(person.id, 'spouses'); }}
                className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 text-red-400"
                title="Toggle Spouses Visibility"
            >
                <Heart size={12} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleHide(person.id); }}
                className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-300"
                title="Hide Character"
            >
                <EyeOff size={12} />
            </button>
        </div>

        {/* Portrait Container */}
        <div className="relative">
            {/* Expand Ancestors (Left) */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleFamily(person.id, 'ancestors'); }} 
                className={`absolute -left-5 bg-gray-800 text-gray-400 rounded-full hover:bg-amber-900 hover:text-amber-500 border border-gray-600 flex items-center justify-center transition-opacity z-30 ${isHovered && !isDragging ? 'opacity-100' : 'opacity-0'}`}
                style={sideBtnStyle}
                title="Expand Ancestors"
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
            >
                <Plus size={10 * scale} />
            </button>

            {/* Portrait */}
            <div 
                className={`rounded-full overflow-hidden bg-gray-900 shadow-lg relative z-20 transition-all duration-300 ${isHighlighted ? 'scale-110 shadow-[0_0_20px_#fbbf24]' : ''}`}
                style={{
                    borderColor: isHighlighted ? '#fbbf24' : borderColor,
                    borderWidth: isHighlighted ? `${4 * scale}px` : `${2 * scale}px`,
                    borderStyle: 'solid',
                    width: imageSize,
                    height: imageSize,
                    minHeight: imageSize,
                }}
            >
                {person.imageUrl ? (
                <img src={person.imageUrl} alt={person.officialName} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                <div 
                    className="w-full h-full flex items-center justify-center bg-gray-800 text-center"
                    style={{ fontSize: `${10 * scale}px` }}
                >
                    No Img
                </div>
                )}
            </div>

            {/* Expand Descendants (Right) */}
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleFamily(person.id, 'descendants'); }}
                className={`absolute -right-5 bg-gray-800 text-gray-400 rounded-full hover:bg-amber-900 hover:text-amber-500 border border-gray-600 flex items-center justify-center transition-opacity z-30 ${isHovered && !isDragging ? 'opacity-100' : 'opacity-0'}`}
                style={sideBtnStyle}
                title="Expand Descendants"
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
            >
                 <Plus size={10 * scale} />
            </button>
        </div>

        {/* Name Plate */}
        <div 
            className="flex flex-col gap-1 w-full items-center relative z-30"
            style={{ marginTop: `${4 * scale}px` }} 
        >
            <div 
                className={`bg-gray-800/90 backdrop-blur-sm border rounded-md text-center shadow-lg transition-colors duration-300 ${isHighlighted ? 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)] bg-amber-950/40' : 'border-gray-700'}`}
                style={{ 
                    padding: `${2 * scale}px ${6 * scale}px`, // Reduced vertical padding
                    maxWidth: `${namePlateWidth}px`
                }}
            >
                
                {/* Name */}
                <div 
                    className={`font-bold truncate leading-tight transition-colors ${isHighlighted ? 'text-amber-200' : 'text-white'}`}
                    style={{ fontSize: `${fontSizeBase}px` }}
                >
                    {person.officialName}
                </div>
                
                {/* Lifespan Years & Duration */}
                {settings.showLifespans && (
                    <div style={{ marginTop: `${1 * scale}px` }}>
                        <div 
                            className="text-gray-400 font-mono leading-tight"
                            style={{ fontSize: `${fontSizeSmall}px` }}
                        >
                        {formatDate(person.birthYear, person.birthMonth, person.birthDay)} — {formatDate(person.deathYear, person.deathMonth, person.deathDay)}
                        </div>
                        <div 
                            className="text-gray-500 italic leading-tight"
                            style={{ fontSize: `${fontSizeSmall}px` }}
                        >
                            ({ageDisplay})
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Titles Stack (Timeline Accurate - Reset to start at Birth Year) */}
      <div 
        className="flex flex-col w-full relative z-30 items-start"
        style={{ marginTop: `${4 * scale}px` }}
      >
        {sortedTitles.map((title) => {
          const entity = getEntity(title.entityId);
          // Determine the range of the whole Title (from min start to max end) to define the track
          if (title.periods.length === 0) return null;

          const minStart = Math.min(...title.periods.map(p => p.startYear));
          const maxEnd = Math.max(...title.periods.map(p => p.endYear));
          
          const trackLeft = (minStart - person.birthYear) * settings.zoom;
          const trackWidth = (maxEnd - minStart) * settings.zoom;
          
          const bgColor = entity?.periods[0]?.color ? entity.periods[0].color.replace(/[\d.]+\)$/g, '0.8)') : 'rgba(127, 29, 29, 0.8)';
          const borderColor = entity?.periods[0]?.color ? entity.periods[0].color.replace(/[\d.]+\)$/g, '1)') : 'rgba(153, 27, 27, 1)';

          return (
            <div 
              key={title.id}
              className="relative"
              style={{
                marginLeft: `${trackLeft}px`,
                width: `${Math.max(trackWidth, 4)}px`,
                height: `${titleTrackHeight}px`,
                marginBottom: `${2 * scale}px`
              }}
            >
                {/* Render distinct segments for each period */}
                {title.periods.map((period, pIdx) => {
                    const segLeft = (period.startYear - minStart) * settings.zoom;
                    const segWidth = (period.endYear - period.startYear) * settings.zoom;
                    
                    // Logic to determine if text should be inside or below
                    const isNarrow = segWidth < 80;
                    
                    // Check if period dates should be hidden
                    const showDates = !period.isHidden;
                    const isHiddenPeriod = period.isHidden || false;

                    return (
                        <div
                            key={pIdx}
                            className="absolute top-0 bottom-0 flex flex-col items-center group/segment"
                            style={{
                                left: `${segLeft}px`,
                                width: `${Math.max(segWidth, 4)}px`,
                            }}
                        >
                            {/* The Colored Bar - rounded-md */}
                            <div 
                                className="w-full h-full rounded-md overflow-hidden flex flex-col justify-center transition-colors"
                                style={{
                                    backgroundColor: isHiddenPeriod ? 'transparent' : bgColor,
                                    borderColor: isHiddenPeriod ? 'transparent' : borderColor,
                                    borderWidth: isHiddenPeriod ? 0 : 1,
                                    borderStyle: 'solid',
                                    boxShadow: isHiddenPeriod ? 'none' : undefined
                                }}
                            >
                                {/* Title Name (Inside) - only if wide enough AND not hidden */}
                                {pIdx === 0 && !isNarrow && (
                                    <div 
                                        className="font-bold text-white leading-none break-words whitespace-normal text-center px-1"
                                        style={{ 
                                            fontSize: `${fontSizeSmall}px`,
                                            textShadow: isHiddenPeriod ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                                        }}
                                    >
                                        {title.name}
                                    </div>
                                )}
                                {/* Years (Inside) - if wide enough AND visible */}
                                {showDates && segWidth > 30 && (
                                    <div 
                                        className="text-white/90 leading-none text-center font-mono"
                                        style={{ fontSize: `${Math.max(6, 8 * scale)}px`, marginTop: `${2 * scale}px` }}
                                    >
                                        {formatDate(period.startYear, period.startMonth)}–{period.endYear}
                                    </div>
                                )}
                            </div>

                            {/* Title Name (Below) - if narrow */}
                            {pIdx === 0 && isNarrow && (
                                <div 
                                    className="absolute top-full bg-gray-900/90 text-gray-200 font-medium rounded border border-gray-700 whitespace-nowrap z-50 shadow-md"
                                    style={{
                                        marginTop: `${4 * scale}px`,
                                        padding: `${2 * scale}px ${6 * scale}px`,
                                        fontSize: `${fontSizeSmall}px`
                                    }}
                                >
                                    {title.name} {showDates && <span className="text-gray-500 font-mono">({formatDate(period.startYear, period.startMonth)}-{period.endYear})</span>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default CharacterNode;
