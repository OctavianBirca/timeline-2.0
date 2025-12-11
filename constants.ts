
import { CharacterRole, Dynasty, Person, PoliticalEntity, RankLevel, HistoricalGroup } from './types';

export const PIXELS_PER_YEAR_DEFAULT = 10;
export const MIN_YEAR = 450;
export const MAX_YEAR = 2025; // Updated to accommodate modern history
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
        id: 'p_kf_6', startYear: 719, endYear: 843, color: 'rgba(5, 150, 105, 0.4)',
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
  },
  {
      id: 'kingdom_west_francia',
      name: 'Kingdom of West Francia',
      description: 'Precursor to the Kingdom of France, emerged after the Treaty of Verdun (843).',
      periods: [
          {
              id: 'p_kwf_1', startYear: 843, endYear: 987, color: 'rgba(37, 99, 235, 0.4)', // Blue 600
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          }
      ]
  },
  {
      id: 'kingdom_france',
      name: 'Kingdom of France',
      description: 'The Kingdom of France from Hugh Capet to the Revolution.',
      periods: [
          {
              id: 'p_kfr_1', startYear: 987, endYear: 1792, color: 'rgba(30, 64, 175, 0.4)', // Blue 800
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          },
          {
              id: 'p_kfr_2', startYear: 1814, endYear: 1848, color: 'rgba(30, 64, 175, 0.4)', // Restoration
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          }
      ]
  },
  {
      id: 'french_empire',
      name: 'French Empire',
      description: 'The Empire under Napoleon I and Napoleon III.',
      periods: [
          {
              id: 'p_emp_1', startYear: 1804, endYear: 1815, color: 'rgba(234, 179, 8, 0.4)', // Yellow/Gold
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          },
          {
              id: 'p_emp_2', startYear: 1852, endYear: 1870, color: 'rgba(234, 179, 8, 0.4)',
              contexts: [franceContext(CharacterRole.NUCLEUS, 0, 1)], vassalage: []
          }
      ]
  }
];

