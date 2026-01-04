
import { CharacterRole, Dynasty, Person, PoliticalEntity, RankLevel, HistoricalGroup } from './types';

export const PIXELS_PER_YEAR_DEFAULT = 10;
export const MIN_YEAR = 450;
export const MAX_YEAR = 2025; 
export const SLOT_HEIGHT = 60; 

export const LABELS = {
  en: {
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    lifespan: "Lifespan",
    secondary: "Secondary Chars",
    grid: "Grid",
    marriages: "Marriages",
    connections: "Connections",
    admin: "Admin Panel",
    historyGroup: "Historical Group",
    entities: "Political Entities",
    characters: "Characters",
    birth: "b.",
    died: "d.",
    reign: "r.",
    adminTabs: {
      people: "People",
      entities: "Entities",
      titles: "Titles",
      dynasties: "Dynasties",
      groups: "Groups"
    }
  }
};

export const MONTHS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

export const PREDEFINED_TITLES = [
  { id: 'pope', label: 'Pope', rank: RankLevel.POPE },
  { id: 'patriarch', label: 'Patriarch', rank: RankLevel.POPE }, 
  { id: 'emperor', label: 'Emperor', rank: RankLevel.EMPEROR },
  { id: 'king', label: 'King', rank: RankLevel.KING },
  { id: 'queen', label: 'Queen', rank: RankLevel.KING },
  { id: 'president', label: 'President', rank: RankLevel.KING },
  { id: 'duke', label: 'Duke', rank: RankLevel.DUKE },
  { id: 'duchess', label: 'Duchess', rank: RankLevel.DUKE },
  { id: 'mayor', label: 'Mayor of the Palace', rank: RankLevel.DUKE },
  { id: 'count', label: 'Count', rank: RankLevel.COUNT },
  { id: 'general', label: 'General', rank: RankLevel.GENERAL },
  { id: 'peasant', label: 'Peasant', rank: RankLevel.PEASANT },
];

export const MOCK_GROUPS: HistoricalGroup[] = [
  { id: 'g1', name: 'History of France', description: 'From Merovingians to the Republic' },
  { id: 'g2', name: 'Holy Roman Empire', description: 'Central European History' }
];

export const MOCK_DYNASTIES: Dynasty[] = [
  { id: 'merovingian', name: 'Merovingian', color: '#10b981', description: 'The Merovingian dynasty was the ruling family of the Franks from the middle of the 5th century until 751.' }, 
  { id: 'carolingian', name: 'Carolingian', color: '#ef4444', description: 'The Carolingian dynasty was a Frankish noble family named after Charlemagne which ruled in western Europe from 750 to 987.' }, 
  { id: 'robertian', name: 'Robertian', color: '#f97316', description: 'Frankish noble family, predecessors to the Capetians.' },
  { id: 'capetian', name: 'Capetian', color: '#3b82f6', description: 'The House of Capet ruled France from 987 to 1328.' },
  { id: 'valois', name: 'Valois', color: '#8b5cf6', description: 'The House of Valois was a cadet branch of the Capetian dynasty, succeeding the House of Capet.' },
  { id: 'bourbon', name: 'Bourbon', color: '#1e40af', description: 'The House of Bourbon is a European royal house of French origin.' },
  { id: 'bonaparte', name: 'Bonaparte', color: '#eab308', description: 'The House of Bonaparte is an imperial and royal European dynasty founded by Napoleon I.' }
];

const franceContext = (role: CharacterRole, height: number, span: number) => ({
    groupId: 'g1',
    role: role,
    heightIndex: height,
    rowSpan: span
});

