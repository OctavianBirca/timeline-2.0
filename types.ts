
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
  startMonth?: number; // 1-12
  startDay?: number; // 1-31
  endYear: number;
  endMonth?: number;
  endDay?: number;
  isHidden?: boolean; // If true, hides the date text in the visualization
}

export interface Title {
  id: string;
  name: string; // e.g., "King of Franks"
  entityId: string;
  rank: RankLevel;
  role: CharacterRole; // NUCLEUS or SECONDARY relative to this entity
  periods: TitlePeriod[];
  positionIndex: number; // For vertical stacking within a character card
}

export interface TitleDefinition {
  id: string;
  label: string;
  rank: RankLevel;
}

export interface EntityPeriod {
  startYear: number;
  endYear: number;
  isVassalTo?: string; // Entity ID of the liege
}

export interface PoliticalEntity {
  id: string;
  name: string;
  color: string;
  periods: EntityPeriod[];
  role: CharacterRole; // Is this a nucleus entity for the current view?
  heightIndex: number; // Vertical slot allocation
}

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
  verticalPosition: number; // User adjustable vertical slot
  isHidden?: boolean;
  color?: string; // Optional override for dynasty color
}

// Configuration State
export interface ViewSettings {
  zoom: number; // Pixels per year
  showLifespans: boolean;
  showSecondary: boolean; // Controls SECONDARY role
  showTertiary: boolean;  // Controls TERTIARY role
  showGrid: boolean;
  showMarriages: boolean;
  showParentalConnections: boolean;
}

export interface LanguageDictionary {
  [key: string]: string;
}
