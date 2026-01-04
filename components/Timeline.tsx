
import React, { useMemo, useRef, useEffect } from 'react';
import { Person, PoliticalEntity, ViewSettings, Dynasty, CharacterRole, HistoricalGroup } from '../types';
import CharacterNode from './CharacterNode';
import { Info } from 'lucide-react';

interface TimelineProps {
  settings: ViewSettings;
  people: Person[];
  entities: PoliticalEntity[];
  dynasties: Dynasty[];
  minYear: number;
  maxYear: number;
  activeGroupIds: string[];
  hiddenEntityIds: string[];
  updatePerson: (person: Person) => void;
  onToggleFamily: (id: string, type: 'ancestors' | 'descendants' | 'spouses') => void;
  onViewInfo: (type: 'person' | 'entity', id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  settings,
  people,
  entities,
  dynasties,
  minYear,
  maxYear,
  activeGroupIds,
  hiddenEntityIds,
  updatePerson,
  onToggleFamily,
  onViewInfo
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const globalScale = Math.min(1, Math.max(0.4, settings.zoom / 10));

  const TOP_RULER_HEIGHT = 40;
  const BOTTOM_RULER_HEIGHT = 40;
  const BASE_SLOT_HEIGHT = 60;
  const SLOT_HEIGHT = BASE_SLOT_HEIGHT * globalScale;
  const BASE_ENTITY_LAYER_HEIGHT = 160;
  const ENTITY_LAYER_HEIGHT = BASE_ENTITY_LAYER_HEIGHT * globalScale;

  const IMG_SIZE_NUCLEUS = 50 * globalScale;
  const IMG_SIZE_SECONDARY = 30 * globalScale; 
  const IMG_SIZE_TERTIARY = 20 * globalScale; 

  const totalYears = maxYear - minYear;
  const totalWidth = Math.max(totalYears * settings.zoom, 1000); 
  const yearToX = (year: number) => (year - minYear) * settings.zoom;

  // --- AUTOFOCUS LOGIC ---
  useEffect(() => {
    if (settings.highlightedDynastyId && containerRef.current) {
      // Find all people in this dynasty
      const dynastyMembers = people.filter(p => p.dynastyId === settings.highlightedDynastyId && !p.isHidden);
      if (dynastyMembers.length > 0) {
        // Sort by birth year to find the first one
        const sortedMembers = [...dynastyMembers].sort((a, b) => a.birthYear - b.birthYear);
        const firstMember = sortedMembers[0];
        
        // Calculate X position
        const targetX = yearToX(firstMember.birthYear);
        
        // Center the view on that year (subtract half of viewport width)
        const viewportWidth = containerRef.current.clientWidth;
        const scrollTarget = Math.max(0, targetX - (viewportWidth / 3)); 
        
        containerRef.current.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, [settings.highlightedDynastyId]);

  const activePeriods = useMemo(() => {
     const flat = [];
     for(const entity of entities) {
        if (hiddenEntityIds.includes(entity.id)) continue;
        for(const period of entity.periods) {
            const matchingContexts = period.contexts.filter(c => activeGroupIds.includes(c.groupId));
            if (matchingContexts.length > 0) {
                matchingContexts.sort((a, b) => {
                    const score = (r: CharacterRole) => r === CharacterRole.NUCLEUS ? 3 : r === CharacterRole.SECONDARY ? 2 : 1;
                    return score(b.role) - score(a.role);
                });
                const bestContext = matchingContexts[0];
                flat.push({
                    entityId: entity.id,
                    name: entity.name,
                    periodId: period.id,
                    startYear: period.startYear,
                    endYear: period.endYear,
                    color: period.color,
                    vassalage: period.vassalage,
                    ...bestContext
                });
            }
        }
     }
     return flat;
  }, [entities, activeGroupIds, hiddenEntityIds]);

  const maxEntityIndex = useMemo(() => Math.max(0, ...activePeriods.map(p => (p.heightIndex + (p.rowSpan || 1) - 1))), [activePeriods]);
  const contentHeight = Math.max(800, TOP_RULER_HEIGHT + (maxEntityIndex + 2) * ENTITY_LAYER_HEIGHT + 200);

  const getEntityY = (index: number) => TOP_RULER_HEIGHT + (index * ENTITY_LAYER_HEIGHT);
  
  const getPersonY = (person: Person): number => {
      const validTitles = person.titles.filter(t => {
          const entity = entities.find(e => e.id === t.entityId);
          if (!entity || hiddenEntityIds.includes(entity.id)) return false;
          return entity.periods.some(ep => 
              ep.contexts.some(c => activeGroupIds.includes(c.groupId)) && 
              Math.max(ep.startYear, person.birthYear) < Math.min(ep.endYear, person.deathYear)
          );
      });

      validTitles.sort((a, b) => {
          const rankA = a.rank !== undefined ? a.rank : 99;
          const rankB = b.rank !== undefined ? b.rank : 99;
          if (rankA !== rankB) return rankA - rankB;
          const startA = a.periods.length > 0 ? Math.min(...a.periods.map(p => p.startYear)) : 9999;
          const startB = b.periods.length > 0 ? Math.min(...b.periods.map(p => p.startYear)) : 9999;
          return startA - startB;
      });

      const relevantTitle = validTitles[0];

      if (relevantTitle) {
          const entity = entities.find(e => e.id === relevantTitle.entityId);
          if (entity) {
              const matchingPeriods = entity.periods.filter(ep => 
                  Math.max(ep.startYear, person.birthYear) < Math.min(ep.endYear, person.deathYear) &&
                  ep.contexts.some(c => activeGroupIds.includes(c.groupId))
              );
              if (matchingPeriods.length > 0) {
                  const period = matchingPeriods[0];
                  const matchingContexts = period.contexts.filter(c => activeGroupIds.includes(c.groupId));
                  matchingContexts.sort((a, b) => {
                      const score = (r: CharacterRole) => r === CharacterRole.NUCLEUS ? 3 : r === CharacterRole.SECONDARY ? 2 : 1;
                      return score(b.role) - score(a.role);
                  });
                  const bestContext = matchingContexts[0];
                  if (bestContext) {
                      const entityBaseY = getEntityY(bestContext.heightIndex);
                      const shift = relevantTitle.verticalShift || 0;
                      return entityBaseY + (shift * (IMG_SIZE_NUCLEUS * 1.5)) + (20 * globalScale); 
                  }
              }
          }
      }

      const fallbackBaseY = TOP_RULER_HEIGHT + ((maxEntityIndex + 1) * ENTITY_LAYER_HEIGHT) + (20 * globalScale);
      return fallbackBaseY + (person.verticalPosition * SLOT_HEIGHT);
  };
  
  const getEntity = (id: string) => entities.find(e => e.id === id);

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

  const getEffectiveRole = (p: Person): CharacterRole => {
      const validTitles = p.titles.filter(t => {
          const entity = entities.find(e => e.id === t.entityId);
          if (!entity || hiddenEntityIds.includes(entity.id)) return false;
          return entity.periods.some(ep => ep.contexts.some(c => activeGroupIds.includes(c.groupId)));
      });

      if (validTitles.length > 0) {
          if (validTitles.some(t => t.role === CharacterRole.NUCLEUS)) return CharacterRole.NUCLEUS;
          if (validTitles.some(t => t.role === CharacterRole.SECONDARY)) return CharacterRole.SECONDARY;
          if (validTitles.some(t => t.role === CharacterRole.TERTIARY)) return CharacterRole.TERTIARY;
      }
      return p.role;
  };
  
  const getImgSize = (role: CharacterRole) => {
      switch (role) {
          case CharacterRole.NUCLEUS: return IMG_SIZE_NUCLEUS;
          case CharacterRole.SECONDARY: return IMG_SIZE_SECONDARY;
          case CharacterRole.TERTIARY: return IMG_SIZE_TERTIARY;
          default: return IMG_SIZE_SECONDARY;
      }
  };

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
  }, [people, settings.showSecondary, settings.showTertiary, settings.forceVisibleIds, hiddenEntityIds, activeGroupIds, entities]);

  const yearTicks = useMemo(() => {
    const ticks = [];
    for (let y = minYear; y <= maxYear; y++) ticks.push(y);
    return ticks;
  }, [minYear, maxYear]);

  const getRoundedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const radius = 15 * globalScale; 
    const midX = (x1 + x2) / 2;
    if (Math.abs(x2 - x1) < radius * 2) return `M ${x1} ${y1} L ${x2} ${y2}`;
    let d = `M ${x1} ${y1}`;
    const xDir = x2 > x1 ? 1 : -1;
    const yDir = y2 > y1 ? 1 : -1;
    const yDist = Math.abs(y2 - y1);
    const effRadius = Math.min(radius, yDist / 2, Math.abs(x2 - x1) / 2);
    if (yDist < 2) return `M ${x1} ${y1} L ${x2} ${y2}`;
    d += ` L ${midX - (effRadius * xDir)} ${y1}`;
    d += ` Q ${midX} ${y1} ${midX} ${y1 + (effRadius * yDir)}`;
    d += ` L ${midX} ${y2 - (effRadius * yDir)}`;
    d += ` Q ${midX} ${y2} ${midX + (effRadius * xDir)} ${y2}`;
    d += ` L ${x2} ${y2}`;
    return d;
  };

  const connections = useMemo(() => {
    const lines: React.ReactElement[] = [];
    if (!settings.showParentalConnections && !settings.showMarriages) return lines;

    const drawnMarriages = new Set<string>();
    const trackedDynasty = settings.highlightedDynastyId;

    visiblePeople.forEach(person => {
      const role = getEffectiveRole(person);
      const pImgSize = getImgSize(role);
      const nodeX = yearToX(person.birthYear);
      const nodeY = getPersonY(person);
      const pReign = getReignGeometry(person);
      const pReignMidOffset = (pReign.mid - person.birthYear) * settings.zoom;
      const pImgCenterX = nodeX + pReignMidOffset;
      const pImgLeftX = pImgCenterX - (pImgSize / 2);
      const pImgRightX = pImgCenterX + (pImgSize / 2);
      const pImgMidY = nodeY + (pImgSize / 2);

      const isPersonTracked = trackedDynasty && person.dynastyId === trackedDynasty;

      if (settings.showParentalConnections) {
        const parents = [{ id: person.motherId, type: 'mother' }, { id: person.fatherId, type: 'father' }];
        parents.forEach(parentInfo => {
            if (!parentInfo.id) return;
            const parent = visiblePeople.find(p => p.id === parentInfo.id);
            if (parent) {
                const isParentTracked = trackedDynasty && parent.dynastyId === trackedDynasty;
                const isLinkHighlighted = trackedDynasty && (isPersonTracked || isParentTracked);

                const pRole = getEffectiveRole(parent);
                const fImgSize = getImgSize(pRole);
                const fNodeX = yearToX(parent.birthYear);
                const fNodeY = getPersonY(parent);
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
                
                let color = parent.color || dynasty?.color || '#666';
                let strokeWidth = isLinkHighlighted ? "2.5" : "1";
                let opacity = isLinkHighlighted ? "1" : "0.6";
                let markerId = isLinkHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead-default)';

                if (isLinkHighlighted) {
                    color = "#fbbf24";
                } else {
                    if (parent.color) markerId = `url(#arrowhead-person-${parent.id})`;
                    else if (dynasty) markerId = `url(#arrowhead-${dynasty.id})`;
                }

                lines.push(
                    <path
                        key={`rel-${parent.id}-${person.id}`}
                        d={pathD}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        markerEnd={markerId}
                        style={{ opacity }}
                        className="transition-all duration-300 hover:opacity-100"
                    />
                );
            }
        });
      }

      if (settings.showMarriages && person.spouseIds.length > 0) {
        person.spouseIds.forEach(spouseId => {
             const pairKey = [person.id, spouseId].sort().join(':');
             if (drawnMarriages.has(pairKey)) return;
             const spouse = visiblePeople.find(p => p.id === spouseId);
             if (spouse) {
                drawnMarriages.add(pairKey);
                const isSpouseTracked = trackedDynasty && spouse.dynastyId === trackedDynasty;
                const isMarriageHighlighted = trackedDynasty && (isPersonTracked || isSpouseTracked);

                const sRole = getEffectiveRole(spouse);
                const sImgSize = getImgSize(sRole);
                const sNodeX = yearToX(spouse.birthYear);
                const sNodeY = getPersonY(spouse);
                const sReign = getReignGeometry(spouse);
                const sReignMidOffset = (sReign.mid - spouse.birthYear) * settings.zoom;
                const sImgCenterX = sNodeX + sReignMidOffset;
                const sImgLeftX = sImgCenterX - (sImgSize / 2);
                const sImgRightX = sImgCenterX + (sImgSize / 2);
                const sImgMidY = sNodeY + (sImgSize / 2);
                
                let mStartX, mEndX;
                const gap = 4 * globalScale;
                if (pImgCenterX < sImgCenterX) { mStartX = pImgRightX + gap; mEndX = sImgLeftX - gap; }
                else { mStartX = pImgLeftX - gap; mEndX = sImgRightX + gap; }

                const pathD = getRoundedPath(mStartX, pImgMidY, mEndX, sImgMidY);
                const pDyn = dynasties.find(d => d.id === person.dynastyId);
                const sDyn = dynasties.find(d => d.id === spouse.dynastyId);
                
                const pColor = isMarriageHighlighted ? "#fbbf24" : (person.color || pDyn?.color || '#ec4899');
                const sColor = isMarriageHighlighted ? "#fbbf24" : (spouse.color || sDyn?.color || '#ec4899');
                const strokeWidth = isMarriageHighlighted ? "2.5" : "1.5";

                lines.push(
                    <g key={`mar-${pairKey}`} style={{ opacity: isMarriageHighlighted ? "1" : "0.4" }} className="group transition-opacity duration-300">
                        <path d={pathD} stroke={pColor} strokeWidth={strokeWidth} strokeDasharray="4 2" fill="none" transform={`translate(0, -${2 * globalScale})`} />
                        <path d={pathD} stroke={sColor} strokeWidth={strokeWidth} strokeDasharray="4 2" fill="none" transform={`translate(0, ${2 * globalScale})`} />
                    </g>
              );
             }
        });
      }
    });
    return lines;
  }, [visiblePeople, settings, yearToX, dynasties, globalScale, activeGroupIds, entities, hiddenEntityIds]);

