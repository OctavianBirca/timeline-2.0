
import React, { useState } from 'react';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PersonEditor from './components/PersonEditor';
import EntityEditor from './components/EntityEditor';
import TitleDefinitionEditor from './components/TitleDefinitionEditor';
import DynastyEditor from './components/DynastyEditor';
import HistoricalGroupEditor from './components/HistoricalGroupEditor';
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

  // Logic provided in the snippet
  const handleToggleFamily = (id: string, type: 'ancestors' | 'descendants' | 'spouses') => {
      const person = people.find(p => p.id === id);
      if (!person) return;
      
      let targetIds: string[] = [];
      
      if (type === 'spouses') {
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
      const areAllVisible = targetPeople.length > 0 && targetPeople.every(p => isPersonVisible(p));

      if (areAllVisible) {
          setPeople(prev => prev.map(p => targetIds.includes(p.id) ? { ...p, isHidden: true } : p));
          setViewSettings(prev => ({
              ...prev,
              forceVisibleIds: prev.forceVisibleIds.filter(fid => !targetIds.includes(fid))
          }));
      } else {
          setPeople(prev => prev.map(p => targetIds.includes(p.id) ? { ...p, isHidden: false } : p));
          setViewSettings(prev => {
              const current = prev.forceVisibleIds || [];
              const newIds = [...current];
              targetIds.forEach(tid => {
                  if (!newIds.includes(tid)) newIds.push(tid);
              });
              return { ...prev, forceVisibleIds: newIds };
          });
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
          setPeople(prev => [...prev, newPerson]);
          setEditingPersonId(newPerson.id);
      } else if (type === 'entities') {
          const newEntity: PoliticalEntity = {
              id: `e_${Date.now()}`,
              name: 'New Entity',
              color: 'rgba(100, 100, 100, 0.5)',
              periods: [{ startYear: 700, endYear: 800 }],
              role: CharacterRole.SECONDARY,
              heightIndex: 0,
              rowSpan: 1
          };
          setEntities(prev => [...prev, newEntity]);
          setEditingEntityId(newEntity.id);
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
        onSelectEntity={(id) => {}}
        onEditPerson={setEditingPersonId}
        onEditEntity={setEditingEntityId}
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
            updatePerson={updatePerson}
            onToggleFamily={handleToggleFamily}
         />
      </div>

      {/* Modals */}
      {editingPersonId && (
          <PersonEditor 
            person={people.find(p => p.id === editingPersonId)!}
            allPeople={people}
            dynasties={dynasties}
            entities={entities}
            titleDefinitions={titleDefinitions}
            onSave={(updated) => { updatePerson(updated); setEditingPersonId(null); }}
            onCancel={() => setEditingPersonId(null)}
          />
      )}

      {editingEntityId && (
          <EntityEditor 
             entity={entities.find(e => e.id === editingEntityId)!}
             allEntities={entities}
             onSave={(updated) => { setEntities(prev => prev.map(e => e.id === updated.id ? updated : e)); setEditingEntityId(null); }}
             onCancel={() => setEditingEntityId(null)}
          />
      )}

      {editingTitleId && (
          <TitleDefinitionEditor 
            titleDef={titleDefinitions.find(t => t.id === editingTitleId)!}
            onSave={(updated) => { setTitleDefinitions(prev => prev.map(t => t.id === updated.id ? updated : t)); setEditingTitleId(null); }}
            onCancel={() => setEditingTitleId(null)}
          />
      )}

      {editingDynastyId && (
          <DynastyEditor 
            dynasty={dynasties.find(d => d.id === editingDynastyId)!}
            onSave={(updated) => { setDynasties(prev => prev.map(d => d.id === updated.id ? updated : d)); setEditingDynastyId(null); }}
            onCancel={() => setEditingDynastyId(null)}
          />
      )}

       {editingGroupId && (
          <HistoricalGroupEditor 
            group={groups.find(g => g.id === editingGroupId)!}
            onSave={(updated) => { setGroups(prev => prev.map(g => g.id === updated.id ? updated : g)); setEditingGroupId(null); }}
            onCancel={() => setEditingGroupId(null)}
          />
      )}

    </div>
  );
};

export default App;
