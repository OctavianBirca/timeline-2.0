import React, { useMemo, useRef } from 'react';
import { Person, PoliticalEntity, ViewSettings, Dynasty, CharacterRole } from '../types';
import CharacterNode from './CharacterNode';

interface TimelineProps {
  settings: ViewSettings;
  people: Person[];
  entities: PoliticalEntity[];
  dynasties: Dynasty[];
  minYear: number;
  maxYear: number;
  updatePerson: (person: Person) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  settings,
  people,
  entities,
  dynasties,
  minYear,
  maxYear,
  updatePerson
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // --- Constants for Layout ---
  const TOP_RULER_HEIGHT = 40;
  const BOTTOM_RULER_HEIGHT = 40;
  const SLOT_HEIGHT = 140; // Vertical height per character row
  const ENTITY_LAYER_HEIGHT = 220; // Vertical height per entity layer

  // Image sizes matching CharacterNode.tsx
  const IMG_SIZE_NUCLEUS = 60;
  const IMG_SIZE_SECONDARY = 45;

  // --- Dimensions & Scales ---
  const totalYears = maxYear - minYear;
  const totalWidth = Math.max(totalYears * settings.zoom, 1000); 
  const yearToX = (year: number) => (year - minYear) * settings.zoom;

  // --- Height Calculation ---
  const maxEntityIndex = useMemo(() => Math.max(0, ...entities.map(e => e.heightIndex)), [entities]);
  const maxPersonIndex = useMemo(() => Math.max(0, ...people.filter(p => !p.isHidden).map(p => p.verticalPosition)), [people]);

  const contentHeight = Math.max(
    500,
    Math.max(
      (maxEntityIndex + 1) * ENTITY_LAYER_HEIGHT + 100,
      (maxPersonIndex + 1) * SLOT_HEIGHT + 100
    )
  );

  // --- Y Positioning Helpers ---
  const getPersonY = (index: number) => index * SLOT_HEIGHT + 40;
  const getEntityY = (index: number) => index * ENTITY_LAYER_HEIGHT + 20;
  
  const getEntity = (id: string) => entities.find(e => e.id === id);

  // --- Helper: Get Reign Geometry ---
  // Returns start, end, and mid year of the "active/reign" period
  const getReignGeometry = (p: Person) => {
    let start = p.birthYear;
    let end = p.deathYear;
    
    if (p.titles.length > 0) {
      // Flatten all periods from all titles
      const allPeriods = p.titles.flatMap(t => t.periods);
      if (allPeriods.length > 0) {
          start = Math.min(...allPeriods.map(period => period.startYear));
          end = Math.max(...allPeriods.map(period => period.endYear));
      }
    }
    
    return { start, end, mid: (start + end) / 2 };
  };

  // --- Helper: Check Nucleus Status ---
  const isPersonNucleus = (p: Person) => {
      if (p.titles.length > 0) {
          return p.titles.some(t => t.role === CharacterRole.NUCLEUS);
      }
      return p.role === CharacterRole.NUCLEUS;
  };

  // --- Filter visible people ---
  const visiblePeople = useMemo(() => {
    return people.filter(p => {
      if (p.isHidden) return false;
      // If person is nucleus (based on titles or fallback), always show. 
      // If secondary, check settings.
      const isNucleus = isPersonNucleus(p);
      if (!settings.showSecondary && !isNucleus) return false;
      return true;
    });
  }, [people, settings.showSecondary]);

  // --- Ruler Ticks (Every Year) ---
  const yearTicks = useMemo(() => {
    const ticks = [];
    for (let y = minYear; y <= maxYear; y++) {
      ticks.push(y);
    }
    return ticks;
  }, [minYear, maxYear]);

  // --- Path Generator for Rounded Corners (Horizontal -> Vertical -> Horizontal) ---
  const getRoundedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const radius = 15;
    const midX = (x1 + x2) / 2;
    