export const MOCK_PEOPLE: Person[] = [
  // --- MEROVINGIANS ---
  {
    id: 'childeric1',
    officialName: 'Childeric I',
    dynastyId: 'merovingian',
    birthYear: 457,
    deathYear: 481,
    spouseIds: ['basina'],
    role: CharacterRole.NUCLEUS,
    verticalPosition: 0,
    description: 'Father of Clovis I, King of the Salian Franks.',
    titles: [
      { id: 't_ch1', name: 'King of the Salian Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 457, endYear: 481 }], positionIndex: 0, verticalShift: 0 }
    ]
  },
  {
    id: 'basina',
    officialName: 'Basina of Thuringia',
    dynastyId: '',
    birthYear: 460,
    deathYear: 491,
    spouseIds: ['childeric1'],
    role: CharacterRole.SECONDARY,
    verticalPosition: 0,
    description: 'Queen of the Salian Franks, mother of Clovis I.',
    titles: []
  },
  {
    id: 'clovis1',
    officialName: 'Clovis I',
    realName: 'Chlodovech',
    dynastyId: 'merovingian',
    birthYear: 466,
    deathYear: 511,
    deathMonth: 11,
    deathDay: 27,
    fatherId: 'childeric1',
    motherId: 'basina',
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
  // Sons of Clovis
  {
      id: 'theuderic1',
      officialName: 'Theuderic I',
      dynastyId: 'merovingian',
      birthYear: 487,
      deathYear: 534,
      fatherId: 'clovis1',
      spouseIds: [],
      role: CharacterRole.NUCLEUS,
      verticalPosition: 0,
      description: 'King of Metz/Austrasia.',
      titles: [
          { id: 't_th1', name: 'King of Austrasia', entityId: 'kingdom_austrasia', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 511, endYear: 534 }], positionIndex: 0, verticalShift: 0 }
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
          { id: 't_ch1', name: 'King of Orléans', entityId: 'kingdom_orleans', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 511, endYear: 524 }], positionIndex: 0, verticalShift: 0 }
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
          { id: 't_chi1', name: 'King of Paris', entityId: 'kingdom_paris', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 511, endYear: 558 }], positionIndex: 0, verticalShift: 0 }
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
    spouseIds: ['ingund', 'aregund'],
    role: CharacterRole.NUCLEUS,
    verticalPosition: 0, 
    description: 'Chlothar I reunited the entire Frankish kingdom.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chlothar_I.jpg/220px-Chlothar_I.jpg',
    titles: [
      { id: 't2', name: 'King of Neustria', entityId: 'kingdom_neustria', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 511, endYear: 558 }], positionIndex: 0, verticalShift: 0 },
      { id: 't3', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 558, endYear: 561 }], positionIndex: 1, verticalShift: 0 }
    ]
  },
  // Wives of Chlothar I (Mothers of next gen)
  {
      id: 'ingund', officialName: 'Ingund', dynastyId: '', birthYear: 499, deathYear: 546, spouseIds: ['clothar1'], role: CharacterRole.SECONDARY, verticalPosition: 0, titles: []
  },
  {
      id: 'aregund', officialName: 'Aregund', dynastyId: '', birthYear: 515, deathYear: 573, spouseIds: ['clothar1'], role: CharacterRole.SECONDARY, verticalPosition: 0, titles: []
  },
  // Sons of Chlothar
  {
      id: 'charibert1', officialName: 'Charibert I', dynastyId: 'merovingian', birthYear: 517, deathYear: 567, fatherId: 'clothar1', motherId: 'ingund', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'King of Paris.',
      titles: [{ id: 't_chari1', name: 'King of Paris', entityId: 'kingdom_paris', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 561, endYear: 567 }], positionIndex: 0, verticalShift: 0 }]
  },
  {
      id: 'guntram', officialName: 'Guntram', dynastyId: 'merovingian', birthYear: 532, deathYear: 592, fatherId: 'clothar1', motherId: 'ingund', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'King of Orléans and Burgundy.',
      titles: [{ id: 't_guntram1', name: 'King of Orléans', entityId: 'kingdom_orleans', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 561, endYear: 592 }], positionIndex: 0, verticalShift: 0 }]
  },
  {
      id: 'sigebert1', officialName: 'Sigebert I', dynastyId: 'merovingian', birthYear: 535, deathYear: 575, fatherId: 'clothar1', motherId: 'ingund', spouseIds: ['brunhilda'], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'King of Austrasia.',
      titles: [{ id: 't_sig1', name: 'King of Austrasia', entityId: 'kingdom_austrasia', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 561, endYear: 575 }], positionIndex: 0, verticalShift: 0 }]
  },
  {
      id: 'chilperic1', officialName: 'Chilperic I', dynastyId: 'merovingian', birthYear: 539, deathYear: 584, fatherId: 'clothar1', motherId: 'aregund', spouseIds: ['fredegund'], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'King of Neustria.',
      titles: [{ id: 't_chil1', name: 'King of Neustria', entityId: 'kingdom_neustria', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 561, endYear: 584 }], positionIndex: 0, verticalShift: 0 }]
  },
  {
      id: 'brunhilda', officialName: 'Brunhilda', dynastyId: '', birthYear: 543, deathYear: 613, spouseIds: ['sigebert1'], role: CharacterRole.SECONDARY, verticalPosition: 0, description: 'Visigothic princess and Queen of Austrasia.',
      titles: [{ id: 't_brun1', name: 'Queen Consort', entityId: 'kingdom_austrasia', rank: RankLevel.KING, role: CharacterRole.SECONDARY, periods: [{ startYear: 567, endYear: 575 }], positionIndex: 0, verticalShift: 1 }]
  },
  {
      id: 'fredegund', officialName: 'Fredegund', dynastyId: '', birthYear: 545, deathYear: 597, spouseIds: ['chilperic1'], role: CharacterRole.SECONDARY, verticalPosition: 0, description: 'Queen of Neustria.',
      titles: [{ id: 't_fred1', name: 'Queen Consort', entityId: 'kingdom_neustria', rank: RankLevel.KING, role: CharacterRole.SECONDARY, periods: [{ startYear: 567, endYear: 584 }], positionIndex: 0, verticalShift: 1 }]
  },
  {
      id: 'clothar2', officialName: 'Chlothar II', dynastyId: 'merovingian', birthYear: 584, deathYear: 629, fatherId: 'chilperic1', motherId: 'fredegund', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Reunited the Frankish Kingdom.',
      titles: [
          { id: 't_c2_1', name: 'King of Neustria', entityId: 'kingdom_neustria', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 584, endYear: 613 }], positionIndex: 0 },
          { id: 't_c2_2', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 613, endYear: 629 }], positionIndex: 1 }
      ]
  },
  {
      id: 'dagobert1', officialName: 'Dagobert I', dynastyId: 'merovingian', birthYear: 605, deathYear: 639, fatherId: 'clothar2', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Last Merovingian king to wield real power.',
      titles: [{ id: 't_dag1', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 629, endYear: 639 }], positionIndex: 0 }]
  },

  // --- CAROLINGIANS ---
  {
      id: 'charles_martel', officialName: 'Charles Martel', dynastyId: 'carolingian', birthYear: 688, deathYear: 741, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Mayor of the Palace, Victor of Tours.',
      titles: [{ id: 't_cm', name: 'Mayor of the Palace', entityId: 'kingdom_franks', rank: RankLevel.DUKE, role: CharacterRole.NUCLEUS, periods: [{ startYear: 718, endYear: 741 }], positionIndex: 0 }]
  },
  {
      id: 'pepin_short', officialName: 'Pepin the Short', dynastyId: 'carolingian', birthYear: 714, deathYear: 768, fatherId: 'charles_martel', spouseIds: ['bertrada'], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'First Carolingian King.',
      titles: [
          { id: 't_pepin_1', name: 'Mayor of the Palace', entityId: 'kingdom_franks', rank: RankLevel.DUKE, role: CharacterRole.NUCLEUS, periods: [{ startYear: 741, endYear: 751 }], positionIndex: 0 },
          { id: 't_pepin_2', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 751, endYear: 768 }], positionIndex: 1 }
      ]
  },
  {
      id: 'bertrada', officialName: 'Bertrada of Laon', dynastyId: '', birthYear: 720, deathYear: 783, spouseIds: ['pepin_short'], role: CharacterRole.SECONDARY, verticalPosition: 0, titles: []
  },
  {
      id: 'charlemagne', officialName: 'Charlemagne', dynastyId: 'carolingian', birthYear: 747, deathYear: 814, fatherId: 'pepin_short', motherId: 'bertrada', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'King of the Franks and Emperor of the Romans.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Charlemagne-by-Durer.jpg/220px-Charlemagne-by-Durer.jpg',
      titles: [
          { id: 't_char_1', name: 'King of the Franks', entityId: 'kingdom_franks', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 768, endYear: 814 }], positionIndex: 0 },
          { id: 't_char_2', name: 'Emperor of the Romans', entityId: 'kingdom_franks', rank: RankLevel.EMPEROR, role: CharacterRole.NUCLEUS, periods: [{ startYear: 800, endYear: 814 }], positionIndex: 1 }
      ]
  },
  {
      id: 'louis_pious', officialName: 'Louis the Pious', dynastyId: 'carolingian', birthYear: 778, deathYear: 840, fatherId: 'charlemagne', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Emperor and King of the Franks.',
      titles: [{ id: 't_louis1', name: 'Emperor', entityId: 'kingdom_franks', rank: RankLevel.EMPEROR, role: CharacterRole.NUCLEUS, periods: [{ startYear: 814, endYear: 840 }], positionIndex: 0 }]
  },
  {
      id: 'charles_bald', officialName: 'Charles the Bald', dynastyId: 'carolingian', birthYear: 823, deathYear: 877, fatherId: 'louis_pious', spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'King of West Francia.',
      titles: [{ id: 't_cb', name: 'King of West Francia', entityId: 'kingdom_west_francia', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 843, endYear: 877 }], positionIndex: 0 }]
  },

  // --- CAPETIANS ---
  {
      id: 'hugh_capet', officialName: 'Hugh Capet', dynastyId: 'capetian', birthYear: 939, deathYear: 996, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Founder of the Capetian dynasty.',
      titles: [{ id: 't_hc', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 987, endYear: 996 }], positionIndex: 0 }]
  },
  {
      id: 'philip2', officialName: 'Philip II Augustus', dynastyId: 'capetian', birthYear: 1165, deathYear: 1223, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'First to style himself King of France.',
      titles: [{ id: 't_phil2', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1180, endYear: 1223 }], positionIndex: 0 }]
  },
  {
      id: 'louis9', officialName: 'Louis IX (Saint Louis)', dynastyId: 'capetian', birthYear: 1214, deathYear: 1270, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Canonized King of France.',
      titles: [{ id: 't_louis9', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1226, endYear: 1270 }], positionIndex: 0 }]
  },

  // --- VALOIS ---
  {
      id: 'philip6', officialName: 'Philip VI', dynastyId: 'valois', birthYear: 1293, deathYear: 1350, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'First Valois King.',
      titles: [{ id: 't_phil6', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1328, endYear: 1350 }], positionIndex: 0 }]
  },
  {
      id: 'francis1', officialName: 'Francis I', dynastyId: 'valois', birthYear: 1494, deathYear: 1547, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Renaissance monarch.',
      titles: [{ id: 't_fran1', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1515, endYear: 1547 }], positionIndex: 0 }]
  },

  // --- BOURBONS ---
  {
      id: 'henry4', officialName: 'Henry IV', dynastyId: 'bourbon', birthYear: 1553, deathYear: 1610, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'First Bourbon King of France.',
      titles: [{ id: 't_henry4', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1589, endYear: 1610 }], positionIndex: 0 }]
  },
  {
      id: 'louis14', officialName: 'Louis XIV', dynastyId: 'bourbon', birthYear: 1638, deathYear: 1715, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'The Sun King. Longest reigning monarch.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Louis_XIV_of_France.jpg/220px-Louis_XIV_of_France.jpg',
      titles: [{ id: 't_louis14', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1643, endYear: 1715 }], positionIndex: 0 }]
  },
  {
      id: 'louis16', officialName: 'Louis XVI', dynastyId: 'bourbon', birthYear: 1754, deathYear: 1793, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Guillotined during the French Revolution.',
      titles: [{ id: 't_louis16', name: 'King of France', entityId: 'kingdom_france', rank: RankLevel.KING, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1774, endYear: 1792 }], positionIndex: 0 }]
  },

  // --- BONAPARTE ---
  {
      id: 'napoleon1', officialName: 'Napoleon I', dynastyId: 'bonaparte', birthYear: 1769, deathYear: 1821, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Emperor of the French.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/220px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg',
      titles: [
          { id: 't_nap1', name: 'Emperor of the French', entityId: 'french_empire', rank: RankLevel.EMPEROR, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1804, endYear: 1814 }, { startYear: 1815, endYear: 1815 }], positionIndex: 0 }
      ]
  },
  {
      id: 'napoleon3', officialName: 'Napoleon III', dynastyId: 'bonaparte', birthYear: 1808, deathYear: 1873, spouseIds: [], role: CharacterRole.NUCLEUS, verticalPosition: 0, description: 'Last Monarch of France.',
      titles: [
          { id: 't_nap3', name: 'Emperor of the French', entityId: 'french_empire', rank: RankLevel.EMPEROR, role: CharacterRole.NUCLEUS, periods: [{ startYear: 1852, endYear: 1870 }], positionIndex: 0 }
      ]
  }
];
