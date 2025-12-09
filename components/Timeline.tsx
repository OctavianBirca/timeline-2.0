
import React, { useMemo, useRef } from 'react';
import { Person, PoliticalEntity, ViewSettings, Dynasty, CharacterRole, HistoricalGroup } from '../types';
import CharacterNode from './CharacterNode';

interface TimelineProps {
  settings: ViewSettings;
  people: Person[];
  entities: PoliticalEntity[];
  dynasties: Dynasty[];
  minYear: number;
  maxYear: number;
  activeGroupId: string;
  updatePerson: (person: Person) => void;
  onToggleFamily: (id: string, type: 'ancestors' | 'descendants' | 'spouses') => void;
}

const Timeline: React.FC<TimelineProps> = ({
  settings,
  people,
  entities,
  dynasties,
  minYear,
  maxYear,
  activeGroupId,
  updatePerson,
  onToggleFamily
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // --- Dynamic Scaling for Global Vision ---
  const globalScale = Math.min(1, Math.max(0.4, settings.zoom / 10));

  // --- Constants for Layout (Scaled) ---
  const TOP_RULER_HEIGHT = 40;
  const BOTTOM_RULER_HEIGHT = 40;
  
  const BASE_SLOT_HEIGHT = 140;
  const SLOT_HEIGHT = BASE_SLOT_HEIGHT * globalScale; // Vertical height per character row
  
  const BASE_ENTITY_LAYER_HEIGHT = 220;
  const ENTITY_LAYER_HEIGHT = BASE_ENTITY_LAYER_HEIGHT * globalScale; // Vertical height per entity layer

  // Image sizes matching CharacterNode.tsx (Scaled)
  const IMG_SIZE_NUCLEUS = 60 * globalScale;
  const IMG_SIZE_SECONDARY = 45 * globalScale;
  const IMG_SIZE_TERTIARY = 30 * globalScale;

  // --- Dimensions & Scales ---
  const totalYears = maxYear - minYear;
  const totalWidth = Math.max(totalYears * settings.zoom, 1000); 
  const yearToX = (year: number) => (year - minYear) * settings.zoom;

  // --- Entities & Layout Calculation relative to Active Group ---
  
  // Flatten periods that are relevant to the active context
  const activePeriods = useMemo(() => {
     const flat = [];
     for(const entity of entities) {
        for(const period of entity.periods) {
            const context = period.contexts.find(c => c.groupId === activeGroupId);
            if(context) {
                flat.push({
                    entityId: entity.id,
                    name: entity.name,
                    periodId: period.id,
                    startYear: period.startYear,
                    endYear: period.endYear,
                    color: period.color,
                    vassalage: period.vassalage,
                    ...context // adds role, heightIndex, rowSpan
                });
            }
        }
     }
     return flat;
  }, [entities, activeGroupId]);

  const maxEntityIndex = useMemo(() => Math.max(0, ...activePeriods.map(p => (p.heightIndex + (p.rowSpan || 1) - 1))), [activePeriods]);
  const maxPersonIndex = useMemo(() => Math.max(0, ...people.filter(p => !p.isHidden).map(p => p.verticalPosition)), [people]);

  const contentHeight = Math.max(
    500,
    Math.max(
      (maxEntityIndex + 1) * ENTITY_LAYER_HEIGHT + 100,
      (maxPersonIndex + 1) * SLOT_HEIGHT + 100
    )
  );

  // --- Y Positioning Helpers ---
  const getPersonY = (index: number) => index * SLOT_HEIGHT + (40 * globalScale);
  const getEntityY = (index: number) => index * ENTITY_LAYER_HEIGHT + (20 * globalScale);
  
  const getEntity = (id: string) => entities.find(e => e.id === id);

  // --- Helper: Get Reign Geometry ---
  const getReignGeometry = (p: Person) => {
    let start = p.birthYear;
    let end = p.deathYear;
    
    if (p.titles.length > 0) {
      const allPeriods = p.titles.flatMap(t => t.periods);
      if (allPeriods.length > 0) {
          start = Math.min(...allPeriods.map(period => period.startYear));
          end = Math.max(...allPeriods.map(period => period.endYear));
      }
    }
    
    return { start, end, mid: (start + end) / 2 };
  };

  // --- Helper: Get Effective Role ---
  const getEffectiveRole = (p: Person): CharacterRole => {
      if (p.titles.length > 0) {
          if (p.titles.some(t => t.role === CharacterRole.NUCLEUS)) return CharacterRole.NUCLEUS;
          if (p.titles.some(t => t.role === CharacterRole.SECONDARY)) return CharacterRole.SECONDARY;
          if (p.titles.some(t => t.role === CharacterRole.TERTIARY)) return CharacterRole.TERTIARY;
      }
      return p.role;
  };
  
  // Helper to get image size from role
  const getImgSize = (role: CharacterRole) => {
      switch (role) {
          case CharacterRole.NUCLEUS: return IMG_SIZE_NUCLEUS;
          case CharacterRole.SECONDARY: return IMG_SIZE_SECONDARY;
          case CharacterRole.TERTIARY: return IMG_SIZE_TERTIARY;
          default: return IMG_SIZE_SECONDARY;
      }
  };

  // --- Filter visible people ---
  const visiblePeople = useMemo(() => {
    return people.filter(p => {
      if (p.isHidden) return false;
      if (settings.forceVisibleIds && settings.forceVisibleIds.includes(p.id)) return true;
      
      const role = getEffectiveRole(p);
      if (role === CharacterRole.NUCLEUS) return true;
      if (role === CharacterRole.SECONDARY) return settings.showSecondary;
      if (role === CharacterRole.TERTIARY) return settings.showTertiary;
      return true;
    });
  }, [people, settings.showSecondary, settings.showTertiary, settings.forceVisibleIds]);

  // --- Ruler Ticks (Every Year) ---
  const yearTicks = useMemo(() => {
    const ticks = [];
    for (let y = minYear; y <= maxYear; y++) {
      ticks.push(y);
    }
    return ticks;
  }, [minYear, maxYear]);

  // --- Path Generator (S-Curve) ---
  const getRoundedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const radius = 15 * globalScale; 
    const midX = (x1 + x2) / 2;
    
    if (Math.abs(x2 - x1) < radius * 2) {
       return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    let d = `M ${x1} ${y1}`;
    const xDir = x2 > x1 ? 1 : -1;
    const yDir = y2 > y1 ? 1 : -1;
    const yDist = Math.abs(y2 - y1);
    const effRadius = Math.min(radius, yDist / 2, Math.abs(x2 - x1) / 2);

    if (yDist < 2) {
         return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    d += ` L ${midX - (effRadius * xDir)} ${y1}`;
    d += ` Q ${midX} ${y1} ${midX} ${y1 + (effRadius * yDir)}`;
    d += ` L ${midX} ${y2 - (effRadius * yDir)}`;
    d += ` Q ${midX} ${y2} ${midX + (effRadius * xDir)} ${y2}`;
    d += ` L ${x2} ${y2}`;
    
    return d;
  };

  // --- Connections (Lines) ---
  const connections = useMemo(() => {
    const lines: React.ReactElement[] = [];
    if (!settings.showParentalConnections && !settings.showMarriages) return lines;

    const drawnMarriages = new Set<string>();

    visiblePeople.forEach(person => {
      // Geometry for current person (Child)
      const role = getEffectiveRole(person);
      const pImgSize = getImgSize(role);
      
      const nodeX = yearToX(person.birthYear);
      const nodeY = getPersonY(person.verticalPosition);
      const pReign = getReignGeometry(person);
      const pReignMidOffset = (pReign.mid - person.birthYear) * settings.zoom;
      
      const pImgCenterX = nodeX + pReignMidOffset;
      const pImgLeftX = pImgCenterX - (pImgSize / 2);
      const pImgRightX = pImgCenterX + (pImgSize / 2);
      const pImgMidY = nodeY + (pImgSize / 2);

      // Parent -> Child (Father AND Mother)
      if (settings.showParentalConnections) {
        // Draw Mother first (bottom layer), then Father (top layer)
        const parents = [
            { id: person.motherId, type: 'mother' },
            { id: person.fatherId, type: 'father' }
        ];

        parents.forEach(parentInfo => {
            if (!parentInfo.id) return;

            const parent = visiblePeople.find(p => p.id === parentInfo.id);
            if (parent) {
                const parentRole = getEffectiveRole(parent);
                const fImgSize = getImgSize(parentRole);
                
                const fNodeX = yearToX(parent.birthYear);
                const fNodeY = getPersonY(parent.verticalPosition);
                
                const fReign = getReignGeometry(parent);
                const fReignMidOffset = (fReign.mid - parent.birthYear) * settings.zoom;
                
                const fImgCenterX = fNodeX + fReignMidOffset;
                const fImgRightX = fImgCenterX + (fImgSize / 2);
                const fImgMidY = fNodeY + (fImgSize / 2);

                const startX = fImgRightX + (2 * globalScale); 
                const startY = fImgMidY;
                const endX = pImgLeftX - (6 * globalScale); 
                const endY = pImgMidY;

                const pathD = getRoundedPath(startX, startY, endX, endY);
                
                const dynasty = dynasties.find(d => d.id === parent.dynastyId);
                const color = parent.color || dynasty?.color || '#666';
                
                let markerId = 'url(#arrowhead-default)';
                if (parent.color) {
                    markerId = `url(#arrowhead-person-${parent.id})`;
                } else if (dynasty) {
                    markerId = `url(#arrowhead-${dynasty.id})`;
                }

                lines.push(
                    <path
                    key={`rel-${parent.id}-${person.id}`}
                    d={pathD}
                    stroke={color}
                    strokeWidth="1"
                    fill="none"
                    markerEnd={markerId}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                    />
                );
            }
        });
      }

      // Marriages
      if (settings.showMarriages && person.spouseIds.length > 0) {
        person.spouseIds.forEach(spouseId => {
             const pairKey = [person.id, spouseId].sort().join(':');
             
             if (drawnMarriages.has(pairKey)) return;

             const spouse = visiblePeople.find(p => p.id === spouseId);
             if (spouse) {
                drawnMarriages.add(pairKey);

                const spouseRole = getEffectiveRole(spouse);
                const sImgSize = getImgSize(spouseRole);
                const sNodeX = yearToX(spouse.birthYear);
                const sNodeY = getPersonY(spouse.verticalPosition);
                
                const sReign = getReignGeometry(spouse);
                const sReignMidOffset = (sReign.mid - spouse.birthYear) * settings.zoom;
                
                const sImgCenterX = sNodeX + sReignMidOffset;
                const sImgLeftX = sImgCenterX - (sImgSize / 2);
                const sImgRightX = sImgCenterX + (sImgSize / 2);
                const sImgMidY = sNodeY + (sImgSize / 2);
                
                let mStartX, mEndX;
                const gap = 4 * globalScale;
                
                if (pImgCenterX < sImgCenterX) {
                    mStartX = pImgRightX + gap;
                    mEndX = sImgLeftX - gap;
                } else {
                    mStartX = pImgLeftX - gap;
                    mEndX = sImgRightX + gap;
                }

                const pathD = getRoundedPath(mStartX, pImgMidY, mEndX, sImgMidY);

                const pDyn = dynasties.find(d => d.id === person.dynastyId);
                const pColor = person.color || pDyn?.color || '#ec4899';

                const sDyn = dynasties.find(d => d.id === spouse.dynastyId);
                const sColor = spouse.color || sDyn?.color || '#ec4899';

                lines.push(
                    <g key={`mar-${pairKey}`} className="opacity-40 hover:opacity-100 group transition-opacity">
                        <path
                            d={pathD}
                            stroke={pColor}
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            fill="none"
                            transform={`translate(0, -${2 * globalScale})`}
                        />
                         <path
                            d={pathD}
                            stroke={sColor}
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            fill="none"
                            transform={`translate(0, ${2 * globalScale})`}
                        />
                    </g>
              );
             }
        });
      }
    });
    return lines;
  }, [visiblePeople, settings, yearToX, dynasties, globalScale]);

  const handleVerticalMove = (id: string, direction: -1 | 1) => {
    const p = people.find(per => per.id === id);
    if(p) {
      updatePerson({
        ...p,
        verticalPosition: Math.max(0, p.verticalPosition + direction)
      });
    }
  };

  const handleToggleHide = (id: string) => {
    const p = people.find(per => per.id === id);
    if(p) {
        updatePerson({ ...p, isHidden: true });
    }
  }

  return (
    <div className="absolute inset-0 overflow-auto timeline-scroll bg-gray-900" ref={containerRef}>
        <div 
            className="flex flex-col relative"
            style={{ 
                width: totalWidth,
                minHeight: '100%' 
            }}
        >
            {/* Top Ruler */}
            <div 
              className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-700 shadow-md shrink-0"
              style={{ height: TOP_RULER_HEIGHT }}
            >
               {yearTicks.map(y => {
                 const isDecade = y % 10 === 0;
                 const isFive = y % 5 === 0;
                 const showLabel = settings.zoom > 15 ? true : settings.zoom > 5 ? isFive : isDecade;
                 const h = isDecade ? 16 : isFive ? 10 : 5;
                 return (
                   <React.Fragment key={`t-ruler-${y}`}>
                     <div 
                        className={`absolute bottom-0 border-l ${isDecade ? 'border-gray-500' : 'border-gray-700'}`} 
                        style={{ left: yearToX(y), height: h }} 
                     />
                     {showLabel && (
                        <div 
                            className="absolute bottom-2 text-[10px] text-amber-500/90 font-mono select-none translate-x-1" 
                            style={{ left: yearToX(y) }}
                        >
                            {y}
                        </div>
                     )}
                   </React.Fragment>
                 );
               })}
            </div>

            {/* Content Body */}
            <div className="relative flex-grow w-full" style={{ height: contentHeight }}>
                {/* Grid */}
                {settings.showGrid && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    {yearTicks.filter(y => y % 10 === 0).map(y => (
                        <div key={`grid-${y}`} className="absolute top-0 bottom-0 border-l border-gray-800/30" style={{ left: yearToX(y) }} />
                    ))}
                  </div>
                )}

                {/* Entities (Active Context Only) */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {activePeriods.map((period, i) => {
                      const x = yearToX(period.startYear);
                      const w = yearToX(period.endYear) - x;
                      const y = getEntityY(period.heightIndex);
                      const rowSpan = period.rowSpan || 1;
                      const height = (ENTITY_LAYER_HEIGHT * rowSpan) - (40 * globalScale);

                      // Only show text if wide enough to be readable
                      const showText = w > 60;

                      return (
                        <div
                          key={`${period.entityId}-${period.periodId}-${i}`}
                          title={`${period.name} (${period.startYear} - ${period.endYear})`}
                          className={`absolute rounded-md flex flex-col justify-center text-white/40 font-bold uppercase tracking-widest text-lg overflow-hidden pointer-events-auto hover:bg-white/5 transition-colors`}
                          style={{
                            left: x,
                            width: w,
                            top: y,
                            height: height,
                            backgroundColor: period.color,
                            border: '1px solid rgba(255,255,255,0.05)',
                            fontSize: `${18 * globalScale}px`,
                            alignItems: 'center'
                          }}
                        >
                          {/* Main Entity Block Content */}
                          {showText && (
                            <div className="sticky left-1/2 -translate-x-1/2 flex flex-col items-center text-center max-w-[95%] py-2 z-10">
                                <span className="whitespace-normal leading-tight">{period.name}</span>
                                <span className="text-[0.7em] opacity-70 whitespace-nowrap mt-1">{period.startYear} – {period.endYear}</span>
                            </div>
                          )}
                          
                          {/* Vassalage Overlays */}
                          {period.vassalage && period.vassalage.map((vassal, vIdx) => {
                              // Ensure vassal period is within main period
                              const vStart = Math.max(vassal.startYear, period.startYear);
                              const vEnd = Math.min(vassal.endYear, period.endYear);
                              if(vStart >= vEnd) return null;
                              
                              const vx = (vStart - period.startYear) * settings.zoom;
                              const vw = (vEnd - vStart) * settings.zoom;
                              
                              return (
                                  <div 
                                    key={`vas-${vIdx}`}
                                    className="absolute top-0 bottom-0 pattern-diagonal-lines border-x border-white/20"
                                    style={{ left: vx, width: vw }}
                                    title={`Vassal to ${entities.find(e => e.id === vassal.liegeId)?.name || 'Unknown'}`}
                                  />
                              );
                          })}
                        </div>
                      );
                  })}
                </div>

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                  <defs>
                    <marker id="arrowhead-default" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#888" />
                    </marker>
                    {dynasties.map(d => (
                         <marker key={d.id} id={`arrowhead-${d.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill={d.color} />
                         </marker>
                    ))}
                    {visiblePeople.filter(p => p.color).map(p => (
                         <marker key={`person-color-${p.id}`} id={`arrowhead-person-${p.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill={p.color} />
                         </marker>
                    ))}
                  </defs>
                  {connections}
                </svg>

                {/* Nodes */}
                <div className="absolute inset-0 z-30">
                  {visiblePeople.map(p => {
                    const width = yearToX(p.deathYear) - yearToX(p.birthYear);
                    const x = yearToX(p.birthYear);
                    const y = getPersonY(p.verticalPosition);
                    const reign = getReignGeometry(p);
                    const contentOffset = (reign.mid - p.birthYear) * settings.zoom;

                    return (
                      <CharacterNode
                        key={p.id}
                        person={p}
                        dynasty={dynasties.find(d => d.id === p.dynastyId)}
                        getEntity={getEntity}
                        x={x}
                        y={y}
                        width={Math.max(width, 140)} 
                        contentOffset={contentOffset}
                        settings={settings}
                        onToggleHide={handleToggleHide}
                        onVerticalMove={handleVerticalMove}
                        onToggleFamily={onToggleFamily}
                        scale={globalScale}
                      />
                    );
                  })}
                </div>
            </div>

            {/* Bottom Ruler */}
            <div 
              className="sticky bottom-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] shrink-0 mt-auto"
              style={{ height: BOTTOM_RULER_HEIGHT }}
            >
               {yearTicks.map(y => {
                 const isDecade = y % 10 === 0;
                 const isFive = y % 5 === 0;
                 const showLabel = settings.zoom > 15 ? true : settings.zoom > 5 ? isFive : isDecade;
                 const h = isDecade ? 16 : isFive ? 10 : 5;

                 return (
                   <React.Fragment key={`b-ruler-${y}`}>
                     <div 
                        className={`absolute top-0 border-l ${isDecade ? 'border-gray-500' : 'border-gray-700'}`} 
                        style={{ left: yearToX(y), height: h }} 
                     />
                     {showLabel && (
                        <div className="absolute top-2 text-[10px] text-amber-500/90 font-mono select-none translate-x-1" style={{ left: yearToX(y) }}>
                            {y}
                        </div>
                     )}
                   </React.Fragment>
                 );
               })}
            </div>

        </div>
    </div>
  );
};

export default Timeline;
