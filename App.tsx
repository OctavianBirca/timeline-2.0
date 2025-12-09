
import React, { useState, useCallback } from 'react';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PersonEditor from './components/PersonEditor';
import EntityEditor from './components/EntityEditor';
import TitleDefinitionEditor from './components/TitleDefinitionEditor';
import DynastyEditor from './components/DynastyEditor';
import HistoricalGroupEditor from './components/HistoricalGroupEditor';
import { 
  PIXELS_PER_YEAR_DEFAULT,
  MOCK_ENTITIES,
  MOCK_PEOPLE,
  MOCK_DYNASTIES,
  MOCK_GROUPS,
  MIN_YEAR,
  MAX_YEAR,
  PREDEFINED_TITLES
} from './constants';
import { 
  ViewSettings, 
  PoliticalEntity, 
  Person, 
  Dynasty,
  CharacterRole,
  TitleDefinition,
  RankLevel,
  HistoricalGroup
} from './types';

const App: React.FC = () => {
  // --- Global State ---
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Edit States
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editingEntity, setEditingEntity] = useState<PoliticalEntity | null>(null);
  const [editingTitleDefinition, setEditingTitleDefinition] = useState<TitleDefinition | null>(null);
  const [editingDynasty, setEditingDynasty] = useState<Dynasty | null>(null);
  const [editingGroup, setEditingGroup] = useState<HistoricalGroup | null>(null);
  
  // View Settings State
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    zoom: PIXELS_PER_YEAR_DEFAULT,
    showLifespans: true,
    showSecondary: true,
    showTertiary: true,
    showGrid: true,
    showMarriages: true,
    showParentalConnections: true
  });

  // Data State
  const [entities, setEntities] = useState<PoliticalEntity[]>(MOCK_ENTITIES);
  const [dynasties, setDynasties] = useState<Dynasty[]>(MOCK_DYNASTIES);
  const [people, setPeople] = useState<Person[]>(MOCK_PEOPLE);
  const [titleDefinitions, setTitleDefinitions] = useState<TitleDefinition[]>(PREDEFINED_TITLES);
  const [groups, setGroups] = useState<HistoricalGroup[]>(MOCK_GROUPS);

  // --- Handlers ---
  const handleUpdateSetting = useCallback((key: keyof ViewSettings, value: any) => {
    setViewSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // --- Person Handling ---
  const handleUpdatePerson = useCallback((updatedPerson: Person) => {
      setPeople(prev => {
        const exists = prev.some(p => p.id === updatedPerson.id);
        if (exists) {
            return prev.map(p => p.id === updatedPerson.id ? updatedPerson : p);
        } else {
            return [...prev, updatedPerson];
        }
      });
  }, []);

  const handleSavePerson = (updatedPerson: Person) => {
    handleUpdatePerson(updatedPerson);
    setEditingPerson(null);
  };

  const handleEditPerson = (id: string) => {
      const person = people.find(p => p.id === id);
      if (person) setEditingPerson(person);
  };

  // --- Entity Handling ---
  const handleUpdateEntity = useCallback((updatedEntity: PoliticalEntity) => {
    setEntities(prev => {
      const exists = prev.some(e => e.id === updatedEntity.id);
      if (exists) {
        return prev.map(e => e.id === updatedEntity.id ? updatedEntity : e);
      } else {
        return [...prev, updatedEntity];
      }
    });
  }, []);

  const handleSaveEntity = (updatedEntity: PoliticalEntity) => {
    handleUpdateEntity(updatedEntity);
    setEditingEntity(null);
  };

  const handleEditEntity = (id: string) => {
    const entity = entities.find(e => e.id === id);
    if (entity) setEditingEntity(entity);
  };

  // --- Title Definition Handling ---
  const handleUpdateTitleDefinition = useCallback((updatedDef: TitleDefinition) => {
    setTitleDefinitions(prev => {
      const exists = prev.some(t => t.id === updatedDef.id);
      if (exists) {
        return prev.map(t => t.id === updatedDef.id ? updatedDef : t);
      } else {
        return [...prev, updatedDef];
      }
    });
  }, []);

  const handleSaveTitleDefinition = (updatedDef: TitleDefinition) => {
    handleUpdateTitleDefinition(updatedDef);
    setEditingTitleDefinition(null);
  };

  const handleEditTitleDefinition = (id: string) => {
      const def = titleDefinitions.find(t => t.id === id);
      if (def) setEditingTitleDefinition(def);
  };

  // --- Dynasty Handling ---
  const handleUpdateDynasty = useCallback((updatedDynasty: Dynasty) => {
    setDynasties(prev => {
      const exists = prev.some(d => d.id === updatedDynasty.id);
      if (exists) {
        return prev.map(d => d.id === updatedDynasty.id ? updatedDynasty : d);
      } else {
        return [...prev, updatedDynasty];
      }
    });
  }, []);

  const handleSaveDynasty = (updatedDynasty: Dynasty) => {
    handleUpdateDynasty(updatedDynasty);
    setEditingDynasty(null);
  };

  const handleEditDynasty = (id: string) => {
      const dyn = dynasties.find(d => d.id === id);
      if (dyn) setEditingDynasty(dyn);
  };

  // --- Historical Group Handling ---
  const handleUpdateGroup = useCallback((updatedGroup: HistoricalGroup) => {
    setGroups(prev => {
      const exists = prev.some(g => g.id === updatedGroup.id);
      if (exists) {
        return prev.map(g => g.id === updatedGroup.id ? updatedGroup : g);
      } else {
        return [...prev, updatedGroup];
      }
    });
  }, []);

  const handleSaveGroup = (updatedGroup: HistoricalGroup) => {
    handleUpdateGroup(updatedGroup);
    setEditingGroup(null);
  };

  const handleEditGroup = (id: string) => {
      const grp = groups.find(g => g.id === id);
      if (grp) setEditingGroup(grp);
  };


  // --- Add New Handling ---
  const handleAddNew = (type: string) => {
      if (type === 'people') {
          const newPerson: Person = {
              id: `person_${Date.now()}`,
              officialName: "New Character",
              dynastyId: "",
              birthYear: 700,
              deathYear: 750,
              spouseIds: [],
              titles: [],
              role: CharacterRole.SECONDARY,
              verticalPosition: 0
          };
          setEditingPerson(newPerson);
      } else if (type === 'entities') {
          const newEntity: PoliticalEntity = {
            id: `entity_${Date.now()}`,
            name: "New Entity",
            color: "rgba(100, 100, 100, 0.3)",
            role: CharacterRole.SECONDARY,
            heightIndex: entities.length,
            periods: [{ startYear: 500, endYear: 600 }]
          };
          setEditingEntity(newEntity);
      } else if (type === 'titles') {
          const newTitleDef: TitleDefinition = {
              id: `title_${Date.now()}`,
              label: "New Title",
              rank: RankLevel.COUNT
          };
          setEditingTitleDefinition(newTitleDef);
      } else if (type === 'dynasties') {
          const newDynasty: Dynasty = {
              id: `dynasty_${Date.now()}`,
              name: "New Dynasty",
              color: "#ffffff"
          };
          setEditingDynasty(newDynasty);
      } else if (type === 'groups') {
          const newGroup: HistoricalGroup = {
              id: `group_${Date.now()}`,
              name: "New Historical Group"
          };
          setEditingGroup(newGroup);
      } else {
          alert(`Adding new ${type} is not implemented in this demo.`);
      }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-gray-200 font-sans selection:bg-amber-900 selection:text-white">
      
      {/* Left Sidebar (Fixed width handled by component) */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        entities={entities}
        people={people}
        dynasties={dynasties}
        titleDefinitions={titleDefinitions}
        groups={groups}
        onSelectEntity={(id) => console.log("Selected", id)}
        onEditPerson={handleEditPerson}
        onEditEntity={handleEditEntity}
        onEditTitle={handleEditTitleDefinition}
        onEditDynasty={handleEditDynasty}
        onEditGroup={handleEditGroup}
        onAddNew={handleAddNew}
      />

      {/* Main Content Layout */}
      <div 
        className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-80' : 'ml-12'}`}
      >
        {/* Fixed Top Bar */}
        <div className="h-14 w-full relative z-50">
           <TopBar settings={viewSettings} updateSetting={handleUpdateSetting} />
        </div>

        {/* Scrollable Timeline Area Wrapper */}
        <div className="flex-1 relative overflow-hidden bg-gray-900 shadow-inner"> 
          <Timeline 
             settings={viewSettings}
             people={people}
             entities={entities}
             dynasties={dynasties}
             minYear={MIN_YEAR}
             maxYear={MAX_YEAR}
             updatePerson={handleUpdatePerson}
          />
        </div>
      </div>

      {/* Editors */}
      {editingPerson && (
        <PersonEditor 
          person={editingPerson}
          allPeople={people}
          dynasties={dynasties}
          entities={entities}
          titleDefinitions={titleDefinitions}
          onSave={handleSavePerson}
          onCancel={() => setEditingPerson(null)}
        />
      )}

      {editingEntity && (
        <EntityEditor
          entity={editingEntity}
          allEntities={entities}
          onSave={handleSaveEntity}
          onCancel={() => setEditingEntity(null)}
        />
      )}

      {editingTitleDefinition && (
        <TitleDefinitionEditor 
          titleDef={editingTitleDefinition}
          onSave={handleSaveTitleDefinition}
          onCancel={() => setEditingTitleDefinition(null)}
        />
      )}

      {editingDynasty && (
        <DynastyEditor 
          dynasty={editingDynasty}
          onSave={handleSaveDynasty}
          onCancel={() => setEditingDynasty(null)}
        />
      )}
      
      {editingGroup && (
        <HistoricalGroupEditor 
          group={editingGroup}
          onSave={handleSaveGroup}
          onCancel={() => setEditingGroup(null)}
        />
      )}

    </div>
  );
};

export default App;