    // If horizontal distance is too small, direct line
    if (Math.abs(x2 - x1) < radius * 2) {
       return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    // Logic:
    // 1. Start (x1, y1)
    // 2. Horizontal to midX
    // 3. Vertical to y2
    // 4. Horizontal to x2

    let d = `M ${x1} ${y1}`;

    // Direction for curve on X axis (always right usually, but safe to check)
    const xDir = x2 > x1 ? 1 : -1;
    // Direction for curve on Y axis
    const yDir = y2 > y1 ? 1 : -1;

    // Line to first corner start
    // We want to turn at midX. So we go to midX - radius
    
    // Adjust radius if vertical distance is tiny
    const yDist = Math.abs(y2 - y1);
    const effRadius = Math.min(radius, yDist / 2, Math.abs(x2 - x1) / 2);

    if (yDist < 2) {
         // Straight horizontal line if Ys are basically same
         return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    // 1. Horizontal segment to first turn
    d += ` L ${midX - (effRadius * xDir)} ${y1}`;
    
    // 2. Curve 1 (Horizontal to Vertical)
    d += ` Q ${midX} ${y1} ${midX} ${y1 + (effRadius * yDir)}`;

    // 3. Vertical segment
    d += ` L ${midX} ${y2 - (effRadius * yDir)}`;

    // 4. Curve 2 (Vertical to Horizontal)
    d += ` Q ${midX} ${y2} ${midX + (effRadius * xDir)} ${y2}`;

    // 5. Final Horizontal segment
    d += ` L ${x2} ${y2}`;

    return d;
  };

  // --- Connections (Lines) ---
  const connections = useMemo(() => {
    const lines: React.ReactElement[] = [];
    if (!settings.showParentalConnections && !settings.showMarriages) return lines;

    visiblePeople.forEach(person => {
      // Geometry for current person (Child)
      const isNucleus = isPersonNucleus(person);
      const pImgSize = isNucleus ? IMG_SIZE_NUCLEUS : IMG_SIZE_SECONDARY;
      
      // Node Origin (Birth Year)
      const nodeX = yearToX(person.birthYear);
      const nodeY = getPersonY(person.verticalPosition);
      
      // Calculate Image Center based on Reign
      const pReign = getReignGeometry(person);
      const pReignMidOffset = (pReign.mid - person.birthYear) * settings.zoom;
      
      // Absolute Coordinates of Image Center and Edges
      const pImgCenterX = nodeX + pReignMidOffset;
      const pImgLeftX = pImgCenterX - (pImgSize / 2);
      const pImgRightX = pImgCenterX + (pImgSize / 2);
      const pImgMidY = nodeY + (pImgSize / 2);

      // Parent -> Child (Father AND Mother)
      if (settings.showParentalConnections) {
        // Swap order: Render Mother first (bottom), then Father (top)
        const parents = [
            { id: person.motherId, type: 'mother' },
            { id: person.fatherId, type: 'father' }
        ];

        parents.forEach(parentInfo => {
            if (!parentInfo.id) return;

            const parent = visiblePeople.find(p => p.id === parentInfo.id);
            if (parent) {
                const isParentNucleus = isPersonNucleus(parent);
                const fImgSize = isParentNucleus ? IMG_SIZE_NUCLEUS : IMG_SIZE_SECONDARY;
                
                const fNodeX = yearToX(parent.birthYear);
                const fNodeY = getPersonY(parent.verticalPosition);
                
                const fReign = getReignGeometry(parent);
                const fReignMidOffset = (fReign.mid - parent.birthYear) * settings.zoom;
                
                const fImgCenterX = fNodeX + fReignMidOffset;
                const fImgRightX = fImgCenterX + (fImgSize / 2);
                const fImgMidY = fNodeY + (fImgSize / 2);

                // Connection: Parent Right Edge -> Child Left Edge
                // Add small gap so line doesn't overlap border
                const startX = fImgRightX + 2; 
                const startY = fImgMidY;
                const endX = pImgLeftX - 6; // Leave room for arrow head
                const endY = pImgMidY;

                const pathD = getRoundedPath(startX, startY, endX, endY);
                
                const dynasty = dynasties.find(d => d.id === parent.dynastyId);
                
                // Use person override color if present, else dynasty color
                const color = parent.color || dynasty?.color || '#666';
                
                // Determine marker
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
                    strokeWidth="2"
                    fill="none"
                    markerEnd={markerId}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                    />
                );
            }
        });
      }

      // Marriages (Double Dashed line between images)
      if (settings.showMarriages && person.spouseIds.length > 0) {
        person.spouseIds.forEach(spouseId => {
          if (person.id < spouseId) { // Draw once
             const spouse = visiblePeople.find(p => p.id === spouseId);
             if (spouse) {
                // Calculate Spouse Geometry
                const isSpouseNucleus = isPersonNucleus(spouse);
                const sImgSize = isSpouseNucleus ? IMG_SIZE_NUCLEUS : IMG_SIZE_SECONDARY;
                const sNodeX = yearToX(spouse.birthYear);
                const sNodeY = getPersonY(spouse.verticalPosition);
                
                const sReign = getReignGeometry(spouse);
                const sReignMidOffset = (sReign.mid - spouse.birthYear) * settings.zoom;
                
                const sImgCenterX = sNodeX + sReignMidOffset;
                const sImgLeftX = sImgCenterX - (sImgSize / 2);
                const sImgRightX = sImgCenterX + (sImgSize / 2);
                const sImgMidY = sNodeY + (sImgSize / 2);
                
                // Determine Left/Right relationship based on calculated visual centers
                
                let mStartX, mEndX;
                
                if (pImgCenterX < sImgCenterX) {
                    mStartX = pImgRightX + 4;
                    mEndX = sImgLeftX - 4;
                } else {
                    mStartX = pImgLeftX - 4;
                    mEndX = sImgRightX + 4;
                }

                const pathD = getRoundedPath(mStartX, pImgMidY, mEndX, sImgMidY);

                // Double line: Draw two parallel paths slightly offset
                lines.push(
                    <g key={`mar-${person.id}-${spouseId}`} className="opacity-40 hover:opacity-100 group">
                        <path
                            d={pathD}
                            stroke="#ec4899"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            fill="none"
                            transform="translate(0, -2)"
                        />
                         <path
                            d={pathD}
                            stroke="#ec4899"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            fill="none"
                            transform="translate(0, 2)"
                        />
                    </g>
              );
             }
          }
        });
      }
    });
    return lines;
  }, [visiblePeople, settings, yearToX, dynasties]);

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
            