  const handlePositionChange = (id: string, deltaPixels: number) => {
      const p = people.find(per => per.id === id);
      if(!p) return;
      const unitPixels = IMG_SIZE_NUCLEUS * 1.5;
      const deltaUnits = deltaPixels / unitPixels;
      if(p.titles.length > 0) {
        const newTitles = [...p.titles];
        const newShift = Math.round(((newTitles[0].verticalShift || 0) + deltaUnits) * 10) / 10;
        newTitles[0] = { ...newTitles[0], verticalShift: newShift };
        updatePerson({ ...p, titles: newTitles });
      } else {
        const newPos = Math.round((p.verticalPosition + (deltaPixels / SLOT_HEIGHT)) * 10) / 10;
        updatePerson({ ...p, verticalPosition: newPos });
      }
  };

  const handleToggleHide = (id: string) => {
    const p = people.find(per => per.id === id);
    if(p) updatePerson({ ...p, isHidden: true });
  }

  return (
    <div className="absolute inset-0 overflow-auto timeline-scroll bg-gray-900" ref={containerRef}>
        <div className="flex flex-col relative" style={{ width: totalWidth, minHeight: '100%' }}>
            <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-700 shadow-md shrink-0" style={{ height: TOP_RULER_HEIGHT }}>
               {yearTicks.map(y => {
                 const isDecade = y % 10 === 0;
                 const isFive = y % 5 === 0;
                 const showLabel = settings.zoom > 15 ? true : settings.zoom > 5 ? isFive : isDecade;
                 return (
                   <React.Fragment key={`t-ruler-${y}`}>
                     <div className={`absolute bottom-0 border-l ${isDecade ? 'border-gray-500' : 'border-gray-700'}`} style={{ left: yearToX(y), height: isDecade ? 16 : isFive ? 10 : 5 }} />
                     {showLabel && <div className="absolute bottom-2 text-[10px] text-amber-500/90 font-mono select-none translate-x-1" style={{ left: yearToX(y) }}>{y}</div>}
                   </React.Fragment>
                 );
               })}
            </div>

            <div className="relative flex-grow w-full" style={{ height: contentHeight }}>
                {settings.showGrid && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    {yearTicks.filter(y => y % 10 === 0).map(y => <div key={`grid-${y}`} className="absolute top-0 bottom-0 border-l border-gray-800/30" style={{ left: yearToX(y) }} />)}
                  </div>
                )}

