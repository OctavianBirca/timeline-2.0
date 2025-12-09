
import { CharacterRole, Dynasty, Person, PoliticalEntity, RankLevel, HistoricalGroup } from './types';

export const PIXELS_PER_YEAR_DEFAULT = 10;
export const MIN_YEAR = 450;
export const MAX_YEAR = 850;
export const SLOT_HEIGHT = 140; 

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
  { id: 'duke', label: 'Duke', rank: RankLevel.DUKE },
  { id: 'duchess', label: 'Duchess', rank: RankLevel.DUKE },
  { id: 'mayor', label: 'Mayor of the Palace', rank: RankLevel.DUKE },
  { id: 'count', label: 'Count', rank: RankLevel.COUNT },
  { id: 'general', label: 'General', rank: RankLevel.GENERAL },
  { id: 'peasant', label: 'Peasant', rank: RankLevel.PEASANT },
];

export const MOCK_GROUPS: HistoricalGroup[] = [
  { id: 'g1', name: 'History of France', description: 'From Merovingians to Napoleon' },
  { id: 'g2', name: 'History of Rome', description: 'The Rise and Fall' },
  { id: 'g3', name: 'Holy Roman Empire' }
];

export const MOCK_DYNASTIES: Dynasty[] = [
  { id: 'merovingian', name: 'Merovingian', color: '#10b981' }, 
  { id: 'carolingian', name: 'Carolingian', color: '#ef4444' }, 
  { id: 'pippinids', name: 'Pippinids', color: '#f97316' }, 
];

export const MOCK_ENTITIES: PoliticalEntity[] = [
  {
    id: 'kingdom_franks',
    name: 'Kingdom of the Franks',
    periods: [
      {
        id: 'p_kf_1',
        startYear: 481,
        endYear: 843,
        color: 'rgba(16, 185, 129, 0.2)',
        contexts: [
          { groupId: 'g1', role: CharacterRole.NUCLEUS, heightIndex: 0, rowSpan: 1 }
        ],
        vassalage: []
      }
    ]
  },
  {
    id: 'kingdom_neustria',
    name: 'Kingdom of Neustria',
    periods: [
      {
        id: 'p_kn_1',
        startYear: 511,
        endYear: 751,
        color: 'rgba(59, 130, 246, 0.2)',
        contexts: [
          { groupId: 'g1', role: CharacterRole.SECONDARY, heightIndex: 2, rowSpan: 1 }
        ],
        vassalage: [
           { startYear: 511, endYear: 751, liegeId: 'kingdom_franks' }
        ]
      }
    ]
  },
  {
    id: 'hre',
    name: 'Holy Roman Empire',
    periods: [
      {
        id: 'p_hre_1',
        startYear: 800,
        endYear: 840,
        color: 'rgba(239, 68, 68, 0.2)',
        contexts: [
           { groupId: 'g3', role: CharacterRole.NUCLEUS, heightIndex: 0, rowSpan: 1 },
           { groupId: 'g1', role: CharacterRole.SECONDARY, heightIndex: 4, rowSpan: 1 }
        ],
        vassalage: []
      }
    ]
  }
];

export const MOCK_PEOPLE: Person[] = [
  {
    id: 'clovis1',
    officialName: 'Clovis I',
    dynastyId: 'merovingian',
    birthYear: 466,
    deathYear: 511,
    deathMonth: 11,
    deathDay: 27,
    spouseIds: ['clotilde'],
    role: CharacterRole.NUCLEUS,
    verticalPosition: 1,
    imageUrl: 'https://picsum.photos/id/100/200/200',
    titles: [
      { id: 't1', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 481, endYear: 511 }], positionIndex: 0 }
    ]
  },
  {
    id: 'clotilde',
    officialName: 'Clotilde',
    dynastyId: 'merovingian',
    birthYear: 475,
    deathYear: 545,
    spouseIds: ['clovis1'],
    role: CharacterRole.SECONDARY,
    verticalPosition: 2,
    titles: []
  },
  {
    id: 'clothar1',
    officialName: 'Chlothar I',
    dynastyId: 'merovingian',
    birthYear: 497,
    deathYear: 561,
    fatherId: 'clovis1',
    motherId: 'clotilde',
    spouseIds: [],
    role: CharacterRole.NUCLEUS,
    verticalPosition: 1,
    imageUrl: 'https://picsum.photos/id/101/200/200',
    titles: [
      { id: 't2', name: 'King of Soissons', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 511, endYear: 558 }], positionIndex: 0 },
      { id: 't3', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 558, endYear: 561 }], positionIndex: 1 }
    ]
  },
  {
    id: 'pepin_short',
    officialName: 'Pepin the Short',
    dynastyId: 'carolingian',
    birthYear: 714,
    deathYear: 768,
    spouseIds: [],
    role: CharacterRole.NUCLEUS,
    verticalPosition: 3,
    imageUrl: 'https://picsum.photos/id/102/200/200',
    titles: [
      { id: 't4', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 751, endYear: 768 }], positionIndex: 0 },
      { id: 't5', name: 'Mayor of the Palace', entityId: 'kingdom_neustria', rank: RankLevel.DUKE, role: CharacterRole.SECONDARY, periods: [{ startYear: 741, endYear: 751 }], positionIndex: 1 }
    ]
  },
  {
    id: 'charlemagne',
    officialName: 'Charlemagne',
    dynastyId: 'carolingian',
    birthYear: 742,
    birthMonth: 4,
    birthDay: 2,
    deathYear: 814,
    deathMonth: 1,
    deathDay: 28,
    fatherId: 'pepin_short',
    spouseIds: [],
    role: CharacterRole.NUCLEUS,
    verticalPosition: 3,
    imageUrl: 'https://picsum.photos/id/103/200/200',
    titles: [
      { id: 't6', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 768, endYear: 814 }], positionIndex: 0 },
      { id: 't7', name: 'Emperor of the Romans', entityId: 'hre', rank: RankLevel.EMPEROR, role: CharacterRole.NUCLEUS, periods: [{ startYear: 800, endYear: 814 }], positionIndex: 1 }
    ]
  }
];
