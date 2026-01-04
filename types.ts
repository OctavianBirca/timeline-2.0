
export enum CharacterRole {
  NUCLEUS = 'NUCLEUS',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY'
}

export enum EntityType {
  RELIGIOUS = 'RELIGIOUS',
  EMPIRE = 'EMPIRE',
  KINGDOM = 'KINGDOM',
  DUCHY = 'DUCHY'
}

export enum RankLevel {
  POPE = 0,
  EMPEROR = 1,
  KING = 2,
  DUKE = 3,
  COUNT = 4,
  GENERAL = 8,
  PEASANT = 19
}

export interface TitlePeriod {
  startYear: number;
  startMonth?: number; 
  startDay?: number; 
  endYear: number;
  endMonth?: number;
  endDay?: number;
  isHidden?: boolean; 
}

export interface Title {
  id: string;
  name: string; 
  entityId: string;
  rank: RankLevel;
  role: CharacterRole; 
  periods: TitlePeriod[];
  positionIndex: number; // Internal sort order of titles
  verticalShift?: number; // Row offset relative to the Entity's base position
}

export interface TitleDefinition {
  id: string;
  label: string;
  rank: RankLevel;
}

// --- NEW ENTITY STRUCTURE ---

export interface EntityContextRole {
  groupId: string; // The Historical Group this configuration applies to
  role: CharacterRole;
  heightIndex: number;
  rowSpan: number;
}

export interface EntityVassalage {
  startYear: number;
  startMonth?: number;
  startDay?: number;
  endYear: number;
  endMonth?: number;
  endDay?: number;
  liegeId: string; // Entity ID of the liege
}

export interface EntityPeriod {
  id: string; // Unique ID for keying
  startYear: number;
  startMonth?: number;
  startDay?: number;
  endYear: number;
  endMonth?: number;
  endDay?: number;
  color: string;
  contexts: EntityContextRole[]; // How this period appears in different history groups
  vassalage: EntityVassalage[];
}

export interface PoliticalEntity {
  id: string;
  name: string;
  description?: string;
  periods: EntityPeriod[];
}

// ---------------------------

export interface Dynasty {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface HistoricalGroup {
  id: string;
  name: string;
  description?: string;
}

export interface Person {
  id: string;
  officialName: string;
  realName?: string;
  dynastyId: string;
  
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;

  deathYear: number;
  deathMonth?: number;
  deathDay?: number;

  fatherId?: string;
  motherId?: string;
  adoptedParentId?: string;
  spouseIds: string[];
  titles: Title[];
  imageUrl?: string;
  role: CharacterRole; // Fallback role if no titles
  verticalPosition: number; // Fallback position
  isHidden?: boolean;
  color?: string; 
  description?: string;
}

export interface ViewSettings {
  zoom: number; 
  showLifespans: boolean;
  showSecondary: boolean; 
  showTertiary: boolean; 
  showGrid: boolean;
  showMarriages: boolean;
  showParentalConnections: boolean;
  forceVisibleIds: string[]; 
  highlightedDynastyId?: string;
}

export interface LanguageDictionary {
  [key: string]: string;
}