                <div className="absolute inset-0 z-10 pointer-events-none">
                  {activePeriods.map((period, i) => {
                      const x = yearToX(period.startYear);
                      const w = yearToX(period.endYear) - x;
                      const y = getEntityY(period.heightIndex);
                      const rowSpan = period.rowSpan || 1;
                      return (
                        <div key={`${period.entityId}-${period.periodId}-${i}`} className={`absolute rounded-md flex flex-col justify-center text-white/40 font-bold uppercase tracking-widest text-lg overflow-hidden pointer-events-auto hover:bg-white/5 transition-colors group/entity`}
                          style={{ left: x, width: w, top: y, height: (ENTITY_LAYER_HEIGHT * rowSpan) - 1, backgroundColor: period.color, fontSize: `${18 * globalScale}px`, alignItems: 'center' }}>
                          {w > 60 && <div className="flex flex-col items-center text-center max-w-[95%] py-2 z-10 pointer-events-none"><span className="whitespace-normal leading-tight text-white/40 font-black drop-shadow-sm">{period.name}</span><span className="text-[0.75em] whitespace-nowrap mt-0.5 font-mono text-white/30 drop-shadow-sm">{period.startYear} – {period.endYear}</span></div>}
                          {period.vassalage && period.vassalage.map((vassal, vIdx) => {
                              const vStart = Math.max(vassal.startYear, period.startYear);
                              const vEnd = Math.min(vassal.endYear, period.endYear);
                              if(vStart >= vEnd) return null;
                              return <div key={`vas-${vIdx}`} className="absolute top-0 bottom-0 pattern-diagonal-lines border-x border-white/20 z-0" style={{ left: (vStart - period.startYear) * settings.zoom, width: (vEnd - vStart) * settings.zoom }} />;
                          })}
                        </div>
                      );
                  })}
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                  <defs>
                    <marker id="arrowhead-default" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#888" />
                    </marker>
                    <marker id="arrowhead-highlight" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                      <polygon points="0 0, 10 4, 0 8" fill="#fbbf24" />
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

