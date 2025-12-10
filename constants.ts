
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
  { id: 'merovingian', name: 'Merovingian', color: '#10b981', description: 'The Merovingian dynasty was the ruling family of the Franks from the middle of the 5th century until 751.' }, 
  { id: 'carolingian', name: 'Carolingian', color: '#ef4444', description: 'The Carolingian dynasty was a Frankish noble family named after Charlemagne which ruled in western Europe from 750 to 987.' }, 
  { id: 'pippinids', name: 'Pippinids', color: '#f97316' }, 
];

// Helper for repeating context config
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
        id: 'p_kf_1', startYear: 481, endYear: 511, color: 'rgba(5, 150, 105, 0.4)', // Emerald 600
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
        id: 'p_kf_6', startYear: 719, endYear: 768, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      },
      {
        id: 'p_kf_7', startYear: 771, endYear: 814, color: 'rgba(5, 150, 105, 0.4)',
        contexts: [franceContext(CharacterRole.NUCLEUS, 0, 4)], vassalage: []
      }
    ]
  },
  {
    id: 'kingdom_neustria',
    name: 'Kingdom of Neustria',
    description: 'Western Frankish Kingdom.',
    periods: [
      {
        id: 'p_kn_1', startYear: 511, endYear: 558, color: 'rgba(13, 148, 136, 0.4)', // Teal 600
        contexts: [franceContext(CharacterRole.SECONDARY, 0, 2)], vassalage: []
      },
      {
        id: 'p_kn_2', startYear: 561, endYear: 613, color: 'rgba(13, 148, 136, 0.4)',
        contexts: [franceContext(CharacterRole.SECONDARY, 0, 2)], vassalage: []
      },
      {
        id: 'p_kn_3', startYear: 639, endYear: 673, color: 'rgba(13, 148, 136, 0.4)',
        contexts: [franceContext(CharacterRole.SECONDARY, 0, 2)], vassalage: []
      },
      {
        id: 'p_kn_4', startYear: 675, endYear: 679, color: 'rgba(13, 148, 136, 0.4)',
        contexts: [franceContext(CharacterRole.SECONDARY, 0, 2)], vassalage: []
      },
      {
        id: 'p_kn_5', startYear: 715, endYear: 719, color: 'rgba(13, 148, 136, 0.4)',
        contexts: [franceContext(CharacterRole.SECONDARY, 0, 2)], vassalage: []
      },
      {
        id: 'p_kn_6', startYear: 768, endYear: 771, color: 'rgba(13, 148, 136, 0.4)',
        contexts: [franceContext(CharacterRole.SECONDARY, 0, 2)], vassalage: []
      }
    ]
  },
  {
      id: 'kingdom_paris',
      name: 'Kingdom of Paris',
      description: 'Centered on the city of Paris.',
      periods: [
          {
              id: 'p_kp_1', startYear: 511, endYear: 558, color: 'rgba(101, 163, 13, 0.4)', // Lime 600
              contexts: [franceContext(CharacterRole.SECONDARY, 1, 1)], vassalage: []
          },
          {
              id: 'p_kp_2', startYear: 561, endYear: 567, color: 'rgba(101, 163, 13, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 1, 1)], vassalage: []
          }
      ]
  },
  {
      id: 'kingdom_austrasia',
      name: 'Kingdom of Austrasia',
      description: 'Eastern Frankish Kingdom.',
      periods: [
          {
              id: 'p_ka_1', startYear: 511, endYear: 555, color: 'rgba(21, 128, 61, 0.4)', // Green 700
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          },
          {
              id: 'p_ka_2', startYear: 561, endYear: 613, color: 'rgba(21, 128, 61, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          },
          // User input had "539-673", assumed typo for 639-673 to match historical Sigibert III period
          {
              id: 'p_ka_3', startYear: 639, endYear: 673, color: 'rgba(21, 128, 61, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          },
          {
              id: 'p_ka_4', startYear: 675, endYear: 679, color: 'rgba(21, 128, 61, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          },
          {
              id: 'p_ka_5', startYear: 717, endYear: 719, color: 'rgba(21, 128, 61, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          },
          {
              id: 'p_ka_6', startYear: 768, endYear: 771, color: 'rgba(21, 128, 61, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 2, 2)], vassalage: []
          }
      ]
  },
  {
      id: 'kingdom_orleans',
      name: 'Kingdom of Orleans',
      description: 'Kingdom based in Orleans/Burgundy region.',
      periods: [
          {
              id: 'p_ko_1', startYear: 511, endYear: 524, color: 'rgba(161, 98, 7, 0.4)', // Yellow/Amber 700 mix
              contexts: [franceContext(CharacterRole.SECONDARY, 3, 1)], vassalage: []
          },
          {
              id: 'p_ko_2', startYear: 561, endYear: 592, color: 'rgba(161, 98, 7, 0.4)',
              contexts: [franceContext(CharacterRole.SECONDARY, 3, 1)], vassalage: []
          }
      ]
  },
  {
      id: 'kingdom_burgundy',
      name: 'Kingdom of Burgundy',
      description: 'The early Burgundian kingdom.',
      periods: [
          {
              id: 'p_kb_1', startYear: 411, endYear: 534, color: 'rgba(147, 51, 234, 0.4)', // Purple 600
              contexts: [franceContext(CharacterRole.SECONDARY, 4, 1)], vassalage: []
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
    deathMonth: 11,
    deathDay: 27,
    spouseIds: ['clotilde'], 
    role: CharacterRole.NUCLEUS,
    verticalPosition: 0,
    description: 'Clovis I was the first king of the Franks to unite all of the Frankish tribes under one ruler.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Fran%C3%A7ois-Louis_Dejuinne_%281786-1844%29_-_Clovis_Ier_%28465-511%29%2C_roi_des_Francs_-_MV_22_%28cropped%29.jpg/220px-Fran%C3%A7ois-Louis_Dejuinne_%281786-1844%29_-_Clovis_Ier_%28465-511%29%2C_roi_des_Francs_-_MV_22_%28cropped%29.jpg',
    titles: [
      { id: 't1', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 481, endYear: 511 }], positionIndex: 0, verticalShift: 0 }
    ]
  },
  {
    id: 'clotilde',
    officialName: 'Clotilde',
    dynastyId: '', 
    birthYear: 475,
    deathYear: 545,
    spouseIds: ['clovis1'],
    role: CharacterRole.SECONDARY,
    verticalPosition: 2,
    description: 'Saint Clotilde was a princess of the Kingdom of Burgundy and the second wife of the Frankish king Clovis I.',
    titles: [
        { id: 't_q1', name: 'Queen Consort', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.SECONDARY, periods: [{startYear: 493, endYear: 511}], positionIndex: 0, verticalShift: 1 }
    ]
  },
  {
      id: 'theuderic1',
      officialName: 'Theuderic I',
      dynastyId: 'merovingian',
      birthYear: 485,
      deathYear: 534,
      fatherId: 'clovis1',
      spouseIds: [],
      role: CharacterRole.NUCLEUS,
      verticalPosition: 0,
      description: 'King of Metz/Austrasia.',
      titles: [
          { 
              id: 't_th1', 
              name: 'King of Austrasia', 
              entityId: 'kingdom_austrasia', 
              rank: RankLevel.KING, 
              role: CharacterRole.NUCLEUS, 
              periods: [{ startYear: 511, endYear: 534 }], 
              positionIndex: 0, 
              verticalShift: 0 
          }
      ]
  },
  {
      id: 'chlodomer',
      officialName: 'Chlodomer',
      dynastyId: 'merovingian',
      birthYear: 495,
      deathYear: 524,
      fatherId: 'clovis1',
      motherId: 'clotilde',
      spouseIds: [],
      role: CharacterRole.NUCLEUS,
      verticalPosition: 0,
      description: 'King of Orléans.',
      titles: [
          { 
              id: 't_ch1', 
              name: 'King of Orléans', 
              entityId: 'kingdom_orleans', 
              rank: RankLevel.KING, 
              role: CharacterRole.NUCLEUS, 
              periods: [{ startYear: 511, endYear: 524 }], 
              positionIndex: 0, 
              verticalShift: 0 
          }
      ]
  },
  {
      id: 'childebert1',
      officialName: 'Childebert I',
      dynastyId: 'merovingian',
      birthYear: 496,
      deathYear: 558,
      fatherId: 'clovis1',
      motherId: 'clotilde',
      spouseIds: [],
      role: CharacterRole.NUCLEUS,
      verticalPosition: 0,
      description: 'King of Paris.',
      titles: [
          { 
              id: 't_chi1', 
              name: 'King of Paris', 
              entityId: 'kingdom_paris', 
              rank: RankLevel.KING, 
              role: CharacterRole.NUCLEUS, 
              periods: [{ startYear: 511, endYear: 558 }], 
              positionIndex: 0, 
              verticalShift: 0 
          }
      ]
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
    verticalPosition: 0, 
    description: 'Chlothar I reunited the entire Frankish kingdom.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chlothar_I.jpg/220px-Chlothar_I.jpg',
    titles: [
      { id: 't2', name: 'King of Neustria', entityId: 'kingdom_neustria', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 511, endYear: 558 }], positionIndex: 0, verticalShift: 0 },
      { id: 't3', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 558, endYear: 561 }], positionIndex: 1, verticalShift: 0 }
    ]
  }
];
