export interface DietItem {
  name: string;
  percentage: number;
  color: string;
}

export interface SpeciesData {
  commonName: string;
  scientificName: string;
  habitat: string;
  diet: DietItem[];
  conservationStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered' | 'Extinct';
  populationEstimate: string;
  geographicRange: string;
  funFacts: string[];
  description: string;
  groundingUrls?: string[];
}

export interface UserProfile {
  name: string;
  points: number;
  badges: string[];
  discoveredSpecies: string[];
  avatar: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}