export const MOCK_ENTITIES: PoliticalEntity[] = [
  {
    id: 'kingdom_franks',
    name: 'Kingdom of the Franks',
    description: 'The Unified Kingdom of the Franks.',
    periods: [
      {
        id: 'p_kf_1', startYear: 481, endYear: 511, color: 'rgba(5, 150, 105, 0.4)', 
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      },
      {
        id: 'p_kf_2', startYear: 558, endYear: 561, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      },
      {
        id: 'p_kf_3', startYear: 613, endYear: 639, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      },
      {
        id: 'p_kf_4', startYear: 673, endYear: 675, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      },
      {
        id: 'p_kf_5', startYear: 679, endYear: 715, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      },
      {
        id: 'p_kf_6', startYear: 719, endYear: 843, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      }
    ]
  },
  {
      id: 'kingdom_france',
      name: 'Kingdom of France',
      description: 'The Kingdom of France across different monarchical phases.',
      periods: [
          {
              id: 'p_kfr_1', startYear: 987, endYear: 1792, color: 'rgba(30, 64, 175, 0.4)', 
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          },
          {
              id: 'p_kfr_2', startYear: 1814, endYear: 1848, color: 'rgba(30, 64, 175, 0.4)', 
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          }
      ]
  },
  {
      id: 'french_empire',
      name: 'French Empire',
      description: 'The Empire under the Bonapartes.',
      periods: [
          {
              id: 'p_emp_1', startYear: 1804, endYear: 1814, color: 'rgba(234, 179, 8, 0.4)', 
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          },
          {
              id: 'p_emp_hundred_days', startYear: 1815, endYear: 1815, color: 'rgba(234, 179, 8, 0.5)', 
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          },
          {
              id: 'p_emp_2', startYear: 1852, endYear: 1870, color: 'rgba(234, 179, 8, 0.4)',
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          }
      ]
  },
  {
      id: 'kingdom_austrasia',
      name: 'Kingdom of Austrasia',
      description: 'Eastern Frankish Kingdom.',
      periods: [
          {
              id: 'p_ka_1', startYear: 511, endYear: 555, color: 'rgba(21, 128, 61, 0.4)', 
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          },
          {
              id: 'p_ka_2', startYear: 561, endYear: 613, color: 'rgba(21, 128, 61, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          }
      ]
  }
];

export const MOCK_PEOPLE: Person[] = [
  {
    id: 'clovis1',
    officialName: 'Clovis I',
    realName: 'Chlodovech',
    dynastyId: 'merovingian',
    birthYear: 466,
    deathYear: 511,
    spouseIds: ['clotilde'], 
    role: CharacterRole.NUCLEUS,
    verticalPosition: 0,
    description: 'Clovis I was the first king of the Franks to unite all tribes.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Fran%C3%A7ois-Louis_Dejuinne_%281786-1844%29_-_Clovis_Ier_%28465-511%29%2C_roi_des_Francs_-_MV_22_%28cropped%29.jpg/220px-Fran%C3%A7ois-Louis_Dejuinne_%281786-1844%29_-_Clovis_Ier_%28465-511%29%2C_roi_des_Francs_-_MV_22_%28cropped%29.jpg',
    titles: [
      { id: 't1', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 481, endYear: 511 }], positionIndex: 0, verticalShift: 0 }
    ]
  },
  {
      id: 'napoleon1',
      officialName: 'Napoleon I',
      dynastyId: 'bonaparte',
      birthYear: 1769,
      deathYear: 1821,
      spouseIds: [],
      role: CharacterRole.NUCLEUS,
      verticalPosition: 0,
      description: 'Emperor of the French.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/220px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg',
      titles: [
          { 
              id: 't_nap1', 
              name: 'Emperor of the French', 
              entityId: 'french_empire', 
              rank: RankLevel.EMPEROR, 
              role: CharacterRole.NUCLEUS, 
              periods: [
                  { startYear: 1804, endYear: 1814 }, 
                  { startYear: 1815, endYear: 1815, isHidden: false }
              ], 
              positionIndex: 0 
          }
      ]
  },
  {
      id: 'louis18',
      officialName: 'Louis XVIII',
      dynastyId: 'bourbon',
      birthYear: 1755,
      deathYear: 1824,
      spouseIds: [],
      role: CharacterRole.NUCLEUS,
      verticalPosition: 0,
      description: 'King of France during the Restoration.',
      titles: [
          { 
              id: 't_l18', 
              name: 'King of France', 
              entityId: 'kingdom_france', 
              rank: RankLevel.KING, 
              role: CharacterRole.NUCLEUS, 
              periods: [
                  { startYear: 1814, endYear: 1815 }, 
                  { startYear: 1815, endYear: 1824 }
              ], 
              positionIndex: 0 
          }
      ]
  }
];