                <div className="absolute inset-0 z-25 pointer-events-none">
                    {activePeriods.map((period, i) => (
                        <div key={`info-btn-${period.entityId}-${i}`} className="absolute pointer-events-auto" style={{ left: yearToX(period.startYear) + 4, top: getEntityY(period.heightIndex) + 4 }}>
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); onViewInfo('entity', period.entityId); }} className="p-1 bg-black/20 hover:bg-black/60 text-white/50 hover:text-white rounded-full transition-colors backdrop-blur-sm shadow-sm" title="Info"><Info size={Math.max(12, 12 * globalScale)} /></button>
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 z-30">
                  {visiblePeople.map(p => {
                    const reign = getReignGeometry(p);
                    return <CharacterNode key={p.id} person={p} dynasty={dynasties.find(d => d.id === p.dynastyId)} getEntity={getEntity} x={yearToX(p.birthYear)} y={getPersonY(p)} width={Math.max(yearToX(p.deathYear) - yearToX(p.birthYear), 140)} contentOffset={(reign.mid - p.birthYear) * settings.zoom} settings={settings} onToggleHide={handleToggleHide} onPositionChange={handlePositionChange} onToggleFamily={onToggleFamily} onViewInfo={(id) => onViewInfo('person', id)} scale={globalScale} />;
                  })}
                </div>
            </div>

            <div className="sticky bottom-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] shrink-0 mt-auto" style={{ height: BOTTOM_RULER_HEIGHT }}>
               {yearTicks.map(y => {
                 const isDecade = y % 10 === 0;
                 const showLabel = settings.zoom > 15 ? true : settings.zoom > 5 ? y % 5 === 0 : isDecade;
                 return (
                   <React.Fragment key={`b-ruler-${y}`}>
                     <div className={`absolute top-0 border-l ${isDecade ? 'border-gray-500' : 'border-gray-700'}`} style={{ left: yearToX(y), height: isDecade ? 16 : y % 5 === 0 ? 10 : 5 }} />
                     {showLabel && <div className="absolute top-2 text-[10px] text-amber-500/90 font-mono select-none translate-x-1" style={{ left: yearToX(y) }}>{y}</div>}
                   </React.Fragment>
                 );
               })}
            </div>
        </div>
    </div>
  );
};

export default Timeline;
