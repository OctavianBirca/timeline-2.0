
import React, { useState } from 'react';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PersonEditor from './components/PersonEditor';
import EntityEditor from './components/EntityEditor';
import TitleDefinitionEditor from './components/TitleDefinitionEditor';
import DynastyEditor from './components/DynastyEditor';
import HistoricalGroupEditor from './components/HistoricalGroupEditor';
import InfoModal from './components/InfoModal';
import { 
  Person, PoliticalEntity, Dynasty, HistoricalGroup, TitleDefinition, ViewSettings, 
  CharacterRole, RankLevel 
} from './types';
import { 
  MOCK_PEOPLE, MOCK_ENTITIES, MOCK_DYNASTIES, MOCK_GROUPS, PREDEFINED_TITLES, 
  PIXELS_PER_YEAR_DEFAULT, MIN_YEAR, MAX_YEAR 
} from './constants';

const App: React.FC = () => {
  // State
  const [people, setPeople] = useState<Person[]>(MOCK_PEOPLE);
  const [entities, setEntities] = useState<PoliticalEntity[]>(MOCK_ENTITIES);
  const [dynasties, setDynasties] = useState<Dynasty[]>(MOCK_DYNASTIES);
  const [groups, setGroups] = useState<HistoricalGroup[]>(MOCK_GROUPS);
  const [titleDefinitions, setTitleDefinitions] = useState<TitleDefinition[]>(PREDEFINED_TITLES);
  
  // Track currently selected contexts (Multi-select)
  const [activeGroupIds, setActiveGroupIds] = useState<string[]>(MOCK_GROUPS.length > 0 ? [MOCK_GROUPS[0].id] : []);
  
  // Track hidden entities (Sidebar toggles)
  const [hiddenEntityIds, setHiddenEntityIds] = useState<string[]>([]);
  
  const [settings, setViewSettings] = useState<ViewSettings>({
    zoom: PIXELS_PER_YEAR_DEFAULT,
    showLifespans: true,
    showSecondary: true,
    showTertiary: false,
    showGrid: true,
    showMarriages: true,
    showParentalConnections: true,
    forceVisibleIds: []
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Editors State
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingDynastyId, setEditingDynastyId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // Info Viewing State
  const [viewingInfoItem, setViewingInfoItem] = useState<{
      type: 'person' | 'entity';
      data: Person | PoliticalEntity;
      sections?: { title: string; content: React.ReactNode }[];
  } | null>(null);

  // New person state (temporarily holds new person object before save)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editingEntity, setEditingEntity] = useState<PoliticalEntity | null>(null);

  // Helpers
  const updateSetting = (key: keyof ViewSettings, value: any) => {
    setViewSettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePerson = (updated: Person) => {
    setPeople(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const isPersonVisible = (p: Person) => {
      if (p.isHidden) return false;
      if (settings.forceVisibleIds && settings.forceVisibleIds.includes(p.id)) return true;
      
      // Determine effective role
      let role = p.role;
      if (p.titles.length > 0) {
        if (p.titles.some(t => t.role === CharacterRole.NUCLEUS)) role = CharacterRole.NUCLEUS;
        else if (p.titles.some(t => t.role === CharacterRole.SECONDARY)) role = CharacterRole.SECONDARY;
        else if (p.titles.some(t => t.role === CharacterRole.TERTIARY)) role = CharacterRole.TERTIARY;
      }

      if (role === CharacterRole.NUCLEUS) return true;
      if (role === CharacterRole.SECONDARY) return settings.showSecondary;
      if (role === CharacterRole.TERTIARY) return settings.showTertiary;
      return true;
  };

  // Helper: Get effective role (duplicate logic for handleToggleFamily)
  const getEffectiveRole = (p: Person): CharacterRole => {
      if (p.titles.length > 0) {
          if (p.titles.some(t => t.role === CharacterRole.NUCLEUS)) return CharacterRole.NUCLEUS;
          if (p.titles.some(t => t.role === CharacterRole.SECONDARY)) return CharacterRole.SECONDARY;
          if (p.titles.some(t => t.role === CharacterRole.TERTIARY)) return CharacterRole.TERTIARY;
      }
      return p.role;
  };

  // Logic provided in the snippet
  const handleToggleFamily = (id: string, type: 'ancestors' | 'descendants' | 'spouses') => {
      const person = people.find(p => p.id === id);
      if (!person) return;
      
      let targetIds: string[] = [];
      
      if (type === 'spouses') {
          // Both direct spouseIds AND reverse spouseIds
          const directSpouses = person.spouseIds || [];
          const reverseSpouses = people
            .filter(p => p.spouseIds && p.spouseIds.includes(id))
            .map(p => p.id);
          targetIds = Array.from(new Set([...directSpouses, ...reverseSpouses]));

      } else if (type === 'ancestors') {
          if (person.fatherId) targetIds.push(person.fatherId);
          if (person.motherId) targetIds.push(person.motherId);
          if (person.adoptedParentId) targetIds.push(person.adoptedParentId);
      } else if (type === 'descendants') {
          targetIds = people.filter(p => p.fatherId === id || p.motherId === id).map(p => p.id);
      }
      
      if (targetIds.length === 0) return;

      const targetPeople = people.filter(p => targetIds.includes(p.id));

      // Determine visibility status of targets
      const visibleTargets = targetPeople.filter(p => isPersonVisible(p));
      const areAllVisible = visibleTargets.length === targetPeople.length;

      if (areAllVisible) {
          // HIDE ALL
          setPeople(prev => prev.map(p => targetIds.includes(p.id) ? { ...p, isHidden: true } : p));
          setViewSettings(prev => ({
              ...prev,
              forceVisibleIds: prev.forceVisibleIds.filter(fid => !targetIds.includes(fid))
          }));
      } else {
          // SHOW ALL
          // 1. Unhide them
          setPeople(prev => prev.map(p => targetIds.includes(p.id) ? { ...p, isHidden: false } : p));
          
          // 2. Force visibility if they are typically hidden by role filters
          const idsToForce = targetPeople.filter(p => {
               const role = getEffectiveRole(p);
               if (role === CharacterRole.SECONDARY && !settings.showSecondary) return true;
               if (role === CharacterRole.TERTIARY && !settings.showTertiary) return true;
               return false;
          }).map(p => p.id);

          if (idsToForce.length > 0) {
              setViewSettings(prev => {
                  const current = prev.forceVisibleIds || [];
                  const newIds = [...current];
                  idsToForce.forEach(tid => {
                      if (!newIds.includes(tid)) newIds.push(tid);
                  });
                  return { ...prev, forceVisibleIds: newIds };
              });
          }
      }
  };

  const handleViewInfo = (type: 'person' | 'entity', id: string) => {
      if (type === 'person') {
          const p = people.find(item => item.id === id);
          if (p) {
              const sections = [];
              
              // 1. Parents
              const father = people.find(x => x.id === p.fatherId);
              const mother = people.find(x => x.id === p.motherId);
              const adopted = people.find(x => x.id === p.adoptedParentId);
              
              if (father || mother || adopted) {
                  sections.push({
                      title: 'Parents',
                      content: (
                          <div className="flex flex-col gap-1">
                              {father && <div>Father: <span className="text-amber-500">{father.officialName}</span></div>}
                              {mother && <div>Mother: <span className="text-pink-500">{mother.officialName}</span></div>}
                              {adopted && <div>Adopted Parent: <span className="text-blue-500">{adopted.officialName}</span></div>}
                          </div>
                      )
                  });
              }

              // 2. Spouses
              const spouseIds = [...(p.spouseIds || [])];
              // Reverse lookup
              people.forEach(other => {
                  if (other.spouseIds?.includes(p.id) && !spouseIds.includes(other.id)) {
                      spouseIds.push(other.id);
                  }
              });

              if (spouseIds.length > 0) {
                   const spouseObjs = people.filter(x => spouseIds.includes(x.id));
                   sections.push({
                       title: 'Spouses',
                       content: (
                           <div className="flex flex-wrap gap-2">
                               {spouseObjs.map(s => (
                                   <span key={s.id} className="bg-gray-800 px-2 py-1 rounded text-xs">{s.officialName}</span>
                               ))}
                           </div>
                       )
                   });
              }

              // 3. Children
              const children = people.filter(x => x.fatherId === p.id || x.motherId === p.id);
              if (children.length > 0) {
                  sections.push({
                      title: `Children (${children.length})`,
                      content: (
                          <div className="flex flex-wrap gap-2">
                               {children.map(c => (
                                   <span key={c.id} className="bg-gray-800 px-2 py-1 rounded text-xs border border-gray-700">{c.officialName}</span>
                               ))}
                          </div>
                      )
                  });
              }

              // 4. Titles
              if (p.titles && p.titles.length > 0) {
                  sections.push({
                      title: 'Titles & Positions',
                      content: (
                          <div className="space-y-2">
                              {p.titles.map((t, idx) => {
                                  // Find entity name
                                  const entity = entities.find(e => e.id === t.entityId);
                                  const years = t.periods.map(per => `${per.startYear}-${per.endYear}`).join(', ');
                                  return (
                                      <div key={idx} className="flex flex-col">
                                          <div className="font-bold text-amber-400">{t.name}</div>
                                          <div className="text-xs text-gray-500">{entity?.name || 'Unknown Entity'} • {years}</div>
                                      </div>
                                  )
                              })}
                          </div>
                      )
                  });
              }

              setViewingInfoItem({ type: 'person', data: p, sections });
          }
      } else {
          const e = entities.find(item => item.id === id);
          if (e) setViewingInfoItem({ type: 'entity', data: e });
      }
  };

  // Handlers for Add/Edit
  const handleAddNew = (type: string) => {
      if (type === 'people') {
          const newPerson: Person = {
              id: `p_${Date.now()}`,
              officialName: 'New Person',
              dynastyId: '',
              birthYear: 700,
              deathYear: 750,
              spouseIds: [],
              titles: [],
              role: CharacterRole.SECONDARY,
              verticalPosition: 0,
              isHidden: false
          };
          setEditingPerson(newPerson);
      } else if (type === 'entities') {
          const newEntity: PoliticalEntity = {
              id: `e_${Date.now()}`,
              name: 'New Entity',
              periods: [
                  { 
                      id: `ep_${Date.now()}`,
                      startYear: 700, 
                      endYear: 800, 
                      color: 'rgba(100,100,100,0.5)', 
                      contexts: [], 
                      vassalage: [] 
                  }
              ]
          };
          setEditingEntity(newEntity);
      } else if (type === 'dynasties') {
          const newDynasty: Dynasty = {
              id: `d_${Date.now()}`,
              name: 'New Dynasty',
              color: '#cccccc'
          };
          setDynasties(prev => [...prev, newDynasty]);
          setEditingDynastyId(newDynasty.id);
      } else if (type === 'titles') {
         const newDef: TitleDefinition = {
             id: `td_${Date.now()}`,
             label: 'New Title',
             rank: RankLevel.COUNT
         };
         setTitleDefinitions(prev => [...prev, newDef]);
         setEditingTitleId(newDef.id);
      } else if (type === 'groups') {
          const newGroup: HistoricalGroup = {
              id: `g_${Date.now()}`,
              name: 'New Group'
          };
          setGroups(prev => [...prev, newGroup]);
          setEditingGroupId(newGroup.id);
      }
  };

  const handleEditPerson = (id: string) => {
      const p = people.find(person => person.id === id);
      if (p) setEditingPerson({ ...p });
  };

  const handleSavePerson = (personToSave: Person) => {
      setPeople(prev => {
          const exists = prev.some(p => p.id === personToSave.id);
          if (exists) {
              return prev.map(p => p.id === personToSave.id ? personToSave : p);
          } else {
              return [...prev, personToSave];
          }
      });
      setEditingPerson(null);
  };

  const handleDeletePerson = (id: string) => {
      if (window.confirm("Are you sure you want to delete this person?")) {
          setPeople(prev => prev.filter(p => p.id !== id));
          setEditingPerson(null);
      }
  };

  const handleEditEntity = (id: string) => {
      const e = entities.find(entity => entity.id === id);
      if (e) setEditingEntity({ ...e });
  };

  const handleSaveEntity = (entityToSave: PoliticalEntity) => {
      setEntities(prev => {
          const exists = prev.some(e => e.id === entityToSave.id);
          if (exists) {
              return prev.map(e => e.id === entityToSave.id ? entityToSave : e);
          } else {
              return [...prev, entityToSave];
          }
      });
      setEditingEntity(null);
  };

  const handleDeleteEntity = (id: string) => {
      if (window.confirm("Are you sure you want to delete this entity?")) {
          setEntities(prev => prev.filter(e => e.id !== id));
          setEditingEntity(null);
      }
  };

  const handleDeleteTitleDefinition = (id: string) => {
      if (window.confirm("Are you sure you want to delete this title definition?")) {
          setTitleDefinitions(prev => prev.filter(t => t.id !== id));
          setEditingTitleId(null);
      }
  };

  const handleDeleteDynasty = (id: string) => {
      if (window.confirm("Are you sure you want to delete this dynasty?")) {
          setDynasties(prev => prev.filter(d => d.id !== id));
          setEditingDynastyId(null);
      }
  };

  const handleDeleteGroup = (id: string) => {
      if (window.confirm("Are you sure you want to delete this historical group?")) {
          setGroups(prev => prev.filter(g => g.id !== id));
          setEditingGroupId(null);
      }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white font-sans">
      <TopBar 
        settings={settings} 
        updateSetting={updateSetting} 
        people={people}
        onUnhidePerson={(id) => updatePerson({...people.find(p => p.id === id)!, isHidden: false})}
        onResetView={() => setViewSettings(prev => ({ ...prev, zoom: PIXELS_PER_YEAR_DEFAULT, forceVisibleIds: [] }))}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        entities={entities}
        people={people}
        dynasties={dynasties}
        titleDefinitions={titleDefinitions}
        groups={groups}
        activeGroupIds={activeGroupIds}
        hiddenEntityIds={hiddenEntityIds}
        onUpdateActiveGroups={setActiveGroupIds}
        onToggleEntityVisibility={(id) => {
            setHiddenEntityIds(prev => prev.includes(id) ? prev.filter(hid => hid !== id) : [...prev, id]);
        }}
        onSelectEntity={(id) => {}}
        onEditPerson={handleEditPerson}
        onEditEntity={handleEditEntity}
        onEditTitle={setEditingTitleId}
        onEditDynasty={setEditingDynastyId}
        onEditGroup={setEditingGroupId}
        onAddNew={handleAddNew}
      />

      <div className={`flex-1 relative transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-12'} mt-14`}>
         <Timeline 
            settings={settings}
            people={people}
            entities={entities}
            dynasties={dynasties}
            minYear={MIN_YEAR}
            maxYear={MAX_YEAR}
            activeGroupIds={activeGroupIds}
            hiddenEntityIds={hiddenEntityIds}
            updatePerson={updatePerson}
            onToggleFamily={handleToggleFamily}
            onViewInfo={handleViewInfo}
         />
      </div>

      {/* Modals */}
      {viewingInfoItem && (
          <InfoModal
             title={viewingInfoItem.type === 'person' ? (viewingInfoItem.data as Person).officialName : (viewingInfoItem.data as PoliticalEntity).name}
             subtitle={viewingInfoItem.type === 'person' 
                ? `${(viewingInfoItem.data as Person).birthYear} – ${(viewingInfoItem.data as Person).deathYear}` 
                : `${(viewingInfoItem.data as PoliticalEntity).periods.length} Periods`}
             description={viewingInfoItem.data.description}
             imageUrl={(viewingInfoItem.data as any).imageUrl}
             color={(viewingInfoItem.data as any).periods?.[0]?.color}
             sections={viewingInfoItem.sections}
             onClose={() => setViewingInfoItem(null)}
          />
      )}

      {editingPerson && (
          <PersonEditor 
            person={editingPerson}
            allPeople={people}
            dynasties={dynasties}
            entities={entities}
            titleDefinitions={titleDefinitions}
            onSave={handleSavePerson}
            onDelete={handleDeletePerson}
            onCancel={() => setEditingPerson(null)}
          />
      )}

      {editingEntity && (
          <EntityEditor 
             entity={editingEntity}
             allEntities={entities}
             groups={groups}
             activeGroupId={activeGroupIds[0]} // Pass the first active group as default context
             onSave={handleSaveEntity}
             onDelete={handleDeleteEntity}
             onCancel={() => setEditingEntity(null)}
          />
      )}

      {editingTitleId && (
          <TitleDefinitionEditor 
            titleDef={titleDefinitions.find(t => t.id === editingTitleId)!}
            onSave={(updated) => { setTitleDefinitions(prev => prev.map(t => t.id === updated.id ? updated : t)); setEditingTitleId(null); }}
            onDelete={handleDeleteTitleDefinition}
            onCancel={() => setEditingTitleId(null)}
          />
      )}

      {editingDynastyId && (
          <DynastyEditor 
            dynasty={dynasties.find(d => d.id === editingDynastyId)!}
            onSave={(updated) => { setDynasties(prev => prev.map(d => d.id === updated.id ? updated : d)); setEditingDynastyId(null); }}
            onDelete={handleDeleteDynasty}
            onCancel={() => setEditingDynastyId(null)}
          />
      )}

       {editingGroupId && (
          <HistoricalGroupEditor 
            group={groups.find(g => g.id === editingGroupId)!}
            onSave={(updated) => { setGroups(prev => prev.map(g => g.id === updated.id ? updated : g)); setEditingGroupId(null); }}
            onDelete={handleDeleteGroup}
            onCancel={() => setEditingGroupId(null)}
          />
      )}

    </div>
  );
};

export default App;