            {/* --- Sticky Top Ruler --- */}
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

            {/* --- Main Content Body --- */}
            <div className="relative flex-grow w-full" style={{ height: contentHeight }}>
                
                {/* Background Grid Lines */}
                {settings.showGrid && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    {yearTicks.filter(y => y % 10 === 0).map(y => (
                        <div key={`grid-${y}`} className="absolute top-0 bottom-0 border-l border-gray-800/30" style={{ left: yearToX(y) }} />
                    ))}
                  </div>
                )}

                {/* Political Entities Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {entities.map((entity, i) => (
                    entity.periods.map((period, idx) => {
                      const x = yearToX(period.startYear);
                      const w = yearToX(period.endYear) - x;
                      const isVassal = !!period.isVassalTo;
                      const y = getEntityY(entity.heightIndex);
                      
                      return (
                        <div
                          key={`${entity.id}-${idx}`}
                          className={`absolute rounded-md flex items-end justify-center pb-2 text-white/40 font-bold uppercase tracking-widest text-lg overflow-hidden ${isVassal ? 'pattern-diagonal-lines' : ''}`}
                          style={{
                            left: x,
                            width: w,
                            top: y,
                            height: ENTITY_LAYER_HEIGHT - 40,
                            backgroundColor: entity.color,
                            border: isVassal ? '1px dashed rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)'
                          }}
                        >
                          {!isVassal && <span className="sticky left-1/2 whitespace-nowrap px-4">{entity.name}</span>}
                        </div>
                      )
                    })
                  ))}
                </div>

                {/* Connections SVG Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                  <defs>
                    <marker id="arrowhead-default" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#888" />
                    </marker>
                    {/* Generate colored markers for each dynasty */}
                    {dynasties.map(d => (
                         <marker key={d.id} id={`arrowhead-${d.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill={d.color} />
                         </marker>
                    ))}
                    {/* Generate custom markers for people with override colors */}
                    {visiblePeople.filter(p => p.color).map(p => (
                         <marker key={`person-color-${p.id}`} id={`arrowhead-person-${p.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill={p.color} />
                         </marker>
                    ))}
                  </defs>
                  {connections}
                </svg>

                {/* Character Nodes Layer */}
                <div className="absolute inset-0 z-30">
                  {visiblePeople.map(p => {
                    const width = yearToX(p.deathYear) - yearToX(p.birthYear);
                    const x = yearToX(p.birthYear);
                    const y = getPersonY(p.verticalPosition);
                    
                    // Calculate visual offset based on Reign Center
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
                        width={Math.max(width, 140)} // Keep min width for rendering container interaction
                        contentOffset={contentOffset}
                        settings={settings}
                        onToggleHide={handleToggleHide}
                        onVerticalMove={handleVerticalMove}
                      />
                    );
                  })}
                </div>
            </div>

            {/* --- Sticky Bottom Ruler --- */}
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